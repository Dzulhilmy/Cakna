<script lang="ts">
	import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-svelte';
	import { mathuratState } from '$lib/state/stores.svelte';
	import type { Versi } from '$lib/data/mathurat';
	import type { Waktu } from '$lib/data/mathurat';

	type VersionFilter = 'sughra' | 'kubra' | 'semua';
	type WaktuFilter = 'pagi' | 'petang' | 'semua';

	let version = $state<VersionFilter>('semua');
	let waktu = $state<WaktuFilter>('semua');

	// Month navigation — 0 = current month
	let monthOffset = $state(0);

	const today = new Date();

	const viewDate = $derived(new Date(today.getFullYear(), today.getMonth() + monthOffset, 1));
	const viewYear = $derived(viewDate.getFullYear());
	const viewMonth = $derived(viewDate.getMonth());

	const monthLabel = $derived(
		viewDate.toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' })
	);

	// Build calendar days array (with leading nulls for alignment, Mon-first)
	const calDays = $derived(() => {
		const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
		const firstDow = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
		const leadingBlanks = (firstDow + 6) % 7; // shift so Mon=0
		const days: (number | null)[] = Array(leadingBlanks).fill(null);
		for (let d = 1; d <= daysInMonth; d++) days.push(d);
		return days;
	});

	function dateKey(year: number, month: number, day: number): string {
		return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	}

	const rekod = $derived(mathuratState.value?.rekod ?? {});

	function getCompletions(day: number): { sp: boolean; sk: boolean; kp: boolean; kk: boolean } {
		const key = dateKey(viewYear, viewMonth, day);
		const entry = rekod[key];
		if (!entry) return { sp: false, sk: false, kp: false, kk: false };
		return {
			sp: !!(entry.pagi?.sughra),
			sk: !!(entry.petang?.sughra),
			kp: !!(entry.pagi?.kubra),
			kk: !!(entry.petang?.kubra)
		};
	}

	// Check if a day is "matched" by the current filter
	function dayMatched(day: number): boolean {
		const c = getCompletions(day);
		const versions: Versi[] = version === 'semua' ? ['sughra', 'kubra'] : [version];
		const waktus: Waktu[] = waktu === 'semua' ? ['pagi', 'petang'] : [waktu];
		return versions.some((v) =>
			waktus.some((w) => {
				if (v === 'sughra' && w === 'pagi') return c.sp;
				if (v === 'sughra' && w === 'petang') return c.sk;
				if (v === 'kubra' && w === 'pagi') return c.kp;
				if (v === 'kubra' && w === 'petang') return c.kk;
				return false;
			})
		);
	}

	// Stats for the filtered view across the viewed month
	const stats = $derived(() => {
		const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
		let completed = 0;
		for (let d = 1; d <= daysInMonth; d++) {
			if (dayMatched(d)) completed++;
		}

		// Streak: consecutive days matched ending today (only meaningful for current month view)
		let streak = 0;
		if (monthOffset === 0) {
			const todayD = today.getDate();
			for (let d = todayD; d >= 1; d--) {
				if (dayMatched(d)) streak++;
				else break;
			}
		}

		return { completed, streak };
	});

	// Dot visibility for a given day cell
	function dots(day: number) {
		const c = getCompletions(day);
		const showSughraPagi = (version === 'sughra' || version === 'semua') && (waktu === 'pagi' || waktu === 'semua');
		const showSuhraPetang = (version === 'sughra' || version === 'semua') && (waktu === 'petang' || waktu === 'semua');
		const showKubraPagi = (version === 'kubra' || version === 'semua') && (waktu === 'pagi' || waktu === 'semua');
		const showKubraPetang = (version === 'kubra' || version === 'semua') && (waktu === 'petang' || waktu === 'semua');
		return {
			sp: showSughraPagi && c.sp,
			sk: showSuhraPetang && c.sk,
			kp: showKubraPagi && c.kp,
			kk: showKubraPetang && c.kk
		};
	}

	function isToday(day: number): boolean {
		return monthOffset === 0 && day === today.getDate();
	}
</script>

<svelte:head><title>Prestasi Ma'thurat — Cakna</title></svelte:head>

<div class="root">
	<!-- Header -->
	<header class="hdr">
		<a href="/mathurat" class="hdr-btn" aria-label="Kembali">
			<ChevronLeft size={20} />
		</a>
		<span class="hdr-title">Prestasi Ma'thurat</span>
		<div class="hdr-spacer"></div>
	</header>

	<!-- Stats row -->
	<div class="stats-row">
		<div class="stat-card">
			<span class="stat-num">{stats().completed}</span>
			<span class="stat-label">Hari selesai</span>
		</div>
		{#if monthOffset === 0}
			<div class="stat-card">
				<span class="stat-num">{stats().streak}</span>
				<span class="stat-label">Hari berturut</span>
			</div>
		{/if}
		<div class="stat-card">
			<span class="stat-num">{new Date(viewYear, viewMonth + 1, 0).getDate()}</span>
			<span class="stat-label">Hari dalam bulan</span>
		</div>
	</div>

	<!-- Month navigator -->
	<div class="month-nav">
		<button class="nav-btn" onclick={() => (monthOffset -= 1)}>
			<ChevronLeft size={16} />
		</button>
		<span class="month-label">{monthLabel}</span>
		<button class="nav-btn" onclick={() => (monthOffset += 1)} disabled={monthOffset >= 0}>
			<ChevronRight size={16} />
		</button>
	</div>

	<!-- Day-of-week headers -->
	<div class="cal-grid">
		{#each ['Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa', 'Ah'] as dow}
			<div class="dow-label">{dow}</div>
		{/each}

		{#each calDays() as day}
			{#if day === null}
				<div class="day-blank"></div>
			{:else}
				{@const d = dots(day)}
				{@const matched = dayMatched(day)}
				<div
					class="day-cell"
					class:day-today={isToday(day)}
					class:day-matched={matched}
				>
					<span class="day-num">{day}</span>
					<div class="dot-row">
						{#if d.sp}<span class="dot dot-sp" title="Sughra Pagi"></span>{/if}
						{#if d.sk}<span class="dot dot-sk" title="Sughra Petang"></span>{/if}
						{#if d.kp}<span class="dot dot-kp" title="Kubra Pagi"></span>{/if}
						{#if d.kk}<span class="dot dot-kk" title="Kubra Petang"></span>{/if}
					</div>
				</div>
			{/if}
		{/each}
	</div>

	<!-- Legend -->
	<div class="legend">
		<span class="legend-item"><span class="dot dot-sp"></span> Sughra Pagi</span>
		<span class="legend-item"><span class="dot dot-sk"></span> Sughra Petang</span>
		<span class="legend-item"><span class="dot dot-kp"></span> Kubra Pagi</span>
		<span class="legend-item"><span class="dot dot-kk"></span> Kubra Petang</span>
	</div>

	<!-- Filters -->
	<div class="filters">
		<div class="filter-group">
			<p class="filter-label">Versi</p>
			<div class="filter-row">
				{#each ([['semua', 'Semua'], ['sughra', 'Sughra'], ['kubra', 'Kubra']] as [VersionFilter, string][]) as [v, label]}
					<button
						class="filter-btn"
						class:active={version === v}
						onclick={() => (version = v)}
					>{label}</button>
				{/each}
			</div>
		</div>
		<div class="filter-group">
			<p class="filter-label">Waktu</p>
			<div class="filter-row">
				<button class="filter-btn" class:active={waktu === 'semua'} onclick={() => (waktu = 'semua')}>Semua</button>
				<button class="filter-btn" class:active={waktu === 'pagi'} onclick={() => (waktu = 'pagi')}>
					<Sun size={12} /> Pagi
				</button>
				<button class="filter-btn" class:active={waktu === 'petang'} onclick={() => (waktu = 'petang')}>
					<Moon size={12} /> Petang
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) { background: #1e0f0f; }

	.root {
		min-height: 100dvh;
		background: #1e0f0f;
		color: rgba(255, 255, 255, 0.88);
		display: flex;
		flex-direction: column;
		gap: 0;
		padding-bottom: 2rem;
	}

	/* Header */
	.hdr {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}
	.hdr-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.5rem;
		background: rgba(255, 255, 255, 0.05);
		border: none;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		text-decoration: none;
		flex-shrink: 0;
	}
	.hdr-title {
		font-size: 0.9rem;
		font-weight: 600;
		flex: 1;
		text-align: center;
	}
	.hdr-spacer { width: 2rem; }

	/* Stats */
	.stats-row {
		display: flex;
		gap: 0.75rem;
		padding: 1rem 1rem 0.75rem;
	}
	.stat-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		padding: 0.75rem 0.5rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 0.75rem;
	}
	.stat-num {
		font-size: 1.5rem;
		font-weight: 700;
		color: rgb(100, 210, 140);
		line-height: 1;
	}
	.stat-label {
		font-size: 0.6rem;
		color: rgba(255, 255, 255, 0.35);
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	/* Month nav */
	.month-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
	}
	.nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.5rem;
		background: rgba(255, 255, 255, 0.06);
		border: none;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
	}
	.nav-btn:disabled { opacity: 0.3; cursor: default; }
	.month-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.8);
		text-transform: capitalize;
	}

	/* Calendar */
	.cal-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.25rem;
		padding: 0 0.75rem;
	}
	.dow-label {
		text-align: center;
		font-size: 0.6rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.3);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.25rem 0;
	}
	.day-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		padding: 0.35rem 0.2rem 0.3rem;
		border-radius: 0.5rem;
		min-height: 3.2rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid transparent;
		transition: background 0.15s, border-color 0.15s;
	}
	.day-cell.day-matched {
		background: rgba(45, 120, 80, 0.18);
		border-color: rgba(80, 200, 120, 0.15);
	}
	.day-cell.day-today .day-num {
		color: rgb(100, 210, 140);
		font-weight: 700;
	}
	.day-num {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.65);
		line-height: 1;
	}
	.dot-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem;
		justify-content: center;
	}
	.dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		display: inline-block;
	}
	.dot-sp { background: rgb(251, 191, 36); }   /* amber — Sughra Pagi */
	.dot-sk { background: rgb(251, 146, 60); }   /* orange — Sughra Petang */
	.dot-kp { background: rgb(52, 211, 153); }   /* teal — Kubra Pagi */
	.dot-kk { background: rgb(129, 140, 248); }  /* indigo — Kubra Petang */

	/* Legend */
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		padding: 0.75rem 1rem 0.25rem;
		justify-content: center;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.65rem;
		color: rgba(255, 255, 255, 0.4);
	}

	/* Filters */
	.filters {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		margin-top: auto;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}
	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.filter-label {
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 0.3);
		margin: 0;
	}
	.filter-row {
		display: flex;
		gap: 0.4rem;
	}
	.filter-btn {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.4rem 0.75rem;
		border-radius: 2rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
	}
	.filter-btn.active {
		background: rgba(45, 120, 80, 0.45);
		border-color: rgba(80, 200, 120, 0.25);
		color: rgba(255, 255, 255, 0.95);
	}
	.filter-btn:hover:not(.active) {
		background: rgba(255, 255, 255, 0.09);
		color: rgba(255, 255, 255, 0.75);
	}
</style>
