<script lang="ts">
	// Al-Ma'thurat — wirid pagi/petang (Sughra & Kubra), port panelMathurat sampel.
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import MathuratCard from '$lib/components/modules/MathuratCard.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { getSurah } from '$lib/api/content';
	import type { Ayah, MathuratItem } from '$lib/api/types';
	import { t } from '$lib/state/i18n.svelte';
	import { mathuratState, settings, todayKey } from '$lib/state/stores.svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const items = data.items;
	const N = items.length;

	type Mode = 'pagi' | 'petang';
	type Ver = 's' | 'k';
	type CountKey = 's_pagi' | 's_petang' | 'k_pagi' | 'k_petang';

	// Mod ikut waktu semasa; versi ikut pilihan tersimpan (spt. sampel).
	let mode = $state<Mode>(new Date().getHours() < 12 ? 'pagi' : 'petang');
	let ver = $state<Ver>(mathuratState.value?.v === 'k' ? 'k' : 's');

	// Port mtFresh(): reset harian + pulihkan array yang rosak/salah panjang.
	function fresh() {
		const tk = todayKey();
		const cur = mathuratState.value;
		if (!cur || cur.d !== tk) {
			mathuratState.value = {
				d: tk,
				v: ver,
				s_pagi: [],
				s_petang: [],
				k_pagi: [],
				k_petang: []
			};
		}
		const mt = mathuratState.value!;
		for (const k of ['s_pagi', 's_petang', 'k_pagi', 'k_petang'] as const) {
			if (!Array.isArray(mt[k]) || mt[k].length !== N) mt[k] = Array(N).fill(0);
		}
	}
	fresh();

	const mtKey = $derived(`${ver}_${mode}` as CountKey);
	const counts = $derived(mathuratState.value?.[mtKey] ?? []);

	// Sughra: item teras (Kubra-sahaja) disembunyikan; indeks asal dikekalkan.
	const visible = $derived(
		items.map((it, i) => ({ it, i })).filter((x) => ver === 'k' || !x.it.core)
	);
	function target(it: MathuratItem): number {
		return ver === 'k' ? (it.repeat_full ?? it.repeat_n) : it.repeat_n;
	}
	const doneCount = $derived(visible.filter((x) => (counts[x.i] ?? 0) >= target(x.it)).length);

	function tap(i: number, it: MathuratItem) {
		fresh();
		const arr = mathuratState.value![mtKey];
		const tgt = target(it);
		const c = arr[i] ?? 0;
		if (c >= tgt) return;
		arr[i] = c + 1;
		if (navigator.vibrate) navigator.vibrate(12);
		if (arr[i] >= tgt) {
			if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
			if (doneCount === visible.length) {
				toast(t('t_mt_done', { m: t(mode === 'pagi' ? 'mt_pagi' : 'mt_petang') }));
			}
		}
	}

	function setVer(v: Ver) {
		ver = v;
		fresh();
		mathuratState.value!.v = v;
	}

	function reset() {
		fresh();
		mathuratState.value![mtKey] = Array(N).fill(0);
	}

	// Muat malas ayat Al-Quran untuk item quran_ref (Fatihah, Baqarah, 3 Qul…).
	let surahCache = $state<Record<number, Ayah[]>>({});
	onMount(() => {
		const needed = new Set(
			items.filter((x) => x.quran_ref).map((x) => x.quran_ref!.surah)
		);
		for (const s of needed) {
			getSurah(s)
				.then((b) => {
					surahCache[s] = b.ayahs;
				})
				.catch(() => {});
		}
	});
	function ayahsFor(it: MathuratItem): Ayah[] | null {
		const r = it.quran_ref;
		if (!r) return null;
		const ay = surahCache[r.surah];
		return ay ? ay.slice(r.ayah_from - 1, r.ayah_to) : null;
	}

	const tabBase =
		'flex-1 rounded-xl border py-[11px] text-[13.5px] font-bold transition-colors';
	const tabOn = 'border-primary bg-primary text-primary-foreground';
	const tabOff = 'text-muted-foreground active:bg-accent';
</script>

<PageHeader title={t('mathurat')} back="/menu" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<!-- Paksi 1: waktu wirid -->
	<div class="mb-3 flex gap-2">
		<button class="{tabBase} {mode === 'pagi' ? tabOn : tabOff}" onclick={() => (mode = 'pagi')}>
			{t('mt_pagi')}
		</button>
		<button
			class="{tabBase} {mode === 'petang' ? tabOn : tabOff}"
			onclick={() => (mode = 'petang')}
		>
			{t('mt_petang')}
		</button>
	</div>
	<!-- Paksi 2: versi -->
	<div class="mb-2 flex gap-2">
		<button class="{tabBase} {ver === 's' ? tabOn : tabOff}" onclick={() => setVer('s')}>
			{t('mt_s')}
		</button>
		<button class="{tabBase} {ver === 'k' ? tabOn : tabOff}" onclick={() => setVer('k')}>
			{t('mt_k')}
		</button>
	</div>

	<div class="flex items-center justify-between px-0.5 pt-1.5 pb-3 text-sm font-medium">
		<span>{t('show_meaning')}</span>
		<Switch bind:checked={settings.value.mtMaksud} aria-label={t('show_meaning')} />
	</div>

	<!-- Kemajuan hari ini -->
	<div class="mb-3 rounded-2xl border bg-card px-3.5 py-3">
		<div class="mb-[7px] flex items-center justify-between text-[12.5px] text-muted-foreground">
			<span>{t('mt_prog_label')}</span>
			<b class="text-foreground tabular-nums">
				{t('mt_prog', { x: doneCount, y: visible.length })}
			</b>
		</div>
		<div class="h-1.5 overflow-hidden rounded-full bg-border">
			<div
				class="h-full rounded-full transition-[width] duration-400"
				style="width: {(doneCount / Math.max(visible.length, 1)) * 100}%; background: linear-gradient(90deg, var(--emerald), var(--gold));"
			></div>
		</div>
	</div>

	{#each visible as x, vi (x.i)}
		<MathuratCard
			item={x.it}
			num={vi + 1}
			count={counts[x.i] ?? 0}
			target={target(x.it)}
			{mode}
			ayahs={ayahsFor(x.it)}
			ontap={() => tap(x.i, x.it)}
		/>
	{/each}

	<button
		class="mt-1 w-full rounded-xl border py-3 text-[13.5px] font-semibold text-destructive active:bg-accent"
		onclick={reset}
	>
		{t('mt_reset')}
	</button>

	<p class="mt-3 rounded-xl border border-dashed border-gold px-3.5 py-3 text-xs leading-[1.6] text-muted-foreground">
		{t('mt_note')}
	</p>
</div>
