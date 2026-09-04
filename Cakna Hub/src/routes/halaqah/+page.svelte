<script lang="ts">
	import { goto } from '$app/navigation';
	import AudioVisualizer from '$lib/components/modules/AudioVisualizer.svelte';
	import { halaqah } from '$lib/halaqah/store.svelte';
	import { ChevronLeft, Mic, MicOff, Users, LogOut, Copy, X, Radio, BookOpen, ScrollText, MapPin } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';

	let { data } = $props();

	let roomTitle = $state('');
	let creating = $state(false);
	let createError = $state<string | null>(null);
	let joining = $state(false);
	let joinError = $state<string | null>(null);

	const session = $derived(halaqah.session);
	const active = $derived(halaqah.active);

	async function create() {
		if (!roomTitle.trim() || creating) return;
		creating = true;
		createError = null;
		try {
			const r = await fetch('/api/halaqah/rooms', {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: roomTitle.trim() })
			});
			if (!r.ok) throw new Error((await r.json())?.error ?? `HTTP ${r.status}`);
			const room = await r.json();
			await goto(`/halaqah/${room.slug}`);
		} catch (e: unknown) {
			createError = e instanceof Error ? e.message : 'Gagal membuka sesi.';
		} finally {
			creating = false;
		}
	}

	async function join(s: string) {
		if (!s.trim()) return;
		joining = true;
		joinError = null;
		try {
			await halaqah.join(s.trim().toLowerCase());
		} catch (e: unknown) {
			joinError = e instanceof Error ? e.message : 'Gagal menyambung. Cuba lagi.';
		} finally {
			joining = false;
		}
	}

	async function leave() {
		await halaqah.leave();
	}

	async function close() {
		await halaqah.close();
	}

	function copyLink() {
		const url = `${location.origin}/halaqah/${session?.slug}`;
		navigator.clipboard.writeText(url);
	}

	function toggleMic() {
		session?.setMic(!session.micOn);
	}

	const memberCount = $derived(session?.members?.length ?? 0);
	const sessionTitle = $derived(session?.title ?? session?.slug ?? '');

	function fmtAge(iso: string) {
		const ms = Date.now() - new Date(iso).getTime();
		const m = Math.floor(ms / 60000);
		if (m < 1) return 'Baru sahaja';
		if (m < 60) return `${m} min lalu`;
		return `${Math.floor(m / 60)} jam lalu`;
	}
</script>

<svelte:head><title>Halaqah — Cakna</title></svelte:head>

<div class="hlq-root">
	<header class="hlq-header">
		<a href="/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			{#if active && session}
				<span class="hdr-badge">
					<span class="live-dot"></span>
					Langsung
				</span>
				<span class="hdr-title">{sessionTitle}</span>
			{:else}
				<span class="hdr-title">Halaqah</span>
			{/if}
		</div>
		{#if active && session}
			<button class="hdr-btn hdr-danger" onclick={leave} title="Keluar">
				<LogOut size={18} />
			</button>
		{:else}
			<div class="w-9"></div>
		{/if}
	</header>

	<main class="hlq-main">
		{#if active && session}
			<!-- Active session view -->
			<div class="session-view">
				<!-- Visualizer -->
				{#if session.floorTrack}
					<div class="viz-wrap">
						<AudioVisualizer track={session.floorTrack} height={60} bars={32} />
					</div>
				{/if}

				<!-- Speaker info -->
				{#if session.speakerId}
					{@const speaker = session.members.find((m) => m.identity === session.speakerId)}
					<div class="speaker-card">
						<Radio size={16} class="text-rose-400" />
						<span class="speaker-label">Penceramah</span>
						<span class="speaker-name">{speaker?.name ?? 'Tidak diketahui'}</span>
					</div>
				{/if}

				<!-- Members -->
				<section class="members-section">
					<h2 class="sec-label">
						<Users size={13} />
						Ahli ({memberCount})
					</h2>
					<div class="members-grid">
						{#each session.members as m (m.identity)}
							<div class="member-chip" class:member-speaking={m.identity === session.speakerId}>
								<span class="member-avatar">{m.name?.[0]?.toUpperCase() ?? '?'}</span>
								<span class="member-name">{m.name}</span>
								{#if m.identity === session.speakerId}
									<span class="member-mic"><Mic size={13} /></span>
								{/if}
							</div>
						{/each}
					</div>
				</section>

				<!-- Controls -->
				<div class="controls">
					<button class="ctrl-btn" class:ctrl-active={session.micOn} onclick={toggleMic}>
						{#if session.micOn}
							<Mic size={22} />
							<span>Mik Hidup</span>
						{:else}
							<MicOff size={22} />
							<span>Mik Mati</span>
						{/if}
					</button>

					<button class="ctrl-btn" onclick={copyLink}>
						<Copy size={22} />
						<span>Kongsi</span>
					</button>

					{#if session.role === 'host'}
						<button class="ctrl-btn ctrl-danger" onclick={close}>
							<X size={22} />
							<span>Tutup</span>
						</button>
					{:else}
						<button class="ctrl-btn ctrl-danger" onclick={leave}>
							<LogOut size={22} />
							<span>Keluar</span>
						</button>
					{/if}
				</div>

				<!-- Share state -->
				{#if session.share}
					<div class="share-info">
						{#if session.share.kind === 'page'}
							<span class="share-label"><BookOpen size={14} /> Halaman {session.share.page}</span>
						{:else if session.share.kind === 'mathurat'}
							<span class="share-label"><ScrollText size={14} /> Al-Ma'thurat</span>
						{:else}
							<span class="share-label"><MapPin size={14} /> {session.share.label}</span>
						{/if}
						{#if !session.following && session.role !== 'host'}
							<button class="follow-btn" onclick={() => session?.followSpeaker()}>Ikut</button>
						{/if}
					</div>
				{/if}

				<!-- Audio unlock prompt -->
				{#if session.needsAudioUnlock}
					<button class="unlock-btn" onclick={() => session.unlockAudio()}>
						Ketik untuk aktifkan audio
					</button>
				{/if}
			</div>
		{:else}
			<!-- Lobby -->
			<div class="lobby">
				<div class="lobby-hero">
					<div class="lobby-icon">
						<Radio size={32} />
					</div>
					<h1 class="lobby-title">Halaqah</h1>
					<p class="lobby-sub">Platform pembelajaran Al-Quran secara langsung bersama-sama.</p>
				</div>

				{#if data.isAdmin}
					<div class="create-card">
						<label class="create-label" for="room-title">Buka halaqah baharu</label>
						<div class="create-row">
							<input
								id="room-title"
								class="create-input"
								type="text"
								placeholder="cth. Tadarus Malam Khamis"
								maxlength="80"
								bind:value={roomTitle}
								onkeydown={(e) => e.key === 'Enter' && create()}
								disabled={creating}
							/>
							<button class="open-btn" onclick={create} disabled={creating || !roomTitle.trim()}>
								{creating ? 'Membuka…' : 'Buka'}
							</button>
						</div>
						<p class="create-hint">Anda menjadi hos. Sesi ditutup secara automatik selepas 5 jam — atau lebih awal jika anda tutup sendiri.</p>
						{#if createError}
							<p class="create-error">{createError}</p>
						{/if}
					</div>
				{/if}

				{#if data.rooms.length === 0}
					<div class="empty-card">
						Tiada halaqah aktif buat masa ini.
						{#if !data.isAdmin}<br />Hos akan membuka sesi apabila bersedia.{/if}
					</div>
				{:else}
					<div class="rooms-card">
						{#each data.rooms as room (room.id)}
							<button class="room-row" onclick={() => join(room.slug)} disabled={joining}>
								<div class="room-info">
									<span class="room-live-dot"></span>
									<div>
										<div class="room-title">{room.title}</div>
										{#if room.host_name}
											<div class="room-meta">Hos: {room.host_name} · {fmtAge(room.created_at)}</div>
										{:else}
											<div class="room-meta">{fmtAge(room.created_at)}</div>
										{/if}
									</div>
								</div>
								<span class="room-join-label">{joining ? '…' : 'Sertai'}</span>
							</button>
						{/each}
					</div>
				{/if}

				{#if joinError}
					<p class="join-error">{joinError}</p>
				{/if}

				<div class="features">
					<div class="feat">
						<span class="feat-icon"><BookOpen size={18} /></span>
						<div>
							<div class="feat-title">Mushaf Bersama</div>
							<div class="feat-sub">Halaman Quran disinkron secara masa nyata</div>
						</div>
					</div>
					<div class="feat">
						<span class="feat-icon"><Mic size={18} /></span>
						<div>
							<div class="feat-title">Audio Langsung</div>
							<div class="feat-sub">Dengar bacaan guru terus dalam sesi</div>
						</div>
					</div>
					<div class="feat">
						<span class="feat-icon"><ScrollText size={18} /></span>
						<div>
							<div class="feat-title">Al-Ma'thurat Bersama</div>
							<div class="feat-sub">Bacaan wirid dikongsi dengan ahli sesi</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<SideNav active="halaqah" />

<style>
	.hlq-root {
		display: flex; flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
	}

	.hlq-header {
		position: sticky; top: 0; z-index: 20;
		display: flex; align-items: center; gap: 12px;
		padding: 12px 16px;
		background: var(--pg-hdr);
		border-bottom: 1px solid rgba(34,197,94,0.1);
		backdrop-filter: blur(8px);
	}
	.hdr-btn {
		display: grid; place-items: center;
		width: 36px; height: 36px;
		border-radius: 10px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		color: var(--pg-btn-color);
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s;
	}
	.hdr-btn:hover { background: var(--pg-btn-hover); }
	.hdr-danger { border-color: rgba(248,113,113,0.2); color: rgba(248,113,113,0.7); }
	.hdr-danger:hover { background: rgba(248,113,113,0.1); }
	.hdr-center { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
	.hdr-title { font-size: 13px; font-weight: 600; color: var(--pg-text-75); }
	.hdr-badge {
		display: flex; align-items: center; gap: 5px;
		font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
		text-transform: uppercase; color: rgba(228,112,163,0.9);
	}
	.live-dot {
		width: 7px; height: 7px;
		border-radius: 50%;
		background: #b34a6e;
		box-shadow: 0 0 6px #b34a6e;
		animation: pulse 1.5s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.hlq-main { flex: 1; overflow-y: auto; }

	/* Session view */
	.session-view { padding: 20px 16px 40px; display: flex; flex-direction: column; gap: 16px; }
	.viz-wrap {
		border-radius: 16px;
		background: rgba(34,197,94,0.06);
		border: 1px solid rgba(34,197,94,0.12);
		overflow: hidden;
		padding: 4px 0;
	}
	.speaker-card {
		display: flex; align-items: center; gap: 8px;
		padding: 10px 14px;
		border-radius: 12px;
		background: rgba(34,197,94,0.08);
		border: 1px solid rgba(34,197,94,0.15);
		font-size: 13px;
	}
	.speaker-label { color: rgba(74,222,128,0.7); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
	.speaker-name { flex: 1; color: var(--pg-text-85); }

	.members-section {}
	.sec-label {
		display: flex; align-items: center; gap: 5px;
		font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
		text-transform: uppercase; color: var(--pg-subtle);
		margin-bottom: 8px;
	}
	.members-grid { display: flex; flex-wrap: wrap; gap: 6px; }
	.member-chip {
		display: flex; align-items: center; gap: 6px;
		padding: 6px 10px;
		border-radius: 20px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		font-size: 12px;
	}
	.member-speaking {
		background: rgba(34,197,94,0.12);
		border-color: rgba(34,197,94,0.25);
	}
	.member-avatar {
		width: 20px; height: 20px;
		border-radius: 50%;
		background: rgba(34,197,94,0.2);
		color: rgba(74,222,128,0.9);
		font-size: 11px; font-weight: 700;
		display: grid; place-items: center;
	}
	.member-name { color: var(--pg-text-75); }
	.member-mic { display: flex; align-items: center; color: rgba(74,222,128,0.8); }

	.controls {
		display: grid; grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}
	.ctrl-btn {
		display: flex; flex-direction: column; align-items: center; gap: 6px;
		padding: 14px 8px;
		border-radius: 14px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		color: var(--pg-btn-color);
		font-size: 11px; cursor: pointer;
		transition: all 0.15s;
	}
	.ctrl-btn:hover { background: var(--pg-btn-hover); color: white; }
	.ctrl-active { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.3); color: rgba(74,222,128,0.9); }
	.ctrl-danger { color: rgba(248,113,113,0.7); }
	.ctrl-danger:hover { background: rgba(248,113,113,0.12); border-color: rgba(248,113,113,0.2); }

	.share-info {
		display: flex; align-items: center; gap: 10px; justify-content: center;
		padding: 10px 14px;
		border-radius: 12px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		font-size: 13px; color: var(--pg-muted);
	}
	.follow-btn {
		padding: 4px 10px;
		border-radius: 8px;
		background: rgba(34,197,94,0.15);
		border: 1px solid rgba(34,197,94,0.25);
		color: rgba(74,222,128,0.9);
		font-size: 11px; cursor: pointer;
	}
	.share-label { display: flex; align-items: center; gap: 6px; }

	.unlock-btn {
		width: 100%;
		padding: 14px;
		border-radius: 14px;
		background: rgba(250,204,21,0.1);
		border: 1px solid rgba(250,204,21,0.2);
		color: rgba(253,224,71,0.9);
		font-size: 14px; cursor: pointer;
		animation: throb 2s ease-in-out infinite;
	}
	@keyframes throb {
		0%, 100% { box-shadow: 0 0 0 0 rgba(250,204,21,0.2); }
		50% { box-shadow: 0 0 0 8px rgba(250,204,21,0); }
	}

	/* Lobby */
	.lobby { padding: 20px 20px 40px; display: flex; flex-direction: column; gap: 12px; }
	.lobby-hero { text-align: center; margin-bottom: 8px; }
	.lobby-icon {
		display: inline-grid; place-items: center;
		width: 72px; height: 72px;
		border-radius: 20px;
		background: rgba(34,197,94,0.12);
		border: 1px solid rgba(34,197,94,0.2);
		color: rgba(74,222,128,0.9);
		margin-bottom: 16px;
	}
	.lobby-title { font-size: 28px; font-weight: 700; color: var(--pg-fg); margin-bottom: 6px; }
	.lobby-sub { font-size: 14px; color: var(--pg-subtle); max-width: 320px; margin: 0 auto; }

	/* Create card */
	.create-card {
		background: var(--pg-surface);
		border: 1px solid var(--pg-btn-border);
		border-radius: 16px;
		padding: 18px;
	}
	.create-label { font-size: 14px; font-weight: 600; color: var(--pg-fg); display: block; margin-bottom: 10px; }
	.create-row { display: flex; gap: 8px; }
	.create-input {
		flex: 1;
		padding: 10px 14px;
		border-radius: 10px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-text-85);
		font-size: 14px;
		outline: none;
	}
	.create-input:focus { border-color: rgba(34,197,94,0.4); }
	.create-input::placeholder { color: var(--pg-faint); }
	.create-input:disabled { opacity: 0.6; }
	.open-btn {
		padding: 10px 18px;
		border-radius: 10px;
		background: rgba(34,197,94,0.65);
		border: none;
		color: #fff;
		font-size: 14px; font-weight: 600;
		cursor: pointer; white-space: nowrap;
		transition: background 0.15s;
	}
	.open-btn:hover:not(:disabled) { background: rgba(34,197,94,0.8); }
	.open-btn:disabled { opacity: 0.5; cursor: not-allowed; }
	.create-hint { font-size: 12px; color: var(--pg-subtle); margin: 8px 0 0; line-height: 1.5; }
	.create-error { font-size: 12px; color: #f87171; margin: 6px 0 0; }

	/* Rooms / empty */
	.empty-card {
		background: var(--pg-surface);
		border: 1px solid var(--pg-btn-border);
		border-radius: 16px;
		padding: 28px 20px;
		text-align: center;
		font-size: 14px;
		color: var(--pg-subtle);
		line-height: 1.6;
	}
	.rooms-card {
		background: var(--pg-surface);
		border: 1px solid var(--pg-btn-border);
		border-radius: 16px;
		overflow: hidden;
	}
	.room-row {
		display: flex; align-items: center; justify-content: space-between; gap: 12px;
		padding: 14px 16px;
		width: 100%;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--pg-btn-border);
		color: inherit;
		cursor: pointer;
		text-align: left;
		transition: background 0.12s;
	}
	.room-row:last-child { border-bottom: none; }
	.room-row:hover:not(:disabled) { background: var(--pg-btn); }
	.room-row:disabled { opacity: 0.6; cursor: not-allowed; }
	.room-info { display: flex; align-items: center; gap: 10px; min-width: 0; }
	.room-live-dot {
		width: 8px; height: 8px; flex-shrink: 0;
		border-radius: 50%;
		background: rgba(74,222,128,0.8);
		box-shadow: 0 0 6px rgba(74,222,128,0.5);
		animation: pulse 1.5s ease-in-out infinite;
	}
	.room-title { font-size: 13px; font-weight: 600; color: var(--pg-fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.room-meta { font-size: 11px; color: var(--pg-subtle); margin-top: 1px; }
	.room-join-label { font-size: 12px; font-weight: 600; color: rgba(74,222,128,0.85); flex-shrink: 0; }

	.join-error { font-size: 12px; color: #f87171; text-align: center; }

	.features { display: flex; flex-direction: column; gap: 2px; }
	.feat {
		display: flex; align-items: center; gap: 12px;
		padding: 12px 14px;
		border-radius: 12px;
	}
	.feat:hover { background: var(--pg-surface); }
	.feat-icon {
		display: grid; place-items: center;
		width: 36px; height: 36px; flex-shrink: 0;
		border-radius: 10px;
		background: rgba(74,222,128,0.08);
		color: rgba(74,222,128,0.75);
	}
	.feat-title { font-size: 13px; font-weight: 600; color: var(--pg-text-75); }
	.feat-sub { font-size: 12px; color: var(--pg-subtle); margin-top: 1px; }

	.w-9 { width: 36px; }
</style>
