<script lang="ts">
	import { goto } from '$app/navigation';
	import { mathuratState } from '$lib/state/stores.svelte';
	import type { MathuratTetapan } from '$lib/state/stores.svelte';
	import { LISTS, VERSI_LABEL } from '$lib/data/mathurat';
	import type { Versi, Waktu } from '$lib/data/mathurat';
	import { Sun, Moon, ArrowRight, RotateCcw, BarChart2, ChevronLeft, BookMarked } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';

	const DEFAULT_TETAPAN: MathuratTetapan = {
		arSaiz: 26, bmSaiz: 14, paparBm: true, paparRumi: false,
		jajarAr: 'kanan', jajarBm: 'kiri', bahasa: 'bm',
		getar: true, autoMaju: false, skrinTerang: false, autoWaktu: true
	};

	const autoWaktu: Waktu = new Date().getHours() >= 4 && new Date().getHours() < 13 ? 'pagi' : 'petang';

	let version = $state<Versi>(mathuratState.value?.v2 ? mathuratState.value.version : 'sughra');
	let waktu = $state<Waktu>(mathuratState.value?.v2 ? mathuratState.value.mode : autoWaktu);

	function progFor(v: Versi) {
		const s = mathuratState.value;
		if (!s?.v2) return { idx: 0, total: LISTS[v].length, done: false };
		const idx = s.idx[v] ?? 0;
		const total = LISTS[v].length;
		return { idx, total, done: idx >= total };
	}

	const prog = $derived(progFor(version));
	const progPct = $derived(prog.total > 0 ? Math.round((prog.idx / prog.total) * 100) : 0);
	const ctaLabel = $derived(
		prog.done ? 'Mulakan Semula' : prog.idx > 0 ? 'Teruskan Wirid' : 'Mulakan Wirid'
	);

	// ── Stats ────────────────────────────────────
	const rekod = $derived(mathuratState.value?.rekod ?? {});

	const now = new Date();
	const viewYear = now.getFullYear();
	const viewMonth = now.getMonth();
	const todayD = now.getDate();

	function dateKey(y: number, m: number, d: number): string {
		return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
	}

	function getCompletions(day: number) {
		const entry = rekod[dateKey(viewYear, viewMonth, day)];
		if (!entry) return { sp: false, sk: false, kp: false, kk: false };
		return {
			sp: !!(entry.pagi?.sughra),
			sk: !!(entry.petang?.sughra),
			kp: !!(entry.pagi?.kubra),
			kk: !!(entry.petang?.kubra)
		};
	}

	function dayHasAny(day: number): boolean {
		const c = getCompletions(day);
		return c.sp || c.sk || c.kp || c.kk;
	}

	const monthStats = $derived(() => {
		const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
		let completed = 0;
		for (let d = 1; d <= daysInMonth; d++) {
			if (dayHasAny(d)) completed++;
		}
		let streak = 0;
		for (let d = todayD; d >= 1; d--) {
			if (dayHasAny(d)) streak++;
			else break;
		}
		return { completed, streak, daysInMonth };
	});

	const todayC = $derived(getCompletions(todayD));
	const todayDone = $derived(todayC.sp || todayC.sk || todayC.kp || todayC.kk);

	// ── Actions ───────────────────────────────────
	function start() {
		const s = mathuratState.value;
		if (!s?.v2) {
			mathuratState.value = {
				v2: true, version, mode: waktu,
				idx: { sughra: 0, kubra: 0 },
				counts: { sughra: LISTS.sughra.map(() => 0), kubra: LISTS.kubra.map(() => 0) },
				tetapan: { ...DEFAULT_TETAPAN },
				rekod: {}
			};
		} else if (prog.done) {
			mathuratState.value = {
				...s, version, mode: waktu,
				idx: { ...s.idx, [version]: 0 },
				counts: { ...s.counts, [version]: LISTS[version].map(() => 0) }
			};
		} else {
			mathuratState.value = { ...s, version, mode: waktu };
		}
		goto('/mathurat/baca');
	}
</script>

<svelte:head><title>Al-Ma'thurat — Cakna</title></svelte:head>

<div class="root">
	<!-- Header -->
	<header class="hdr">
		<a href="/hub" class="hdr-btn" aria-label="Kembali">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<BookMarked size={15} class="hdr-icon" />
			<span class="hdr-title">Al-Ma'thurat</span>
		</div>
		<a href="/mathurat/rekod" class="hdr-btn" aria-label="Prestasi">
			<BarChart2 size={18} />
		</a>
	</header>

	<div class="body">
		<!-- ── Picker ─────────────────────────── -->
		<section class="picker-section">

			<!-- Version -->
			<div class="field">
				<p class="field-label">Versi</p>
				<div class="card-row">
					{#each (['sughra', 'kubra'] as Versi[]) as v}
						{@const p = progFor(v)}
						<button
							class="ver-card"
							class:selected={version === v}
							onclick={() => (version = v)}
						>
							{#if p.done}
								<span class="badge badge-done">✓</span>
							{:else if p.idx > 0}
								<span class="badge badge-prog">{p.idx}/{p.total}</span>
							{/if}
							<span class="ver-name">{VERSI_LABEL[v].nama}</span>
							<span class="ver-sub">{VERSI_LABEL[v].n} item</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Waktu -->
			<div class="field">
				<p class="field-label">Waktu</p>
				<div class="card-row">
					<button class="waktu-card" class:selected={waktu === 'pagi'} onclick={() => (waktu = 'pagi')}>
						<Sun size={18} />
						<span class="waktu-name">Pagi</span>
					</button>
					<button class="waktu-card" class:selected={waktu === 'petang'} onclick={() => (waktu = 'petang')}>
						<Moon size={18} />
						<span class="waktu-name">Petang</span>
					</button>
				</div>
			</div>

			<!-- Progress (if in progress) -->
			{#if prog.idx > 0}
				<div class="prog-block">
					<div class="prog-meta">
						<span class="prog-text">
							{prog.done ? 'Selesai' : `Item ${prog.idx}`} / {prog.total}
						</span>
						<span class="prog-pct">{progPct}%</span>
					</div>
					<div class="prog-track">
						<div class="prog-fill" style="width: {Math.min(100, progPct)}%"></div>
					</div>
				</div>
			{/if}

			<!-- CTA -->
			<button class="cta-btn" onclick={start}>
				{#if prog.done}
					<RotateCcw size={16} />
				{:else}
					<ArrowRight size={16} />
				{/if}
				{ctaLabel}
			</button>
		</section>

		<!-- ── Divider ────────────────────────── -->
		<div class="divider"></div>

		<!-- ── Stats ─────────────────────────── -->
		<section class="stats-section">
			<p class="field-label">Prestasi Bulan Ini</p>

			<div class="stat-row">
				<div class="stat-card">
					<span class="stat-num">{monthStats().streak}</span>
					<span class="stat-label">Hari Berturut</span>
				</div>
				<div class="stat-card">
					<span class="stat-num">{monthStats().completed}</span>
					<span class="stat-label">Hari Selesai</span>
				</div>
				<div class="stat-card">
					<span class="stat-num">{monthStats().daysInMonth}</span>
					<span class="stat-label">Hari Dalam Bulan</span>
				</div>
			</div>

			<!-- Today's session status -->
			<div class="today-block">
				<p class="today-label">Hari Ini</p>
				<div class="session-pills">
					<span class="pill" class:pill-done={todayC.sp} title="Sughra Pagi">SP</span>
					<span class="pill" class:pill-done={todayC.sk} title="Sughra Petang">SK</span>
					<span class="pill" class:pill-done={todayC.kp} title="Kubra Pagi">KP</span>
					<span class="pill" class:pill-done={todayC.kk} title="Kubra Petang">KK</span>
				</div>
				{#if !todayDone}
					<p class="today-hint">Belum ada sesi selesai hari ini</p>
				{:else}
					<p class="today-hint today-hint-done">
						{[todayC.sp && 'Sughra Pagi', todayC.sk && 'Sughra Petang', todayC.kp && 'Kubra Pagi', todayC.kk && 'Kubra Petang'].filter(Boolean).join(', ')} selesai
					</p>
				{/if}
			</div>

			<a href="/mathurat/rekod" class="rekod-link">
				<BarChart2 size={14} />
				<span>Lihat Prestasi Lengkap</span>
			</a>
		</section>
	</div>
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

	/* ── Header ───────────────────────────────── */
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
		flex-shrink: 0;
	}
	.hdr-btn:hover { background: var(--pg-btn-hover); }
	.hdr-center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
	}
	:global(.hdr-icon) { color: rgba(74,222,128,0.7); }
	.hdr-title {
		font-size: 14px;
		font-weight: 700;
		color: var(--pg-text-85);
		letter-spacing: 0.01em;
	}

	/* ── Body ────────────────────────────────── */
	.body {
		flex: 1;
		overflow-y: auto;
		padding: 20px 20px 40px;
		max-width: 480px;
		width: 100%;
		margin: 0 auto;
	}

	/* ── Picker ──────────────────────────────── */
	.picker-section {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.field-label {
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.3);
		margin: 0;
	}

	.card-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.ver-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		padding: 14px 12px 12px;
		border-radius: 14px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-muted);
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
	}
	.ver-card:hover {
		background: var(--pg-btn-hover);
		color: var(--pg-text-75);
	}
	.ver-card.selected {
		background: rgba(34, 197, 94, 0.1);
		border-color: rgba(34, 197, 94, 0.3);
		color: rgba(74, 222, 128, 0.95);
	}

	.ver-name {
		font-size: 15px;
		font-weight: 700;
	}
	.ver-sub {
		font-size: 11px;
		color: var(--pg-subtle);
	}
	.ver-card.selected .ver-sub {
		color: rgba(74,222,128,0.5);
	}

	.badge {
		position: absolute;
		top: 8px;
		right: 10px;
		font-size: 10px;
		font-weight: 700;
		border-radius: 999px;
		padding: 1px 6px;
		line-height: 1.5;
	}
	.badge-done {
		background: rgba(34, 197, 94, 0.18);
		color: rgba(74, 222, 128, 0.9);
	}
	.badge-prog {
		background: rgba(251, 191, 36, 0.15);
		color: rgba(251, 191, 36, 0.9);
	}

	.waktu-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		padding: 14px 12px;
		border-radius: 14px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-muted);
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
	}
	.waktu-card:hover {
		background: var(--pg-btn-hover);
		color: var(--pg-text-75);
	}
	.waktu-card.selected {
		background: rgba(34, 197, 94, 0.1);
		border-color: rgba(34, 197, 94, 0.3);
		color: rgba(74, 222, 128, 0.95);
	}
	.waktu-name {
		font-size: 14px;
		font-weight: 600;
	}

	/* ── Progress block ──────────────────────── */
	.prog-block {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.prog-meta {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.prog-text { font-size: 12px; color: var(--pg-muted); }
	.prog-pct { font-size: 11px; color: var(--pg-subtle); }
	.prog-track {
		height: 4px;
		border-radius: 999px;
		background: var(--pg-surface-b);
		overflow: hidden;
	}
	.prog-fill {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, rgba(34,197,94,0.6), rgba(74,222,128,0.9));
		transition: width 0.3s ease;
	}

	/* ── CTA ─────────────────────────────────── */
	.cta-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		padding: 14px;
		border-radius: 14px;
		background: rgba(34, 197, 94, 0.18);
		border: 1px solid rgba(34, 197, 94, 0.3);
		color: rgba(74, 222, 128, 0.95);
		font-size: 15px;
		font-weight: 700;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
		letter-spacing: 0.01em;
	}
	.cta-btn:hover {
		background: rgba(34, 197, 94, 0.28);
		border-color: rgba(34, 197, 94, 0.45);
	}

	/* ── Divider ─────────────────────────────── */
	.divider {
		height: 1px;
		background: var(--pg-surface-b);
		margin: 24px 0;
	}

	/* ── Stats ───────────────────────────────── */
	.stats-section {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.stat-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}
	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		padding: 14px 8px;
		border-radius: 12px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
	}
	.stat-num {
		font-size: 24px;
		font-weight: 700;
		color: rgba(74, 222, 128, 0.9);
		line-height: 1;
	}
	.stat-label {
		font-size: 10px;
		color: var(--pg-subtle);
		text-align: center;
	}

	/* ── Today block ─────────────────────────── */
	.today-block {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 14px;
		border-radius: 12px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
	}
	.today-label {
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.3);
		margin: 0;
	}
	.session-pills {
		display: flex;
		gap: 6px;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		padding: 4px 8px;
		border-radius: 6px;
		font-size: 11px;
		font-weight: 700;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-subtle);
		letter-spacing: 0.03em;
	}
	.pill.pill-done {
		background: rgba(34, 197, 94, 0.15);
		border-color: rgba(34, 197, 94, 0.3);
		color: rgba(74, 222, 128, 0.9);
	}
	.today-hint {
		font-size: 11px;
		color: var(--pg-subtle);
		margin: 0;
	}
	.today-hint-done {
		color: rgba(74, 222, 128, 0.6);
	}

	/* ── Rekod link ──────────────────────────── */
	.rekod-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 11px;
		border-radius: 12px;
		background: transparent;
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-subtle);
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
		transition: background 0.15s, color 0.15s;
	}
	.rekod-link:hover {
		background: var(--pg-surface);
		color: var(--pg-muted);
	}
</style>
