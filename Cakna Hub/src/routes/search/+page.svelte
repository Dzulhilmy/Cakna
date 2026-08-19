<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ChevronLeft, Search, X } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { SURAHS } from '$lib/quran/meta.ts';
	import { settings } from '$lib/state/stores.svelte';

	/**
	 * @typedef {{ global: number, surah: number, ayah: number, page: number, text: string }} SearchHit
	 */

	let query = $state('');
	let loading = $state(false);
	/** @type {SearchHit[]} */
	let hits = $state([]);
	let total = $state(0);
	let lastQuery = $state('');
	/** @type {ReturnType<typeof setTimeout>|null} */
	let debounceTimer = null;
	/** @type {HTMLInputElement|null} */
	let inputEl = null;

	const isArabic = $derived(/[؀-ۿ]/.test(query));
	const apiLang = $derived(isArabic ? 'ar' : settings.value.uiLang ?? 'ms');
	const hasResults = $derived(hits.length > 0);
	const searched = $derived(lastQuery.length >= 3);

	function clearInput() {
		query = '';
		hits = [];
		total = 0;
		lastQuery = '';
		inputEl?.focus();
	}

	async function doSearch(q) {
		if (q.length < 3) return;
		loading = true;
		try {
			const url = `/proxy/api/search?q=${encodeURIComponent(q)}&lang=${apiLang}&limit=60`;
			const res = await fetch(url);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			hits = data.hits ?? [];
			total = data.total ?? hits.length;
			lastQuery = q;
		} catch {
			hits = [];
			total = 0;
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		const q = query;
		if (debounceTimer) clearTimeout(debounceTimer);
		if (q.length < 3) {
			hits = [];
			total = 0;
			lastQuery = '';
			return;
		}
		debounceTimer = setTimeout(() => doSearch(q), 300);
	});

	onMount(() => {
		inputEl?.focus();
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});

	/**
	 * @param {number} surahNum
	 */
	function surahName(surahNum) {
		return SURAHS[surahNum - 1]?.name_translit ?? `Surah ${surahNum}`;
	}

	/**
	 * @param {SearchHit} hit
	 */
	function openAyah(hit) {
		goto('/mushaf?page=' + hit.page);
	}
</script>

<svelte:head><title>Cari Ayat — Cakna</title></svelte:head>

<div class="search-root">
	<header class="search-header">
		<a href="https://cakna.org/hub" class="hdr-btn" aria-label="Kembali">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Cari Ayat</span>
		</div>
		<span class="hdr-spacer"></span>
	</header>

	<!-- Search bar -->
	<div class="search-bar-wrap">
		<div class="search-input-wrap">
			<span class="search-icon-wrap">
				<Search size={16} />
			</span>
			<input
				bind:this={inputEl}
				bind:value={query}
				class="search-input"
				class:input-rtl={isArabic}
				type="search"
				placeholder={isArabic ? '…ابحث عن آية' : 'Taip kata kunci (min. 3 huruf)'}
				dir={isArabic ? 'rtl' : 'ltr'}
				autocomplete="off"
				spellcheck="false"
				aria-label="Cari ayat"
			/>
			{#if query.length > 0}
				<button class="clear-btn" onclick={clearInput} aria-label="Padam carian">
					<X size={15} />
				</button>
			{/if}
		</div>
	</div>

	<main class="search-main">
		<!-- Loading -->
		{#if loading}
			<div class="loading-wrap" aria-live="polite">
				<div class="spinner"></div>
				<span class="loading-text">Mencari…</span>
			</div>
		<!-- Results -->
		{:else if searched && hasResults}
			<p class="result-count" aria-live="polite">
				<strong>{total}</strong> keputusan untuk '<span class="result-query">{lastQuery}</span>'
			</p>
			<div class="hits-list">
				{#each hits as hit (hit.global)}
					<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
					<div
						class="hit-card"
						onclick={() => openAyah(hit)}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && openAyah(hit)}
						aria-label="{surahName(hit.surah)} ayat {hit.ayah}"
					>
						<div class="hit-meta">
							<span class="hit-surah">{surahName(hit.surah)}</span>
							<span class="hit-ref">{hit.surah}:{hit.ayah}</span>
						</div>
						<p
							class="hit-text"
							class:hit-rtl={isArabic}
							dir={isArabic ? 'rtl' : 'ltr'}
						>{hit.text}</p>
					</div>
				{/each}
			</div>
		<!-- No results -->
		{:else if searched && !hasResults}
			<div class="empty-state" aria-live="polite">
				<span class="empty-icon">🔍</span>
				<p class="empty-title">Tiada keputusan</p>
				<p class="empty-sub">Cuba kata kunci lain atau semak ejaan.</p>
			</div>
		<!-- Idle -->
		{:else if query.length > 0 && query.length < 3}
			<p class="hint-text" aria-live="polite">Taip sekurang-kurangnya 3 huruf untuk mencari.</p>
		{:else if query.length === 0}
			<div class="idle-state">
				<span class="idle-icon">📖</span>
				<p class="idle-text">Cari mana-mana ayat dalam Al-Quran</p>
			</div>
		{/if}
	</main>
</div>

<SideNav active="search" />

<style>
	.search-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: #070e14;
		color: #e2e8f0;
		padding-left: 76px;
	}

	/* ── Header ── */
	.search-header {
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
		justify-content: center;
	}
	.hdr-title {
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.75);
	}
	.hdr-spacer { width: 36px; flex-shrink: 0; }

	/* ── Search bar ── */
	.search-bar-wrap {
		padding: 14px 16px 10px;
		position: sticky;
		top: 57px;
		z-index: 10;
		background: rgba(7, 14, 20, 0.96);
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(8px);
	}
	.search-input-wrap {
		display: flex;
		align-items: center;
		gap: 0;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.09);
		transition: border-color 0.15s;
		overflow: hidden;
	}
	.search-input-wrap:focus-within {
		border-color: rgba(34, 197, 94, 0.35);
		background: rgba(255, 255, 255, 0.06);
	}
	.search-icon-wrap {
		padding: 0 10px 0 14px;
		color: rgba(255, 255, 255, 0.3);
		display: grid;
		place-items: center;
		flex-shrink: 0;
	}
	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: #e2e8f0;
		font-size: 15px;
		padding: 12px 0;
		line-height: 1.4;
		caret-color: rgba(34, 197, 94, 0.8);
	}
	.search-input::placeholder { color: rgba(255, 255, 255, 0.22); }
	.search-input::-webkit-search-cancel-button { display: none; }
	.input-rtl { font-family: 'Amiri Quran', 'Amiri', serif; font-size: 18px; }
	.clear-btn {
		padding: 0 14px;
		height: 100%;
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.3);
		cursor: pointer;
		display: grid;
		place-items: center;
		flex-shrink: 0;
		transition: color 0.15s;
	}
	.clear-btn:hover { color: rgba(255, 255, 255, 0.6); }

	/* ── Main ── */
	.search-main {
		flex: 1;
		padding: 16px 16px 40px;
	}

	/* ── Loading ── */
	.loading-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 40px 0;
		color: rgba(255, 255, 255, 0.35);
	}
	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(34, 197, 94, 0.15);
		border-top-color: rgba(34, 197, 94, 0.7);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.loading-text { font-size: 13px; }

	/* ── Result count ── */
	.result-count {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.35);
		margin-bottom: 12px;
	}
	.result-count strong { color: rgba(34, 197, 94, 0.8); }
	.result-query { color: rgba(255, 255, 255, 0.5); font-style: italic; }

	/* ── Hits ── */
	.hits-list { display: flex; flex-direction: column; gap: 8px; }
	.hit-card {
		padding: 14px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
	}
	.hit-card:hover {
		background: rgba(34, 197, 94, 0.05);
		border-color: rgba(34, 197, 94, 0.15);
	}
	.hit-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 7px;
	}
	.hit-surah {
		font-size: 12px;
		font-weight: 600;
		color: rgba(34, 197, 94, 0.75);
	}
	.hit-ref {
		font-size: 10px;
		font-weight: 600;
		padding: 2px 7px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.4);
	}
	.hit-text {
		font-size: 13px;
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
	}
	.hit-rtl {
		font-family: 'Amiri Quran', 'Amiri', serif;
		font-size: 18px;
		line-height: 1.8;
		text-align: right;
	}

	/* ── Empty state ── */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 60px 20px;
		text-align: center;
	}
	.empty-icon { font-size: 40px; }
	.empty-title {
		font-size: 15px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		margin: 0;
	}
	.empty-sub {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.25);
		margin: 0;
	}

	/* ── Idle ── */
	.idle-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 60px 20px;
	}
	.idle-icon { font-size: 40px; }
	.idle-text {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.25);
		text-align: center;
	}
	.hint-text {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.3);
		text-align: center;
		padding: 30px 0;
	}
</style>
