<script>
	import { ChevronLeft } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { goto } from '$app/navigation';
	import { SURAHS, JUZ_FIRST_GLOBAL, surahPage, gToSA } from '$lib/quran/meta';

	let activeTab = $state('surah'); // 'surah' | 'juz'
	let query = $state('');

	// Filtered surahs by search
	const filteredSurahs = $derived(
		query.trim() === ''
			? SURAHS
			: SURAHS.filter((s) => {
					const q = query.toLowerCase();
					return (
						s.name_translit.toLowerCase().includes(q) ||
						s.name_ms.toLowerCase().includes(q) ||
						s.name_ar.includes(query)
					);
				})
	);

	// Build juz list: 30 entries with starting surah/ayah
	const juzList = $derived(
		JUZ_FIRST_GLOBAL.map((g, i) => {
			const { s, a } = gToSA(g);
			const surah = SURAHS[s - 1];
			return { juz: i + 1, surah, ayah: a, globalFirst: g };
		})
	);

	function openSurah(surahNumber) {
		const page = surahPage(surahNumber);
		goto(`/mushaf?page=${page}`);
	}

	function openJuz(juzEntry) {
		// Navigate to the page where this juz starts
		const page = surahPage(juzEntry.surah.number);
		goto(`/mushaf?page=${page}`);
	}

	const REVELATION_LABEL = {
		Meccan: 'Makkiyyah',
		Medinan: 'Madaniyyah'
	};
</script>

<svelte:head><title>Senarai Surah — Cakna</title></svelte:head>

<div class="sr-root">
	<header class="sr-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Senarai Surah</span>
			<span class="hdr-sub">Al-Quran Al-Karim</span>
		</div>
		<div style="width:36px;"></div>
	</header>

	<!-- Search -->
	<div class="search-wrap">
		<input
			class="search-input"
			type="search"
			placeholder="Cari surah..."
			bind:value={query}
		/>
	</div>

	<!-- Tabs -->
	<div class="tabs-row">
		<button class="tab" class:tab-active={activeTab === 'surah'} onclick={() => (activeTab = 'surah')}>
			Surah
		</button>
		<button class="tab" class:tab-active={activeTab === 'juz'} onclick={() => (activeTab = 'juz')}>
			Juz
		</button>
	</div>

	<main class="sr-main">
		{#if activeTab === 'surah'}
			{#if filteredSurahs.length === 0}
				<div class="empty-state">
					<p>Tiada surah dijumpai untuk "{query}"</p>
				</div>
			{:else}
				<ul class="surah-list">
					{#each filteredSurahs as surah (surah.number)}
						<li>
							<button class="surah-row" onclick={() => openSurah(surah.number)}>
								<!-- Number badge -->
								<div class="surah-num">
									<span>{surah.number}</span>
								</div>
								<!-- Name info -->
								<div class="surah-info">
									<span class="surah-translit">{surah.name_translit}</span>
									<span class="surah-sub">
										{surah.name_ms} · {surah.ayah_count} ayat · {REVELATION_LABEL[surah.revelation] ?? surah.revelation}
									</span>
								</div>
								<!-- Arabic name -->
								<div class="surah-ar">
									<span class="surah-ar-text">{surah.name_ar}</span>
								</div>
							</button>
						</li>
					{/each}
				</ul>
			{/if}

		{:else if activeTab === 'juz'}
			<ul class="juz-list">
				{#each juzList as entry (entry.juz)}
					<li>
						<button class="juz-row" onclick={() => openJuz(entry)}>
							<div class="juz-num">
								<span class="juz-num-label">JUZ</span>
								<span class="juz-num-val">{entry.juz}</span>
							</div>
							<div class="juz-info">
								<span class="juz-surah">{entry.surah.name_translit}</span>
								<span class="juz-sub">
									Ayat {entry.ayah} · {entry.surah.name_ms}
								</span>
							</div>
							<div class="juz-ar">
								<span class="juz-ar-text">{entry.surah.name_ar}</span>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</main>
</div>

<SideNav active="surah" />

<style>
	.sr-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.sr-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--pg-hdr);
		border-bottom: 1px solid rgba(199, 162, 75, 0.1);
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
		color: rgba(199, 162, 75, 0.6);
	}

	.search-wrap {
		padding: 10px 16px;
		background: var(--pg-surface);
		border-bottom: 1px solid var(--pg-surface-b);
	}
	.search-input {
		width: 100%;
		box-sizing: border-box;
		padding: 10px 14px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		border-radius: 12px;
		color: var(--pg-fg);
		font-size: 14px;
		outline: none;
		transition: border-color 0.15s;
	}
	.search-input::placeholder {
		color: var(--pg-subtle);
	}
	.search-input:focus {
		border-color: rgba(199, 162, 75, 0.3);
	}

	.tabs-row {
		display: flex;
		gap: 4px;
		padding: 8px 16px;
		border-bottom: 1px solid var(--pg-surface-b);
	}
	.tab {
		padding: 6px 20px;
		border-radius: 8px;
		font-size: 13px;
		color: var(--pg-muted);
		cursor: pointer;
		border: none;
		background: transparent;
		transition: all 0.15s;
	}
	.tab-active {
		background: rgba(199, 162, 75, 0.12);
		color: #c7a24b;
		font-weight: 600;
	}

	.sr-main {
		flex: 1;
		overflow-y: auto;
	}

	/* Surah list */
	.surah-list,
	.juz-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.surah-row,
	.juz-row {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px 16px;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--pg-surface-b);
		cursor: pointer;
		text-align: left;
		color: inherit;
		transition: background 0.12s;
	}
	.surah-row:hover,
	.juz-row:hover {
		background: var(--pg-surface);
	}
	.surah-row:active,
	.juz-row:active {
		background: rgba(199, 162, 75, 0.06);
	}

	.surah-num {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: rgba(199, 162, 75, 0.1);
		border: 1px solid rgba(199, 162, 75, 0.2);
		flex-shrink: 0;
	}
	.surah-num span {
		font-size: 12px;
		font-weight: 700;
		color: #c7a24b;
	}

	.surah-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.surah-translit {
		font-size: 14px;
		font-weight: 600;
		color: var(--pg-text-85);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.surah-sub {
		font-size: 11px;
		color: var(--pg-muted);
	}

	.surah-ar {
		flex-shrink: 0;
		text-align: right;
	}
	.surah-ar-text {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 18px;
		color: rgba(199, 162, 75, 0.75);
		line-height: 1.4;
	}

	/* Juz list */
	.juz-num {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.15);
		flex-shrink: 0;
	}
	.juz-num-label {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: rgba(34, 197, 94, 0.5);
		text-transform: uppercase;
		line-height: 1;
	}
	.juz-num-val {
		font-size: 16px;
		font-weight: 700;
		color: rgba(74, 222, 128, 0.9);
		line-height: 1.2;
	}

	.juz-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.juz-surah {
		font-size: 14px;
		font-weight: 600;
		color: var(--pg-text-85);
	}
	.juz-sub {
		font-size: 11px;
		color: var(--pg-muted);
	}

	.juz-ar {
		flex-shrink: 0;
		text-align: right;
	}
	.juz-ar-text {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 16px;
		color: var(--pg-muted);
		line-height: 1.4;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		color: var(--pg-subtle);
		font-size: 14px;
	}
</style>
