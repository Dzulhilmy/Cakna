<script lang="ts">
	import { getWords } from '$lib/api/content';
	import type { Ayah, PageBundle, Word } from '$lib/api/types';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Textarea } from '$lib/components/ui/textarea';
	import { RULE_NAMES, TJ_CHIPS, TJ_DESC, rulesIn } from '$lib/quran/tajweed';
	import { t } from '$lib/state/i18n.svelte';
	import { player } from '$lib/state/player.svelte';
	import { hls, notes, settings } from '$lib/state/stores.svelte';
	import { downloadAyahCard } from '$lib/utils/share-card';
	import { Copy, Image, Languages, Play, Repeat, Square } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		g: number | null; // open when non-null
		bundle: PageBundle;
		onclose: () => void;
	}
	let { g, bundle, onclose }: Props = $props();

	const ayah = $derived<Ayah | null>(g == null ? null : (bundle.ayahs.find((a) => a.global === g) ?? null));
	const surahMeta = $derived(ayah ? bundle.surahs.find((s) => s.number === ayah.surah) : null);
	const gKey = $derived(String(g));
	let noteDraft = $state('');
	$effect(() => {
		noteDraft = g != null ? (notes.value[String(g)] ?? '') : '';
	});
	let showTaj = $state(false);

	// word-by-word (fetched on demand; the gloss lang follows transLang, falling
	// back to ms since the Tilawah dataset always has ms/en/id)
	let showWords = $state(false);
	let words = $state<Word[] | null>(null);
	let wordsLoading = $state(false);
	$effect(() => {
		void g;
		showTaj = false;
		showWords = false;
		words = null;
	});

	async function toggleWords() {
		showWords = !showWords;
		if (showWords && !words && g != null) {
			wordsLoading = true;
			try {
				words = (await getWords(g)).words;
			} catch {
				toast.error(t('t_audio'));
				showWords = false;
			} finally {
				wordsLoading = false;
			}
		}
	}
	const glossLang = $derived(settings.value.transLang as 'ms' | 'en' | 'id');

	async function copyAyah() {
		if (!ayah) return;
		try {
			await navigator.clipboard.writeText(
				`${ayah.ar}\n\n${ayah.tr[settings.value.transLang]}\n(${surahMeta?.name_translit} ${ayah.surah}:${ayah.ayah})`
			);
			toast(t('t_copied'));
		} catch {
			toast.error(t('t_copy_fail'));
		}
	}

	async function shareCard() {
		if (!ayah || !surahMeta) return;
		toast(t('t_card_gen'));
		try {
			await downloadAyahCard({
				arabic: ayah.ar,
				translation: ayah.tr[settings.value.transLang],
				surahLatin: surahMeta.name_translit,
				surah: ayah.surah,
				ayah: ayah.ayah
			});
			toast(t('t_card_ok'));
		} catch {
			toast.error(t('t_card_fail'));
		}
	}

	function setHighlight(color: 0 | 1 | 2 | 3) {
		if (g == null) return;
		if (color === 0) delete hls.value[gKey];
		else hls.value[gKey] = color;
	}

	function saveNote() {
		if (g == null) return;
		const v = noteDraft.trim();
		if (v) {
			notes.value[gKey] = v;
			toast(t('t_note_saved'));
		} else {
			delete notes.value[gKey];
			toast(t('t_note_del'));
		}
		onclose();
	}

	function handleAB() {
		if (g == null) return;
		const r = player.setAB(g);
		if (r === 'a-set') toast(t('t_ab_a'));
		else if (r === 'stopped') toast(t('t_ab_off'));
		onclose();
	}

	const abLabel = $derived(
		player.abActive ? t('act_ab_stop') : player.abStart >= 0 ? t('act_ab_b') : t('act_ab_a')
	);
	const tajRules = $derived(ayah ? rulesIn(ayah.taj) : []);
</script>

<Drawer.Root open={g != null} onOpenChange={(o: boolean) => !o && onclose()}>
	<Drawer.Content>
		{#if ayah && surahMeta}
			<Drawer.Header class="pb-1">
				<Drawer.Title class="font-display">
					{surahMeta.name_translit} · {ayah.surah}:{ayah.ayah}
				</Drawer.Title>
			</Drawer.Header>
			<div class="max-h-[65dvh] overflow-y-auto px-4 pb-6">
				<p dir="rtl" class="font-arabic mb-3 text-center leading-[1.9]" style="font-size: calc(var(--arabic-size) * 0.75);">
					{ayah.ar}
				</p>
				{#if settings.value.translit}
					<p class="mb-1 text-center text-[13px] italic text-muted-foreground">{ayah.translit}</p>
				{/if}
				<p class="mb-4 text-center text-sm leading-relaxed">{ayah.tr[settings.value.transLang]}</p>

				<!-- highlight -->
				<div class="mb-4 flex items-center justify-center gap-3">
					<span class="text-sm text-muted-foreground">{t('hl_label')}</span>
					{#each [1, 2, 3] as c (c)}
						<button
							aria-label="highlight {c}"
							class="h-7 w-7 rounded-full border-2 {hls.value[gKey] === c ? 'border-primary' : 'border-transparent'}"
							style="background: var(--hl-{c});"
							onclick={() => setHighlight(c as 1 | 2 | 3)}
						></button>
					{/each}
					<button class="text-xs text-muted-foreground underline" onclick={() => setHighlight(0)}>×</button>
				</div>

				<div class="grid gap-2">
					<Button
						variant="outline"
						class="justify-start"
						onclick={() => {
							player.toggle(ayah.global);
							onclose();
						}}
					>
						{#if player.playingG === ayah.global}<Square size={16} />{:else}<Play size={16} />{/if}
						{t('act_play')}
					</Button>
					<Button variant="outline" class="justify-start" onclick={handleAB}>
						<Repeat size={16} />
						{abLabel}
					</Button>
					<Button variant="outline" class="justify-start" onclick={copyAyah}>
						<Copy size={16} />
						{t('act_copy')}
					</Button>
					<Button variant="outline" class="justify-start" onclick={shareCard}>
						<Image size={16} />
						{t('act_card')}
					</Button>
					<Button variant="outline" class="justify-start" onclick={() => (showTaj = !showTaj)}>
						<span class="font-arabic text-[15px]">نّ</span>
						{t('act_taj')}
					</Button>
					<Button variant="outline" class="justify-start" onclick={toggleWords}>
						<Languages size={16} />
						{t('act_words')}
					</Button>
				</div>

				{#if showWords}
					<div class="mt-3 rounded-xl border bg-background p-3">
						{#if wordsLoading}
							<p class="py-2 text-center text-sm text-muted-foreground">…</p>
						{:else if words}
							<div class="flex flex-wrap gap-2" dir="rtl">
								{#each words as w, i (i)}
									<div
										class="flex min-w-16 flex-col items-center rounded-lg border bg-card px-2 py-1.5 text-center"
									>
										<span class="font-arabic text-[22px] leading-tight">{w.ar}</span>
										<span class="mt-0.5 text-[11px] text-muted-foreground" dir="ltr">
											{w[glossLang]}
										</span>
									</div>
								{/each}
							</div>
							<p class="mt-2 text-[10px] text-muted-foreground">{t('words_src')}</p>
						{/if}
					</div>
				{/if}

				{#if showTaj}
					<div class="mt-3 rounded-xl border bg-background p-3">
						{#if tajRules.length === 0}
							<p class="text-sm text-muted-foreground">{t('act_none')}</p>
						{:else}
							{#each tajRules as r (r)}
								<div class="flex items-start gap-2 py-1.5">
									<span class="font-arabic t{r} tj min-w-8 text-center text-lg">{TJ_CHIPS[r]}</span>
									<div>
										<div class="text-sm font-semibold">{RULE_NAMES[r]}</div>
										<div class="text-xs text-muted-foreground">
											{TJ_DESC[settings.value.uiLang]?.[r] ?? TJ_DESC.ms[r]}
										</div>
									</div>
								</div>
							{/each}
						{/if}
					</div>
				{/if}

				<!-- note -->
				<div class="mt-4 grid gap-2">
					<Textarea placeholder={t('note_ph')} bind:value={noteDraft} rows={2} />
					<Button variant="secondary" onclick={saveNote}>{t('note_btn')}</Button>
				</div>
			</div>
		{/if}
	</Drawer.Content>
</Drawer.Root>
