<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import AudioVisualizer from '$lib/components/modules/AudioVisualizer.svelte';
	import { halaqah } from '$lib/halaqah/store.svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import {
		Mic, MicOff, Users, LogOut, X, Radio,
		ChevronLeft, Minimize2, Crown, BookOpen, ScrollText, MapPin, Clock, Monitor
	} from 'lucide-svelte';

	const slug = $derived(page.params.slug ?? '');
	const session = $derived(halaqah.session);
	const active = $derived(halaqah.active);

	let joining = $state(false);
	let joinError = $state<string | null>(null);

	$effect(() => {
		const s = slug;
		if (session?.slug === s && session?.connected) return;
		joining = true;
		joinError = null;
		halaqah.join(s)
			.catch((e: unknown) => {
				joinError = e instanceof Error ? e.message : 'Gagal menyertai sesi.';
			})
			.finally(() => { joining = false; });
	});

	async function leave() { await halaqah.leave(); }
	async function close() { await halaqah.close(); }

	function toggleMic() { session?.setMic(!session.micOn); }

	function minimize() { history.back(); }

	const memberCount = $derived(session?.members?.length ?? 0);
	const roomTitle = $derived(session?.title || session?.slug || slug);

	function memberRole(identity: string, canPublish: boolean): 'host' | 'speaker' | 'listener' {
		if (!session) return 'listener';
		if (identity === session.speakerId) return 'speaker';
		if (canPublish) return 'host';
		return 'listener';
	}

	function fmtTime(ms: number): string {
		return new Date(ms).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	}

	// Redirect listeners to the speaker's shared page when following.
	$effect(() => {
		if (!session?.connected || session.canSpeak || !session.following) return;
		const sh = session.share;
		if (!sh) return;
		const cur = page.url.pathname + page.url.search;
		if (sh.kind === 'route' && page.url.pathname !== sh.path) {
			void goto(sh.path);
		} else if (sh.kind === 'page') {
			const dest = `/read/${sh.page}`;
			if (cur !== dest) void goto(dest);
		} else if (sh.kind === 'mathurat') {
			if (page.url.pathname !== '/mathurat/baca') void goto('/mathurat/baca');
		}
	});
</script>

<svelte:head><title>{roomTitle} — Halaqah Cakna</title></svelte:head>

<div class="hlq-root">
	<header class="hlq-header">
		<button class="hdr-btn" onclick={minimize} title="Minimumkan">
			<ChevronLeft size={20} />
		</button>
		<div class="hdr-center">
			{#if active && session}
				<span class="hdr-badge">
					<span class="live-dot"></span>
					Langsung
				</span>
				<span class="hdr-title">{roomTitle}</span>
			{:else}
				<span class="hdr-title">Halaqah</span>
			{/if}
		</div>
		{#if active && session}
			<button class="hdr-btn hdr-minimize" onclick={minimize} title="Minimumkan">
				<Minimize2 size={18} />
			</button>
		{:else}
			<div class="w-9"></div>
		{/if}
	</header>

	<main class="hlq-main">
		{#if joining}
			<div class="state-view">
				<div class="spinner"></div>
				<p class="state-msg">Menyambung ke sesi…</p>
			</div>
		{:else if joinError}
			<div class="state-view">
				<p class="state-err">{joinError}</p>
				<a href="/halaqah" class="state-back">Kembali ke Halaqah</a>
			</div>
		{:else if active && session}
			<div class="session-view">

				<!-- Audio visualizer -->
				{#if session.floorTrack}
					<div class="viz-wrap">
						<AudioVisualizer track={session.floorTrack} height={60} bars={32} />
					</div>
				{/if}

				<!-- Speaker card -->
				{#if session.speakerId}
					{@const speaker = session.members.find(m => m.identity === session.speakerId)}
					<div class="speaker-card">
						<Radio size={16} class="text-rose-400" />
						<span class="speaker-label">Penceramah</span>
						<span class="speaker-name">{speaker?.name ?? 'Tidak diketahui'}</span>
					</div>
				{/if}

				<!-- Members list -->
				<section class="section">
					<h2 class="sec-label">
						<Users size={13} />
						Ahli ({memberCount})
					</h2>
					<div class="members-list">
						{#each session.members as m (m.identity)}
							{@const role = memberRole(m.identity, m.canPublish)}
							<div class="member-row" class:member-speaking={m.speaking}>
								<div class="member-avatar" class:avatar-host={role === 'host'} class:avatar-speaker={role === 'speaker'}>
									{m.name?.[0]?.toUpperCase() ?? '?'}
								</div>
								<div class="member-info">
									<span class="member-name">
										{m.name}
										{#if m.isLocal}<span class="self-tag">(Saya)</span>{/if}
									</span>
									<span class="member-role" class:role-host={role === 'host'} class:role-speaker={role === 'speaker'}>
										{#if role === 'host'}
											<Crown size={10} /> Hos
										{:else if role === 'speaker'}
											<Mic size={10} /> Penceramah
										{:else}
											Pendengar
										{/if}
									</span>
								</div>
								{#if m.speaking}
									<span class="speaking-badge">🎙</span>
								{/if}
								{#if session.role === 'host' && !m.isLocal && session.engagement[m.identity]}
									{@const eng = session.engagement[m.identity]}
									<span class="engagement-pct" class:eng-on={eng.onTask} title="Mengikut: {eng.following ? 'Ya' : 'Tidak'}">
										{eng.sessionMs > 0 ? Math.round((eng.attentiveMs / eng.sessionMs) * 100) : 0}%
									</span>
								{/if}
							</div>
						{/each}
					</div>
				</section>

				<!-- Activity log -->
				{#if session.logs.length > 0}
					<section class="section">
						<h2 class="sec-label">
							<Clock size={13} />
							Log Aktiviti
						</h2>
						<div class="log-list">
							{#each [...session.logs].reverse() as entry (entry.at)}
								<div class="log-row">
									<span class="log-icon">
										{#if entry.kind === 'started'}🏠
										{:else if entry.kind === 'joined'}→
										{:else}←{/if}
									</span>
									<span class="log-msg">
										{#if entry.kind === 'started'}
											Sesi dimulakan oleh <strong>{entry.name}</strong>
										{:else if entry.kind === 'joined'}
											<strong>{entry.name}</strong> menyertai sesi
										{:else}
											<strong>{entry.name}</strong> meninggalkan sesi
										{/if}
									</span>
									<span class="log-time">{fmtTime(entry.at)}</span>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Controls -->
				<div class="controls" class:controls-4={session.canSpeak}>
					<button class="ctrl-btn" class:ctrl-active={session.micOn} onclick={toggleMic}>
						{#if session.micOn}
							<Mic size={22} />
							<span>Mik Hidup</span>
						{:else}
							<MicOff size={22} />
							<span>Mik Mati</span>
						{/if}
					</button>

					{#if session.canSpeak}
						<button
							class="ctrl-btn"
							class:ctrl-active={session.sharing}
							onclick={() => session?.sharing ? session.stopSharing() : session?.resumeSharing()}
							title={session.sharing ? 'Henti kongsi skrin' : 'Kongsi skrin'}
						>
							<Monitor size={22} />
							<span>{session.sharing ? 'Henti Kongsi' : 'Kongsi Skrin'}</span>
						</button>
					{/if}

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

				<!-- Share content preview -->
				{#if session.share}
					{@const shareUrl = session.share.kind === 'page' ? `/read/${session.share.page}` : session.share.kind === 'mathurat' ? '/mathurat/baca' : session.share.path}
					<div class="content-preview">
						<div class="preview-hdr">
							{#if session.share.kind === 'page'}
								<a class="preview-lbl" href="/read/{session.share.page}"><BookOpen size={13} /> Halaman {session.share.page}</a>
							{:else if session.share.kind === 'mathurat'}
								<a class="preview-lbl" href="/mathurat"><ScrollText size={13} /> Al-Ma'thurat</a>
							{:else if session.share.kind === 'route'}
								<a class="preview-lbl" href={session.share.path}><MapPin size={13} /> {session.share.label}</a>
							{/if}
							{#if !session.following && session.role !== 'host'}
								<button class="follow-btn" onclick={() => session?.followSpeaker()}>Ikut</button>
							{/if}
						</div>
						<iframe
							src={shareUrl}
							title="Kandungan dikongsi"
							loading="lazy"
							class="content-frame"
							sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
						></iframe>
					</div>
				{/if}

				<!-- Audio unlock -->
				{#if session.needsAudioUnlock}
					<button class="unlock-btn" onclick={() => session.unlockAudio()}>
						Ketik untuk aktifkan audio
					</button>
				{/if}

			</div>
		{:else}
			<div class="state-view">
				<p class="state-msg">Sesi tidak aktif.</p>
				<a href="/halaqah" class="state-back">Kembali ke Halaqah</a>
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

	/* Header */
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
		transition: background 0.15s;
	}
	.hdr-btn:hover { background: var(--pg-btn-hover); }
	.hdr-minimize { color: rgba(74,222,128,0.8); border-color: rgba(34,197,94,0.25); }
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
	@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
	.w-9 { width: 36px; }

	.hlq-main { flex: 1; overflow-y: auto; }

	/* Loading / error states */
	.state-view {
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		gap: 16px; min-height: 50dvh; padding: 32px 20px;
	}
	.spinner {
		width: 36px; height: 36px;
		border: 3px solid rgba(34,197,94,0.15);
		border-top-color: rgba(74,222,128,0.8);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.state-msg { font-size: 14px; color: var(--pg-subtle); }
	.state-err { font-size: 14px; color: #f87171; text-align: center; }
	.state-back {
		padding: 8px 18px;
		border-radius: 10px;
		background: rgba(34,197,94,0.12);
		border: 1px solid rgba(34,197,94,0.2);
		color: rgba(74,222,128,0.9);
		font-size: 13px; text-decoration: none;
	}

	/* Session view */
	.session-view { padding: 16px 16px 40px; display: flex; flex-direction: column; gap: 14px; }

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

	/* Section */
	.sec-label {
		display: flex; align-items: center; gap: 5px;
		font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
		text-transform: uppercase; color: var(--pg-subtle);
		margin-bottom: 8px;
	}

	/* Members list */
	.members-list { display: flex; flex-direction: column; gap: 4px; }
	.member-row {
		display: flex; align-items: center; gap: 10px;
		padding: 9px 12px;
		border-radius: 12px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		transition: background 0.15s;
	}
	.member-row.member-speaking {
		background: rgba(34,197,94,0.09);
		border-color: rgba(34,197,94,0.2);
	}
	.member-avatar {
		width: 32px; height: 32px; flex-shrink: 0;
		border-radius: 50%;
		background: rgba(34,197,94,0.12);
		color: rgba(74,222,128,0.9);
		font-size: 13px; font-weight: 700;
		display: grid; place-items: center;
		border: 1px solid rgba(34,197,94,0.2);
	}
	.avatar-host { background: rgba(251,191,36,0.12); color: rgba(253,224,71,0.9); border-color: rgba(251,191,36,0.25); }
	.avatar-speaker { background: rgba(228,112,163,0.12); color: rgba(228,112,163,0.9); border-color: rgba(228,112,163,0.25); }
	.member-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
	.member-name { font-size: 13px; font-weight: 500; color: var(--pg-text-85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.self-tag { font-size: 11px; color: var(--pg-subtle); font-weight: 400; margin-left: 4px; }
	.member-role {
		display: flex; align-items: center; gap: 3px;
		font-size: 10px; font-weight: 600; letter-spacing: 0.05em;
		text-transform: uppercase; color: var(--pg-subtle);
	}
	.role-host { color: rgba(253,224,71,0.8); }
	.role-speaker { color: rgba(228,112,163,0.8); }
	.speaking-badge { font-size: 14px; }
	.engagement-pct {
		font-size: 11px; font-weight: 700;
		color: var(--pg-subtle);
		padding: 2px 6px;
		border-radius: 6px;
		background: var(--pg-surface);
	}
	.engagement-pct.eng-on { color: rgba(74,222,128,0.9); }

	/* Activity log */
	.log-list {
		display: flex; flex-direction: column; gap: 2px;
		max-height: 180px; overflow-y: auto;
		border-radius: 12px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		padding: 4px 0;
	}
	.log-row {
		display: flex; align-items: baseline; gap: 8px;
		padding: 6px 12px;
		font-size: 12px;
	}
	.log-icon { width: 16px; text-align: center; flex-shrink: 0; font-size: 11px; opacity: 0.7; }
	.log-msg { flex: 1; color: var(--pg-text-75); line-height: 1.4; }
	.log-msg strong { color: var(--pg-fg); }
	.log-time { font-size: 10px; color: var(--pg-faint); white-space: nowrap; flex-shrink: 0; }

	/* Controls */
	.controls {
		display: grid; grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}
	.controls-4 { grid-template-columns: repeat(3, 1fr); }
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
	.ctrl-btn:hover { background: var(--pg-btn-hover); color: var(--pg-fg); }
	.ctrl-active { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.3); color: rgba(74,222,128,0.9); }
	.ctrl-danger { color: rgba(248,113,113,0.7); }
	.ctrl-danger:hover { background: rgba(248,113,113,0.12); border-color: rgba(248,113,113,0.2); }

	/* Content preview (shared content iframe) */
	.content-preview {
		border-radius: 14px;
		overflow: hidden;
		border: 1px solid var(--pg-surface-b);
		background: var(--pg-surface);
	}
	.preview-hdr {
		display: flex; align-items: center; gap: 10px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--pg-btn-border);
		font-size: 13px; color: var(--pg-muted);
	}
	.preview-lbl {
		display: flex; align-items: center; gap: 6px;
		text-decoration: none; color: inherit; flex: 1;
	}
	a.preview-lbl:hover { color: var(--pg-fg); }
	.follow-btn {
		padding: 4px 10px;
		border-radius: 8px;
		background: rgba(34,197,94,0.15);
		border: 1px solid rgba(34,197,94,0.25);
		color: rgba(74,222,128,0.9);
		font-size: 11px; cursor: pointer;
		flex-shrink: 0;
	}
	.content-frame {
		width: 100%;
		height: 55vh;
		border: none;
		display: block;
	}

	/* Audio unlock */
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
</style>
