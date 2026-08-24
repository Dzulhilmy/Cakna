<script lang="ts">
	/**
	 * Floating halaqah window — shown on every route except the room itself.
	 *
	 * Compact mode  : pill bar, draggable, shows audio viz + title.
	 * Expanded mode : card below the pill with members, activity log, quick controls.
	 *
	 * Drag starts on the pill (stopPropagation on icon buttons keeps them clickable).
	 * A tap that didn't move navigates back into the room.
	 */
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { halaqah } from '$lib/halaqah/store.svelte';
	import AudioVisualizer from '$lib/components/modules/AudioVisualizer.svelte';
	import { Maximize2, Minimize2, X, Mic, MicOff, Copy, Users, Crown, Radio, Monitor, BookOpen, ScrollText, MapPin } from 'lucide-svelte';

	const s = $derived(halaqah.session);
	const inRoom = $derived(page.url.pathname.startsWith('/halaqah/'));
	const visible = $derived(!!s?.connected && !inRoom);

	// ── Layout constants ──────────────────────────────────────────────────────
	const FLOAT_W = 300;
	const COMPACT_H = 60;
	const NAV_H = 64;

	// ── Float position ────────────────────────────────────────────────────────
	let posLeft = $state(0);
	let posTop = $state(0);
	let mounted = $state(false);

	onMount(() => {
		posLeft = window.innerWidth - FLOAT_W - 16;
		posTop = window.innerHeight - NAV_H - COMPACT_H - 20;
		mounted = true;
	});

	// Float doesn't push page content — set the legacy variable to 0.
	$effect(() => {
		const px = '0px';
		document.documentElement.style.setProperty('--halaqah-h', px);
		return () => document.documentElement.style.setProperty('--halaqah-h', '0px');
	});

	// ── Expand / minimize ─────────────────────────────────────────────────────
	let expanded = $state(false);

	function toggleExpand() {
		expanded = !expanded;
		if (expanded) {
			// Keep the card inside the viewport
			const cardH = 420;
			const maxTop = window.innerHeight - NAV_H - cardH - 16;
			if (posTop > maxTop) posTop = Math.max(16, maxTop);
		}
	}

	// ── Drag ──────────────────────────────────────────────────────────────────
	let dragging = $state(false);
	let didDrag = false;
	let dragOffsetX = 0;
	let dragOffsetY = 0;

	function onDragStart(e: PointerEvent) {
		dragging = true;
		didDrag = false;
		dragOffsetX = e.clientX - posLeft;
		dragOffsetY = e.clientY - posTop;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onDragMove(e: PointerEvent) {
		if (!dragging) return;
		const nl = e.clientX - dragOffsetX;
		const nt = e.clientY - dragOffsetY;
		if (!didDrag && (Math.abs(nl - posLeft) > 4 || Math.abs(nt - posTop) > 4)) {
			didDrag = true;
		}
		posLeft = Math.max(0, Math.min(window.innerWidth - FLOAT_W, nl));
		posTop = Math.max(0, Math.min(window.innerHeight - COMPACT_H, nt));
	}

	function onDragEnd() {
		dragging = false;
	}

	function handlePillClick() {
		if (!didDrag && s) goto(`/halaqah/${s.slug}`);
	}

	// ── Shared-view broadcast (same logic as before) ──────────────────────────
	const ROUTE_LABELS: Record<string, string> = {
		'/mathurat': "Al-Ma'thurat",
		'/surah': 'Senarai Surah',
		'/asma': 'Asmaul Husna',
		'/doa': 'Doa Al-Quran',
		'/yasin': 'Surah Yasin',
		'/zikir': 'Zikir & Tasbih',
		'/ibadah': 'Panduan Ibadah',
		'/mengaji': 'Asas Mengaji',
		'/solat': 'Waktu Solat',
		'/qibla': 'Arah Kiblat',
		'/khatam': 'Sasaran Khatam',
		'/puasa': 'Rekod Puasa',
		'/zakat': 'Kalkulator Zakat',
		'/search': 'Cari Ayat',
		'/menu': 'Lagi',
		'/settings': 'Tetapan',
		'/read': 'Mushaf',
		'/': 'Utama'
	};

	$effect(() => {
		const sess = halaqah.session;
		const path = page.url.pathname;
		if (!sess?.connected || !sess.canSpeak || !sess.sharing) return;
		if (path.startsWith('/halaqah')) return;
		if (path === '/mathurat') return;
		const m = path.match(/^\/read\/(\d+)$/);
		if (m) {
			void sess.setShare({ kind: 'page', page: Number(m[1]) });
		} else {
			void sess.setShare({
				kind: 'route',
				path,
				label: ROUTE_LABELS[path] ?? path.replace(/^\//, '')
			});
		}
	});

	// ── Derived display values ─────────────────────────────────────────────────
	const speaking = $derived(s?.members.find((m) => m.speaking)?.name ?? null);
	const label = $derived(speaking ?? s?.title ?? 'Halaqah');

	const shareLabel = $derived.by(() => {
		const sh = s?.share;
		if (!sh) return null;
		if (sh.kind === 'page') return `Halaman ${sh.page}`;
		if (sh.kind === 'mathurat') return `Al-Ma'thurat · item ${sh.idx + 1}`;
		return sh.label;
	});

	function fmtTime(ms: number) {
		return new Date(ms).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });
	}

	function memberRole(identity: string, canPublish: boolean): 'host' | 'speaker' | 'listener' {
		if (!s) return 'listener';
		if (identity === s.speakerId) return 'speaker';
		if (canPublish) return 'host';
		return 'listener';
	}

	let screenVideo = $state<HTMLVideoElement | null>(null);

	$effect(() => {
		const track = s?.screenShareTrack ?? null;
		const el = screenVideo;
		if (!el || !track) return;
		el.srcObject = new MediaStream([track]);
		return () => { el.srcObject = null; };
	});
</script>

{#if visible && s && mounted}
	<div
		class="hlq-float"
		class:is-expanded={expanded}
		class:is-dragging={dragging}
		style="left:{posLeft}px; top:{posTop}px; width:{FLOAT_W}px;"
	>
		<!-- ── Compact pill (drag handle + primary tap target) ──────────────── -->
		<div
			class="pill"
			onpointerdown={onDragStart}
			onpointermove={onDragMove}
			onpointerup={onDragEnd}
			role="none"
		>
			<!-- Tap to open room (only fires if not dragging) -->
			<button class="pill-main" onclick={handlePillClick} title="Buka sesi">
				<span class="viz">
					<AudioVisualizer track={s.floorTrack} live={!!speaking} height={26} bars={10} />
				</span>
				<span class="pill-txt">
					<span class="pill-title">{label}</span>
					<span class="pill-sub">
						{speaking ? 'sedang membaca' : 'halaqah aktif'}{shareLabel ? ' · ' : ''}{#if s.share?.kind === 'page'}<BookOpen size={9} class="sub-icon" />{/if}{shareLabel ?? ''}
					</span>
				</span>
			</button>

			<!-- Expand / minimize toggle -->
			<button
				class="ic"
				onpointerdown={(e) => e.stopPropagation()}
				onclick={toggleExpand}
				title={expanded ? 'Minimumkan' : 'Kembangkan'}
			>
				{#if expanded}<Minimize2 size={14} />{:else}<Maximize2 size={14} />{/if}
			</button>

			<!-- Leave -->
			<button
				class="ic ic-leave"
				onpointerdown={(e) => e.stopPropagation()}
				onclick={() => halaqah.leave()}
				title="Keluar halaqah"
			>
				<X size={14} />
			</button>
		</div>

		<!-- ── Expanded panel ───────────────────────────────────────────────── -->
		{#if expanded}
			<div class="panel" onpointerdown={(e) => e.stopPropagation()} role="none">
				<!-- Live badge + title -->
				<div class="panel-hdr">
					<span class="live-badge">
						<span class="live-dot"></span>
						Langsung
					</span>
					<span class="panel-title">{s.title || s.slug}</span>
				</div>

				<!-- Audio viz -->
				{#if s.floorTrack}
					<div class="panel-viz">
						<AudioVisualizer track={s.floorTrack} height={44} bars={22} />
					</div>
				{/if}

				<!-- Members -->
				<div class="psec">
					<div class="psec-lbl"><Users size={11} /> Ahli ({s.members.length})</div>
					<div class="member-list">
						{#each s.members.slice(0, 6) as m (m.identity)}
							{@const role = memberRole(m.identity, m.canPublish)}
							<div class="mrow" class:mrow-spk={m.speaking}>
								<div
									class="avatar"
									class:av-host={role === 'host'}
									class:av-speaker={role === 'speaker'}
								>
									{m.name?.[0]?.toUpperCase() ?? '?'}
								</div>
								<span class="mname">
									{m.name}{m.isLocal ? ' (Saya)' : ''}
								</span>
								{#if role === 'host'}
									<Crown size={10} class="role-crown" />
								{:else if m.speaking}
									<span class="spk-dot"></span>
								{/if}
								<!-- Mic status -->
								{#if m.canPublish}
									{#if m.micEnabled}
										<Mic size={10} class="mic-on" />
									{:else}
										<MicOff size={10} class="mic-off" />
									{/if}
								{:else}
									<MicOff size={10} class="mic-none" />
								{/if}
							</div>
						{/each}
						{#if s.members.length > 6}
							<div class="more">+{s.members.length - 6} lagi</div>
						{/if}
					</div>
				</div>

				<!-- Share preview: page/route info or WebRTC screen -->
				{#if s.share || s.screenShareTrack}
					<div class="share-preview">
						{#if s.share}
							<div class="sp-info">
								{#if s.share.kind === 'page'}
									<a class="sp-label" href="/read/{s.share.page}">
										<BookOpen size={12} />
										<span>Halaman {s.share.page}</span>
									</a>
								{:else if s.share.kind === 'mathurat'}
									<span class="sp-label">
										<ScrollText size={12} />
										<span>Al-Ma'thurat</span>
									</span>
								{:else}
									<span class="sp-label">
										<MapPin size={12} />
										<span>{s.share.label}</span>
									</span>
								{/if}
							</div>
						{/if}
						{#if s.screenShareTrack}
							<video bind:this={screenVideo} autoplay muted playsinline></video>
						{/if}
					</div>
				{/if}

				<!-- Quick controls -->
				<div class="panel-ctrl">
					<button
						class="ctrl-btn"
						class:ctrl-on={s.micOn}
						onclick={() => s.setMic(!s.micOn)}
						title={s.micOn ? 'Matikan mik' : 'Hidupkan mik'}
					>
						{#if s.micOn}<Mic size={15} />{:else}<MicOff size={15} />{/if}
						<span>{s.micOn ? 'Mik' : 'Mik Mati'}</span>
					</button>
					{#if s.canSpeak}
						<button
							class="ctrl-btn"
							class:ctrl-on={s.screenSharing}
							onclick={() => s.toggleScreenShare()}
							title={s.screenSharing ? 'Henti kongsi skrin' : 'Kongsi skrin'}
						>
							<Monitor size={15} />
							<span>{s.screenSharing ? 'Henti' : 'Kongsi Skrin'}</span>
						</button>
					{:else}
						<button
							class="ctrl-btn"
							onclick={() => navigator.clipboard.writeText(`${location.origin}/halaqah/${s.slug}`)}
							title="Salin pautan"
						>
							<Copy size={15} />
							<span>Kongsi</span>
						</button>
					{/if}
					<a class="ctrl-btn" href="/halaqah/{s.slug}" title="Buka sesi penuh">
						<Radio size={15} />
						<span>Buka</span>
					</a>
				</div>

				<!-- Audio unlock -->
				{#if s.needsAudioUnlock}
					<button class="unlock-btn" onclick={() => s.unlockAudio()}>
						Ketik untuk aktifkan audio
					</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* ── Container ─────────────────────────────────────────────────────────── */
	.hlq-float {
		position: fixed;
		z-index: 50;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
		border: 1px solid var(--pg-btn-border);
		background: var(--pg-bg);
		user-select: none;
		touch-action: none;
		transition: box-shadow 0.15s;
	}
	.hlq-float.is-dragging {
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.22);
		cursor: grabbing;
	}

	/* ── Compact pill ──────────────────────────────────────────────────────── */
	.pill {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 8px 8px 10px;
		height: 60px;
		box-sizing: border-box;
		cursor: grab;
		border-bottom: 1px solid transparent;
	}
	.is-expanded .pill {
		border-bottom-color: var(--pg-btn-border);
	}
	.is-dragging .pill { cursor: grabbing; }

	.pill-main {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 10px;
		background: none;
		border: 0;
		padding: 2px;
		cursor: pointer;
		text-align: start;
		color: inherit;
	}
	.viz { width: 48px; flex-shrink: 0; }

	.pill-txt { min-width: 0; display: flex; flex-direction: column; gap: 1px; }
	.pill-title {
		font-size: 13px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.pill-sub {
		font-size: 10.5px;
		color: var(--pg-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: flex;
		align-items: center;
		gap: 3px;
	}
	:global(.sub-icon) { flex-shrink: 0; opacity: 0.7; }

	.ic {
		flex-shrink: 0;
		width: 30px;
		height: 30px;
		border-radius: 8px;
		border: 1px solid var(--pg-btn-border);
		background: var(--pg-btn);
		color: var(--pg-muted);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: background 0.12s;
	}
	.ic:hover { background: var(--pg-btn-hover); }
	.ic-leave { color: #b34a4a; border-color: rgba(179, 74, 74, 0.25); }
	.ic-leave:hover { background: rgba(179, 74, 74, 0.1); }

	/* ── Expanded panel ────────────────────────────────────────────────────── */
	.panel {
		padding: 12px 12px 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-height: 380px;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.panel-hdr {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.live-badge {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 9.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #b34a6e;
	}
	.live-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #b34a6e;
		box-shadow: 0 0 5px #b34a6e;
		animation: pulse 1.5s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.45; }
	}
	.panel-title {
		flex: 1;
		font-size: 12.5px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--pg-fg);
	}

	.panel-viz {
		border-radius: 10px;
		background: rgba(34, 197, 94, 0.06);
		border: 1px solid rgba(34, 197, 94, 0.12);
		overflow: hidden;
		padding: 2px 0;
	}

	/* Section */
	.psec { display: flex; flex-direction: column; gap: 5px; }
	.psec-lbl {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--pg-subtle);
	}

	/* Members */
	.member-list { display: flex; flex-direction: column; gap: 3px; }
	.mrow {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 8px;
		border-radius: 9px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		font-size: 12px;
		transition: background 0.12s;
	}
	.mrow.mrow-spk {
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.2);
	}
	.avatar {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		border-radius: 50%;
		background: rgba(34, 197, 94, 0.12);
		color: rgba(74, 222, 128, 0.9);
		font-size: 11px;
		font-weight: 700;
		display: grid;
		place-items: center;
	}
	.av-host { background: rgba(251, 191, 36, 0.12); color: rgba(253, 224, 71, 0.9); }
	.av-speaker { background: rgba(228, 112, 163, 0.12); color: rgba(228, 112, 163, 0.9); }
	.mname {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 12px;
		color: var(--pg-fg);
	}
	:global(.role-crown) { color: rgba(251, 191, 36, 0.9); flex-shrink: 0; }
	.spk-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: rgba(34, 197, 94, 0.8);
		flex-shrink: 0;
	}
	.more {
		font-size: 11px;
		color: var(--pg-subtle);
		padding: 3px 8px;
		text-align: center;
	}

	/* Mic status icons */
	:global(.mic-on) { color: rgba(34, 197, 94, 0.8); flex-shrink: 0; }
	:global(.mic-off) { color: var(--pg-subtle); opacity: 0.5; flex-shrink: 0; }
	:global(.mic-none) { color: var(--pg-subtle); opacity: 0.25; flex-shrink: 0; }

	/* Share preview (page info + optional WebRTC screen) */
	.share-preview {
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid var(--pg-btn-border);
		background: var(--pg-surface, var(--pg-btn));
	}
	.sp-info {
		display: flex;
		align-items: center;
		padding: 8px 10px;
	}
	.sp-label {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		font-weight: 600;
		color: var(--pg-muted);
		text-decoration: none;
	}
	a.sp-label:hover { color: var(--pg-fg); }
	.share-preview video {
		width: 100%;
		display: block;
		max-height: 160px;
		object-fit: contain;
		background: #000;
	}

	/* Quick controls */
	.panel-ctrl {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
	}
	.ctrl-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 9px 6px;
		border-radius: 10px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		color: var(--pg-muted);
		font-size: 10px;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.12s;
	}
	.ctrl-btn:hover { background: var(--pg-btn-hover); }
	.ctrl-btn.ctrl-on {
		background: rgba(34, 197, 94, 0.1);
		border-color: rgba(34, 197, 94, 0.25);
		color: rgba(74, 222, 128, 0.9);
	}

	/* Audio unlock */
	.unlock-btn {
		width: 100%;
		padding: 10px;
		border-radius: 10px;
		background: rgba(250, 204, 21, 0.1);
		border: 1px solid rgba(250, 204, 21, 0.2);
		color: rgba(253, 224, 71, 0.9);
		font-size: 12px;
		cursor: pointer;
	}
</style>
