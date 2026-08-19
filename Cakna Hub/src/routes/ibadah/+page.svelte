<script>
	import { onMount } from 'svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { settings, manasik } from '$lib/state/stores.svelte';

	let loading = $state(true);
	let fetchError = $state('');
	let ibadahDoc = $state(null);
	let activeSection = $state('wuduk');

	const uiLang = $derived(settings.value.uiLang ?? 'ms');

	const TABS = [
		{ id: 'wuduk',   label: 'Wuduk' },
		{ id: 'solat',   label: 'Solat' },
		{ id: 'tay',     label: 'Tayammum' },
		{ id: 'umrah',   label: 'Umrah' },
		{ id: 'haji',    label: 'Haji' }
	];

	onMount(async () => {
		try {
			const r = await fetch('/proxy/api/modules/ibadah');
			if (!r.ok) throw new Error(`HTTP ${r.status}`);
			ibadahDoc = await r.json();
		} catch (e) {
			fetchError = e instanceof Error ? e.message : 'Ralat tidak diketahui';
		} finally {
			loading = false;
		}
	});

	function stepDesc(step) {
		return uiLang === 'en' ? (step.desc_en ?? step.desc_ms ?? '') : (step.desc_ms ?? step.desc_en ?? '');
	}

	function flagLabel(flag) {
		if (flag === 1) return 'Rukun';
		if (flag === 2) return 'Wajib';
		return 'Sunat';
	}

	function incrementTawaf() {
		if (manasik.value.t < 7) {
			manasik.value = { ...manasik.value, t: manasik.value.t + 1 };
		}
	}

	function resetTawaf() {
		manasik.value = { ...manasik.value, t: 0 };
	}
</script>

<svelte:head><title>Panduan Ibadah — Cakna</title></svelte:head>

<div class="ib-root">
	<!-- Header -->
	<header class="ib-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Panduan Ibadah</span>
			<span class="hdr-sub">{TABS.find(t => t.id === activeSection)?.label ?? ''}</span>
		</div>
		<div style="width:36px;"></div>
	</header>

	<!-- Section tabs -->
	<div class="tabs-row">
		{#each TABS as tab}
			<button
				class="tab"
				class:tab-active={activeSection === tab.id}
				onclick={() => (activeSection = tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<main class="ib-main">
		{#if loading}
			<div class="loading-wrap">
				<div class="spinner" aria-label="Memuatkan…"></div>
				<p class="loading-text">Memuatkan panduan ibadah…</p>
			</div>
		{:else if fetchError}
			<div class="error-wrap">
				<p class="error-text">Ralat: {fetchError}</p>
			</div>
		{:else if !ibadahDoc}
			<div class="error-wrap">
				<p class="error-text">Tiada data tersedia.</p>
			</div>
		{:else}
			<!-- Tawaf counter for Umrah section -->
			{#if activeSection === 'umrah'}
				<div class="tawaf-card">
					<div class="tawaf-label">Kaunter Tawaf</div>
					<div class="tawaf-count">{manasik.value.t} / 7</div>
					<div class="tawaf-dots">
						{#each Array(7) as _, i}
							<div class="tawaf-dot" class:dot-filled={i < manasik.value.t}></div>
						{/each}
					</div>
					<div class="tawaf-actions">
						<button
							class="tawaf-reset"
							onclick={resetTawaf}
							disabled={manasik.value.t === 0}
						>
							Set Semula
						</button>
						<button
							class="tawaf-tap"
							onclick={incrementTawaf}
							disabled={manasik.value.t >= 7}
						>
							{manasik.value.t >= 7 ? 'Lengkap ✓' : `Pusingan ${manasik.value.t + 1}`}
						</button>
					</div>
					{#if manasik.value.t >= 7}
						<p class="tawaf-done">Tahniah! Tawaf lengkap 7 pusingan.</p>
					{/if}
				</div>
			{/if}

			<!-- Steps list -->
			{@const steps = ibadahDoc.sections?.[activeSection] ?? []}
			{#if steps.length === 0}
				<div class="empty-wrap">
					<p class="empty-text">Tiada langkah untuk bahagian ini.</p>
				</div>
			{:else}
				<div class="steps-list">
					{#each steps as step, i (i)}
						<div class="step-card">
							<div class="step-hdr">
								<span class="step-num">{i + 1}</span>
								<span
									class="flag-badge"
									class:flag-rukun={step.flag === 1}
									class:flag-wajib={step.flag === 2}
									class:flag-sunat={step.flag === 0}
								>
									{flagLabel(step.flag)}
								</span>
							</div>

							<!-- Arabic / tajweed -->
							{#if step.tajweed}
								<p class="step-ar" dir="rtl">{@html step.tajweed}</p>
							{:else if step.arabic}
								<p class="step-ar" dir="rtl">{step.arabic}</p>
							{/if}

							<!-- Description -->
							<p class="step-desc">{stepDesc(step)}</p>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</main>
</div>

<SideNav active="ibadah" />

<style>
	.ib-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: #070e14;
		color: #e2e8f0;
		padding-left: 76px;
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* ── Header ── */
	.ib-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: rgba(7, 14, 20, 0.96);
		border-bottom: 1px solid rgba(34, 197, 94, 0.1);
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
	.hdr-sub {
		font-size: 11px;
		color: rgba(34, 197, 94, 0.6);
	}

	/* ── Tabs ── */
	.tabs-row {
		display: flex;
		gap: 4px;
		padding: 10px 16px;
		background: rgba(255, 255, 255, 0.02);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}
	.tabs-row::-webkit-scrollbar { display: none; }

	.tab {
		flex-shrink: 0;
		padding: 7px 14px;
		border-radius: 10px;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.4);
		cursor: pointer;
		border: none;
		background: transparent;
		transition: all 0.15s;
		white-space: nowrap;
	}
	.tab-active {
		background: rgba(34, 197, 94, 0.15);
		color: rgba(74, 222, 128, 0.95);
		font-weight: 600;
	}

	/* ── Main ── */
	.ib-main {
		flex: 1;
		padding: 16px 16px 60px;
		display: flex;
		flex-direction: column;
		gap: 0;
		max-width: 680px;
	}

	/* ── Loading / Error ── */
	.loading-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: 80px 20px;
	}
	.spinner {
		width: 36px;
		height: 36px;
		border: 3px solid rgba(34, 197, 94, 0.15);
		border-top-color: rgba(34, 197, 94, 0.7);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.loading-text {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.35);
		margin: 0;
	}
	.error-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
	}
	.error-text {
		color: rgba(248, 113, 113, 0.8);
		font-size: 14px;
		margin: 0;
	}
	.empty-wrap {
		padding: 40px 0;
		text-align: center;
	}
	.empty-text {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.25);
		margin: 0;
	}

	/* ── Tawaf counter ── */
	.tawaf-card {
		background: rgba(199, 162, 75, 0.07);
		border: 1px solid rgba(199, 162, 75, 0.2);
		border-radius: 16px;
		padding: 20px;
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.tawaf-label {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(199, 162, 75, 0.6);
	}
	.tawaf-count {
		font-size: 40px;
		font-weight: 700;
		color: #c7a24b;
		line-height: 1;
	}
	.tawaf-dots {
		display: flex;
		gap: 8px;
	}
	.tawaf-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: rgba(199, 162, 75, 0.2);
		border: 1px solid rgba(199, 162, 75, 0.3);
		transition: background 0.2s;
	}
	.dot-filled {
		background: #c7a24b;
		border-color: #c7a24b;
	}
	.tawaf-actions {
		display: flex;
		gap: 10px;
		width: 100%;
	}
	.tawaf-reset {
		flex: 1;
		padding: 10px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.5);
		font-size: 13px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.tawaf-reset:hover:not(:disabled) { background: rgba(255, 255, 255, 0.09); }
	.tawaf-reset:disabled { opacity: 0.35; cursor: not-allowed; }

	.tawaf-tap {
		flex: 2;
		padding: 10px;
		border-radius: 12px;
		background: rgba(199, 162, 75, 0.15);
		border: 1px solid rgba(199, 162, 75, 0.3);
		color: #c7a24b;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.tawaf-tap:hover:not(:disabled) { background: rgba(199, 162, 75, 0.25); }
	.tawaf-tap:disabled {
		background: rgba(34, 197, 94, 0.12);
		border-color: rgba(34, 197, 94, 0.25);
		color: rgba(74, 222, 128, 0.8);
		cursor: not-allowed;
	}
	.tawaf-done {
		font-size: 13px;
		color: rgba(74, 222, 128, 0.7);
		margin: 0;
		text-align: center;
	}

	/* ── Steps ── */
	.steps-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.step-card {
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 14px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.step-hdr {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.step-num {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 28px;
		height: 28px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 12px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
	}

	.flag-badge {
		padding: 3px 10px;
		border-radius: 20px;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.flag-rukun {
		background: rgba(199, 162, 75, 0.15);
		border: 1px solid rgba(199, 162, 75, 0.3);
		color: #c7a24b;
	}
	.flag-wajib {
		background: rgba(251, 146, 60, 0.12);
		border: 1px solid rgba(251, 146, 60, 0.25);
		color: rgba(251, 146, 60, 0.9);
	}
	.flag-sunat {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.35);
	}

	.step-ar {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 20px;
		line-height: 2.2;
		text-align: right;
		color: #e8e3d4;
		margin: 0;
		direction: rtl;
	}

	.step-desc {
		font-size: 14px;
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.65);
		margin: 0;
	}
</style>
