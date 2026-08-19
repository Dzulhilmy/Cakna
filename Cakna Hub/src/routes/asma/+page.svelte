<script>
	import { onMount } from 'svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { settings } from '$lib/state/stores.svelte';

	/** @type {Array<{position:number,arabic:string,translit:string,meaning_ms:string,meaning_en:string}>} */
	let items = $state([]);
	let loading = $state(true);
	let error = $state('');
	/** @type {number|null} */
	let expanded = $state(null);

	const lang = $derived(settings.value.uiLang === 'en' ? 'en' : 'ms');

	onMount(async () => {
		try {
			const res = await fetch('/proxy/api/modules/asma');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			items = await res.json();
		} catch (e) {
			error = 'Gagal memuatkan data. Sila cuba semula.';
		} finally {
			loading = false;
		}
	});

	/** @param {number} pos */
	function toggle(pos) {
		expanded = expanded === pos ? null : pos;
	}
</script>

<svelte:head><title>Asmaul Husna — Cakna</title></svelte:head>

<div class="asma-root">
	<header class="asma-header">
		<a href="https://cakna.org/hub" class="hdr-btn" aria-label="Kembali">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Asmaul Husna</span>
		</div>
		<span class="total-badge">99</span>
	</header>

	<main class="asma-main">
		{#if loading}
			<div class="skeleton-grid">
				{#each {length: 6} as _, i (i)}
					<div class="skeleton-card">
						<div class="skel-circle"></div>
						<div class="skel-lines">
							<div class="skel-line skel-arabic"></div>
							<div class="skel-line skel-translit"></div>
							<div class="skel-line skel-meaning"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if error}
			<p class="error-msg">{error}</p>
		{:else}
			<div class="names-grid">
				{#each items as item (item.position)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						class="name-card"
						class:name-expanded={expanded === item.position}
						onclick={() => toggle(item.position)}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && toggle(item.position)}
						aria-expanded={expanded === item.position}
					>
						<div class="card-top">
							<span class="pos-circle">{item.position}</span>
							<div class="card-body">
								<p class="arabic-name" dir="rtl">{item.arabic}</p>
								<p class="translit">{item.translit}</p>
								<p class="meaning">
									{lang === 'en' ? item.meaning_en : item.meaning_ms}
								</p>
							</div>
						</div>
						{#if expanded === item.position}
							<div class="card-extra">
								<div class="extra-row">
									<span class="extra-label">Bahasa Melayu</span>
									<span class="extra-val">{item.meaning_ms}</span>
								</div>
								<div class="extra-row">
									<span class="extra-label">English</span>
									<span class="extra-val">{item.meaning_en}</span>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</main>
</div>

<SideNav active="asma" />

<style>
	.asma-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: #070e14;
		color: #e2e8f0;
		padding-left: 76px;
	}

	/* ── Header ── */
	.asma-header {
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
		flex-direction: column;
		align-items: center;
	}
	.hdr-title {
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.75);
	}
	.total-badge {
		padding: 4px 10px;
		border-radius: 20px;
		background: rgba(199, 162, 75, 0.15);
		border: 1px solid rgba(199, 162, 75, 0.3);
		font-size: 12px;
		font-weight: 700;
		color: #c7a24b;
		flex-shrink: 0;
	}

	/* ── Main ── */
	.asma-main {
		padding: 16px 16px 40px;
	}

	/* ── Skeleton ── */
	.skeleton-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.skeleton-card {
		display: flex;
		gap: 10px;
		padding: 14px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
	}
	.skel-circle {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.07);
		flex-shrink: 0;
		animation: pulse 1.4s ease-in-out infinite;
	}
	.skel-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; padding-top: 2px; }
	.skel-line {
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.07);
		animation: pulse 1.4s ease-in-out infinite;
	}
	.skel-arabic { height: 20px; }
	.skel-translit { height: 10px; width: 70%; }
	.skel-meaning { height: 10px; width: 55%; }
	@keyframes pulse {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	/* ── Names grid ── */
	.names-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	/* ── Name card ── */
	.name-card {
		padding: 14px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
		user-select: none;
	}
	.name-card:hover { background: rgba(255, 255, 255, 0.055); }
	.name-expanded {
		background: rgba(199, 162, 75, 0.07);
		border-color: rgba(199, 162, 75, 0.25);
	}

	.card-top {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	.pos-circle {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: rgba(199, 162, 75, 0.12);
		border: 1px solid rgba(199, 162, 75, 0.3);
		color: #c7a24b;
		font-size: 11px;
		font-weight: 700;
		display: grid;
		place-items: center;
		flex-shrink: 0;
	}
	.card-body { flex: 1; min-width: 0; }
	.arabic-name {
		font-family: 'Amiri Quran', 'Amiri', serif;
		font-size: 22px;
		line-height: 1.3;
		color: rgba(255, 255, 255, 0.92);
		text-align: right;
		margin: 0 0 4px;
	}
	.translit {
		font-size: 10px;
		font-weight: 600;
		color: #c7a24b;
		letter-spacing: 0.04em;
		margin: 0 0 3px;
	}
	.meaning {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.5);
		margin: 0;
		line-height: 1.4;
	}

	/* ── Expanded extra ── */
	.card-extra {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.extra-row { display: flex; flex-direction: column; gap: 2px; }
	.extra-label {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.25);
	}
	.extra-val {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.45;
	}

	.error-msg {
		text-align: center;
		color: #f87171;
		font-size: 13px;
		padding: 40px 0;
	}
</style>
