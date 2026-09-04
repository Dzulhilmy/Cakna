<script lang="ts">
	import type { DuaItem, QuranRef } from '$lib/api/types';
	import { base } from '$app/paths';
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import ArabicText from '$lib/components/ArabicText.svelte';
	import DoaAyatRange from '$lib/components/modules/DoaAyatRange.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { pageOf, saToG, SURAHS } from '$lib/quran/meta';
	import { t } from '$lib/state/i18n.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// sample: doaMode "q" | "h"
	let mode = $state('q');

	const quranDuas = $derived(data.duas.filter((d) => d.kind === 'quran'));
	const hadithDuas = $derived(data.duas.filter((d) => d.kind === 'hadith'));

	const title = (d: DuaItem) => (settings.value.uiLang === 'en' ? d.title_en : d.title_ms);
	// sample uses transLang for maksud: ms -> meaning_ms, en/id -> meaning_en
	const meaning = (d: DuaItem) =>
		settings.value.transLang === 'ms' ? d.meaning_ms : d.meaning_en;

	const refLabel = (r: QuranRef, dash: string) =>
		`${SURAHS[r.surah - 1].name_translit} ${r.surah}:${r.ayah_from}${
			r.ayah_to > r.ayah_from ? dash + r.ayah_to : ''
		}`;

	function mushafHref(r: QuranRef): string {
		const g = saToG(r.surah, r.ayah_from);
		return `${base}/read/${pageOf(g)}?g=${g}`;
	}
</script>

<PageHeader title={t('p_doa')} back="/menu" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<Tabs.Root bind:value={mode}>
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="q">{t('doa_tab_q')}</Tabs.Trigger>
			<Tabs.Trigger value="h">{t('doa_tab_h')}</Tabs.Trigger>
		</Tabs.List>

		<!-- Dari Al-Quran -->
		<Tabs.Content value="q">
			<div class="rounded-2xl border bg-card px-4">
				<Accordion.Root type="multiple">
					{#each quranDuas as d (d.position)}
						<Accordion.Item value={String(d.position)}>
							<Accordion.Trigger class="items-center gap-2.5 py-3.5 hover:no-underline">
								<span class="flex-1 text-[14.5px] font-bold">{title(d)}</span>
								{#if d.quran_ref}
									<span class="text-[11.5px] font-bold whitespace-nowrap text-gold">
										{refLabel(d.quran_ref, '-')}
									</span>
								{/if}
							</Accordion.Trigger>
							<Accordion.Content>
								{#if d.quran_ref}
									<DoaAyatRange qref={d.quran_ref} />
									<Button
										variant="outline"
										size="sm"
										class="mt-3 rounded-full"
										href={mushafHref(d.quran_ref)}
									>
										{t('open_mushaf')}
									</Button>
								{/if}
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</div>
		</Tabs.Content>

		<!-- Doa Harian -->
		<Tabs.Content value="h">
			<Accordion.Root type="multiple" class="gap-2.5">
				{#each hadithDuas as d, i (d.position)}
					<Accordion.Item value={String(d.position)} class="rounded-2xl border bg-card px-4">
						<Accordion.Trigger class="items-center gap-2.5 py-3.5 hover:no-underline">
							<span
								class="grid h-[26px] w-[26px] flex-none place-items-center rounded-full border-[1.5px] border-gold text-[11px] font-bold text-gold"
							>
								{i + 1}
							</span>
							<span class="flex-1 text-sm font-bold">{title(d)}</span>
						</Accordion.Trigger>
						<Accordion.Content>
							{#if d.arabic}
								<ArabicText text={d.arabic} taj={d.tajweed} scale={0.85} />
								{#if settings.value.mtMaksud && meaning(d)}
									<p class="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
										{meaning(d)}
									</p>
								{/if}
							{:else if d.quran_ref}
								<DoaAyatRange qref={d.quran_ref} />
							{/if}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
