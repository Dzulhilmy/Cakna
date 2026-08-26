<script lang="ts">
	import SideNav from '$lib/components/SideNav.svelte';
	import { LISTS, TOTALS, VERSI_LABEL, JENIS_LABEL, BASMALAH, pickText, type Versi } from '$lib/data/mathurat';
	import type { Waktu } from '$lib/data/mathurat';
	import { mathuratState, todayKey } from '$lib/state/stores.svelte';
	import type { MathuratState, MathuratTetapan } from '$lib/state/stores.svelte';
	import { ChevronLeft, Settings, X, RotateCcw } from 'lucide-svelte';
	import { halaqah } from '$lib/halaqah/store.svelte';

	const DEFAULT_TETAPAN: MathuratTetapan = {
		arSaiz: 26,
		bmSaiz: 14,
		paparBm: true,
		paparRumi: false,
		jajarAr: 'kanan',
		jajarBm: 'kiri',
		bahasa: 'bm',
		getar: true,
		autoMaju: false,
		skrinTerang: false,
		autoWaktu: true
	};

	function initState(): MathuratState {
		const hour = new Date().getHours();
		const mode: Waktu = hour >= 4 && hour < 13 ? 'pagi' : 'petang';
		return {
			v2: true,
			version: 'sughra',
			mode,
			idx: { sughra: 0, kubra: 0 },
			counts: {
				sughra: LISTS.sughra.map(() => 0),
				kubra: LISTS.kubra.map(() => 0)
			},
			tetapan: { ...DEFAULT_TETAPAN },
			rekod: {}
		};
	}

	if (!mathuratState.value || !mathuratState.value.v2) {
		mathuratState.value = initState();
	} else {
		const s = mathuratState.value;
		if (!s.counts) s.counts = { sughra: LISTS.sughra.map(() => 0), kubra: LISTS.kubra.map(() => 0) };
		if (!s.tetapan) s.tetapan = { ...DEFAULT_TETAPAN };
	}

	const ms = $derived(mathuratState.value as MathuratState);

	let showSettings = $state(false);
	let advancePending = $state(false);

	const list     = $derived(LISTS[ms.version]);
	const idx      = $derived(ms.idx[ms.version]);
	const item     = $derived(list[idx] ?? null);
	const counts   = $derived(ms.counts[ms.version]);
	const count    = $derived(counts[idx] ?? 0);
	const progress = $derived(
		list.slice(0, idx).reduce((s, it) => s + it.reps, 0) + Math.min(count, item?.reps ?? 0)
	);
	const total       = $derived(TOTALS[ms.version]);
	const progressPct = $derived(total > 0 ? Math.round((progress / total) * 100) : 0);
	const repsLeft    = $derived(item ? Math.max(0, item.reps - count) : 0);
	const isDone      = $derived(repsLeft === 0 && !!item);

	// SVG ring
	const R            = 52;
	const CIRC         = 2 * Math.PI * R;
	const ringProgress = $derived(item ? Math.min(count / item.reps, 1) : 0);
	const dashOffset   = $derived(CIRC * (1 - ringProgress));

	function arText() { return item ? pickText(item, ms.version, ms.mode, 'ar') : ''; }
	function bmText() {
		if (!item) return '';
		return pickText(item, ms.version, ms.mode, ms.tetapan.bahasa === 'bm' ? 'bm' : 'bi');
	}
	function rumiText() { return item ? pickText(item, ms.version, ms.mode, 'rumi') : ''; }

	function tap() {
		if (!item || advancePending) return;
		const newCount = count + 1;
		ms.counts[ms.version][idx] = newCount;
		mathuratState.value = { ...ms };
		if (ms.tetapan.getar && navigator.vibrate) navigator.vibrate(30);
		if (newCount >= item.reps) {
			advancePending = true;
			setTimeout(() => {
				advancePending = false;
				advance();
			}, 700);
		}
	}

	function advance() {
		const next = idx + 1;
		if (next <= list.length) ms.idx[ms.version] = next;
		if (next === list.length) {
			const key = todayKey();
			const rekod = { ...(ms.rekod ?? {}) };
			const day = rekod[key] ?? {};
			const waktuRec = day[ms.mode] ?? {};
			rekod[key] = { ...day, [ms.mode]: { ...waktuRec, [ms.version]: true } };
			ms.rekod = rekod;
		}
		mathuratState.value = { ...ms };
	}

	function prev() {
		if (idx > 0) {
			ms.idx[ms.version] = idx - 1;
			mathuratState.value = { ...ms };
		}
	}

	function resetAll() {
		mathuratState.value = initState();
	}

	function setVersion(v: Versi) {
		ms.version = v;
		mathuratState.value = { ...ms };
	}

	function setMode(m: Waktu) {
		ms.mode = m;
		mathuratState.value = { ...ms };
	}

	// Broadcast content position to halaqah when host is sharing
	$effect(() => {
		const sess = halaqah.session;
		if (!sess?.connected || !sess.canSpeak || !sess.sharing) return;
		void sess.setShare({
			kind: 'mathurat',
			version: ms.version,
			mode: ms.mode,
			idx: ms.idx[ms.version]
		});
	});

	// Apply received mathurat share state when following as listener
	$effect(() => {
		const sess = halaqah.session;
		if (!sess?.connected || sess.canSpeak || !sess.following) return;
		const sh = sess.share;
		if (sh?.kind !== 'mathurat') return;
		ms.version = sh.version;
		ms.mode = sh.mode;
		ms.idx[sh.version] = sh.idx;
		mathuratState.value = { ...ms };
	});
</script>

<svelte:head><title>Al-Ma'thurat — Cakna</title></svelte:head>

<div class="root">
	<!-- Header -->
	<header class="hdr">
		<a href="/mathurat" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Al-Ma'thurat</span>
			<span class="hdr-sub">{VERSI_LABEL[ms.version].penuh} · {ms.mode === 'pagi' ? 'Pagi' : 'Petang'}</span>
		</div>
		<button class="hdr-btn" onclick={() => (showSettings = !showSettings)} aria-label="Tetapan">
			<Settings size={18} />
		</button>
	</header>

	<!-- Progress bar -->
	<div class="prog-wrap">
		<div class="prog-bar" style="width: {progressPct}%;"></div>
		<span class="prog-label">{progress} / {total} ({progressPct}%)</span>
	</div>

	<!-- Version + mode tabs -->
	<div class="tabs-row">
		<div class="tab-group">
			{#each (['sughra', 'kubra'] as Versi[]) as v (v)}
				<button class="tab" class:tab-on={ms.version === v} onclick={() => setVersion(v)}>
					{VERSI_LABEL[v].nama}
				</button>
			{/each}
		</div>
		<div class="tab-group">
			{#each (['pagi', 'petang'] as Waktu[]) as m (m)}
				<button class="tab" class:tab-on={ms.mode === m} onclick={() => setMode(m)}>
					{m === 'pagi' ? 'Pagi' : 'Petang'}
				</button>
			{/each}
		</div>
	</div>

	<!-- Content -->
	{#if item}
		<main class="content">
			<div class="item-meta">
				<span class="item-num">{idx + 1} / {list.length}</span>
				<span class="item-jenis">{JENIS_LABEL[item.jenis]}</span>
			</div>
			<h2 class="item-tajuk">{item.tajuk}</h2>
			{#if item.info}
				<p class="item-info">{item.info}</p>
			{/if}

			{#if item.basmalah}
				<p class="ar-basmalah" dir="rtl">{BASMALAH}</p>
			{/if}
			<p
				class="ar-text"
				dir="rtl"
				style="font-size: {ms.tetapan.arSaiz}px; text-align: {ms.tetapan.jajarAr === 'kanan' ? 'right' : ms.tetapan.jajarAr === 'kiri' ? 'left' : 'center'};"
			>{arText()}</p>

			{#if ms.tetapan.paparRumi}
				<p class="rumi-text">{rumiText()}</p>
			{/if}
			{#if ms.tetapan.paparBm}
				<p
					class="bm-text"
					style="font-size: {ms.tetapan.bmSaiz}px; text-align: {ms.tetapan.jajarBm === 'kiri' ? 'left' : ms.tetapan.jajarBm === 'kanan' ? 'right' : 'center'};"
				>{bmText()}</p>
			{/if}
		</main>
	{:else}
		<!-- Completion screen -->
		<div class="complete">
			<div class="complete-icon">✓</div>
			<h2>Wirid Selesai</h2>
			<p>Tahniah! Anda telah melengkapkan {VERSI_LABEL[ms.version].penuh}.</p>
			<a href="/mathurat" class="back-link">Kembali ke Utama</a>
			<button class="reset-btn" onclick={resetAll}>
				<RotateCcw size={16} />
				<span>Mula Semula</span>
			</button>
		</div>
	{/if}

	<!-- Floating counter button -->
	{#if item}
		<div class="fab-wrap">
			<button
				class="fab"
				class:fab-done={isDone || advancePending}
				onclick={tap}
				disabled={advancePending}
				aria-label="Tap untuk zikir"
			>
				<!-- Ring progress -->
				<svg class="fab-ring" viewBox="0 0 120 120" aria-hidden="true">
					<circle class="ring-bg" cx="60" cy="60" r={R} />
					<circle
						class="ring-fill"
						cx="60" cy="60" r={R}
						stroke-dasharray={CIRC}
						stroke-dashoffset={dashOffset}
						transform="rotate(-90 60 60)"
					/>
				</svg>
				<!-- Center label -->
				<div class="fab-inner">
					{#if advancePending || (isDone && repsLeft === 0)}
						<span class="fab-check">✓</span>
					{:else}
						<span class="fab-num">{repsLeft}</span>
						<span class="fab-sub">lagi</span>
					{/if}
				</div>
			</button>
		</div>
	{/if}

	<!-- Nav footer -->
	{#if item}
		<footer class="nav-foot">
			<button class="foot-btn" onclick={prev} disabled={idx <= 0}>
				<ChevronLeft size={16} />
				<span>Sebelum</span>
			</button>
			<button class="foot-reset" onclick={resetAll} title="Reset semua">
				<RotateCcw size={15} />
			</button>
			<button class="foot-btn foot-skip" onclick={advance}>
				<span>Langkau</span>
				<ChevronLeft size={16} style="transform: rotate(180deg)" />
			</button>
		</footer>
	{/if}

	<!-- Settings sheet -->
	{#if showSettings}
		<div class="backdrop" onclick={() => (showSettings = false)} role="dialog" aria-modal="true">
			<div class="sheet" onclick={(e) => e.stopPropagation()}>
				<div class="sheet-handle"></div>
				<div class="sheet-hdr">
					<span>Tetapan Al-Ma'thurat</span>
					<button onclick={() => (showSettings = false)}><X size={16} /></button>
				</div>

				<div class="srow">
					<label class="slabel">Saiz Arab</label>
					<input type="range" min="18" max="40" step="2" bind:value={ms.tetapan.arSaiz} class="range" />
					<span class="sval">{ms.tetapan.arSaiz}px</span>
				</div>
				<div class="srow">
					<label class="slabel">Bahasa</label>
					<div class="tab-group">
						<button class="tab" class:tab-on={ms.tetapan.bahasa === 'bm'} onclick={() => (ms.tetapan.bahasa = 'bm')}>Melayu</button>
						<button class="tab" class:tab-on={ms.tetapan.bahasa === 'bi'} onclick={() => (ms.tetapan.bahasa = 'bi')}>English</button>
					</div>
				</div>
				<div class="srow srow-check">
					<label class="slabel">Terjemahan</label>
					<input type="checkbox" bind:checked={ms.tetapan.paparBm} />
				</div>
				<div class="srow srow-check">
					<label class="slabel">Transliterasi</label>
					<input type="checkbox" bind:checked={ms.tetapan.paparRumi} />
				</div>
				<div class="srow srow-check">
					<label class="slabel">Getaran</label>
					<input type="checkbox" bind:checked={ms.tetapan.getar} />
				</div>
				<button class="reset-btn" style="margin-top:16px;width:100%;" onclick={() => { resetAll(); showSettings = false; }}>
					<RotateCcw size={14} /> Reset Semua
				</button>
			</div>
		</div>
	{/if}
</div>

<SideNav active="mathurat" />

<style>
	:global(body) { margin: 0; }

	.root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* ── Header ─────────────────────────────── */
	.hdr {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--pg-hdr);
		border-bottom: 1px solid rgba(34, 197, 94, 0.1);
		backdrop-filter: blur(8px);
	}
	.hdr-btn {
		display: grid;
		place-items: center;
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
	.hdr-center { flex: 1; display: flex; flex-direction: column; align-items: center; }
	.hdr-title { font-size: 13px; font-weight: 600; color: var(--pg-text-75); }
	.hdr-sub { font-size: 11px; color: rgba(34,197,94,0.6); }

	/* ── Progress ────────────────────────────── */
	.prog-wrap {
		position: relative;
		height: 3px;
		background: var(--pg-surface-b);
	}
	.prog-bar {
		height: 100%;
		background: linear-gradient(90deg, #8e3557, #b34a6e);
		transition: width 0.4s ease;
	}
	.prog-label {
		position: absolute;
		right: 12px; top: 6px;
		font-size: 10px;
		color: var(--pg-subtle);
	}

	/* ── Tabs ────────────────────────────────── */
	.tabs-row {
		display: flex;
		gap: 8px;
		padding: 10px 16px;
		border-bottom: 1px solid var(--pg-surface-b);
	}
	.tab-group {
		display: flex;
		gap: 4px;
		background: var(--pg-btn);
		border-radius: 10px;
		padding: 3px;
	}
	.tab {
		padding: 5px 12px;
		border-radius: 7px;
		font-size: 12px;
		color: var(--pg-muted);
		cursor: pointer;
		border: none;
		background: transparent;
		transition: all 0.15s;
	}
	.tab-on {
		background: rgba(34,197,94,0.2);
		color: rgba(74,222,128,0.95);
	}

	/* ── Content ─────────────────────────────── */
	.content {
		flex: 1;
		padding: 20px 20px 200px;
		overflow-y: auto;
	}
	.item-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
	.item-num { font-size: 11px; color: var(--pg-subtle); }
	.item-jenis {
		font-size: 10px; font-weight: 600;
		letter-spacing: 0.08em;
		color: rgba(34,197,94,0.7);
		text-transform: uppercase;
	}
	.item-tajuk { font-size: 16px; font-weight: 700; color: var(--pg-text-85); margin-bottom: 4px; }
	.item-info { font-size: 12px; color: var(--pg-subtle); margin-bottom: 12px; }
	.ar-basmalah {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 22px; line-height: 2.2; text-align: center;
		color: var(--gold); margin-bottom: 4px;
	}
	.ar-text {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		line-height: 2.2; color: var(--pg-fg); margin-bottom: 12px;
	}
	.rumi-text { font-size: 13px; font-style: italic; color: var(--pg-muted); margin-bottom: 8px; }
	.bm-text { line-height: 1.7; color: var(--pg-muted); margin-bottom: 20px; }

	/* ── Floating counter button ─────────────── */
	.fab-wrap {
		position: fixed;
		bottom: 76px;
		left: 76px; right: 0;
		display: flex;
		justify-content: center;
		z-index: 30;
		pointer-events: none;
	}
	.fab {
		position: relative;
		width: 120px; height: 120px;
		border-radius: 50%;
		border: none;
		background: transparent;
		cursor: pointer;
		pointer-events: auto;
		transition: transform 0.12s;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}
	.fab:active:not(:disabled) { transform: scale(0.93); }
	.fab:disabled { cursor: default; }

	.fab-ring {
		position: absolute;
		inset: 0;
		width: 100%; height: 100%;
	}
	.ring-bg {
		fill: none;
		stroke: var(--pg-surface-b);
		stroke-width: 6;
	}
	.ring-fill {
		fill: none;
		stroke: rgba(34,197,94,0.75);
		stroke-width: 6;
		stroke-linecap: round;
		transition: stroke-dashoffset 0.25s ease, stroke 0.25s ease;
	}
	.fab-done .ring-fill {
		stroke: rgba(74,222,128,0.95);
		filter: drop-shadow(0 0 6px rgba(34,197,94,0.6));
	}

	.fab-inner {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		background: rgba(10, 21, 16, 0.88);
		border-radius: 50%;
		margin: 10px;
	}
	.fab-num {
		font-size: 38px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
		line-height: 1;
	}
	.fab-sub {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.5);
		letter-spacing: 0.05em;
	}
	.fab-check {
		font-size: 36px;
		color: rgba(74,222,128,0.95);
		line-height: 1;
	}
	.fab-done .fab-inner {
		background: rgba(10, 21, 16, 0.7);
	}

	/* ── Nav footer ──────────────────────────── */
	.nav-foot {
		position: fixed;
		bottom: 0;
		left: 76px; right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 16px 20px;
		background: var(--pg-hdr);
		border-top: 1px solid var(--pg-surface-b);
		backdrop-filter: blur(8px);
		z-index: 25;
	}
	.foot-btn {
		display: flex; align-items: center; gap: 4px;
		padding: 8px 14px;
		border-radius: 10px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		color: var(--pg-muted);
		font-size: 12px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.foot-btn:hover:not(:disabled) { background: var(--pg-btn-hover); color: var(--pg-text-75); }
	.foot-btn:disabled { opacity: 0.25; cursor: not-allowed; }
	.foot-skip {
		color: rgba(74,222,128,0.7);
		border-color: rgba(34,197,94,0.15);
		background: rgba(34,197,94,0.06);
	}
	.foot-skip:hover:not(:disabled) { background: rgba(34,197,94,0.12); color: rgba(74,222,128,0.9); }
	.foot-reset {
		display: grid; place-items: center;
		width: 38px; height: 38px;
		border-radius: 10px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-subtle);
		cursor: pointer;
		transition: background 0.15s;
	}
	.foot-reset:hover { background: var(--pg-btn-hover); color: var(--pg-muted); }

	/* ── Completion ──────────────────────────── */
	.complete {
		flex: 1;
		display: flex; flex-direction: column;
		align-items: center; justify-content: center;
		gap: 12px; padding: 40px 20px;
		text-align: center;
	}
	.complete-icon {
		font-size: 40px; width: 80px; height: 80px;
		border-radius: 50%;
		background: rgba(179,74,110,0.15);
		display: grid; place-items: center;
		color: #b34a6e;
	}
	.complete h2 { font-size: 20px; font-weight: 700; color: var(--pg-text-85); margin: 0; }
	.complete p { font-size: 14px; color: var(--pg-muted); margin: 0; }
	.back-link {
		display: inline-flex; align-items: center; gap: 6px;
		padding: 10px 20px;
		border-radius: 12px;
		background: rgba(34,197,94,0.12);
		border: 1px solid rgba(34,197,94,0.2);
		color: rgba(74,222,128,0.9);
		font-size: 13px; text-decoration: none;
		transition: background 0.15s;
	}
	.back-link:hover { background: rgba(34,197,94,0.2); }

	.reset-btn {
		display: flex; align-items: center; gap: 6px;
		padding: 10px 20px;
		border-radius: 12px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-muted);
		font-size: 13px; cursor: pointer;
		transition: background 0.15s;
	}
	.reset-btn:hover { background: var(--pg-btn-hover); }

	/* ── Settings sheet ──────────────────────── */
	.backdrop {
		position: fixed; inset: 0; z-index: 50;
		background: rgba(0,0,0,0.6);
		display: flex; align-items: flex-end;
	}
	.sheet {
		width: 100%; max-height: 80dvh; overflow-y: auto;
		background: #111d16;
		border-top: 1px solid rgba(34,197,94,0.15);
		border-radius: 20px 20px 0 0;
		padding: 12px 20px 40px;
	}
	.sheet-handle {
		width: 36px; height: 4px;
		background: var(--pg-btn-hover);
		border-radius: 2px;
		margin: 0 auto 16px;
	}
	.sheet-hdr {
		display: flex; align-items: center; justify-content: space-between;
		margin-bottom: 16px;
		color: var(--pg-muted); font-size: 14px; font-weight: 600;
	}
	.sheet-hdr button { background: none; border: none; color: inherit; cursor: pointer; }
	.srow {
		display: flex; flex-direction: column; gap: 8px;
		padding: 10px 0;
		border-bottom: 1px solid var(--pg-surface-b);
	}
	.srow-check { flex-direction: row; align-items: center; justify-content: space-between; }
	.slabel { font-size: 12px; color: var(--pg-muted); }
	.sval { font-size: 11px; color: var(--pg-subtle); text-align: right; }
	.range { accent-color: #b34a6e; width: 100%; }
</style>
