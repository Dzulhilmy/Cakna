<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import QuizGame from '$lib/components/modules/QuizGame.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { t } from '$lib/state/i18n.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const doc = $derived(data.mengaji);
	const en = $derived(settings.value.uiLang === 'en');

	// Kasratain needs the dedicated combining mark to render properly (sample parity)
	const mark = (idx: number, m: string) => (idx === 4 ? 'ٍ' : m);

	// static drill lines, hardcoded in the sample (latin lines stay as-is regardless of uiLang)
	const DRILLS: [string, string][] = [
		['بَ تَ ثَ · جَ حَ خَ · دَ ذَ رَ', 'ba ta tsa · ja ha kha · da dza ra'],
		['مَا مِيْ مُوْ · لَا لِيْ لُوْ', 'maa mii muu · laa lii luu (madd — panjang 2 harakat)'],
		['بَا + بٌ = بَابٌ', 'baa + bun = baabun (pintu)'],
		['كَتَبَ · قَلَمٌ · مُسْلِمٌ', 'kataba · qalamun · muslimun'],
		['بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 'bismillaahir-rahmaanir-rahiim']
	];
</script>

<PageHeader title={t('p_mengaji')} back="/menu" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<Tabs.Root value="huruf">
		<Tabs.List class="grid h-10 w-full grid-cols-4">
			<Tabs.Trigger value="huruf">{en ? 'Letters' : 'Huruf'}</Tabs.Trigger>
			<Tabs.Trigger value="baris">{en ? 'Marks' : 'Baris'}</Tabs.Trigger>
			<Tabs.Trigger value="latih">{en ? 'Drill' : 'Latih'}</Tabs.Trigger>
			<Tabs.Trigger value="kuiz">{en ? 'Quiz' : 'Kuiz'}</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="huruf" class="mt-4">
			<h2 class="mb-3 font-display text-[16.5px]">{t('mg_s1')}</h2>
			<div class="grid grid-cols-4 gap-2 min-[420px]:grid-cols-5" dir="rtl">
				{#each doc.hija as [letter, name], li (li)}
					<div class="flex flex-col items-center gap-1 rounded-2xl border bg-card py-3">
						<span class="font-arabic text-[30px] leading-[1.3] text-primary">{letter}</span>
						<span
							class="text-[9.5px] font-bold tracking-[.08em] text-muted-foreground uppercase"
							dir="ltr">{name}</span
						>
					</div>
				{/each}
			</div>
		</Tabs.Content>

		<Tabs.Content value="baris" class="mt-4">
			<h2 class="mb-3 font-display text-[16.5px]">{t('mg_s2')}</h2>
			<div class="rounded-2xl border bg-card px-4 py-1.5">
				{#each doc.harakat as [m, name, descMs, descEn], hi (hi)}
					<div class="flex items-center justify-between gap-2 border-b py-2.5 last:border-b-0">
						<div class="flex-1">
							<b class="text-[13.5px]">{name}</b>
							<small class="block text-[11.5px] text-muted-foreground">
								{en ? descEn : descMs}
							</small>
						</div>
						<span class="min-w-16 text-center font-arabic text-[34px] leading-[1.6]">
							{'ب' + mark(hi, m)}
						</span>
					</div>
				{/each}
			</div>
		</Tabs.Content>

		<Tabs.Content value="latih" class="mt-4">
			<h2 class="mb-3 font-display text-[16.5px]">{t('mg_s3')}</h2>
			<div class="grid grid-cols-3 gap-2" dir="rtl">
				{#each doc.hija as [letter], li (li)}
					{#each doc.hrk3 as [m, vowel] (vowel)}
						<div class="flex flex-col items-center rounded-xl border bg-card py-2">
							<span class="font-arabic text-[28px] leading-[1.7]">{letter + m}</span>
							<span class="text-[11px] text-muted-foreground" dir="ltr">
								{doc.mg_sound[li] + vowel}
							</span>
						</div>
					{/each}
				{/each}
			</div>
			<div class="mt-4 rounded-2xl border bg-card px-4 py-1.5">
				{#each DRILLS as [ar, latin] (ar)}
					<div class="border-b py-2 text-center last:border-b-0">
						<div class="font-arabic text-[26px] leading-[2.3] tracking-[.05em]" dir="rtl">
							{ar}
						</div>
						<small class="block text-[11.5px] leading-[1.4] text-muted-foreground" dir="ltr">
							{latin}
						</small>
					</div>
				{/each}
			</div>
		</Tabs.Content>

		<Tabs.Content value="kuiz" class="mt-4">
			<h2 class="mb-3 font-display text-[16.5px]">{t('mg_s4')}</h2>
			<QuizGame {doc} />
		</Tabs.Content>
	</Tabs.Root>

	<div
		class="mt-4 rounded-xl border border-dashed border-gold px-3.5 py-3 text-xs leading-[1.6] text-muted-foreground"
	>
		{t('mg_note')}
	</div>
</div>
