<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { untrack } from 'svelte';
	import AudioVisualizer from '$lib/components/modules/AudioVisualizer.svelte';
	import MushafPage from '$lib/components/mushaf/MushafPage.svelte';
	import MathuratView from '$lib/components/modules/MathuratView.svelte';
	import { getPage } from '$lib/api/content';
	import type { PageBundle } from '$lib/api/types';
	import { halaqah } from '$lib/halaqah/store.svelte';
	import { HalaqahSession, type Engagement } from '$lib/halaqah/room.svelte';
	import { Mic, MicOff, Expand, ScreenShare, ScreenShareOff } from '@lucide/svelte';

	const slug = $derived(page.params.slug ?? '');

	/* The session lives in the store, not here — this page is a VIEW of it. That
	   is what lets the user minimise and browse the rest of the app (surah list,
	   Al-Ma'thurat, search) without the call ending. An empty placeholder keeps
	   the markup simple before the join resolves. */
	const placeholder = new HalaqahSession();
	const session = $derived(halaqah.session ?? placeholder);

	let joining = $state(true);
	let joinError = $state<string | null>(null);
	let busy = $state<string | null>(null);

	// Live listener engagement (host view). A ticking clock so a participant who
	// stops sending heartbeats flips to "no signal" without waiting for one.
	let now = $state(Date.now());
	$effect(() => {
		const t = setInterval(() => (now = Date.now()), 5000);
		return () => clearInterval(t);
	});

	function fmtDur(ms: number): string {
		const s = Math.round(ms / 1000);
		return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m`;
	}
	/** Derive a listener's status + accountability figure from their last heartbeat. */
	function engStatus(e: Engagement | undefined, at: number): { cls: string; text: string } {
		if (!e || at - e.at > 20000) return { cls: 'off', text: 'Tiada isyarat' };
		const pct = e.sessionMs > 0 ? Math.round((e.attentiveMs / e.sessionMs) * 100) : 100;
		const strayMs = e.sessionMs - e.attentiveMs;
		const stray = strayMs > 15000 ? ` · ${fmtDur(strayMs)} di luar` : '';
		let cls = 'warn';
		let label = 'Terpesong';
		if (e.onTask) {
			cls = 'on';
			label = 'Mengikut';
		} else if (!e.visible) {
			label = 'Di latar';
		} else if (!e.audioOk) {
			label = 'Senyap';
		}
		return { cls, text: `${label} · ${pct}% ikut${stray}` };
	}

	/** The member currently holding the floor (may publish, and is not the host). */
	const speaker = $derived(session.members.find((m) => m.identity === session.speakerId) ?? null);
	const activeName = $derived(
		session.members.find((m) => m.speaking)?.name ?? speaker?.name ?? null
	);

	async function join() {
		joining = true;
		try {
			// Idempotent: re-entering an already-joined room reuses the live session
			// rather than reconnecting, so audio never drops on the way back in.
			const s = await halaqah.join(slug);
			joinError = s.error;
		} catch (e) {
			if ((e as { cause?: number })?.cause === 401) {
				await goto(`${base}/auth/login?next=${base}/halaqah/${slug}`);
				return;
			}
			joinError = e instanceof Error ? e.message : String(e);
		} finally {
			joining = false;
		}
	}

	/** Host: hand the floor to someone, or take it back with null. */
	async function giveFloor(userId: string | null) {
		busy = userId ?? 'clear';
		try {
			const r = await fetch(`/api/halaqah/rooms/${slug}/speaker`, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ user_id: userId })
			});
			if (!r.ok) throw new Error((await r.json())?.error ?? `HTTP ${r.status}`);
			session.speakerId = (await r.json()).speaker_id ?? null;
		} catch (e) {
			joinError = e instanceof Error ? e.message : String(e);
		} finally {
			busy = null;
		}
	}

	async function endSession() {
		if (!confirm('Tutup halaqah ini untuk semua peserta?')) return;
		await halaqah.close();
		await goto(`${base}/halaqah`);
	}

	/**
	 * Leave for good — the call ends for this user.
	 *
	 * Confirmed, because it sits next to the minimise control and the two are
	 * easy to mix up: someone who only wanted to go and read a page should not
	 * silently drop out of the halaqah.
	 */
	async function leave() {
		if (session.connected && !confirm('Keluar dari halaqah ini? Panggilan anda akan tamat.')) return;
		await halaqah.leave();
		await goto(`${base}/halaqah`);
	}

	/**
	 * Minimise: navigate away but KEEP the session. The bar in the root layout
	 * takes over, so the user can open a surah, Al-Ma'thurat or search while the
	 * halaqah keeps running.
	 */
	async function minimise() {
		await goto(`${base}/menu`);
	}

	/* ---- shared mushaf page --------------------------------------------------
	   We broadcast a page NUMBER and let every device draw it with the app's own
	   reader, so each participant keeps their own font size, translation and
	   theme — and a page turn costs a few bytes instead of a video stream. */
	let bundle = $state<PageBundle | null>(null);
	let pageError = $state<string | null>(null);
	let loadedPage = -1;

	$effect(() => {
		const want = session.viewPage;
		if (want === loadedPage) return;
		loadedPage = want;
		getPage(want)
			.then((b) => {
				// A later page turn may have landed while this was in flight.
				if (session.viewPage === want) {
					bundle = b;
					pageError = null;
				}
			})
			.catch((e) => {
				pageError = e instanceof Error ? e.message : String(e);
			});
	});

	const step = (d: number) => session.setPage(session.viewPage + d);

	$effect(() => {
		// untrack prevents Svelte from subscribing to halaqah.session here.
		// Without it, halaqah.join() reads session synchronously, so the effect
		// re-fires when leave() clears the session — immediately re-joining the room.
		untrack(() => void join());
		// NO teardown here on purpose. Disconnecting on unmount is what made the
		// back button (and every other navigation) end the call. The session is
		// owned by the store now and ends only when the user says so — "Keluar",
		// or "Tutup" for the host.
	});

	$effect(() => {
		// Browsers block audio autoplay until the user interacts. Rather than a
		// dedicated "tap to hear" button, unlock on the FIRST interaction anywhere in
		// the room, so the reciter's voice starts on the listener's first tap — no
		// button to find. (startAudio() on connect already covers the common case.)
		const unlock = () => void halaqah.session?.unlockAudio();
		window.addEventListener('pointerdown', unlock, { capture: true });
		return () => window.removeEventListener('pointerdown', unlock, { capture: true });
	});
</script>

<div class="hq">
	<header>
		<!-- Back = minimise. The call keeps running; the bar takes over.
		     Labelled, not a bare chevron: next to a red "Keluar" an ambiguous icon
		     invites people to tap the destructive button just to go and read. -->
		<button class="ghost min" onclick={minimise} aria-label="Kecilkan, teruskan panggilan">
			⌄ Kecilkan
		</button>
		<div class="mid">
			<h1>{session.title || 'Halaqah'}</h1>
			<p>
				{#if session.connected}
					{session.members.length} peserta ·
					{session.role === 'host' ? 'Anda hos' : session.canSpeak ? 'Anda pembaca' : 'Mendengar'}
				{:else}
					Menyambung…
				{/if}
			</p>
		</div>
		{#if session.role === 'host'}
			<button class="ghost danger" onclick={endSession}>Tutup</button>
		{:else}
			<button class="ghost danger" onclick={leave}>Keluar</button>
		{/if}
	</header>

	{#if session.connected}
		<!-- Anchors, not goto(): plain client-side navigation keeps the session,
		     which lives in the store rather than in this page. -->
		<nav class="jump" aria-label="Buka ciri lain sambil terus dalam panggilan">
			<span class="jlab">Buka sambil terus mendengar</span>
			<div class="jrow">
				<a href="{base}/read/{session.page}">Mushaf</a>
				<a href="{base}/mathurat">Al-Ma'thurat</a>
				<a href="{base}/surah">Surah</a>
				<a href="{base}/zikir">Zikir</a>
				<a href="{base}/menu">Lagi…</a>
			</div>
		</nav>
	{/if}

	{#if joining}
		<div class="state">Menyertai halaqah…</div>
	{:else if joinError}
		<div class="state err">
			<p>{joinError}</p>
			<button class="btn" onclick={join}>Cuba lagi</button>
		</div>
	{:else}
		<!-- Visualiser: the floor's audio, drawn from a real FFT -->
		<section class="stage">
			<div class="who">
				{#if activeName}
					<span class="dot" aria-hidden="true"></span>{activeName}
				{:else}
					<span class="idle">Belum ada bacaan</span>
				{/if}
			</div>
			<AudioVisualizer track={session.floorTrack} live={!!activeName} height={110} bars={44} />
			<div class="sub">
				{#if speaker}
					Mikrofon diberi kepada <b>{speaker.name}</b>
				{:else if session.role === 'host'}
					Pilih seorang peserta di bawah untuk memberi mikrofon
				{:else}
					Menunggu hos memilih pembaca
				{/if}
			</div>
		</section>

		<!-- Controls, side by side: mic, screen-share, and (when the shared panel is hidden) a button to bring it back. -->
		{#if session.canSpeak || session.panelHidden}
			<div class="controls">
				{#if session.canSpeak}
					<button
						class="ctl"
						class:open={session.micOn}
						class:closed={!session.micOn}
						onclick={() => session.setMic(!session.micOn)}
						aria-pressed={session.micOn}
						aria-label={session.micOn ? 'Mikrofon terbuka — ketuk untuk tutup' : 'Buka mikrofon'}
					>
						{#if session.micOn}<Mic size={24} />{:else}<MicOff size={24} />{/if}
					</button>
					<button
						class="ctl"
						class:open={session.sharing}
						class:closed={!session.sharing}
						onclick={() => (session.sharing ? session.stopSharing() : session.resumeSharing())}
						aria-pressed={session.sharing}
						aria-label={session.sharing ? 'Berkongsi skrin — ketuk untuk berhenti' : 'Kongsi skrin anda'}
					>
						{#if session.sharing}<ScreenShare size={24} />{:else}<ScreenShareOff size={24} />{/if}
					</button>
				{/if}
				{#if session.panelHidden}
					<button
						class="ctl closed"
						onclick={() => (session.panelHidden = false)}
						aria-label="Papar skrin pembaca"
					>
						<Expand size={24} />
					</button>
				{/if}
			</div>
		{/if}

		<!-- The shared view (mushaf / Al-Ma'thurat / a route to follow), unless the viewer hid it via the control bar above. -->
		{#if !session.panelHidden}
			{#if session.share?.kind === 'mathurat'}
				<section class="mushaf">
					<div class="mbar">
						<div class="mmid">
							<div class="mp">Al-Ma'thurat</div>
							<div class="mhint">
								{session.canSpeak ? 'Bacaan anda diikuti peserta lain' : 'Mengikut pembaca'}
							</div>
						</div>
						<button
							class="nav"
							onclick={() => (session.panelHidden = true)}
							aria-label="Sembunyikan skrin">✕</button
						>
					</div>
					<div class="mbody">
						<MathuratView
							version={session.share.version}
							mode={session.share.mode}
							idx={session.share.idx}
						/>
					</div>
				</section>
			{:else if session.share?.kind === 'route'}
				<section class="routecard">
					<button
						class="dismiss"
						onclick={() => (session.panelHidden = true)}
						aria-label="Sembunyikan skrin">✕</button
					>
					<div class="rlab">Pembaca sedang membuka</div>
					<div class="rttl">{session.share.label}</div>
					<a class="rgo" href={session.share.path}>Ikut ke sana →</a>
					<p class="rhint">Panggilan diteruskan semasa anda melihat.</p>
				</section>
			{:else}
				<section class="mushaf">
					<div class="mbar">
						<button class="nav" onclick={() => step(-1)} aria-label="Halaman sebelum">‹</button>
						<div class="mmid">
							<div class="mp">Halaman {session.viewPage} / 604</div>
							{#if !session.following}
								<button class="follow" onclick={() => session.followSpeaker()}>
									⤺ Kembali ke halaman pembaca ({session.page})
								</button>
							{:else if session.canSpeak}
								<div class="mhint">Halaman anda diikuti peserta lain</div>
							{:else}
								<div class="mhint">Mengikut pembaca</div>
							{/if}
						</div>
						<button class="nav" onclick={() => step(1)} aria-label="Halaman seterusnya">›</button>
						<button
							class="nav"
							onclick={() => (session.panelHidden = true)}
							aria-label="Sembunyikan skrin">✕</button
						>
					</div>

					<div class="mbody">
						{#if pageError}
							<p class="merr">{pageError}</p>
						{:else if bundle}
							<MushafPage {bundle} onactions={() => {}} />
						{:else}
							<p class="mload">Memuatkan halaman…</p>
						{/if}
					</div>
				</section>
			{/if}
		{/if}

		<section class="people">
			<h2>Peserta</h2>
			<ul>
				{#each session.members as m (m.identity)}
					<li class:speaking={m.speaking}>
						<span class="av" aria-hidden="true">{(m.name || '?').slice(0, 2).toUpperCase()}</span>
						<div class="nm">
							<div class="who">
								{m.name}{#if m.isLocal}<em> (anda)</em>{/if}
								{#if m.identity === session.selfId && session.role === 'host'}<span class="tag">hos</span>{/if}
								{#if m.identity === session.speakerId}<span class="tag live">mikrofon</span>{/if}
							</div>
							{#if session.role === 'host' && !m.isLocal}
								{@const e = engStatus(session.engagement[m.identity], now)}
								<div class="eng {e.cls}"><span class="edot"></span>{e.text}</div>
							{/if}
						</div>
						{#if session.role === 'host' && !m.isLocal}
							{#if m.identity === session.speakerId}
								<button class="sm out" disabled={busy !== null} onclick={() => giveFloor(null)}>
									Tarik balik
								</button>
							{:else}
								<button
									class="sm"
									disabled={busy !== null}
									onclick={() => giveFloor(m.identity)}
								>
									Beri mikrofon
								</button>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<style>
	.hq {
		max-width: 560px;
		margin: 0 auto;
		padding: 0 20px 110px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	header {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 0 6px;
	}
	.mid { flex: 1; text-align: center; }
	h1 { font-size: 17px; margin: 0; font-weight: 600; }
	header p { margin: 2px 0 0; font-size: 12.5px; color: var(--muted-foreground, #5c6b63); }
	.ghost {
		width: 44px; height: 38px;
		background: none; border: 0; font-size: 16px; cursor: pointer;
		color: var(--foreground, #22312b);
	}
	.ghost.danger { color: #a8321f; font-size: 13px; font-weight: 600; width: auto; }
	.ghost.min { width: auto; padding: 0 8px; font-size: 12.5px; font-weight: 600; white-space: nowrap; }
	.jump { margin: -6px 0 0; text-align: center; }
	.jlab {
		display: block;
		font-size: 11px;
		color: var(--muted-foreground, #5c6b63);
		margin-bottom: 7px;
	}
	.jrow { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
	.jrow a {
		padding: 6px 12px;
		border: 1px solid var(--border, #e4dcc8);
		border-radius: 999px;
		background: var(--card, #fff);
		font-size: 12.5px;
		font-weight: 600;
		text-decoration: none;
		color: var(--primary, #155b44);
	}
	.state { text-align: center; padding: 40px 0; color: var(--muted-foreground, #5c6b63); }
	.state.err { color: #a8321f; display: grid; gap: 12px; justify-items: center; }

	.stage {
		background: var(--card, #fff);
		border: 1px solid var(--border, #e4dcc8);
		border-radius: 18px;
		padding: 18px 16px 16px;
		text-align: center;
	}
	.who { font-size: 14px; font-weight: 600; min-height: 20px; }
	.who .dot {
		display: inline-block; width: 8px; height: 8px; border-radius: 99px;
		background: #22a06b; margin-right: 7px; vertical-align: middle;
		animation: pulse 1.4s ease-in-out infinite;
	}
	.who .idle { color: var(--muted-foreground, #5c6b63); font-weight: 400; }
	@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
	.sub { font-size: 12.5px; color: var(--muted-foreground, #5c6b63); margin-top: 10px; }

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}
	/* One shared style for every control button: same size, same border.
	   Colour carries the state — red when closed/off, green when open/on. */
	.ctl {
		width: 56px;
		height: 56px;
		display: grid;
		place-items: center;
		border: 1.5px solid var(--border, #e4dcc8);
		border-radius: 14px;
		background: var(--card, #fff);
		color: var(--muted-foreground, #5c6b63);
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s, background 0.15s, transform 0.1s;
	}
	.ctl:active { transform: scale(0.96); }
	.ctl.open {
		border-color: #155b44;
		color: #155b44;
		background: rgba(21, 91, 68, 0.08);
	}
	.ctl.closed {
		border-color: #a8321f;
		color: #a8321f;
		background: rgba(168, 50, 31, 0.06);
	}

	/* shared mushaf panel */
	.mushaf {
		border: 1px solid var(--border, #e4dcc8);
		border-radius: 18px;
		background: var(--card, #fff);
		overflow: hidden;
	}
	.mbar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 8px 8px 8px;
		border-bottom: 1px solid var(--border, #e4dcc8);
		background: var(--muted, #f6f2e7);
	}
	.mmid { flex: 1; text-align: center; min-width: 0; }
	.mp { font-size: 12.5px; font-weight: 600; }
	.mhint { font-size: 11px; color: var(--muted-foreground, #5c6b63); margin-top: 1px; }
	.follow {
		margin-top: 2px; border: 0; background: none; cursor: pointer;
		font-size: 11.5px; font-weight: 600; color: #8a6522;
	}
	.nav {
		width: 36px; height: 36px; flex-shrink: 0;
		border: 1px solid var(--border, #e4dcc8); border-radius: 10px;
		background: var(--card, #fff); font-size: 17px; cursor: pointer;
		color: var(--foreground, #22312b);
	}
	/* Fixed height (not max-height) so the shared panel stays ONE size across pages:
	   short pages show with whitespace, long pages scroll internally — the outer
	   panel never resizes, so page turns no longer make the layout jump/blink. */
	.mbody { padding: 10px 12px 16px; height: 58vh; overflow-y: auto; }
	.mload, .merr { text-align: center; font-size: 13px; padding: 28px 0; color: var(--muted-foreground, #5c6b63); }
	.merr { color: #a8321f; }

	/* a non-mushaf destination the room can follow into */
	.routecard {
		position: relative;
		border: 1px solid var(--border, #e4dcc8);
		border-radius: 18px;
		background: var(--card, #fff);
		padding: 22px 18px 18px;
		text-align: center;
	}
	.dismiss {
		position: absolute; top: 10px; inset-inline-end: 10px;
		width: 28px; height: 28px; border: 0; border-radius: 8px;
		background: var(--muted, #f0ece1); color: var(--muted-foreground, #5c6b63);
		font-size: 12px; cursor: pointer;
	}
	.rlab { font-size: 12px; color: var(--muted-foreground, #5c6b63); }
	.rttl { font-size: 19px; font-weight: 600; margin: 4px 0 14px; }
	.rgo {
		display: inline-flex; align-items: center; height: 42px; padding: 0 20px;
		border-radius: 12px; background: var(--primary, #155b44); color: #fff;
		font-size: 14px; font-weight: 600; text-decoration: none;
	}
	.rhint { margin: 12px 0 0; font-size: 11.5px; color: var(--muted-foreground, #5c6b63); }


	.people h2 { font-size: 13px; margin: 4px 0 8px; color: var(--muted-foreground, #5c6b63); font-weight: 600; }
	.people ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
	.people li {
		display: flex; align-items: center; gap: 10px;
		padding: 10px 12px; border-radius: 12px;
		border: 1px solid var(--border, #e4dcc8); background: var(--card, #fff);
	}
	.people li.speaking { border-color: #22a06b; background: #f2fbf6; }
	.av {
		width: 32px; height: 32px; border-radius: 99px; flex-shrink: 0;
		background: #155b44; color: #fff; font-size: 12px; font-weight: 600;
		display: grid; place-items: center;
	}
	.nm { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
	.who { font-size: 14px; }
	.nm em { color: var(--muted-foreground, #5c6b63); font-style: normal; font-size: 12px; }
	/* Live engagement line (host only): colour + label + accountability figure. */
	.eng {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11.5px;
		font-weight: 600;
	}
	.eng .edot { width: 7px; height: 7px; border-radius: 99px; background: currentColor; flex: none; }
	.eng.on { color: #1f8a5b; }
	.eng.warn { color: #b06a1a; }
	.eng.off { color: var(--muted-foreground, #5c6b63); font-weight: 500; }
	.tag {
		display: inline-block; margin-left: 6px; font-size: 10.5px; font-weight: 600;
		padding: 2px 7px; border-radius: 999px; background: var(--muted, #f0ece1);
		color: var(--muted-foreground, #5c6b63); vertical-align: middle;
	}
	.tag.live { background: #dff3e8; color: #155b44; }
	.sm {
		height: 32px; padding: 0 12px; border: 1px solid var(--primary, #155b44);
		background: transparent; color: var(--primary, #155b44);
		border-radius: 9px; font-size: 12.5px; font-weight: 600; cursor: pointer;
	}
	.sm.out { border-color: #c08a2e; color: #8a6522; }
	.sm:disabled { opacity: .5; cursor: default; }
</style>
