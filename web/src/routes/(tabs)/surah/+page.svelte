<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Tabs from '$lib/components/ui/tabs';
	import {
		JUZ_FIRST_GLOBAL,
		SURAHS,
		gToSA,
		juzOf,
		pageOf,
		pageRange,
		surahPage,
		toArabicNum
	} from '$lib/quran/meta';
	import { t } from '$lib/state/i18n.svelte';
	import { bookmarks, notes, settings } from '$lib/state/stores.svelte';
	import { X } from '@lucide/svelte';

	let tab = $state('surah');
	let filter = $state('');

	// Header mirrors the sample drawer: surah(s) on the last-read page + position.
	const curPage = $derived(Math.min(Math.max(settings.value.page, 1), 604));
	const curSurahSpan = $derived.by(() => {
		const [first, last] = pageRange(curPage);
		return { from: gToSA(first).s, to: gToSA(last).s, firstG: first };
	});
	const headerTitle = $derived.by(() => {
		const names: string[] = [];
		for (let s = curSurahSpan.from; s <= curSurahSpan.to; s++)
			names.push(SURAHS[s - 1].name_translit);
		return names.join(' · ');
	});
	const headerSub = $derived(
		`${t('page')} ${curPage} / 604 · ${t('juz')} ${juzOf(curSurahSpan.firstG)}`
	);

	// ----- Surah tab -----
	const filtered = $derived.by(() => {
		const q = filter.trim().toLowerCase();
		if (!q) return SURAHS;
		return SURAHS.filter(
			(s) =>
				String(s.number) === q ||
				s.name_translit.toLowerCase().includes(q) ||
				s.name_ms.toLowerCase().includes(q) ||
				s.name_en.toLowerCase().includes(q)
		);
	});
	const meaningOf = (n: number) =>
		settings.value.uiLang === 'en' ? SURAHS[n - 1].name_en : SURAHS[n - 1].name_ms;
	const escHtml = (s: string) =>
		s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	// ----- Penanda tab -----
	function pageSurahNames(p: number): string {
		const [first, last] = pageRange(p);
		const names: string[] = [];
		for (let s = gToSA(first).s; s <= gToSA(last).s; s++)
			names.push(SURAHS[s - 1].name_translit);
		return names.join(' · ');
	}
	function removeBookmark(p: number) {
		bookmarks.value = bookmarks.value.filter((x) => x !== p);
		if (navigator.vibrate) navigator.vibrate(15);
	}

	// ----- Nota tab -----
	const noteGlobals = $derived(
		Object.keys(notes.value)
			.map(Number)
			.sort((a, b) => a - b)
	);
	function noteSnip(g: number): string {
		const txt = notes.value[String(g)] ?? '';
		return txt.length > 52 ? txt.slice(0, 52) + '…' : txt;
	}
	function removeNote(g: number) {
		delete notes.value[String(g)];
		if (navigator.vibrate) navigator.vibrate(15);
	}
</script>

{#snippet medallion(label: string)}
	<span class="relative grid h-9 w-9 shrink-0 place-items-center text-[12px] font-bold text-primary">
		<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3" class="absolute inset-0 h-full w-full opacity-80">
			<path d="M20 2 l4.4 7.8 8.8 1.6 -6.2 6.6 1.2 8.9 -8.2 -3.9 -8.2 3.9 1.2 -8.9 -6.2 -6.6 8.8 -1.6 Z" />
		</svg>
		<span class="relative">{label}</span>
	</span>
{/snippet}

<PageHeader title={headerTitle} subtitle={headerSub} back="/read" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<Tabs.Root bind:value={tab}>
		<Tabs.List class="grid w-full grid-cols-4">
			<Tabs.Trigger value="surah">{t('tab_surah')}</Tabs.Trigger>
			<Tabs.Trigger value="juz">{t('tab_juz')}</Tabs.Trigger>
			<Tabs.Trigger value="bm">{t('tab_bm')}</Tabs.Trigger>
			<Tabs.Trigger value="nota">{t('tab_nota')}</Tabs.Trigger>
		</Tabs.List>

		<!-- ======== SURAH ======== -->
		<Tabs.Content value="surah">
			<div class="pt-2">
				<Input
					type="search"
					class="h-10 rounded-xl px-3.5"
					placeholder={t('srch_surah')}
					bind:value={filter}
					aria-label={t('srch_surah')}
				/>
			</div>
			<nav class="mt-2" aria-label={t('tab_surah')}>
				{#each filtered as s (s.number)}
					{@const active = s.number >= curSurahSpan.from && s.number <= curSurahSpan.to}
					<button
						class="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left active:bg-accent/40 {active
							? 'bg-accent'
							: ''}"
						onclick={() => goto(`/read/${surahPage(s.number)}`)}
					>
						{@render medallion(String(s.number))}
						<span class="min-w-0 flex-1">
							<span class="block truncate text-[14.5px] font-semibold">{s.name_translit}</span>
							<span class="block truncate text-[11.5px] text-muted-foreground">
								{meaningOf(s.number)} · {s.ayah_count}
								{t('ayat')} · {t('hal')}
								{surahPage(s.number)}
							</span>
						</span>
						<span class="font-arabic whitespace-nowrap text-[19px] text-primary">{s.name_ar}</span>
					</button>
				{:else}
					<div class="px-4 py-10 text-center text-sm leading-[1.7] text-muted-foreground">
						{@html t('none_surah', { q: `<b>${escHtml(filter)}</b>` })}
					</div>
				{/each}
			</nav>
		</Tabs.Content>

		<!-- ======== JUZUK ======== -->
		<Tabs.Content value="juz">
			<nav class="mt-2" aria-label={t('tab_juz')}>
				{#each JUZ_FIRST_GLOBAL as g, i (g)}
					{@const sa = gToSA(g)}
					{@const p = pageOf(g)}
					<button
						class="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left active:bg-accent/40"
						onclick={() => goto(`/read/${p}`)}
					>
						{@render medallion(String(i + 1))}
						<span class="min-w-0 flex-1">
							<span class="block truncate text-[14.5px] font-semibold">{t('juz')} {i + 1}</span>
							<span class="block truncate text-[11.5px] text-muted-foreground">
								{t('start')}
								{SURAHS[sa.s - 1].name_translit}
								{sa.s}:{sa.a} · {t('hal')}
								{p}
							</span>
						</span>
						<span class="font-arabic whitespace-nowrap text-[19px] text-primary">{toArabicNum(i + 1)}</span>
					</button>
				{/each}
			</nav>
		</Tabs.Content>

		<!-- ======== PENANDA ======== -->
		<Tabs.Content value="bm">
			<nav class="mt-2" aria-label={t('tab_bm')}>
				{#each bookmarks.value as p (p)}
					{@const firstG = pageRange(p)[0]}
					<div class="flex w-full items-center gap-1 rounded-xl">
						<button
							class="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2.5 text-left active:bg-accent/40"
							onclick={() => goto(`/read/${p}`)}
						>
							{@render medallion(String(p))}
							<span class="min-w-0 flex-1">
								<span class="block truncate text-[14.5px] font-semibold">{t('page')} {p}</span>
								<span class="block truncate text-[11.5px] text-muted-foreground">
									{pageSurahNames(p)} · {t('juz')}
									{juzOf(firstG)}
								</span>
							</span>
						</button>
						<button
							class="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground active:bg-accent/40 active:text-destructive"
							aria-label="{settings.value.uiLang === 'en'
								? 'Remove bookmark for page'
								: 'Buang penanda halaman'} {p}"
							onclick={() => removeBookmark(p)}
						>
							<X size={16} />
						</button>
					</div>
				{:else}
					<div class="px-4 py-10 text-center text-sm leading-[1.7] text-muted-foreground">
						{@html t('bm_empty')}
					</div>
				{/each}
			</nav>
		</Tabs.Content>

		<!-- ======== NOTA ======== -->
		<Tabs.Content value="nota">
			<nav class="mt-2" aria-label={t('tab_nota')}>
				{#each noteGlobals as g (g)}
					{@const sa = gToSA(g)}
					<div class="flex w-full items-center gap-1 rounded-xl">
						<button
							class="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2.5 text-left active:bg-accent/40"
							onclick={() => goto(`/read/${pageOf(g)}?g=${g}`)}
						>
							{@render medallion('✎')}
							<span class="min-w-0 flex-1">
								<span class="block truncate text-[14.5px] font-semibold">
									{SURAHS[sa.s - 1].name_translit}
									{sa.s}:{sa.a}
								</span>
								<span class="block truncate text-[11.5px] text-muted-foreground">{noteSnip(g)}</span>
							</span>
						</button>
						<button
							class="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground active:bg-accent/40 active:text-destructive"
							aria-label={settings.value.uiLang === 'en' ? 'Delete note' : 'Padam nota'}
							onclick={() => removeNote(g)}
						>
							<X size={16} />
						</button>
					</div>
				{:else}
					<div class="px-4 py-10 text-center text-sm leading-[1.7] text-muted-foreground">
						{@html t('note_empty')}
					</div>
				{/each}
			</nav>
		</Tabs.Content>
	</Tabs.Root>
</div>
