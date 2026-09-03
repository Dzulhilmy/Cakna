/**
 * LiveKit session wrapper for a halaqah room.
 *
 * Keeps a runes-backed view of the room so Svelte components can render
 * participants, roles and the current speaker without touching the SDK.
 *
 * The permission model is enforced server-side (see server/src/halaqah.rs): a
 * token grants `canPublish` only to the host and the designated speaker. When
 * the host hands the floor over, our API calls LiveKit's UpdateParticipant, and
 * the browser receives a permissions-changed event — so we react to that rather
 * than reconnecting.
 */
import {
	Room,
	RoomEvent,
	Track,
	type LocalTrackPublication,
	type RemoteParticipant,
	type RemoteTrack,
	type RemoteTrackPublication
} from 'livekit-client';

export type Role = 'host' | 'speaker' | 'listener';

export interface LogEntry {
	kind: 'started' | 'joined' | 'left';
	name: string;
	at: number;
}

export interface Member {
	identity: string;
	name: string;
	isLocal: boolean;
	/** Publishing audio right now (i.e. holds the floor). */
	canPublish: boolean;
	speaking: boolean;
	/** Mic track is live and un-muted. */
	micEnabled: boolean;
}

export interface JoinInfo {
	url: string;
	token: string;
	identity: string;
	name: string;
	host_name: string;
	role: Role;
	speaker_id: string | null;
	page: number;
	share: ShareState | null;
	room: { id: string; slug: string; title: string };
}

/** What the mic-holder is showing the room. */
export type ShareState =
	| { kind: 'page'; page: number }
	| { kind: 'mathurat'; version: 'sughra' | 'kubra'; mode: 'pagi' | 'petang'; idx: number }
	| { kind: 'route'; path: string; label: string };

/** Payload broadcast over the LiveKit data channel when the shared view changes. */
interface ShareMessage {
	t: 'share';
	share: ShareState | null;
}

/**
 * A participant's live engagement, broadcast ~every 5s over the data channel so
 * the host can see who is actually following the recitation. `attentiveMs` is the
 * time spent on-task (app in view + audio playing + tracking the reciter) out of
 * `sessionMs` total — an accountability figure, not proof of attention.
 */
export interface Engagement {
	attentiveMs: number;
	sessionMs: number;
	/** On-task right now: visible && audioOk && following. */
	onTask: boolean;
	visible: boolean;
	audioOk: boolean;
	following: boolean;
	/** Local time this heartbeat arrived — used to spot a listener who went silent. */
	at: number;
}

/** Wire form of a heartbeat over the data channel (compact keys). */
interface HeartbeatMessage {
	t: 'hb';
	a: number;
	s: number;
	on: boolean;
	v: boolean;
	au: boolean;
	f: boolean;
}

export class HalaqahSession {
	room = $state<Room | null>(null);
	members = $state<Member[]>([]);
	role = $state<Role>('listener');
	speakerId = $state<string | null>(null);
	/** The page the reciter is on — the shared state everyone follows. */
	page = $state(1);
	/**
	 * Whether this client's view tracks the reciter. Participants may browse away
	 * to check something; forcing their screen to jump would be disorienting, so
	 * they unfollow implicitly and can snap back on demand.
	 */
	following = $state(true);
	/** Page this client is actually looking at (equals `page` while following). */
	viewPage = $state(1);

	/**
	 * What the mic-holder is showing the room, or null when they have stopped.
	 * `page` renders inline; `route` points at another part of the app that
	 * participants can follow into.
	 */
	share = $state<ShareState | null>(null);
	/** Am I the one broadcasting? On by default for whoever holds the floor. */
	sharing = $state(true);
	/** Local dismissal — hides the shared panel for me only, without stopping it. */
	panelHidden = $state(false);
	/** The track we visualise: whoever currently holds the floor. */
	floorTrack = $state<MediaStreamTrack | null>(null);
	micOn = $state(false);
	screenShareTrack = $state<MediaStreamTrack | null>(null);
	screenSharing = $state(false);
	connected = $state(false);
	error = $state<string | null>(null);
	title = $state('');
	slug = $state('');
	selfId = $state('');

	/**
	 * Per-participant engagement (from heartbeats), keyed by identity. The host
	 * reads this to see who is following along. See sendHeartbeat / receiveHeartbeat.
	 */
	engagement = $state<Record<string, Engagement>>({});

	/** Chronological room activity — joins, leaves, session start. Capped at 100 entries. */
	logs = $state<LogEntry[]>([]);

	private pushLog(entry: LogEntry) {
		this.logs = [...this.logs.slice(-99), entry];
	}
	private hbTimer: ReturnType<typeof setInterval> | null = null;
	private lastSampleAt = 0;
	private myAttentiveMs = 0;
	private mySessionMs = 0;
	private visible = true;

	/** True when this client is allowed to publish audio at all. */
	get canSpeak() {
		return this.role === 'host' || this.role === 'speaker';
	}

	async connect(info: JoinInfo) {
		this.role = info.role;
		this.speakerId = info.speaker_id;
		this.title = info.room.title;
		this.slug = info.room.slug;
		this.selfId = info.identity;
		this.page = info.page ?? 1;
		this.viewPage = this.page;
		this.share = info.share ?? { kind: 'page', page: this.page };

		const room = new Room({ adaptiveStream: true, dynacast: true });
		this.room = room;

		room
			.on(RoomEvent.ParticipantConnected, (p: RemoteParticipant) => {
				this.pushLog({ kind: 'joined', name: p.name || p.identity, at: Date.now() });
				this.sync();
			})
			.on(RoomEvent.ParticipantDisconnected, (p: RemoteParticipant) => {
				this.pushLog({ kind: 'left', name: p.name || p.identity, at: Date.now() });
				delete this.engagement[p.identity];
				this.sync();
			})
			.on(RoomEvent.TrackSubscribed, (t: RemoteTrack) => {
				if (t.kind === Track.Kind.Audio) {
					this.playRemote(t);
					this.pickFloorTrack();
				}
				if (t.source === Track.Source.ScreenShare && t.kind === Track.Kind.Video && t.mediaStreamTrack) {
					this.screenShareTrack = t.mediaStreamTrack;
				}
				this.sync();
			})
			.on(RoomEvent.TrackUnsubscribed, (t: RemoteTrack) => {
				if (t.kind === Track.Kind.Audio) this.stopRemote(t);
				if (t.source === Track.Source.ScreenShare) this.screenShareTrack = null;
				this.pickFloorTrack();
				this.sync();
			})
			.on(RoomEvent.ActiveSpeakersChanged, () => this.sync())
			.on(RoomEvent.LocalTrackPublished, (pub: LocalTrackPublication) => {
				if (pub.source === Track.Source.ScreenShare) {
					this.screenShareTrack = pub.track?.mediaStreamTrack ?? null;
					this.screenSharing = true;
				}
				this.pickFloorTrack();
				this.sync();
			})
			.on(RoomEvent.LocalTrackUnpublished, (pub: LocalTrackPublication) => {
				if (pub.source === Track.Source.ScreenShare) {
					this.screenShareTrack = null;
					this.screenSharing = false;
				}
				this.pickFloorTrack();
				this.sync();
			})
			.on(RoomEvent.Disconnected, () => {
				this.connected = false;
				this.sync();
			})
			// The host handing over the floor arrives here, not as a reconnect.
			// NOTE: this event describes THIS client only — it says nothing about
			// who the new speaker is. That comes from room metadata below.
			.on(RoomEvent.ParticipantPermissionsChanged, () => {
				const allowed = room.localParticipant.permissions?.canPublish ?? false;
				if (this.role !== 'host') this.role = allowed ? 'speaker' : 'listener';
				// Losing the floor must stop the microphone immediately.
				if (!allowed && this.micOn) void this.setMic(false);
				this.sync();
			})
			// Authoritative shared state (floor + page), broadcast by the server.
			.on(RoomEvent.RoomMetadataChanged, (m) => {
				this.readMetadata(m);
				this.sync();
			})
			// Live page turns. The data channel is used as well as metadata because
			// it lands immediately, without a server round-trip on every turn.
			.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: RemoteParticipant) => {
				try {
					const msg = JSON.parse(new TextDecoder().decode(payload)) as ShareMessage | HeartbeatMessage;
					if (msg?.t === 'share') this.applyShare(msg.share);
					else if (msg?.t === 'hb' && participant) this.receiveHeartbeat(participant.identity, msg);
				} catch {
					/* ignore anything that is not ours */
				}
			});

		try {
			await room.connect(info.url, info.token);
			this.connected = true;
			this.error = null;
			this.pushLog({ kind: 'started', name: info.host_name, at: Date.now() });
			// Log the local participant's own join. ParticipantConnected never fires
			// for yourself, so this is the only place to record it. Hosts skip it —
			// the 'started' entry above already represents their presence.
			if (info.role !== 'host') {
				this.pushLog({ kind: 'joined', name: info.name, at: Date.now() });
			}
			// A room may already have a speaker when we arrive.
			this.readMetadata(room.metadata);
			this.sync();
			// The navigation click that opened this room may still count as a user
			// gesture — start audio right away so the reciter is audible with no extra
			// tap. If it has expired, the first interaction in the room unlocks it.
			void room.startAudio().catch(() => {});
			this.startEngagement();
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
			this.connected = false;
		}
	}

	/* ----------------------------------------------- engagement / heartbeats */

	/** Begin reporting our own engagement so the host can see who is following. */
	private startEngagement() {
		if (typeof document === 'undefined') return;
		this.visible = document.visibilityState === 'visible';
		this.lastSampleAt = Date.now();
		this.myAttentiveMs = 0;
		this.mySessionMs = 0;
		document.addEventListener('visibilitychange', this.onVisibility);
		// Broadcast every 5s. Kept unreliable — a dropped heartbeat is replaced by
		// the next one, and the host treats a long silence as "away" anyway.
		this.hbTimer = setInterval(() => this.sendHeartbeat(), 5000);
	}

	/** Fold the time since the last sample into the attentive / total counters. */
	private sampleEngagement() {
		const now = Date.now();
		if (this.lastSampleAt) {
			const dt = now - this.lastSampleAt;
			this.mySessionMs += dt;
			// On-task = the app is in view, audio can play, and we are tracking the
			// reciter. Any of those false and the elapsed time is "strayed".
			if (this.visible && !this.needsAudioUnlock && this.following) this.myAttentiveMs += dt;
		}
		this.lastSampleAt = now;
	}

	/** Sample precisely at the moment the tab is shown/hidden. */
	private onVisibility = () => {
		this.sampleEngagement();
		this.visible = document.visibilityState === 'visible';
	};

	private sendHeartbeat() {
		const room = this.room;
		if (!room) return;
		this.sampleEngagement();
		const on = this.visible && !this.needsAudioUnlock && this.following;
		const msg: HeartbeatMessage = {
			t: 'hb',
			a: Math.round(this.myAttentiveMs),
			s: Math.round(this.mySessionMs),
			on,
			v: this.visible,
			au: !this.needsAudioUnlock,
			f: this.following
		};
		void room.localParticipant
			.publishData(new TextEncoder().encode(JSON.stringify(msg)), { reliable: false })
			.catch(() => {});
	}

	private receiveHeartbeat(identity: string, m: HeartbeatMessage) {
		this.engagement[identity] = {
			attentiveMs: m.a ?? 0,
			sessionMs: m.s ?? 0,
			onTask: !!m.on,
			visible: !!m.v,
			audioOk: !!m.au,
			following: !!m.f,
			at: Date.now()
		};
	}

	private stopEngagement() {
		if (this.hbTimer) clearInterval(this.hbTimer);
		this.hbTimer = null;
		if (typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', this.onVisibility);
		}
		this.engagement = {};
	}

	/** Audio elements for subscribed remote tracks, keyed by track sid. */
	private sinks = new Map<string, HTMLMediaElement>();

	/**
	 * Play a subscribed remote audio track.
	 *
	 * livekit-client does NOT auto-play remote audio — you get the track and must
	 * attach it yourself (their React SDK does this via <RoomAudioRenderer>). Without
	 * this, two things break at once: nobody hears the speaker, AND the visualiser
	 * stays flat, because Chrome does not pump a remote WebRTC track through Web
	 * Audio until it is attached to a playing media element. Measured: an analyser
	 * on an unattached remote track reads 0; attached, the same track reads ~1300.
	 */
	private playRemote(t: RemoteTrack) {
		const sid = t.sid ?? String(this.sinks.size);
		if (this.sinks.has(sid)) return;
		const el = t.attach();
		el.autoplay = true;
		// Not `hidden`/`display:none` — some browsers refuse to play a detached or
		// undisplayed element. Keep it in the DOM but visually gone.
		el.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none';
		document.body.appendChild(el);
		// Autoplay policy can still block until a gesture; surface it rather than
		// leaving the user in silence with no explanation.
		void el.play?.().catch(() => {
			this.needsAudioUnlock = true;
		});
		this.sinks.set(sid, el);
	}

	private stopRemote(t: RemoteTrack) {
		const sid = t.sid ?? '';
		const el = this.sinks.get(sid);
		if (el) {
			t.detach(el);
			el.remove();
			this.sinks.delete(sid);
		}
	}

	/** True when the browser blocked playback until the user interacts. */
	needsAudioUnlock = $state(false);

	/** Call from a click handler to satisfy the autoplay policy. */
	async unlockAudio() {
		for (const el of this.sinks.values()) {
			try {
				await el.play();
			} catch {
				/* keep trying the rest */
			}
		}
		await this.room?.startAudio().catch(() => {});
		this.needsAudioUnlock = false;
	}

	/** Room metadata carries `{ speaker_id, page }`. Ignore anything malformed
	 *  rather than letting a bad payload break the room. */
	private readMetadata(raw: string | undefined) {
		if (!raw) {
			this.speakerId = null;
			return;
		}
		try {
			const v = JSON.parse(raw) as {
				speaker_id?: string | null;
				page?: number;
				share?: ShareState | null;
			};
			this.speakerId = v.speaker_id ?? null;
			if (Number.isInteger(v.page)) this.applyPage(v.page as number);
			if (v.share !== undefined) this.applyShare(v.share);
		} catch {
			/* leave the previous values in place */
		}
	}

	/** Adopt a shared view from the mic-holder. Ignores echoes of our own writes. */
	private applyShare(s: ShareState | null, fromRemote = true) {
		if (fromRemote && this.canSpeak && Date.now() - this.lastLocalPageAt < 2000) return;
		this.share = s;
		// A shared mushaf page also drives the follow-the-page view.
		if (s?.kind === 'page') this.applyPage(s.page, fromRemote);
	}

	/**
	 * Broadcast what I am looking at. Only meaningful for the mic-holder; a no-op
	 * when sharing is switched off, so they can browse privately and resume later.
	 */
	async setShare(s: ShareState | null) {
		if (!this.canSpeak || !this.sharing) return;
		// Don't spam an unchanged view (route effects re-run on every navigation).
		if (JSON.stringify(s) === JSON.stringify(this.share)) return;

		this.share = s;
		if (s?.kind === 'page') {
			this.page = s.page;
			this.viewPage = s.page;
		}
		this.lastLocalPageAt = Date.now();

		try {
			const msg: ShareMessage = { t: 'share', share: s };
			await this.room?.localParticipant.publishData(
				new TextEncoder().encode(JSON.stringify(msg)),
				{ reliable: true }
			);
		} catch {
			/* the durable write below still carries it */
		}

		if (this.shareWriteTimer) clearTimeout(this.shareWriteTimer);
		this.shareWriteTimer = setTimeout(() => {
			const body =
				s === null
					? { kind: null }
					: s.kind === 'page'
						? { kind: 'page', page: s.page }
						: s.kind === 'mathurat'
							? { kind: 'mathurat', version: s.version, mode: s.mode, idx: s.idx }
							: { kind: 'route', path: s.path, label: s.label };
			void fetch(`/api/halaqah/rooms/${this.slug}/share`, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			}).catch(() => {});
		}, 500);
	}

	/** Stop broadcasting; the room's panel empties until sharing resumes. */
	async stopSharing() {
		this.sharing = false;
		// setShare() short-circuits once `sharing` is false, so clear directly.
		this.share = null;
		this.lastLocalPageAt = Date.now();
		try {
			const msg: ShareMessage = { t: 'share', share: null };
			await this.room?.localParticipant.publishData(
				new TextEncoder().encode(JSON.stringify(msg)),
				{ reliable: true }
			);
		} catch {
			/* ignore */
		}
		void fetch(`/api/halaqah/rooms/${this.slug}/share`, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ kind: null })
		}).catch(() => {});
	}

	/** Resume broadcasting, starting from the page currently in view. */
	async resumeSharing() {
		this.sharing = true;
		await this.setShare({ kind: 'page', page: this.viewPage });
	}

	/** When this client last set the page itself. */
	private lastLocalPageAt = 0;
	private shareWriteTimer: ReturnType<typeof setTimeout> | null = null;

	/**
	 * Adopt a page turn from the reciter; only moves the view if still following.
	 *
	 * Ignores echoes of our own writes. Turning two pages quickly used to land on
	 * the first: the durable POST for page N came back as room metadata after we
	 * had already moved to N+1, dragging the view backwards.
	 */
	private applyPage(p: number, fromRemote = true) {
		if (p < 1 || p > 604) return;
		if (fromRemote && this.canSpeak && Date.now() - this.lastLocalPageAt < 2000) return;
		this.page = p;
		if (this.following) this.viewPage = p;
	}

	/**
	 * Move the shared page. Only meaningful for whoever holds the floor — the
	 * server rejects anyone else, so a listener turning pages just moves their
	 * own view (and drops them out of following).
	 */
	async setPage(p: number) {
		if (p < 1 || p > 604) return;
		if (!this.canSpeak) {
			// A listener browsing on their own: stop following, move only their view.
			this.following = false;
			this.viewPage = p;
			return;
		}
		// Turning a page IS sharing that page — one path for both, so the two can
		// never disagree about what the room is looking at.
		await this.setShare({ kind: 'page', page: p });
	}

	/** Snap back to the reciter's page and resume following. */
	followSpeaker() {
		this.following = true;
		this.viewPage = this.page;
	}

	/** Enable or disable the local microphone. No-op without publish rights. */
	async setMic(on: boolean) {
		const room = this.room;
		if (!room) return;
		if (on && !(room.localParticipant.permissions?.canPublish ?? false)) {
			this.error = 'Anda belum diberi mikrofon oleh hos.';
			return;
		}
		try {
			await room.localParticipant.setMicrophoneEnabled(on);
			this.micOn = on;
			this.error = null;
			this.pickFloorTrack();
			this.sync();
		} catch (e) {
			// Almost always a denied getUserMedia prompt.
			this.error = e instanceof Error ? e.message : String(e);
			this.micOn = false;
		}
	}

	async toggleScreenShare() {
		const room = this.room;
		if (!room || !this.canSpeak) return;
		try {
			if (this.screenSharing) {
				await room.localParticipant.setScreenShareEnabled(false);
			} else {
				await room.localParticipant.setScreenShareEnabled(true, {
						video: { displaySurface: 'browser' }
					});
			}
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
		}
	}

	/**
	 * Choose which audio track feeds the visualiser: the remote participant who
	 * may publish, else our own mic if we hold the floor.
	 */
	private pickFloorTrack() {
		const room = this.room;
		if (!room) {
			this.floorTrack = null;
			return;
		}
		for (const p of room.remoteParticipants.values()) {
			for (const pub of p.trackPublications.values()) {
				const t = (pub as RemoteTrackPublication).track;
				if (t && t.kind === Track.Kind.Audio && t.mediaStreamTrack) {
					this.floorTrack = t.mediaStreamTrack;
					return;
				}
			}
		}
		const own = room.localParticipant
			.getTrackPublications()
			.find((p) => p.kind === Track.Kind.Audio)?.track?.mediaStreamTrack;
		this.floorTrack = own ?? null;
	}

	private sync() {
		const room = this.room;
		if (!room) {
			this.members = [];
			return;
		}
		const speaking = new Set(room.activeSpeakers.map((p) => p.identity));
		const lp = room.localParticipant;
		const localMicPub = lp.getTrackPublication(Track.Source.Microphone);
		const list: Member[] = [
			{
				identity: lp.identity,
				name: lp.name || lp.identity,
				isLocal: true,
				canPublish: lp.permissions?.canPublish ?? false,
				speaking: speaking.has(lp.identity),
				micEnabled: !!localMicPub && !localMicPub.isMuted
			}
		];
		for (const p of room.remoteParticipants.values() as Iterable<RemoteParticipant>) {
			const micPub = p.getTrackPublication(Track.Source.Microphone);
			list.push({
				identity: p.identity,
				name: p.name || p.identity,
				isLocal: false,
				canPublish: p.permissions?.canPublish ?? false,
				speaking: speaking.has(p.identity),
				micEnabled: !!micPub && !micPub.isMuted
			});
		}
		this.members = list;
	}

	async disconnect() {
		this.stopEngagement();
		if (this.shareWriteTimer) clearTimeout(this.shareWriteTimer);
		this.shareWriteTimer = null;
		for (const el of this.sinks.values()) el.remove();
		this.sinks.clear();
		await this.room?.disconnect();
		this.room = null;
		this.connected = false;
		this.floorTrack = null;
		this.members = [];
		this.needsAudioUnlock = false;
	}
}
