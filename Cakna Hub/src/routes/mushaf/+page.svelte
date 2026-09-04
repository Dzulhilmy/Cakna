<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import MushafPage from '$lib/components/mushaf/MushafPage.svelte';
	import TranslationBar from '$lib/components/mushaf/TranslationBar.svelte';
	import MiniPlayer from '$lib/components/chrome/MiniPlayer.svelte';
	import AudioPlayer from '$lib/components/mushaf/AudioPlayer.svelte';
	import { getPage, prefetchPage } from '$lib/api/content';
	import type { PageBundle } from '$lib/api/types';
	import { QARIS } from '$lib/quran/tajweed';
	import { SURAHS, TOTAL_PAGES, gToSA } from '$lib/quran/meta';
	import { settings } from '$lib/state/stores.svelte';
	import { player } from '$lib/state/player.svelte';
	import { Toaster } from 'svelte-sonner';
	import { ChevronLeft, ChevronRight, Settings, X, BookOpen } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';

	let bundle = $state<PageBundle | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let showSettings = $state(false);
	let actionG = $state<number | null>(null);

	const currentPage = $derived(Number(page.url.searchParams.get('page') || settings.value.page || 1));

	async function loadPage(p: number) {
		loading = true;
		error = null;
		try {
			bundle = await getPage(p);
			settings.value.page = p;
			prefetchPage(p + 1);
		} catch (e) {
			error = 'Gagal memuatkan halaman. Semak sambungan internet anda.';
		} finally {
			loading = false;
		}
	}

	function navigate(delta: number) {
		const next = Math.max(1, Math.min(TOTAL_PAGES, currentPage + delta));
		if (next !== currentPage) goto(`/mushaf?page=${next}`);
	}

	$effect(() => {
		void currentPage;
		loadPage(currentPage);
	});

	onMount(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') navigate(-1);
			if (e.key === 'ArrowLeft') navigate(1);
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	});

	// ayah actions (simplified — no shadcn Drawer needed)
	function openActions(g: number) { actionG = g; }

	const actionAyah = $derived(
		actionG !== null && bundle
			? bundle.ayahs.find((a) => a.global === actionG) ?? null
			: null
	);

	function copyAyah() {
		if (!actionAyah) return;
		navigator.clipboard.writeText(actionAyah.ar + '\n' + actionAyah.tr[settings.value.transLang]);
		actionG = null;
	}
</script>

<svelte:head><title>Mushaf Digital — Cakna</title></svelte:head>

<Toaster richColors position="top-center" />

<div class="mushaf-root" style="--arabic-size: {settings.value.fontSize}px;">
	<!-- Top bar -->
	<header class="mushaf-header">
		<a href="https://cakna.org/hub" class="back-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="header-center">
			{#if bundle}
				<span class="page-label">Halaman {currentPage}</span>
				{#if bundle.surahs.length > 0}
					<span class="surah-label">{bundle.surahs.map(s => s.name_translit).join(' · ')}</span>
				{/if}
			{:else}
				<span class="page-label">Mushaf Digital</span>
			{/if}
		</div>
		<button class="icon-btn" onclick={() => (showSettings = !showSettings)} aria-label="Tetapan">
			<Settings size={18} />
		</button>
	</header>

	<!-- Page content -->
	<main class="mushaf-main">
		{#if loading}
			<div class="state-box">
				<div class="spinner"></div>
				<p class="mt-3 text-sm text-white/40">Memuatkan halaman {currentPage}…</p>
			</div>
		{:else if error}
			<div class="state-box">
				<p class="text-sm text-red-400">{error}</p>
				<button class="retry-btn mt-3" onclick={() => loadPage(currentPage)}>Cuba semula</button>
			</div>
		{:else if bundle}
			<MushafPage {bundle} onactions={openActions} />
			<TranslationBar {bundle} />
		{/if}
	</main>

	<!-- Page nav -->
	<nav class="page-nav">
		<button class="nav-btn" onclick={() => navigate(1)} disabled={currentPage >= TOTAL_PAGES} aria-label="Halaman sebelumnya">
			<ChevronRight size={20} />
		</button>
		<span class="nav-label">{currentPage} / {TOTAL_PAGES}</span>
		<button class="nav-btn" onclick={() => navigate(-1)} disabled={currentPage <= 1} aria-label="Halaman seterusnya">
			<ChevronLeft size={20} />
		</button>
	</nav>

	<SideNav active="mushaf" />

	<!-- Audio player — fixed above page-nav, mushaf-only -->
	<AudioPlayer {currentPage} />

	<!-- Mini player (visible outside /mushaf only) -->
	<MiniPlayer />

	<!-- Ayah Actions Sheet -->
	{#if actionG !== null && actionAyah}
		<div class="sheet-backdrop" onclick={() => (actionG = null)} role="dialog" aria-modal="true">
			<div class="sheet-panel" onclick={(e) => e.stopPropagation()}>
				<div class="sheet-handle"></div>
				<div class="sheet-header">
					<span class="sheet-ref">{actionAyah.surah}:{actionAyah.ayah}</span>
					<button onclick={() => (actionG = null)}><X size={16} /></button>
				</div>
				<p class="sheet-ar" dir="rtl">{actionAyah.ar}</p>
				<p class="sheet-tr">{actionAyah.tr[settings.value.transLang]}</p>
				<div class="sheet-actions">
					<button class="sheet-btn" onclick={() => { player.toggle(actionAyah!.global); actionG = null; }}>
						{player.playingG === actionAyah.global ? 'Berhenti' : 'Main'}
					</button>
					<button class="sheet-btn" onclick={copyAyah}>Salin</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Settings Panel -->
	{#if showSettings}
		<div class="sheet-backdrop" onclick={() => (showSettings = false)} role="dialog" aria-modal="true">
			<div class="sheet-panel settings-panel" onclick={(e) => e.stopPropagation()}>
				<div class="sheet-handle"></div>
				<div class="sheet-header">
					<span class="text-sm font-semibold text-white/80">Tetapan Mushaf</span>
					<button onclick={() => (showSettings = false)}><X size={16} /></button>
				</div>

				<div class="setting-row">
					<label class="setting-label">Saiz Huruf</label>
					<div class="flex items-center gap-3">
						<span class="text-xs text-white/40">A</span>
						<input type="range" min="20" max="52" step="2" bind:value={settings.value.fontSize} class="range-input flex-1" />
						<span class="text-lg text-white/80">A</span>
					</div>
				</div>

				<div class="setting-row">
					<label class="setting-label">Qari</label>
					<select class="setting-select" bind:value={settings.value.qari}>
						{#each QARIS as q (q.id)}
							<option value={q.id}>{q.name}</option>
						{/each}
					</select>
				</div>

				<div class="setting-row">
					<label class="setting-label">Terjemahan</label>
					<select class="setting-select" bind:value={settings.value.transLang}>
						<option value="ms">Bahasa Melayu</option>
						<option value="en">English</option>
						<option value="id">Indonesia</option>
					</select>
				</div>

				<div class="setting-row">
					<label class="setting-label">Tajwid</label>
					<button class="toggle-btn" class:active={settings.value.tajweed} onclick={() => (settings.value.tajweed = !settings.value.tajweed)}>
						{settings.value.tajweed ? 'Hidup' : 'Mati'}
					</button>
				</div>

				<div class="setting-row">
					<label class="setting-label">Terjemahan Sebaris</label>
					<button class="toggle-btn" class:active={settings.value.inlineTrans} onclick={() => (settings.value.inlineTrans = !settings.value.inlineTrans)}>
						{settings.value.inlineTrans ? 'Hidup' : 'Mati'}
					</button>
				</div>

				<div class="setting-row">
					<label class="setting-label">Mod Hafazan</label>
					<button class="toggle-btn" class:active={settings.value.hideMode} onclick={() => (settings.value.hideMode = !settings.value.hideMode)}>
						{settings.value.hideMode ? 'Hidup' : 'Mati'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.mushaf-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
	}

	.mushaf-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--pg-hdr);
		border-bottom: 1px solid rgba(199, 162, 75, 0.15);
		backdrop-filter: blur(8px);
	}

	.back-btn, .icon-btn {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-btn-color);
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s;
	}
	.back-btn:hover, .icon-btn:hover { background: var(--pg-btn-hover); }

	.header-center {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.page-label { font-size: 13px; font-weight: 600; color: var(--pg-text-75); }
	.surah-label { font-size: 11px; color: rgba(199,162,75,0.7); margin-top: 1px; }

	.mushaf-main {
		flex: 1;
		padding: 20px 16px 200px;
		overflow-y: auto;
	}

	.state-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 40vh;
	}
	.spinner {
		width: 32px; height: 32px;
		border: 2px solid var(--pg-surface-b);
		border-top-color: #c7a24b;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.retry-btn {
		padding: 8px 18px;
		border-radius: 10px;
		background: rgba(199,162,75,0.15);
		color: #c7a24b;
		border: 1px solid rgba(199,162,75,0.3);
		cursor: pointer;
		font-size: 13px;
	}

	.page-nav {
		position: fixed;
		bottom: 0;
		left: 76px; right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 20px 20px;
		background: var(--pg-hdr);
		border-top: 1px solid rgba(199, 162, 75, 0.12);
		backdrop-filter: blur(8px);
	}
	.nav-btn {
		display: grid;
		place-items: center;
		width: 44px; height: 44px;
		border-radius: 12px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-btn-color);
		cursor: pointer;
		transition: background 0.15s;
	}
	.nav-btn:hover:not(:disabled) { background: var(--pg-btn-hover); color: white; }
	.nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
	.nav-label { font-size: 13px; color: var(--pg-muted); letter-spacing: 0.05em; }

	/* Sheets */
	.sheet-backdrop {
		position: fixed;
		inset: 0;
		z-index: 50;
		background: rgba(0,0,0,0.6);
		display: flex;
		align-items: flex-end;
	}
	.sheet-panel {
		width: 100%;
		max-height: 75dvh;
		overflow-y: auto;
		background: #152010;
		border-top: 1px solid rgba(199,162,75,0.2);
		border-radius: 20px 20px 0 0;
		padding: 12px 20px 32px;
	}
	.settings-panel { max-height: 85dvh; }
	.sheet-handle {
		width: 36px; height: 4px;
		background: var(--pg-btn-hover);
		border-radius: 2px;
		margin: 0 auto 16px;
	}
	.sheet-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
		color: var(--pg-btn-color);
	}
	.sheet-ref { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; color: #c7a24b; }
	.sheet-ar {
		font-family: var(--font-arabic, 'Amiri Quran', serif);
		font-size: 22px;
		line-height: 2;
		color: var(--pg-text-85);
		margin-bottom: 8px;
	}
	.sheet-tr { font-size: 14px; line-height: 1.6; color: var(--pg-btn-color); margin-bottom: 16px; }
	.sheet-actions { display: flex; gap: 8px; }
	.sheet-btn {
		flex: 1;
		padding: 10px;
		border-radius: 12px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-text-75);
		font-size: 13px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.sheet-btn:hover { background: var(--pg-btn-hover); }

	/* Settings */
	.setting-row {
		padding: 12px 0;
		border-bottom: 1px solid var(--pg-surface-b);
	}
	.setting-label { display: block; font-size: 12px; color: var(--pg-muted); margin-bottom: 8px; }
	.setting-select {
		width: 100%;
		padding: 8px 12px;
		border-radius: 10px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-text-85);
		font-size: 13px;
		cursor: pointer;
	}
	.range-input {
		accent-color: #b34a6e;
	}
	.toggle-btn {
		padding: 6px 14px;
		border-radius: 8px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-muted);
		font-size: 12px;
		cursor: pointer;
	}
	.toggle-btn.active {
		background: rgba(34,197,94,0.15);
		border-color: rgba(34,197,94,0.3);
		color: rgba(74,222,128,0.9);
	}

	/* Override MushafPage card to fit the dark hub theme */
	:global(.mushaf) {
		background: var(--pg-surface) !important;
		border-color: rgba(199,162,75,0.2) !important;
	}
	:global(.mushaf .ay.playing) {
		background: rgba(34,197,94,0.15) !important;
		box-shadow: 0 0 0 4px rgba(34,197,94,0.08) !important;
	}
	:global(.mushaf .font-arabic) {
		font-family: var(--font-arabic, 'Amiri Quran', serif);
		color: var(--pg-fg);
	}
</style>
