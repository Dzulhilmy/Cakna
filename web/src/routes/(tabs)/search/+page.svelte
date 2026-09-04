<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { search } from '$lib/api/content';
	import type { SearchHit, SearchResult } from '$lib/api/types';
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { SURAHS } from '$lib/quran/meta';
	import { t } from '$lib/state/i18n.svelte';
	import { settings } from '$lib/state/stores.svelte';

	let q = $state('');
	let hint = $state('');
	let result = $state<SearchResult | null>(null);
	let isAr = $state(false); // was the executed query Arabic? (renders snippets RTL)
	let searching = $state(false);
	let inputRef = $state<HTMLInputElement | null>(null);

	let timer: ReturnType<typeof setTimeout> | undefined;
	let seq = 0; // guards against out-of-order responses

	$effect(() => {
		inputRef?.focus();
		return () => clearTimeout(timer);
	});

	function onInput() {
		clearTimeout(timer);
		timer = setTimeout(() => void runSearch(q), 250);
	}

	async function runSearch(raw: string) {
		const query = raw.trim();
		const mySeq = ++seq;
		result = null;
		if (query.length < 3) {
			hint = query ? t('s_min') : '';
			searching = false;
			return;
		}
		hint = '';
		isAr = /[\u0600-\u06FF]/.test(query);
		searching = true;
		try {
			const r = await search(query, settings.value.transLang);
			if (mySeq !== seq) return;
			result = r;
		} catch {
			if (mySeq !== seq) return;
			hint =
				settings.value.uiLang === 'en'
					? 'Search failed. Please check your connection.'
					: 'Carian gagal. Sila semak sambungan internet.';
		} finally {
			if (mySeq === seq) searching = false;
		}
	}

	function open(hit: SearchHit) {
		goto(`${base}/read/${hit.page}?g=${hit.global}`);
	}

	function snip(s: string): string {
		return s.length > 160 ? s.slice(0, 160) + '…' : s;
	}
</script>

<PageHeader title={t('srch_title')} back="/read" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<Input
		type="search"
		class="h-11 rounded-xl px-3.5"
		placeholder={t('srch_ph')}
		bind:value={q}
		bind:ref={inputRef}
		oninput={onInput}
		aria-label={t('srch_title')}
	/>

	{#if hint}
		<p class="mt-3 px-0.5 text-xs tracking-wide text-muted-foreground">{hint}</p>
	{:else if searching}
		<div class="mt-4 space-y-4">
			{#each [0, 1, 2] as i (i)}
				<div class="space-y-2">
					<Skeleton class="h-3 w-40" />
					<Skeleton class="h-4 w-full" />
				</div>
			{/each}
		</div>
	{:else if result}
		<p class="mt-3 px-0.5 text-xs tracking-wide text-muted-foreground">
			{result.total
				? t('s_n', { n: result.total }) + (result.total > 60 ? t('s_60') : '')
				: t('s_none')}
		</p>
		<div>
			{#each result.hits as hit (hit.global)}
				<button
					class="block w-full border-b py-3 text-left active:bg-accent/40"
					onclick={() => open(hit)}
				>
					<div class="mb-0.5 text-[11px] font-bold uppercase tracking-[0.07em] text-gold">
						{SURAHS[hit.surah - 1].name_translit} · {hit.surah}:{hit.ayah} · {t('hal')}
						{hit.page}
					</div>
					{#if isAr}
						<div dir="rtl" class="font-arabic text-right text-[17px] leading-[1.8]">
							{snip(hit.text)}
						</div>
					{:else}
						<div class="text-sm leading-[1.55]">{snip(hit.text)}</div>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
