<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { SELAWAT_NABI, type Bait } from '$lib/data/selawat-data';
	import { settings } from '$lib/state/stores.svelte';

	const en = $derived(settings.value.uiLang === 'en');

	// Build display list: inject the opening refrain as a chorus after every 2 bait stanzas
	type DisplayItem = Bait & { key: string };
	const openingRefrain = SELAWAT_NABI[0];

	const displayList: DisplayItem[] = (() => {
		const out: DisplayItem[] = [];
		let baitCount = 0;

		for (let i = 0; i < SELAWAT_NABI.length; i++) {
			const bait = SELAWAT_NABI[i];
			out.push({ ...bait, key: String(bait.id) });

			if (bait.jenis === 'bait') {
				baitCount++;
				// After every 2 bait stanzas, insert the opening refrain if more bait stanzas follow
				if (baitCount % 2 === 0 && SELAWAT_NABI[i + 1]?.jenis === 'bait') {
					out.push({ ...openingRefrain, key: `chorus-${baitCount}a` });
					out.push({ ...openingRefrain, key: `chorus-${baitCount}b` });
				}
			}
		}

		return out;
	})();
</script>

<PageHeader title={en ? 'Salawat Nabi' : 'Selawat Nabi'} back="/menu" />

<div class="sl">
	<div class="sl-intro">
		<p class="sl-eyebrow">Cakna · Selawat</p>
		<h1 class="sl-arab-title">صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ</h1>
		<p class="sl-sub">
			{en ? 'Ashraqal Badr · 21 stanzas' : 'Ashraqal Badr · 21 rangkap'}
		</p>
	</div>

	<div class="sl-senarai">
		{#each displayList as bait (bait.key)}
			<div
				class="sl-bait"
				class:sl-bait-ulang={bait.jenis === 'ulang'}
				class:sl-bait-penutup={bait.jenis === 'penutup'}
			>
				{#each bait.baris as baris, i (i)}
					<div class="sl-baris">
						<p class="sl-arab">{baris.ar}</p>
						<p class="sl-terj">{en ? baris.en : baris.ms}</p>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<p class="sl-nota">
		{en
			? 'Recite with sincerity and love for the Prophet ﷺ. Sending salawat upon him is an act of worship commanded by Allah in the Quran (33:56).'
			: 'Bacalah dengan tulus dan kasih sayang kepada Nabi ﷺ. Berselawat ke atas baginda adalah ibadah yang diperintahkan Allah dalam Al-Quran (33:56).'}
	</p>
</div>

<style>
	.sl {
		--sl-emerald: #0e5f52;
		--sl-emerald-deep: #0a473e;
		--sl-bronze: #b08a3e;
		--sl-paper: #f3f6f2;
		--sl-white: #ffffff;
		--sl-mist: #dce7e0;
		--sl-ink: #0d3b33;
		--sl-ink-soft: #3e5b53;
		background: var(--sl-paper);
		color: var(--sl-ink);
		min-height: calc(100dvh - 56px);
		font-family: var(--font-sans, system-ui, sans-serif);
	}
	:global(.dark) .sl {
		--sl-emerald: #1e7a67;
		--sl-emerald-deep: #8ecfbe;
		--sl-bronze: #d6b36e;
		--sl-paper: #0e1b18;
		--sl-white: #152622;
		--sl-mist: #20342e;
		--sl-ink: #e9f1ed;
		--sl-ink-soft: #9fb8ae;
	}

	.sl-intro {
		max-width: 480px;
		margin: 0 auto;
		padding: 28px 24px 16px;
		text-align: center;
	}
	.sl-eyebrow {
		letter-spacing: 0.22em;
		font-size: 11px;
		font-weight: 600;
		color: var(--sl-bronze);
		text-transform: uppercase;
		margin: 0 0 14px;
	}
	.sl-arab-title {
		font-family: var(--font-arabic, 'Amiri Quran', 'Scheherazade New', serif);
		direction: rtl;
		font-size: 28px;
		color: var(--sl-emerald-deep);
		margin: 0 0 10px;
		font-weight: 400;
		line-height: 2;
	}
	.sl-sub {
		font-size: 14px;
		color: var(--sl-ink-soft);
		margin: 0;
	}

	.sl-senarai {
		max-width: 560px;
		margin: 0 auto;
		padding: 16px 16px 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.sl-bait {
		background: var(--sl-white);
		border-radius: 16px;
		padding: 16px 20px;
		box-shadow: 0 3px 12px rgba(13, 59, 51, 0.07);
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.sl-bait-ulang {
		background: rgba(14, 95, 82, 0.07);
		border: 1px solid rgba(14, 95, 82, 0.18);
		box-shadow: none;
	}
	:global(.dark) .sl-bait-ulang {
		background: rgba(30, 122, 103, 0.13);
		border-color: rgba(30, 122, 103, 0.3);
	}
	.sl-bait-penutup {
		background: linear-gradient(135deg, rgba(176, 138, 62, 0.08), rgba(14, 95, 82, 0.08));
		border: 1px solid rgba(176, 138, 62, 0.22);
		box-shadow: none;
		text-align: center;
	}
	:global(.dark) .sl-bait-penutup {
		background: linear-gradient(135deg, rgba(214, 179, 110, 0.1), rgba(30, 122, 103, 0.1));
		border-color: rgba(214, 179, 110, 0.28);
	}

	.sl-baris {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.sl-arab {
		font-family: var(--font-arabic, 'Amiri Quran', 'Scheherazade New', serif);
		direction: rtl;
		text-align: right;
		font-size: 22px;
		line-height: 2;
		color: var(--sl-ink);
		margin: 0;
	}
	.sl-bait-ulang .sl-arab {
		color: var(--sl-emerald-deep);
		font-size: 21px;
	}
	.sl-bait-penutup .sl-arab {
		text-align: center;
		font-size: 24px;
		color: var(--sl-emerald-deep);
	}
	.sl-terj {
		font-size: 13px;
		color: var(--sl-ink-soft);
		margin: 0;
		line-height: 1.6;
	}
	.sl-bait-ulang .sl-terj {
		font-style: italic;
	}
	.sl-bait-penutup .sl-terj {
		text-align: center;
		font-size: 13.5px;
	}

	.sl-nota {
		max-width: 480px;
		margin: 20px auto 0;
		padding: 0 20px 60px;
		text-align: center;
		font-size: 12px;
		color: var(--sl-ink-soft);
		line-height: 1.8;
	}
</style>
