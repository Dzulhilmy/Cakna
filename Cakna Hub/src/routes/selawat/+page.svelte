<script>
	import { ChevronLeft } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { SELAWAT_NABI } from '$lib/data/selawat-data';
	import { settings } from '$lib/state/stores.svelte';

	let lang = $derived(settings.value.uiLang === 'en' ? 'en' : 'ms');

	function toggleLang() {
		settings.value = { ...settings.value, uiLang: settings.value.uiLang === 'en' ? 'ms' : 'en' };
	}

	const openingRefrain = SELAWAT_NABI[0];
	const displayList = (() => {
		const out = [];
		let baitCount = 0;
		const visible = SELAWAT_NABI.filter((b) => b.id <= 10 || b.id >= 19);

		for (let i = 0; i < visible.length; i++) {
			const bait = visible[i];
			out.push({ ...bait, key: String(bait.id) });

			if (bait.jenis === 'bait') {
				baitCount++;
				if (baitCount % 2 === 0 && visible[i + 1]?.jenis === 'bait') {
					out.push({ ...openingRefrain, key: `chorus-${baitCount}a` });
					out.push({ ...openingRefrain, key: `chorus-${baitCount}b` });
				}
			}
		}

		return out;
	})();
</script>

<svelte:head><title>Selawat Nabi — Cakna</title></svelte:head>

<div class="sl-root">
	<header class="sl-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Selawat Nabi</span>
			<span class="hdr-sub">Selawat Ashraqal Badr</span>
		</div>
		<button class="lang-btn" onclick={toggleLang} aria-label="Toggle language">
			{settings.value.uiLang === 'en' ? 'EN' : 'MS'}
		</button>
	</header>

	<main class="sl-main">
		<div class="sl-intro">
			<p class="sl-eyebrow">Cakna · Selawat</p>
			<h1 class="sl-arab-title">صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ</h1>
			<p class="sl-sub-text">Ashraqal Badr · 21 rangkap</p>
		</div>

		<div class="sl-senarai">
			{#each displayList as bait (bait.key)}
				<div
					class="bait-card"
					class:card-ulang={bait.jenis === 'ulang'}
					class:card-penutup={bait.jenis === 'penutup'}
				>
					{#each bait.baris as baris}
						<div class="baris-wrap">
							<p class="ar-text" dir="rtl">{baris.ar}</p>
							<p class="trans-text">{lang === 'en' ? baris.en : baris.ms}</p>
						</div>
					{/each}
				</div>
			{/each}
		</div>

		<p class="sl-nota">
			{lang === 'en'
				? 'Recite with sincerity and love for the Prophet ﷺ'
				: 'Bacalah dengan tulus dan kasih sayang kepada Nabi ﷺ'}
		</p>
	</main>
</div>

<SideNav active="selawat" />

<style>
	.sl-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.sl-header {
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

	.lang-btn {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: rgba(199, 162, 75, 0.12);
		border: 1px solid rgba(199, 162, 75, 0.2);
		color: #c7a24b;
		font-size: 11px;
		font-weight: 700;
		cursor: pointer;
		letter-spacing: 0.05em;
		transition: background 0.15s;
	}
	.lang-btn:hover {
		background: rgba(199, 162, 75, 0.2);
	}

	.sl-main {
		flex: 1;
		overflow-y: auto;
		padding-bottom: 40px;
	}

	.sl-intro {
		text-align: center;
		padding: 28px 24px 16px;
	}
	.sl-eyebrow {
		letter-spacing: 0.22em;
		font-size: 11px;
		font-weight: 600;
		color: #c7a24b;
		text-transform: uppercase;
		margin: 0 0 14px;
	}
	.sl-arab-title {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		direction: rtl;
		font-size: 26px;
		color: rgba(34, 197, 94, 0.7);
		margin: 0 0 10px;
		font-weight: 400;
		line-height: 2;
	}
	.sl-sub-text {
		font-size: 13px;
		color: var(--pg-muted);
		margin: 0;
	}

	.sl-senarai {
		max-width: 600px;
		margin: 0 auto;
		padding: 16px 16px 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.bait-card {
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		border-radius: 16px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.card-ulang {
		background: rgba(199, 162, 75, 0.07);
		border-color: rgba(199, 162, 75, 0.15);
	}
	.card-penutup {
		background: rgba(34, 197, 94, 0.05);
		border-color: rgba(34, 197, 94, 0.12);
		text-align: center;
	}

	.baris-wrap {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.ar-text {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 22px;
		line-height: 2.2;
		text-align: right;
		color: var(--pg-fg);
		margin: 0;
	}
	.card-ulang .ar-text {
		color: #c7a24b;
		font-size: 21px;
	}
	.card-penutup .ar-text {
		text-align: center;
		font-size: 24px;
		color: rgba(34, 197, 94, 0.8);
	}

	.trans-text {
		font-size: 13px;
		line-height: 1.6;
		color: var(--pg-muted);
		margin: 0;
	}
	.card-ulang .trans-text {
		font-style: italic;
		color: rgba(199, 162, 75, 0.6);
	}
	.card-penutup .trans-text {
		text-align: center;
		color: rgba(34, 197, 94, 0.55);
	}

	.sl-nota {
		max-width: 480px;
		margin: 20px auto 0;
		padding: 0 20px;
		text-align: center;
		font-size: 12px;
		color: var(--pg-subtle);
		line-height: 1.8;
	}
</style>
