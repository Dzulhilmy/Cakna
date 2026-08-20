<script>
	import { ChevronLeft } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import {
		zakatIncome,
		zakatSavings,
		zakatGold,
		fmtRM,
		NISAB_GRAMS,
		DEFAULT_GOLD_PRICE
	} from '$lib/utils/zakat';

	let activeTab = $state('pendapatan'); // 'pendapatan' | 'simpanan' | 'emas'

	// Shared
	let goldPrice = $state(DEFAULT_GOLD_PRICE);

	// Pendapatan (Income)
	let monthlyIncome = $state('');

	// Simpanan (Savings)
	let savings = $state('');

	// Emas (Gold)
	let goldGrams = $state('');

	// Derived results
	const incomeResult = $derived(
		monthlyIncome !== '' && Number(monthlyIncome) >= 0
			? zakatIncome(Number(monthlyIncome), goldPrice)
			: null
	);

	const savingsResult = $derived(
		savings !== '' && Number(savings) >= 0
			? zakatSavings(Number(savings), goldPrice)
			: null
	);

	const goldResult = $derived(
		goldGrams !== '' && Number(goldGrams) >= 0
			? zakatGold(Number(goldGrams), goldPrice)
			: null
	);

	const nisabValue = $derived(NISAB_GRAMS * goldPrice);

	const TABS = [
		{ id: 'pendapatan', label: 'Pendapatan' },
		{ id: 'simpanan', label: 'Simpanan' },
		{ id: 'emas', label: 'Emas' }
	];
</script>

<svelte:head><title>Kalkulator Zakat — Cakna</title></svelte:head>

<div class="zk-root">
	<header class="zk-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Kalkulator Zakat</span>
			<span class="hdr-sub">Nisab: {fmtRM(nisabValue)}</span>
		</div>
		<div style="width:36px;"></div>
	</header>

	<!-- Tabs -->
	<div class="tabs-row">
		{#each TABS as tab}
			<button
				class="tab"
				class:tab-active={activeTab === tab.id}
				onclick={() => (activeTab = tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<main class="zk-main">
		<!-- Gold price (always shown) -->
		<div class="field-group">
			<label class="field-label" for="gold-price">Harga Emas (RM/gram)</label>
			<div class="input-wrap">
				<span class="input-prefix">RM</span>
				<input
					id="gold-price"
					class="field-input"
					type="number"
					min="1"
					step="1"
					bind:value={goldPrice}
					placeholder={String(DEFAULT_GOLD_PRICE)}
				/>
			</div>
			<p class="field-hint">Paras nisab semasa: {fmtRM(nisabValue)} ({NISAB_GRAMS}g × RM{goldPrice}/g)</p>
		</div>

		<!-- Pendapatan tab -->
		{#if activeTab === 'pendapatan'}
			<div class="field-group">
				<label class="field-label" for="monthly-income">Pendapatan Bulanan (RM)</label>
				<div class="input-wrap">
					<span class="input-prefix">RM</span>
					<input
						id="monthly-income"
						class="field-input"
						type="number"
						min="0"
						step="100"
						bind:value={monthlyIncome}
						placeholder="cth: 5000"
					/>
				</div>
				<p class="field-hint">Zakat dikira atas pendapatan setahun (× 12)</p>
			</div>

			{#if incomeResult}
				<div class="result-card" class:result-wajib={incomeResult.due !== null} class:result-tidak={incomeResult.due === null}>
					{#if incomeResult.due !== null}
						<p class="result-label">Wajib zakat</p>
						<p class="result-amount">{fmtRM(incomeResult.due)}</p>
						<p class="result-sub">setahun · {fmtRM(incomeResult.monthly ?? 0)} sebulan</p>
					{:else}
						<p class="result-label">Tidak wajib zakat</p>
						<p class="result-sub">Pendapatan tahunan di bawah nisab {fmtRM(incomeResult.nisab)}</p>
					{/if}
				</div>
			{/if}

		<!-- Simpanan tab -->
		{:else if activeTab === 'simpanan'}
			<div class="field-group">
				<label class="field-label" for="savings">Jumlah Simpanan (RM)</label>
				<div class="input-wrap">
					<span class="input-prefix">RM</span>
					<input
						id="savings"
						class="field-input"
						type="number"
						min="0"
						step="100"
						bind:value={savings}
						placeholder="cth: 20000"
					/>
				</div>
				<p class="field-hint">Simpanan haul penuh (≥ 1 tahun)</p>
			</div>

			{#if savingsResult}
				<div class="result-card" class:result-wajib={savingsResult.due !== null} class:result-tidak={savingsResult.due === null}>
					{#if savingsResult.due !== null}
						<p class="result-label">Wajib zakat</p>
						<p class="result-amount">{fmtRM(savingsResult.due)}</p>
						<p class="result-sub">2.5% daripada simpanan</p>
					{:else}
						<p class="result-label">Tidak wajib zakat</p>
						<p class="result-sub">Simpanan di bawah nisab {fmtRM(savingsResult.nisab)}</p>
					{/if}
				</div>
			{/if}

		<!-- Emas tab -->
		{:else if activeTab === 'emas'}
			<div class="field-group">
				<label class="field-label" for="gold-grams">Berat Emas (gram)</label>
				<div class="input-wrap">
					<span class="input-prefix">g</span>
					<input
						id="gold-grams"
						class="field-input"
						type="number"
						min="0"
						step="1"
						bind:value={goldGrams}
						placeholder="cth: 100"
					/>
				</div>
				<p class="field-hint">Nisab emas: {NISAB_GRAMS} gram</p>
			</div>

			{#if goldResult}
				<div class="result-card" class:result-wajib={goldResult.due !== null} class:result-tidak={goldResult.due === null}>
					{#if goldResult.due !== null}
						<p class="result-label">Wajib zakat</p>
						<p class="result-amount">{fmtRM(goldResult.due)}</p>
						<p class="result-sub">2.5% × {goldGrams}g × RM{goldPrice}/g</p>
					{:else}
						<p class="result-label">Tidak wajib zakat</p>
						<p class="result-sub">Berat emas di bawah {NISAB_GRAMS} gram</p>
					{/if}
				</div>
			{/if}
		{/if}

		<!-- Kadar info -->
		<div class="info-box">
			<p class="info-text">Kadar zakat: 2.5% · Nisab: {NISAB_GRAMS}g emas (85 miskal)</p>
		</div>
	</main>
</div>

<SideNav active="zakat" />

<style>
	.zk-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.zk-header {
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
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		color: var(--pg-btn-color);
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s;
	}
	.hdr-btn:hover {
		background: var(--pg-btn-hover);
	}

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
	.hdr-sub {
		font-size: 11px;
		color: rgba(34, 197, 94, 0.6);
	}

	.tabs-row {
		display: flex;
		gap: 4px;
		padding: 10px 16px;
		background: rgba(255, 255, 255, 0.02);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.tab {
		flex: 1;
		padding: 8px 4px;
		border-radius: 10px;
		font-size: 13px;
		color: var(--pg-muted);
		cursor: pointer;
		border: none;
		background: transparent;
		transition: all 0.15s;
	}
	.tab-active {
		background: rgba(34, 197, 94, 0.15);
		color: rgba(74, 222, 128, 0.95);
		font-weight: 600;
	}

	.zk-main {
		flex: 1;
		padding: 24px 20px 60px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 480px;
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.field-label {
		font-size: 12px;
		font-weight: 600;
		color: var(--pg-btn-color);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.input-wrap {
		display: flex;
		align-items: center;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		border-radius: 12px;
		overflow: hidden;
		transition: border-color 0.15s;
	}
	.input-wrap:focus-within {
		border-color: rgba(34, 197, 94, 0.3);
	}

	.input-prefix {
		padding: 0 12px;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.3);
		border-right: 1px solid var(--pg-surface-b);
		white-space: nowrap;
	}

	.field-input {
		flex: 1;
		padding: 12px 14px;
		background: transparent;
		border: none;
		color: var(--pg-fg);
		font-size: 16px;
		outline: none;
	}
	.field-input::placeholder {
		color: var(--pg-faint);
	}

	.field-hint {
		font-size: 11px;
		color: var(--pg-subtle);
		margin: 0;
	}

	.result-card {
		border-radius: 16px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.result-wajib {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.2);
	}
	.result-tidak {
		background: var(--pg-surface);
		border: 1px solid var(--pg-btn-border);
	}

	.result-label {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin: 0;
	}
	.result-wajib .result-label {
		color: rgba(74, 222, 128, 0.8);
	}
	.result-tidak .result-label {
		color: rgba(255, 255, 255, 0.35);
	}

	.result-amount {
		font-size: 28px;
		font-weight: 700;
		color: var(--pg-fg);
		margin: 4px 0 0;
	}

	.result-sub {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.35);
		margin: 0;
	}

	.info-box {
		margin-top: auto;
		padding: 12px 16px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 12px;
	}
	.info-text {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.2);
		margin: 0;
		text-align: center;
	}
</style>
