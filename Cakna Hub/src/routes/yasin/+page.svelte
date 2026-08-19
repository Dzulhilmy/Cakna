<script>
	import { onMount } from 'svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { settings } from '$lib/state/stores.svelte';

	let loading = $state(true);
	let fetchError = $state('');
	let ayahs = $state([]);
	let surahInfo = $state(null);
	let yasinDoc = $state(null);
	let showAudioMsg = $state(false);

	const transLang = $derived(settings.value.transLang ?? 'ms');

	async function loadData() {
		loading = true;
		fetchError = '';
		try {
			const [r1, r2] = await Promise.all([
				fetch('/proxy/api/surahs/36'),
				fetch('/proxy/api/modules/yasin')
			]);
			if (!r1.ok) throw new Error(`HTTP ${r1.status}`);
			const d1 = await r1.json();
			surahInfo = d1.surah ?? null;
			ayahs = d1.ayahs ?? [];
			if (r2.ok) yasinDoc = await r2.json();
		} catch (e) {
			fetchError = e instanceof Error ? e.message : 'Ralat tidak diketahui';
		} finally {
			loading = false;
		}
	}

	onMount(() => { loadData(); });

	function getTranslation(tr) {
		if (!tr) return '';
		return tr[transLang] ?? tr.ms ?? tr.en ?? tr.id ?? '';
	}

	function getClosingItems() {
		if (!yasinDoc) return [];
		if (Array.isArray(yasinDoc)) return yasinDoc;
		if (Array.isArray(yasinDoc.adhkar)) return yasinDoc.adhkar;
		if (Array.isArray(yasinDoc.closing)) return yasinDoc.closing;
		if (yasinDoc.dua) return [yasinDoc.dua];
		return [];
	}
</script>

<svelte:head><title>Surah Yasin — Cakna</title></svelte:head>

<div class="ys-root">
	<!-- Header -->
	<header class="ys-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Surah Yasin</span>
			{#if ayahs.length}
				<span class="hdr-sub">{ayahs.length} Ayat</span>
			{/if}
		</div>
		<button
			class="play-all-btn"
			onclick={() => (showAudioMsg = !showAudioMsg)}
			aria-label="Main Semua"
		>
			Main Semua
		</button>
	</header>

	<!-- Audio notice -->
	{#if showAudioMsg}
		<div class="audio-notice" role="alert">
			Sila guna aplikasi Cakna untuk bacaan audio
		</div>
	{/if}

	<main class="ys-main">
		{#if loading}
			<div class="loading-wrap">
				<div class="spinner" aria-label="Memuatkan…"></div>
				<p class="loading-text">Memuatkan Surah Yasin…</p>
			</div>
		{:else if fetchError}
			<div class="error-wrap">
				<p class="error-text">Ralat: {fetchError}</p>
				<button class="retry-btn" onclick={loadData}>
					Cuba Semula
				</button>
			</div>
		{:else}
			<!-- Surah header card -->
			<div class="surah-card">
				<div class="surah-name-ar">سُورَةُ يٰسٓ</div>
				<div class="surah-name-latin">36. Yasin</div>
				<div class="surah-meta-row">
					{#if surahInfo}
						<span class="meta-pill">{surahInfo.type === 'Meccan' ? 'Makkiyah' : surahInfo.type === 'Medinan' ? 'Madaniyah' : (surahInfo.type ?? 'Makkiyah')}</span>
					{:else}
						<span class="meta-pill">Makkiyah</span>
					{/if}
					<span class="meta-pill">{ayahs.length || 83} Ayat</span>
				</div>
				<p class="bismillah" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
			</div>

			<!-- Ayahs list -->
			<div class="ayahs-wrap">
				{#each ayahs as item (item.global ?? `${item.surah}-${item.ayah}`)}
					<div class="ayah-row">
						<div class="ayah-num-col">
							<span class="ayah-num">{item.ayah}</span>
						</div>
						<div class="ayah-body">
							<p class="ayah-ar" dir="rtl">
								{#if item.tajweed}
									{@html item.tajweed}
								{:else}
									{item.ar ?? ''}
								{/if}
							</p>
							{#if item.tr}
								<p class="ayah-trans">{getTranslation(item.tr)}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<!-- Closing dua / adhkar -->
			{#if yasinDoc}
				{@const closingItems = getClosingItems()}
				{#if closingItems.length}
					<div class="closing-section">
						<div class="section-divider">
							<span class="divider-label">Doa &amp; Adhkar Penutup</span>
						</div>
						{#each closingItems as item, i (i)}
							<div class="dua-card">
								{#if item.title_ms || item.title}
									<p class="dua-title">{item.title_ms ?? item.title ?? ''}</p>
								{/if}
								{#if item.ar}
									<p class="dua-ar" dir="rtl">{item.ar}</p>
								{/if}
								{#if item.ms || item.en || item.id}
									<p class="dua-trans">{getTranslation(item)}</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		{/if}
	</main>
</div>

<SideNav active="yasin" />

<style>
	.ys-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: #070e14;
		color: #e2e8f0;
		padding-left: 76px;
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* ── Header ── */
	.ys-header {
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
		color: rgba(34, 197, 94, 0.7);
	}

	.play-all-btn {
		padding: 7px 14px;
		border-radius: 10px;
		background: rgba(199, 162, 75, 0.12);
		border: 1px solid rgba(199, 162, 75, 0.25);
		color: #c7a24b;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.play-all-btn:hover { background: rgba(199, 162, 75, 0.2); }

	/* ── Audio notice ── */
	.audio-notice {
		padding: 10px 20px;
		background: rgba(199, 162, 75, 0.1);
		border-bottom: 1px solid rgba(199, 162, 75, 0.2);
		color: #c7a24b;
		font-size: 13px;
		text-align: center;
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
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: 60px 20px;
	}
	.error-text {
		color: rgba(248, 113, 113, 0.8);
		font-size: 14px;
		margin: 0;
	}
	.retry-btn {
		padding: 8px 20px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.6);
		font-size: 13px;
		cursor: pointer;
	}

	/* ── Main ── */
	.ys-main {
		flex: 1;
		padding: 0 0 60px;
	}

	/* ── Surah header card ── */
	.surah-card {
		margin: 20px 16px 24px;
		padding: 28px 20px;
		background: linear-gradient(135deg, rgba(199, 162, 75, 0.08) 0%, rgba(34, 197, 94, 0.05) 100%);
		border: 1px solid rgba(199, 162, 75, 0.2);
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.surah-name-ar {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 32px;
		color: #c7a24b;
		direction: rtl;
		line-height: 1.8;
	}
	.surah-name-latin {
		font-size: 15px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.7);
	}
	.surah-meta-row {
		display: flex;
		gap: 8px;
		margin-top: 4px;
	}
	.meta-pill {
		padding: 3px 10px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 11px;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 500;
	}
	.bismillah {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 22px;
		color: rgba(226, 232, 240, 0.7);
		margin: 8px 0 0;
		direction: rtl;
		line-height: 2;
	}

	/* ── Ayahs ── */
	.ayahs-wrap {
		padding: 0 16px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.ayah-row {
		display: flex;
		gap: 12px;
		padding: 20px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	}
	.ayah-row:last-child { border-bottom: none; }

	.ayah-num-col {
		flex-shrink: 0;
		padding-top: 4px;
	}
	.ayah-num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: rgba(199, 162, 75, 0.12);
		border: 1px solid rgba(199, 162, 75, 0.3);
		color: #c7a24b;
		font-size: 11px;
		font-weight: 600;
	}

	.ayah-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 0;
	}
	.ayah-ar {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 24px;
		line-height: 2.2;
		text-align: right;
		color: #e8e3d4;
		margin: 0;
		word-break: break-word;
	}
	.ayah-trans {
		font-size: 14px;
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.42);
		margin: 0;
	}

	/* ── Closing dua ── */
	.closing-section {
		padding: 24px 16px 20px;
	}
	.section-divider {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 20px;
	}
	.section-divider::before,
	.section-divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: rgba(199, 162, 75, 0.2);
	}
	.divider-label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(199, 162, 75, 0.6);
		white-space: nowrap;
	}
	.dua-card {
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 14px;
		padding: 20px 16px;
		margin-bottom: 12px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.dua-title {
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: rgba(199, 162, 75, 0.7);
		margin: 0;
	}
	.dua-ar {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 20px;
		line-height: 2.2;
		text-align: right;
		color: #e8e3d4;
		margin: 0;
		direction: rtl;
	}
	.dua-trans {
		font-size: 13px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.4);
		margin: 0;
	}
</style>
