<script>
	import { onMount } from 'svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { settings } from '$lib/state/stores.svelte';

	let items = $state([]);
	let loading = $state(true);
	let error = $state('');
	let activeTab = $state('quran');

	// Lazy surah bundle cache: surah_number → Promise<{ayahs: AyahItem[]}>
	const surahCache = new Map();
	// Loaded surah data: surah_number → ayah array (once resolved)
	let surahData = $state({});

	const uiLang = $derived(settings.value.uiLang);
	const transLang = $derived(settings.value.transLang);
	const filtered = $derived(items.filter((d) => d.kind === activeTab));

	function getMeaning(d) {
		if (transLang === 'en') return d.meaning_en ?? '';
		return d.meaning_ms ?? '';
	}

	function getTitle(d) {
		return (uiLang === 'en' ? d.title_en : d.title_ms) ?? '';
	}

	function fmtRef(qr) {
		if (!qr) return '';
		const { surah, ayah_from, ayah_to } = qr;
		return ayah_from === ayah_to ? `${surah}:${ayah_from}` : `${surah}:${ayah_from}–${ayah_to}`;
	}

	async function loadSurah(n) {
		if (surahCache.has(n)) return surahCache.get(n);
		const p = fetch(`/proxy/api/surahs/${n}`)
			.then((r) => r.json())
			.then((bundle) => {
				surahData = { ...surahData, [n]: bundle.ayahs ?? [] };
				return bundle.ayahs ?? [];
			})
			.catch(() => {
				surahData = { ...surahData, [n]: [] };
				return [];
			});
		surahCache.set(n, p);
		return p;
	}

	onMount(async () => {
		try {
			const res = await fetch('/proxy/api/modules/duas');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			items = await res.json();
			// Pre-fetch all unique surahs referenced by quran-kind duas
			const surahs = [...new Set(
				items.filter((d) => d.kind === 'quran' && d.quran_ref?.surah)
					.map((d) => d.quran_ref.surah)
			)];
			await Promise.all(surahs.map(loadSurah));
		} catch {
			error = 'Gagal memuatkan doa. Sila cuba semula.';
		} finally {
			loading = false;
		}
	});

	function getAyahs(quran_ref) {
		if (!quran_ref) return [];
		const ayahs = surahData[quran_ref.surah] ?? [];
		return ayahs.slice(quran_ref.ayah_from - 1, quran_ref.ayah_to);
	}
</script>

<svelte:head><title>Doa Al-Quran — Cakna</title></svelte:head>

<div class="doa-root">
	<header class="doa-header">
		<a href="https://cakna.org/hub" class="hdr-btn" aria-label="Kembali">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Doa Al-Quran</span>
		</div>
		<span class="hdr-spacer"></span>
	</header>

	<div class="tabs-wrap">
		<button class="tab-btn" class:tab-active={activeTab === 'quran'} onclick={() => (activeTab = 'quran')}>
			Dari Al-Quran
		</button>
		<button class="tab-btn" class:tab-active={activeTab === 'hadith'} onclick={() => (activeTab = 'hadith')}>
			Dari Hadith
		</button>
	</div>

	<main class="doa-main">
		{#if loading}
			{#each Array.from({length: 4}) as _, i (i)}
				<div class="skeleton-card">
					<div class="skel-title"></div>
					<div class="skel-arabic"></div>
					<div class="skel-meaning"></div>
				</div>
			{/each}
		{:else if error}
			<p class="error-msg">{error}</p>
		{:else if filtered.length === 0}
			<p class="empty-msg">Tiada doa dalam kategori ini.</p>
		{:else}
			{#each filtered as dua (dua.position)}
				<article class="dua-card">
					<div class="dua-head">
						<h2 class="dua-title">{getTitle(dua)}</h2>
						{#if dua.quran_ref}
							<span class="ref-badge">{fmtRef(dua.quran_ref)}</span>
						{/if}
					</div>

					{#if dua.kind === 'quran' && dua.quran_ref}
						{@const ayahs = getAyahs(dua.quran_ref)}
						{#if ayahs.length === 0 && !surahData[dua.quran_ref.surah]}
							<div class="arabic-loading">Memuatkan ayat…</div>
						{:else if ayahs.length > 0}
							{#each ayahs as ayah (ayah.global)}
								<div class="arabic-wrap" dir="rtl">
									<p class="arabic-text">{ayah.ar}</p>
								</div>
								<p class="meaning-text">{ayah.tr?.[transLang] ?? ayah.tr?.ms ?? ''}</p>
							{/each}
						{/if}
					{:else if dua.arabic}
						<div class="arabic-wrap" dir="rtl">
							<p class="arabic-text">{dua.arabic}</p>
						</div>
						<p class="meaning-text">{getMeaning(dua)}</p>
					{/if}
				</article>
			{/each}
		{/if}
	</main>
</div>

<SideNav active="doa" />

<style>
	.doa-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
	}

	.doa-header {
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
	.hdr-center { flex: 1; display: flex; justify-content: center; }
	.hdr-title { font-size: 13px; font-weight: 600; color: var(--pg-text-75); }
	.hdr-spacer { width: 36px; flex-shrink: 0; }

	.tabs-wrap {
		display: flex;
		gap: 4px;
		padding: 10px 16px 0;
		border-bottom: 1px solid var(--pg-surface-b);
	}
	.tab-btn {
		flex: 1;
		padding: 8px 12px;
		border-radius: 10px 10px 0 0;
		background: transparent;
		border: none;
		color: var(--pg-muted);
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: color 0.15s;
		border-bottom: 2px solid transparent;
	}
	.tab-active {
		color: rgba(34, 197, 94, 0.9);
		border-bottom-color: rgba(34, 197, 94, 0.6);
		background: rgba(34, 197, 94, 0.05);
	}

	.doa-main {
		padding: 16px 16px 40px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.skeleton-card {
		padding: 18px;
		border-radius: 16px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.skel-title { height: 14px; width: 55%; border-radius: 4px; background: var(--pg-surface-b); animation: pulse 1.4s ease-in-out infinite; }
	.skel-arabic { height: 30px; border-radius: 4px; background: var(--pg-surface-b); animation: pulse 1.4s ease-in-out infinite; }
	.skel-meaning { height: 12px; width: 80%; border-radius: 4px; background: var(--pg-surface); animation: pulse 1.4s ease-in-out infinite; }
	@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

	.dua-card {
		padding: 18px;
		border-radius: 16px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
	}
	.dua-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 14px;
	}
	.dua-title { font-size: 13px; font-weight: 600; color: var(--pg-text-85); margin: 0; }
	.ref-badge {
		flex-shrink: 0;
		padding: 3px 8px;
		border-radius: 6px;
		background: rgba(199,162,75,0.12);
		border: 1px solid rgba(199,162,75,0.25);
		font-size: 10px;
		font-weight: 600;
		color: #c7a24b;
		white-space: nowrap;
	}

	.arabic-wrap {
		font-family: 'Amiri Quran', 'Amiri', serif;
		font-size: 22px;
		line-height: 2;
		color: var(--pg-fg);
		text-align: right;
		margin-bottom: 10px;
		padding: 12px 14px;
		background: var(--pg-surface);
		border-radius: 10px;
		border: 1px solid var(--pg-surface-b);
	}
	.arabic-text { margin: 0; }
	.arabic-loading { font-size: 12px; color: var(--pg-subtle); margin-bottom: 10px; font-style: italic; }

	.meaning-text {
		font-size: 13px;
		line-height: 1.65;
		color: var(--pg-muted);
		margin: 0 0 10px;
	}
	.meaning-text:last-child { margin-bottom: 0; }

	.error-msg, .empty-msg { text-align: center; color: #f87171; font-size: 13px; padding: 40px 0; }
	.empty-msg { color: var(--pg-subtle); }
</style>
