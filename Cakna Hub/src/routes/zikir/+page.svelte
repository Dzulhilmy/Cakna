<script>
	import { onMount } from 'svelte';
	import { ChevronLeft, RotateCcw } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { tasbih } from '$lib/state/stores.svelte';

	// ── Tasbih ────────────────────────────────────────────
	const TARGETS = [33, 99, 100, 0];

	const PRESETS = [
		'SubhanAllah سبحان الله',
		'Alhamdulillah الحمد لله',
		'Allahu Akbar الله أكبر',
		'La ilaha illallah لا إله إلا الله',
		'Tasbih bebas'
	];

	// Progress ring geometry
	const RADIUS = 90;
	const CIRC = 2 * Math.PI * RADIUS;

	const progress = $derived(
		tasbih.value.t > 0 ? Math.min(tasbih.value.c / tasbih.value.t, 1) : 0
	);
	const dashOffset = $derived(CIRC * (1 - progress));

	let editingLabel = $state(false);

	function tap() {
		tasbih.value.c += 1;
		if (tasbih.value.t > 0 && tasbih.value.c >= tasbih.value.t) {
			navigator.vibrate?.(50);
			tasbih.value.c = 0;
		}
	}

	function cycleTarget() {
		const idx = TARGETS.indexOf(tasbih.value.t);
		tasbih.value.t = TARGETS[(idx + 1) % TARGETS.length];
	}

	function resetTasbih() {
		tasbih.value.c = 0;
	}

	function setPreset(label) {
		tasbih.value.label = label;
		editingLabel = false;
	}

	// ── Dhikr list ────────────────────────────────────────
	let dhikrList = $state([]);
	let dhikrTab = $state('phrase'); // 'phrase' | 'quran'
	let dhikrLoading = $state(true);

	onMount(() => {
		fetch('/proxy/api/modules/dhikr')
			.then(r => r.json())
			.then(d => { dhikrList = Array.isArray(d) ? d : []; dhikrLoading = false; })
			.catch(() => { dhikrList = []; dhikrLoading = false; });
	});

	const filteredDhikr = $derived(dhikrList.filter(d => d.kind === dhikrTab));
</script>

<svelte:head><title>Zikir & Tasbih — Cakna</title></svelte:head>

<div class="zikir-root">
	<header class="zikir-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Zikir & Tasbih</span>
		</div>
		<div class="hdr-spacer"></div>
	</header>

	<main class="zikir-main">
		<!-- ══ Section 1: Tasbih Counter ══ -->
		<section class="tasbih-section">
			<!-- Label -->
			<div class="label-row">
				{#if editingLabel}
					<div class="preset-list">
						{#each PRESETS as p (p)}
							<button class="preset-item" onclick={() => setPreset(p)}>{p}</button>
						{/each}
						<button class="preset-cancel" onclick={() => (editingLabel = false)}>Batal</button>
					</div>
				{:else}
					<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
					<p class="tasbih-label" onclick={() => (editingLabel = true)}>
						{tasbih.value.label}
					</p>
				{/if}
			</div>

			<!-- Ring counter (tappable) -->
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
			<div class="ring-wrap" onclick={tap} role="button" tabindex="0" aria-label="Klik untuk tambah zikir">
				<svg class="counter-ring" viewBox="0 0 220 220" width="220" height="220">
					<!-- Background track -->
					<circle
						cx="110" cy="110" r={RADIUS}
						stroke="var(--pg-surface-b)"
						stroke-width="12"
						fill="none"
					/>
					<!-- Progress arc -->
					{#if tasbih.value.t > 0}
						<circle
							cx="110" cy="110" r={RADIUS}
							stroke="rgba(34,197,94,0.85)"
							stroke-width="12"
							fill="none"
							stroke-linecap="round"
							stroke-dasharray={CIRC}
							stroke-dashoffset={dashOffset}
							transform="rotate(-90 110 110)"
							style="transition: stroke-dashoffset 0.2s ease"
						/>
					{/if}
					<!-- Glow ring -->
					<circle
						cx="110" cy="110" r={RADIUS}
						stroke="rgba(34,197,94,0.08)"
						stroke-width="24"
						fill="rgba(10,20,30,0.9)"
					/>
				</svg>
				<div class="counter-center">
					<span class="counter-num">{tasbih.value.c}</span>
					{#if tasbih.value.t > 0}
						<span class="counter-target">/ {tasbih.value.t}</span>
					{:else}
						<span class="counter-target">∞</span>
					{/if}
					<span class="counter-hint">ketuk untuk zikir</span>
				</div>
			</div>

			<!-- Controls row -->
			<div class="controls-row">
				<!-- Target cycle -->
				<button class="ctrl-btn" onclick={cycleTarget}>
					<span class="ctrl-lbl">Sasaran</span>
					<span class="ctrl-val">{tasbih.value.t === 0 ? '∞' : tasbih.value.t}</span>
				</button>

				<!-- Reset -->
				<button class="ctrl-btn ctrl-reset" onclick={resetTasbih} aria-label="Reset kiraan">
					<RotateCcw size={16} />
					<span class="ctrl-lbl">Reset</span>
				</button>
			</div>
		</section>

		<!-- ══ Section 2: Dhikr List ══ -->
		<section class="dhikr-section">
			<div class="dhikr-tabs">
				<button
					class="dhikr-tab"
					class:dhikr-tab-active={dhikrTab === 'phrase'}
					onclick={() => (dhikrTab = 'phrase')}
				>
					Zikir Harian
				</button>
				<button
					class="dhikr-tab"
					class:dhikr-tab-active={dhikrTab === 'quran'}
					onclick={() => (dhikrTab = 'quran')}
				>
					Perlindungan
				</button>
			</div>

			{#if dhikrLoading}
				<!-- Loading skeleton -->
				<div class="dhikr-list">
					{#each [1, 2, 3, 4] as i (i)}
						<div class="skeleton-card">
							<div class="sk-arabic"></div>
							<div class="sk-label"></div>
						</div>
					{/each}
				</div>
			{:else if filteredDhikr.length === 0}
				<div class="dhikr-empty">
					<p>Tiada zikir dalam kategori ini.</p>
				</div>
			{:else}
				<div class="dhikr-list">
					{#each filteredDhikr as item (item.id ?? item.label)}
						<div class="dhikr-card">
							{#if item.arabic}
								<p class="dhikr-arabic">{item.arabic}</p>
							{/if}
							<div class="dhikr-meta">
								<span class="dhikr-name">{item.label ?? item.title ?? ''}</span>
								{#if item.count}
									<span class="dhikr-count">{item.count}×</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	</main>
</div>

<SideNav active="zikir" />

<style>
	.zikir-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
	}

	.zikir-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--pg-hdr);
		border-bottom: 1px solid var(--pg-hdr-border);
		backdrop-filter: blur(8px);
	}

	.hdr-btn {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
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
		flex-direction: column;
		align-items: center;
	}
	.hdr-title {
		font-size: 13px;
		font-weight: 600;
		color: var(--pg-text-75);
	}
	.hdr-spacer { width: 36px; flex-shrink: 0; }

	.zikir-main {
		padding: 20px 16px 48px;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	/* ─── Tasbih section ─── */
	.tasbih-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.label-row { width: 100%; max-width: 340px; }

	.tasbih-label {
		text-align: center;
		font-size: 15px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.65);
		cursor: pointer;
		padding: 8px 16px;
		border-radius: 10px;
		border: 1px dashed rgba(255, 255, 255, 0.1);
		transition: all 0.15s;
	}
	.tasbih-label:hover {
		border-color: rgba(34, 197, 94, 0.25);
		color: rgba(255, 255, 255, 0.85);
	}

	.preset-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
		background: rgba(15, 30, 20, 0.95);
		border: 1px solid rgba(34, 197, 94, 0.15);
		border-radius: 14px;
		padding: 8px;
	}
	.preset-item {
		text-align: left;
		padding: 10px 12px;
		border-radius: 8px;
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.7);
		font-size: 13px;
		cursor: pointer;
		transition: background 0.12s;
	}
	.preset-item:hover { background: rgba(34, 197, 94, 0.1); color: rgba(74, 222, 128, 0.9); }
	.preset-cancel {
		text-align: center;
		padding: 8px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.04);
		border: none;
		color: rgba(255, 255, 255, 0.3);
		font-size: 12px;
		cursor: pointer;
		margin-top: 2px;
	}

	/* Ring */
	.ring-wrap {
		position: relative;
		cursor: pointer;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
	.ring-wrap:active .counter-ring { transform: scale(0.97); }
	.counter-ring { display: block; transition: transform 0.1s; }

	.counter-center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
	.counter-num {
		font-size: 60px;
		font-weight: 800;
		color: var(--pg-fg);
		line-height: 1;
		letter-spacing: -0.03em;
	}
	.counter-target {
		font-size: 14px;
		color: rgba(34, 197, 94, 0.6);
		font-weight: 500;
		margin-top: 2px;
	}
	.counter-hint {
		font-size: 10px;
		color: rgba(255, 255, 255, 0.2);
		margin-top: 6px;
	}

	/* Controls */
	.controls-row {
		display: flex;
		gap: 10px;
	}
	.ctrl-btn {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 12px 16px;
		border-radius: 14px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		transition: all 0.15s;
	}
	.ctrl-btn:hover { background: var(--pg-btn-hover); }
	.ctrl-reset { flex: 0 0 auto; padding: 12px 20px; }
	.ctrl-lbl { font-size: 10px; color: rgba(255, 255, 255, 0.3); text-transform: uppercase; letter-spacing: 0.08em; }
	.ctrl-val { font-size: 18px; font-weight: 700; color: rgba(74, 222, 128, 0.9); }

	/* ─── Dhikr section ─── */
	.dhikr-section { display: flex; flex-direction: column; gap: 12px; }

	.dhikr-tabs {
		display: flex;
		gap: 6px;
		background: var(--pg-surface);
		border-radius: 12px;
		padding: 4px;
	}
	.dhikr-tab {
		flex: 1;
		padding: 9px;
		border-radius: 9px;
		background: transparent;
		border: none;
		color: var(--pg-muted);
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
	}
	.dhikr-tab-active {
		background: rgba(34, 197, 94, 0.15);
		color: rgba(74, 222, 128, 0.9);
	}

	.dhikr-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.dhikr-card {
		padding: 14px;
		background: var(--pg-surface);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 14px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.dhikr-arabic {
		text-align: right;
		font-size: 20px;
		line-height: 1.7;
		color: var(--pg-text-85);
		direction: rtl;
		font-family: 'Traditional Arabic', 'Amiri', serif;
	}

	.dhikr-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.dhikr-name {
		font-size: 12px;
		color: var(--pg-muted);
	}
	.dhikr-count {
		font-size: 11px;
		font-weight: 600;
		padding: 3px 9px;
		border-radius: 6px;
		background: rgba(34, 197, 94, 0.12);
		color: rgba(74, 222, 128, 0.8);
	}

	/* Skeleton */
	.skeleton-card {
		padding: 14px;
		background: var(--pg-surface);
		border: 1px solid rgba(255, 255, 255, 0.04);
		border-radius: 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.sk-arabic {
		height: 36px;
		border-radius: 6px;
		background: linear-gradient(90deg, var(--pg-surface) 25%, var(--pg-surface-b) 50%, var(--pg-surface) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
	}
	.sk-label {
		height: 12px;
		width: 60%;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.05);
		animation: shimmer 1.4s infinite 0.2s;
	}

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	.dhikr-empty {
		padding: 32px 20px;
		text-align: center;
		color: rgba(255, 255, 255, 0.2);
		font-size: 13px;
	}
</style>
