<script lang="ts">
	import type { IbadahStep, QuranRef } from '$lib/api/types';
	import ArabicText from '$lib/components/ArabicText.svelte';
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import IbadahQuranRange from '$lib/components/modules/IbadahQuranRange.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { SURAHS } from '$lib/quran/meta';
	import { t } from '$lib/state/i18n.svelte';
	import { manasik, settings } from '$lib/state/stores.svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const doc = $derived(data.doc);

	type Mode = 'wuduk' | 'solat' | 'tay' | 'umrah' | 'haji';
	const TABS: { id: Mode; key: string }[] = [
		{ id: 'wuduk', key: 'ibd_wuduk' },
		{ id: 'solat', key: 'ibd_solat' },
		{ id: 'tay', key: 'ibd_tay' },
		{ id: 'umrah', key: 'ibd_umrah' },
		{ id: 'haji', key: 'ibd_haji' }
	];

	let mode = $state<Mode>('wuduk');
	let umDoaOpen = $state(false);

	// The API's step.flag is 1=rukun, 0=sunat, 2=wajib, "Q"=Fatihah block, null=none;
	// step.arabic is a plain string, "FATIHAH", a [surah, from, to] ref, or null
	// (looser at runtime than the declared IbadahStep type).
	type StepArabic = string | [number, number, number] | null;

	const en = $derived(settings.value.uiLang === 'en');
	// Sample: IBD[ibdMode].filter(st => state.showSunat || st[0] !== 0)
	const steps = $derived(
		(doc.sections[mode] ?? []).filter(
			(st) => settings.value.showSunat || (st.flag as number | string | null) !== 0
		)
	);

	// Descriptions/meanings follow transLang in the sample (ML = transLang==="en" ? en : ms).
	function stepDesc(st: IbadahStep): string {
		return (settings.value.transLang === 'en' ? st.desc_en : st.desc_ms) ?? '';
	}
	function doaRef(q: QuranRef): string {
		return ` (${SURAHS[q.surah - 1].name_translit} ${q.surah}:${q.ayah_from}${
			q.ayah_to > q.ayah_from ? '–' + q.ayah_to : ''
		})`;
	}

	// Tawaf / sa'ie round counters — port of the sample's [data-mk] handler.
	function bump(f: 't' | 's', op: '+' | '-' | '0') {
		const before = manasik.value[f];
		if (op === '+') manasik.value[f] = Math.min(7, before + 1);
		else if (op === '-') manasik.value[f] = Math.max(0, before - 1);
		else manasik.value[f] = 0;
		const now = manasik.value[f];
		if (navigator.vibrate) {
			if (now === 7 && before < 7) navigator.vibrate([70, 50, 70, 50, 70]);
			else if (now !== before) navigator.vibrate(18);
		}
		if (now === 7 && before < 7) toast(t(f === 't' ? 't_tawaf_done' : 't_saie_done'));
	}

	function toggleSunat(v: boolean) {
		settings.value.showSunat = v;
		toast(t(v ? 't_sunat_on' : 't_sunat_off'));
	}
</script>

{#snippet medal(x: string | number)}
	<span
		class="grid h-7 w-7 flex-none place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground"
	>
		{x}
	</span>
{/snippet}

{#snippet section(sym: string, label: string)}
	<div class="mt-6 mb-2.5 flex items-center gap-2.5">
		{@render medal(sym)}
		<h4 class="font-display text-[16.5px]">{label}</h4>
	</div>
{/snippet}

{#snippet goldIdx(n: number)}
	<span
		class="grid h-6.5 w-6.5 flex-none place-items-center rounded-full border-[1.5px] border-gold text-[11px] font-bold text-gold"
	>
		{n}
	</span>
{/snippet}

{#snippet listCard(items: string[])}
	<div class="rounded-2xl border bg-card p-4">
		<ul class="list-disc pl-5 text-[13.5px] leading-[1.9]">
			{#each items as it (it)}
				<li>{it}</li>
			{/each}
		</ul>
	</div>
{/snippet}

{#snippet counter(f: 't' | 's')}
	{@const c = manasik.value[f]}
	{@const unit = t(f === 't' ? 'pusingan' : 'perjalanan')}
	<div class="text-center font-display text-[34px] text-primary">{c} / 7</div>
	<div class="mt-0.5 text-center text-[13px] font-bold text-gold">
		{#if c >= 7}{t('um_done')}
		{:else if f === 't'}{unit} {c + 1}
		{:else}{unit} {c + 1} · {t(c % 2 === 0 ? 'um_dir_sm' : 'um_dir_ms')}{/if}
	</div>
	<div class="my-2.5 flex justify-center gap-1.5">
		{#each Array(7) as _, i (i)}
			<span
				class="h-3 w-3 rounded-full border-[1.5px] {i < c ? 'border-primary bg-primary' : 'border-border'}"
			></span>
		{/each}
	</div>
	<div class="mt-3 flex gap-2">
		<button class="flex-1 rounded-xl border py-3 text-sm font-bold active:scale-[.97]" onclick={() => bump(f, '-')}>
			−1
		</button>
		<button
			class="flex-[2] rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-[.97]"
			onclick={() => bump(f, '+')}
		>
			{c >= 7 ? '✓' : '+1 ' + unit}
		</button>
		<button class="flex-1 rounded-xl border py-3 text-sm font-bold active:scale-[.97]" onclick={() => bump(f, '0')}>
			{t('reset')}
		</button>
	</div>
{/snippet}

{#snippet tabBtn(tb: { id: Mode; key: string })}
	<button
		class="rounded-xl border py-2 text-sm font-semibold transition-colors {mode === tb.id
			? 'border-primary bg-primary text-primary-foreground'
			: 'bg-card text-muted-foreground'}"
		onclick={() => (mode = tb.id)}
	>
		{t(tb.key)}
	</button>
{/snippet}

<PageHeader title={t('p_ibadah')} back="/menu" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<!-- tabs: two rows, like the sample panel -->
	<div class="grid grid-cols-3 gap-2">
		{#each TABS.slice(0, 3) as tb (tb.id)}
			{@render tabBtn(tb)}
		{/each}
	</div>
	<div class="mt-2 grid grid-cols-2 gap-2">
		{#each TABS.slice(3) as tb (tb.id)}
			{@render tabBtn(tb)}
		{/each}
	</div>

	<!-- toggles -->
	<div class="mt-3 flex items-center justify-between px-1 py-1">
		<span class="text-sm">{t('show_meaning')}</span>
		<Switch
			checked={settings.value.mtMaksud}
			onCheckedChange={(v: boolean) => (settings.value.mtMaksud = v)}
		/>
	</div>
	<div class="flex items-center justify-between px-1 pt-1 pb-2">
		<span class="text-sm">{t('show_sunat')}</span>
		<Switch checked={settings.value.showSunat} onCheckedChange={toggleSunat} />
	</div>

	<!-- steps -->
	<div class="mt-2 flex flex-col gap-3">
		{#each steps as st, i (st.title_ms)}
			{@const ar = st.arabic as unknown as StepArabic}
			{@const flag = st.flag as number | string | null}
			{@const desc = stepDesc(st)}
			<div class="rounded-2xl border bg-card p-4">
				<div class="flex items-center gap-2.5">
					{@render medal(i + 1)}
					<h4 class="min-w-0 flex-1 font-display text-[16.5px]">{en ? st.title_en : st.title_ms}</h4>
					{#if flag === 1}
						<span class="ibd-chip bg-primary text-primary-foreground">{t('rukun')}</span>
					{:else if flag === 0}
						<span class="ibd-chip border border-gold-soft text-gold">{t('sunat')}</span>
					{:else if flag === 2}
						<span class="ibd-chip bg-gold text-[#2A2416]">{t('wajib_h')}</span>
					{/if}
				</div>
				{#if ar === 'FATIHAH'}
					<div class="mt-3 border-t pt-3">
						<IbadahQuranRange surah={1} from={1} to={7} />
					</div>
				{:else if Array.isArray(ar)}
					<div class="mt-3 border-t pt-3">
						<IbadahQuranRange
							surah={ar[0]}
							from={ar[1]}
							to={ar[2]}
							suffix={` (${SURAHS[ar[0] - 1].name_translit} ${ar[0]}:${ar[1]})` +
								(desc ? ' — ' + desc : '')}
						/>
					</div>
				{:else if typeof ar === 'string'}
					<div class="mt-3 border-t pt-3">
						<ArabicText text={ar} taj={st.tajweed} scale={0.8} />
						{#if settings.value.mtMaksud && desc}
							<div class="mt-1.5 text-[13px] leading-[1.55] text-muted-foreground">{desc}</div>
						{/if}
					</div>
				{:else if settings.value.mtMaksud && desc}
					<div class="mt-2 text-[13px] leading-[1.55] text-muted-foreground">{desc}</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if mode === 'wuduk'}
		{@render section('!', t('ibd_batal'))}
		{@render listCard(doc.batal[en ? 'en' : 'ms'])}
	{/if}

	{#if mode === 'solat'}
		{@render section('#', t('ibd_rakaat'))}
		<div class="rounded-2xl border bg-card p-4">
			<table class="w-full border-collapse text-[13.5px]">
				<tbody>
					{#each doc.rakaat as [name, n] (name)}
						<tr class="border-b last:border-b-0">
							<td class="py-2">{name}</td>
							<td class="py-2 text-right font-bold text-primary">{n} {t('rakaat_u')}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if mode === 'umrah'}
		{@const tc = manasik.value.t}
		{@render section('۞', t('um_tawaf_c'))}
		<div class="rounded-2xl border bg-card p-4">
			{@render counter('t')}
			{#if tc < 7}
				{@const cd = doc.tawaf_doa[tc]}
				<div class="mt-3.5 rounded-xl border border-primary bg-playing p-3">
					<div class="mb-1.5 flex items-center gap-2.5">
						{@render goldIdx(tc + 1)}
						<span class="min-w-0 flex-1 text-sm font-bold">
							{t('um_doa_now')} — {en ? cd.title_en : cd.title_ms}
						</span>
					</div>
					<IbadahQuranRange
						surah={cd.quran_ref.surah}
						from={cd.quran_ref.ayah_from}
						to={cd.quran_ref.ayah_to}
						suffix={doaRef(cd.quran_ref)}
					/>
				</div>
			{/if}
			<div
				class="mt-3 rounded-xl border border-dashed border-gold px-3 py-2.5 text-xs leading-[1.6] text-muted-foreground"
			>
				{t('um_istilam')}
			</div>
			{#if doc.tawaf_ar[0]}
				<ArabicText
					text={doc.tawaf_ar[0].arabic}
					taj={doc.tawaf_ar[0].tajweed}
					scale={0.8}
					class="mt-1.5 text-center"
				/>
			{/if}
			<button
				class="mt-3 w-full rounded-xl border py-3 text-[13.5px] font-semibold text-muted-foreground active:bg-accent"
				onclick={() => (umDoaOpen = !umDoaOpen)}
			>
				{t(umDoaOpen ? 'um_hide_all' : 'um_show_all')}
			</button>
		</div>
		{#if umDoaOpen}
			<div class="mt-2.5 flex flex-col gap-2.5">
				{#each doc.tawaf_doa as d, i (i)}
					{@const act = tc < 7 && i === tc}
					<div class="rounded-xl border p-3 {act ? 'border-primary bg-playing' : 'bg-card'}">
						<div class="mb-1.5 flex items-center gap-2.5">
							{@render goldIdx(i + 1)}
							<span class="min-w-0 flex-1 text-sm font-bold">
								{t('pusingan')} {i + 1} — {en ? d.title_en : d.title_ms}
							</span>
							{#if act}
								<span class="ibd-chip bg-primary text-primary-foreground">{t('um_now')}</span>
							{/if}
						</div>
						<IbadahQuranRange
							surah={d.quran_ref.surah}
							from={d.quran_ref.ayah_from}
							to={d.quran_ref.ayah_to}
							suffix={doaRef(d.quran_ref)}
						/>
					</div>
				{/each}
			</div>
			<div
				class="mt-2.5 rounded-xl border border-dashed border-gold px-3 py-2.5 text-xs leading-[1.6] text-muted-foreground"
			>
				{t('um_doa_note')}
			</div>
		{/if}
		{@render section('⇄', t('um_saie_c'))}
		<div class="rounded-2xl border bg-card p-4">
			{@render counter('s')}
		</div>
		{@render section('!', t('ihram_ban'))}
		{@render listCard(doc.ihram_ban[en ? 'en' : 'ms'])}
	{/if}

	{#if mode === 'haji'}
		{@render section('★', t('rukun_haji'))}
		{@render listCard(doc.rukun_haji[en ? 'en' : 'ms'])}
	{/if}

	<div
		class="mt-4 rounded-xl border border-dashed border-gold px-3 py-2.5 text-xs leading-[1.6] text-muted-foreground"
	>
		{t(mode === 'umrah' || mode === 'haji' ? 'ibd_note_hu' : 'ibd_note')}
	</div>
</div>

<style>
	.ibd-chip {
		flex: none;
		border-radius: 999px;
		padding: 3px 9px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
</style>
