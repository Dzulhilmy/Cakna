<script lang="ts">
	// Satu item wirid Al-Ma'thurat — port kad .mt-item daripada sampel.
	import ArabicText from '$lib/components/ArabicText.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { Ayah, MathuratItem } from '$lib/api/types';
	import { toArabicNum } from '$lib/quran/meta';
	import { settings } from '$lib/state/stores.svelte';

	interface Props {
		item: MathuratItem;
		/** nombor siri dalam senarai yang dipaparkan (1-based) */
		num: number;
		count: number;
		target: number;
		mode: 'pagi' | 'petang';
		/** ayat Al-Quran untuk item quran_ref; null semasa masih dimuat */
		ayahs: Ayah[] | null;
		ontap: () => void;
	}
	let { item, num, count, target, mode, ayahs, ontap }: Props = $props();

	const done = $derived(count >= target);
	const title = $derived(settings.value.uiLang === 'en' ? item.title_en : item.title_ms);

	// Teks Arab bukan-Quran: sama untuk kedua-dua waktu, atau varian pagi/petang.
	const raw = $derived(
		item.arabic ?? (mode === 'pagi' ? item.arabic_pagi : item.arabic_petang) ?? ''
	);
	const rawTaj = $derived(
		item.arabic ? item.tajweed : mode === 'pagi' ? item.tajweed_pagi : item.tajweed_petang
	);

	// Maksud: terjemahan ayat (ikut bahasa terjemahan) atau maksud zikir (ms/en).
	const maksud = $derived.by(() => {
		if (!settings.value.mtMaksud) return '';
		if (item.quran_ref) {
			if (!ayahs) return '';
			return ayahs
				.map((a) => a.tr[settings.value.transLang] ?? a.tr.ms)
				.join(' ')
				.trim();
		}
		return (settings.value.transLang === 'en' ? item.meaning_en : item.meaning_ms) ?? '';
	});
</script>

<button
	type="button"
	class="mb-2.5 w-full rounded-2xl border bg-card p-3.5 text-left transition-opacity active:bg-accent {done
		? 'opacity-55'
		: ''}"
	onclick={ontap}
>
	<div class="mb-2 flex items-center gap-2.5">
		<span
			class="grid h-[26px] w-[26px] flex-none place-items-center rounded-full border-[1.5px] border-gold text-[11px] font-bold text-gold"
		>
			{num}
		</span>
		<span class="min-w-0 flex-1 text-sm font-bold">{title}</span>
		<span
			class="rounded-full border px-2.5 py-[3px] text-xs font-bold whitespace-nowrap tabular-nums {done
				? 'border-primary bg-primary text-primary-foreground'
				: 'border-primary text-primary'}"
		>
			{done ? '✓' : `${count} / ${target}`}
		</span>
	</div>

	{#if item.quran_ref}
		{#if ayahs}
			<div dir="rtl" class="text-right leading-[2]" style="font-size: calc(var(--arabic-size) * 0.85);">
				{#each ayahs as a (a.global)}
					<ArabicText text={a.ar} taj={a.taj} scale={0.85} class="inline" />
					<span class="font-arabic text-gold">﴿{toArabicNum(a.ayah)}﴾ </span>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-end gap-2 py-1" dir="rtl">
				<Skeleton class="h-5 w-full" />
				<Skeleton class="h-5 w-2/3" />
			</div>
		{/if}
	{:else}
		<ArabicText text={raw} taj={rawTaj} scale={0.85} />
	{/if}

	{#if maksud}
		<p class="mt-[7px] text-[12.5px] leading-[1.55] text-muted-foreground">{maksud}</p>
	{/if}
</button>
