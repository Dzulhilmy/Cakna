<script>
	import { ChevronLeft, Trash2, Flame, Target } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { read, readlog, khatamToasted, sgdays } from '$lib/state/stores.svelte';

	const TOTAL_PAGES = 604;
	const TARGET_OPTIONS = [7, 15, 30, 60, 90];

	const pagesRead = $derived(read.value.length);
	const pct = $derived(Math.round((pagesRead / TOTAL_PAGES) * 100));

	// Approximate khatam count from readlog history (total pages logged / 604)
	const totalPagesEver = $derived(
		Object.values(readlog.value).reduce((a, b) => a + b, 0)
	);
	const khatamCount = $derived(Math.max(1, Math.floor(totalPagesEver / TOTAL_PAGES) + (pagesRead > 0 ? 1 : 0)));

	// Reading streak: consecutive days from today backward
	const streak = $derived.by(() => {
		let s = 0;
		const d = new Date();
		while (true) {
			const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
			if (!readlog.value[k]) break;
			s++;
			d.setDate(d.getDate() - 1);
		}
		return s;
	});

	// Avg pages per day (last 14 days with reads)
	const avgPagesPerDay = $derived.by(() => {
		const vals = Object.values(readlog.value).filter(v => v > 0);
		if (!vals.length) return 0;
		const total = vals.reduce((a, b) => a + b, 0);
		return Math.round((total / vals.length) * 10) / 10;
	});

	const daysToFinish = $derived(
		avgPagesPerDay > 0 ? Math.ceil((TOTAL_PAGES - pagesRead) / avgPagesPerDay) : null
	);

	// Heatmap: last 12 weeks (84 days), oldest at index 0
	const heatmapDays = $derived.by(() => {
		const days = [];
		const now = new Date();
		for (let i = 83; i >= 0; i--) {
			const d = new Date(now);
			d.setDate(d.getDate() - i);
			const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
			days.push({ k, count: readlog.value[k] ?? 0 });
		}
		return days;
	});

	// Split into 12 weeks × 7 days
	const heatmapWeeks = $derived.by(() => {
		const weeks = [];
		for (let i = 0; i < 12; i++) {
			weeks.push(heatmapDays.slice(i * 7, (i + 1) * 7));
		}
		return weeks;
	});

	function cellColor(count) {
		if (count === 0) return 'rgba(255,255,255,0.04)';
		if (count <= 3) return 'rgba(34,197,94,0.3)';
		return 'rgba(34,197,94,0.85)';
	}

	function resetAll() {
		read.value = [];
		readlog.value = {};
		khatamToasted.value = false;
	}

	// Progress ring
	const RADIUS = 64;
	const CIRC = 2 * Math.PI * RADIUS;
	const dashOffset = $derived(CIRC * (1 - pagesRead / TOTAL_PAGES));
</script>

<svelte:head><title>Rekod Khatam — Cakna</title></svelte:head>

<div class="khatam-root">
	<header class="khatam-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Rekod Khatam</span>
		</div>
		<button class="hdr-btn" onclick={resetAll} aria-label="Reset semua">
			<Trash2 size={16} />
		</button>
	</header>

	<main class="khatam-main">
		<!-- Progress Section -->
		<section class="progress-section">
			<div class="progress-ring-wrap">
				<svg class="progress-ring" viewBox="0 0 160 160" width="160" height="160">
					<circle
						cx="80" cy="80" r={RADIUS}
						stroke="rgba(255,255,255,0.06)"
						stroke-width="10"
						fill="none"
					/>
					<circle
						cx="80" cy="80" r={RADIUS}
						stroke="rgba(34,197,94,0.85)"
						stroke-width="10"
						fill="none"
						stroke-linecap="round"
						stroke-dasharray={CIRC}
						stroke-dashoffset={dashOffset}
						transform="rotate(-90 80 80)"
						style="transition: stroke-dashoffset 0.4s ease"
					/>
				</svg>
				<div class="ring-center">
					<span class="ring-pct">{pct}%</span>
					<span class="ring-sub">selesai</span>
				</div>
			</div>

			<div class="progress-info">
				<div class="info-row">
					<span class="info-label">Halaman dibaca</span>
					<span class="info-val">{pagesRead} / {TOTAL_PAGES}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Khatam ke</span>
					<span class="info-val khatam-num">#{khatamCount}</span>
				</div>
				<div class="info-row">
					<Flame size={14} class="streak-icon" />
					<span class="info-label">Streak berturut</span>
					<span class="info-val">{streak} hari</span>
				</div>
			</div>
		</section>

		<!-- Heatmap -->
		<section class="heatmap-section">
			<h2 class="section-label">Aktiviti 12 Minggu Lepas</h2>
			<div class="heatmap-scroll">
				<div class="heatmap-grid">
					{#each heatmapWeeks as week, wi (wi)}
						<div class="heatmap-col">
							{#each week as day, di (di)}
								<div
									class="heatmap-cell"
									style="background: {cellColor(day.count)}"
									title="{day.k}: {day.count} halaman"
								></div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
			<div class="heatmap-legend">
				<span class="legend-lbl">Kurang</span>
				<div class="legend-cells">
					<div class="heatmap-cell" style="background: rgba(255,255,255,0.04)"></div>
					<div class="heatmap-cell" style="background: rgba(34,197,94,0.3)"></div>
					<div class="heatmap-cell" style="background: rgba(34,197,94,0.6)"></div>
					<div class="heatmap-cell" style="background: rgba(34,197,94,0.85)"></div>
				</div>
				<span class="legend-lbl">Banyak</span>
			</div>
		</section>

		<!-- Target Selector -->
		<section class="target-section">
			<h2 class="section-label">
				<Target size={12} style="display:inline;vertical-align:middle;margin-right:4px;" />
				Sasaran Khatam
			</h2>
			<div class="target-btns">
				{#each TARGET_OPTIONS as t (t)}
					<button
						class="target-btn"
						class:target-active={sgdays.value === t}
						onclick={() => (sgdays.value = t)}
					>
						{t} hari
					</button>
				{/each}
			</div>
		</section>

		<!-- Estimate tip -->
		{#if daysToFinish !== null}
			<div class="tip-card">
				<span class="tip-icon">💡</span>
				<p class="tip-text">
					Pada kadar <strong>{avgPagesPerDay}</strong> halaman/hari, anda dijangka khatam dalam <strong>{daysToFinish}</strong> hari lagi.
				</p>
			</div>
		{:else}
			<div class="tip-card tip-empty">
				<span class="tip-icon">📖</span>
				<p class="tip-text">Mula membaca untuk lihat anggaran khatam anda.</p>
			</div>
		{/if}
	</main>
</div>

<SideNav active="khatam" />

<style>
	.khatam-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: #070e14;
		color: #e2e8f0;
		padding-left: 76px;
	}

	.khatam-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: rgba(7, 14, 20, 0.96);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
	}

	.hdr-btn {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.hdr-btn:hover { background: rgba(255, 255, 255, 0.08); }

	.hdr-center {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.hdr-title {
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.75);
	}

	.khatam-main {
		padding: 20px 16px 48px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* Progress section */
	.progress-section {
		display: flex;
		align-items: center;
		gap: 20px;
		background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.03));
		border: 1px solid rgba(34, 197, 94, 0.15);
		border-radius: 20px;
		padding: 20px;
	}

	.progress-ring-wrap {
		position: relative;
		flex-shrink: 0;
	}
	.progress-ring { display: block; }
	.ring-center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.ring-pct {
		font-size: 22px;
		font-weight: 800;
		color: rgba(74, 222, 128, 0.95);
		line-height: 1;
	}
	.ring-sub {
		font-size: 10px;
		color: rgba(255, 255, 255, 0.3);
		margin-top: 2px;
	}

	.progress-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.info-row {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.info-label {
		flex: 1;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.4);
	}
	.info-val {
		font-size: 14px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.85);
	}
	.khatam-num {
		color: rgba(199, 162, 75, 0.9);
		font-size: 16px;
	}
	.streak-icon { color: rgba(251, 146, 60, 0.8); }

	/* Heatmap */
	.section-label {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.25);
		margin-bottom: 10px;
	}

	.heatmap-scroll {
		overflow-x: auto;
		padding-bottom: 4px;
	}
	.heatmap-grid {
		display: flex;
		gap: 3px;
		min-width: fit-content;
	}
	.heatmap-col {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.heatmap-cell {
		width: 12px;
		height: 12px;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.heatmap-legend {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 8px;
	}
	.legend-lbl { font-size: 10px; color: rgba(255, 255, 255, 0.25); }
	.legend-cells {
		display: flex;
		gap: 3px;
	}

	/* Target */
	.target-btns {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.target-btn {
		padding: 8px 16px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.45);
		font-size: 13px;
		cursor: pointer;
		transition: all 0.15s;
	}
	.target-btn:hover { background: rgba(255, 255, 255, 0.08); }
	.target-active {
		background: rgba(34, 197, 94, 0.12);
		border-color: rgba(34, 197, 94, 0.3);
		color: rgba(74, 222, 128, 0.9);
		font-weight: 600;
	}

	/* Tip card */
	.tip-card {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 14px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 14px;
	}
	.tip-empty { opacity: 0.6; }
	.tip-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
	.tip-text {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.5;
	}
	.tip-text strong { color: rgba(255, 255, 255, 0.8); }
</style>
