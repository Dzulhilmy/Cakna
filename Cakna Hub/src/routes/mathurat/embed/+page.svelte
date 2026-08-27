<script lang="ts">
	import { page } from '$app/state';
	import { LISTS, TOTALS, VERSI_LABEL, BASMALAH, pickText, type Versi } from '$lib/data/mathurat';
	import type { Waktu } from '$lib/data/mathurat';

	const version = (page.url.searchParams.get('v') ?? 'sughra') as Versi;
	const mode    = (page.url.searchParams.get('m') ?? 'pagi') as Waktu;
	const idx     = Math.max(0, parseInt(page.url.searchParams.get('i') ?? '0', 10));

	const list    = LISTS[version];
	const total   = TOTALS[version];
	const item    = list[idx] ?? null;

	const progress    = list.slice(0, idx).reduce((s, it) => s + it.reps, 0);
	const progressPct = total > 0 ? Math.round((progress / total) * 100) : 0;

	function arText()  { return item ? pickText(item, version, mode, 'ar') : ''; }
	function bmText()  { return item ? pickText(item, version, mode, 'bm') : ''; }
</script>

<svelte:head><title>Al-Ma'thurat</title></svelte:head>

<div class="root">
	<header class="hdr">
		<div class="hdr-center">
			<span class="hdr-title">Al-Ma'thurat</span>
			<span class="hdr-sub">{VERSI_LABEL[version].penuh} · {mode === 'pagi' ? 'Pagi' : 'Petang'}</span>
		</div>
	</header>

	<div class="prog-wrap">
		<div class="prog-bar" style="width: {progressPct}%;"></div>
		<span class="prog-label">{progress} / {total} ({progressPct}%)</span>
	</div>

	<div class="tabs-row">
		<div class="tab-group">
			<span class="tab tab-on">{VERSI_LABEL[version].nama}</span>
		</div>
		<div class="tab-group">
			<span class="tab tab-on">{mode === 'pagi' ? 'Pagi' : 'Petang'}</span>
		</div>
	</div>

	{#if item}
		<main class="content">
			<div class="item-meta">
				<span class="item-num">{idx + 1} / {list.length}</span>
			</div>
			<h2 class="item-tajuk">{item.tajuk}</h2>
			{#if item.info}
				<p class="item-info">{item.info}</p>
			{/if}
			{#if item.basmalah}
				<p class="ar-basmalah" dir="rtl">{BASMALAH}</p>
			{/if}
			<p class="ar-text" dir="rtl">{arText()}</p>
			<p class="bm-text">{bmText()}</p>
		</main>
	{:else}
		<div class="complete">
			<div class="complete-icon">✓</div>
			<h2>Wirid Selesai</h2>
			<p>{VERSI_LABEL[version].penuh} telah selesai.</p>
		</div>
	{/if}
</div>

<style>
	:global(body) { margin: 0; }

	.root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
	}

	.hdr {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--pg-hdr);
		border-bottom: 1px solid rgba(34, 197, 94, 0.1);
	}
	.hdr-center { flex: 1; display: flex; flex-direction: column; align-items: center; }
	.hdr-title  { font-size: 13px; font-weight: 600; color: var(--pg-text-75); }
	.hdr-sub    { font-size: 11px; color: rgba(34,197,94,0.6); }

	.prog-wrap {
		position: relative;
		height: 3px;
		background: var(--pg-surface-b);
	}
	.prog-bar {
		height: 100%;
		background: linear-gradient(90deg, #8e3557, #b34a6e);
		transition: width 0.4s ease;
	}
	.prog-label {
		position: absolute;
		right: 12px; top: 6px;
		font-size: 10px;
		color: var(--pg-subtle);
	}

	.tabs-row {
		display: flex;
		gap: 8px;
		padding: 10px 16px;
		border-bottom: 1px solid var(--pg-surface-b);
	}
	.tab-group {
		display: flex;
		gap: 4px;
		background: var(--pg-btn);
		border-radius: 10px;
		padding: 3px;
	}
	.tab {
		padding: 5px 12px;
		border-radius: 7px;
		font-size: 12px;
		color: var(--pg-muted);
	}
	.tab-on {
		background: rgba(34,197,94,0.2);
		color: rgba(74,222,128,0.95);
	}

	.content {
		flex: 1;
		padding: 20px 20px 40px;
		overflow-y: auto;
	}
	.item-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
	.item-num  { font-size: 11px; color: var(--pg-subtle); }
	.item-tajuk { font-size: 16px; font-weight: 700; color: var(--pg-text-85); margin-bottom: 4px; }
	.item-info  { font-size: 12px; color: var(--pg-subtle); margin-bottom: 12px; }
	.ar-basmalah {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 22px; line-height: 2.2; text-align: center;
		color: var(--gold); margin-bottom: 4px;
	}
	.ar-text {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 26px; line-height: 2.2;
		color: var(--pg-fg); margin-bottom: 12px;
		text-align: right;
	}
	.bm-text { line-height: 1.7; color: var(--pg-muted); margin-bottom: 20px; }

	.complete {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 40px;
		text-align: center;
	}
	.complete-icon {
		width: 56px; height: 56px;
		border-radius: 50%;
		background: rgba(34,197,94,0.15);
		border: 2px solid rgba(34,197,94,0.4);
		display: grid; place-items: center;
		font-size: 24px;
		color: rgba(74,222,128,0.9);
	}
</style>
