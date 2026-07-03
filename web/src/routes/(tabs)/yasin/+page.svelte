<script lang="ts">
	import ArabicText from '$lib/components/ArabicText.svelte';
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { audioUrl, toArabicNum } from '$lib/quran/meta';
	import { t } from '$lib/state/i18n.svelte';
	import { player } from '$lib/state/player.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Meanings of the opening/closing adhkar (inline in the sample's renderYasin — YS_M).
	const YS_M: Record<'ms' | 'en', [string, string, string]> = {
		ms: [
			'Aku memohon keampunan Allah Yang Maha Agung.',
			'Selawat ke atas junjungan Nabi Muhammad SAW dan keluarga baginda.',
			'Ya Allah, jadikanlah Al-Quran penyubur hati kami, cahaya dada kami, penghapus dukacita kami dan pelenyap kebimbangan kami. Selawat dan salam ke atas Nabi Muhammad SAW, keluarga dan para sahabat baginda.'
		],
		en: [
			'I seek the forgiveness of Allah, the Most Great.',
			'Salutations upon our master Prophet Muhammad and his family.',
			'O Allah, make the Quran the spring of our hearts, the light of our chests, the remover of our sorrows and the reliever of our worries. Blessings and peace upon Prophet Muhammad, his family and all his companions.'
		]
	};

	const maksud = $derived(settings.value.mtMaksud);
	const ml = $derived(settings.value.transLang === 'en' ? 'en' : 'ms');
	const arAlign = $derived(settings.value.align === 'center' ? 'center' : 'right');

	const firstG = $derived(data.yasin.ayahs[0].global);
	const lastG = $derived(data.yasin.ayahs[data.yasin.ayahs.length - 1].global);

	// ---- Yasin-local audio: plays sequentially through the end of the surah, then
	// stops (port of the sample's separate yAudio engine, L3438-3464). 1-based globals.
	let ysG = $state(-1);
	let audio: HTMLAudioElement | null = null;

	function getAudio(): HTMLAudioElement {
		if (!audio) {
			audio = new Audio();
			audio.addEventListener('ended', () => {
				if (ysG >= firstG && ysG < lastG) ysPlay(ysG + 1);
				else stopYasin();
			});
			audio.addEventListener('error', () => {
				if (ysG >= 0) {
					toast(t('t_audio'));
					stopYasin();
				}
			});
		}
		return audio;
	}

	function ysPlay(g: number) {
		player.stop(); // like the sample: Yasin playback silences the mushaf player
		const a = getAudio();
		ysG = g;
		a.src = audioUrl(settings.value.qari, g);
		a.playbackRate = settings.value.speed;
		a.play().catch(() => {
			toast(t('t_audio'));
			stopYasin();
		});
		document.getElementById(`ys${g}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
	}

	function stopYasin() {
		ysG = -1;
		if (audio) {
			audio.pause();
			audio.removeAttribute('src');
		}
	}

	function tapAyah(g: number) {
		if (ysG === g) stopYasin();
		else ysPlay(g);
	}

	onDestroy(() => stopYasin());
</script>

{#snippet step(n: number, label: string, first = false)}
	<div class="ys-step flex items-center gap-2.5" class:ys-step-first={first}>
		<span
			class="grid h-7 w-7 flex-none place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground"
		>
			{n}
		</span>
		<h4 class="font-display text-[16.5px]">{label}</h4>
	</div>
{/snippet}

<PageHeader title={t('p_yasin')} back="/menu" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<div class="flex items-center justify-between px-0.5 pt-0.5 pb-2.5 text-[14.5px] font-medium">
		<span>{t('show_meaning')}</span>
		<Switch
			checked={maksud}
			onCheckedChange={(v: boolean) => (settings.value.mtMaksud = v)}
			aria-label={t('show_meaning')}
		/>
	</div>

	<!-- Langkah 1: Pembukaan — istighfar & selawat -->
	{@render step(1, t('ys_s1'), true)}
	{#each [0, 1] as i (i)}
		<div class="ys-b rounded-xl border-b px-1 py-3">
			<div class="ys-ar" dir="rtl" style="font-size: calc(var(--arabic-size) * 0.85); text-align: {arAlign};">
				<ArabicText
					text={data.doc.closing[i].arabic}
					taj={data.doc.closing[i].tajweed}
					scale={0.85}
					class="inline"
				/>
				<span class="ys-mrk ys-times">3&times;</span>
			</div>
			{#if maksud}<div class="ys-bm">{YS_M[ml][i]}</div>{/if}
		</div>
	{/each}

	<!-- Langkah 2: Hadiah Al-Fatihah -->
	{@render step(2, t('ys_s2'))}
	<div class="ys-b rounded-xl border-b px-1 py-3">
		<div class="ys-ar" dir="rtl" style="font-size: calc(var(--arabic-size) * 0.95); text-align: {arAlign};">
			{#each data.fatihah.ayahs as a (a.global)}
				<ArabicText
					text={`${a.ar} ﴿${toArabicNum(a.ayah)}﴾`}
					taj={a.taj}
					scale={0.95}
					class="inline"
				/>{' '}
			{/each}
		</div>
		{#if maksud}
			<div class="ys-bm">
				{data.fatihah.ayahs.map((a) => a.tr[settings.value.transLang]).join(' ')}
			</div>
		{/if}
	</div>

	<!-- Langkah 3: Bacaan Surah Yasin (83 ayat) -->
	{@render step(3, t('ys_s3'))}
	<div
		class="font-arabic mt-1 mb-2.5 text-center"
		dir="rtl"
		style="font-size: calc(var(--arabic-size) * 0.95);"
	>
		بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
	</div>
	{#each data.yasin.ayahs as a (a.global)}
		<button
			type="button"
			id="ys{a.global}"
			class="ys-b block w-full cursor-pointer rounded-xl border-b px-1 py-3 text-start transition-colors"
			class:playing={ysG === a.global}
			onclick={() => tapAyah(a.global)}
		>
			<div class="ys-ar" dir="rtl" style="font-size: calc(var(--arabic-size) * 0.95); text-align: {arAlign};">
				<ArabicText text={a.ar} taj={a.taj} scale={0.95} class="inline" />
				<span class="ys-mrk">{toArabicNum(a.ayah)}</span>
			</div>
			{#if maksud}<div class="ys-bm">{a.tr[settings.value.transLang]}</div>{/if}
		</button>
	{/each}

	<!-- Langkah 4: Doa penutup -->
	{@render step(4, t('ys_s4'))}
	<div class="ys-b rounded-xl border-b px-1 py-3">
		<div class="ys-ar" dir="rtl" style="font-size: calc(var(--arabic-size) * 0.85); text-align: {arAlign};">
			<ArabicText
				text={data.doc.closing[2].arabic}
				taj={data.doc.closing[2].tajweed}
				scale={0.85}
				class="inline"
			/>
		</div>
		{#if maksud}<div class="ys-bm">{YS_M[ml][2]}</div>{/if}
	</div>

	<p class="mt-3.5 text-xs leading-relaxed text-muted-foreground">{t('ys_note')}</p>
</div>

<style>
	.ys-step {
		margin: 18px 0 10px;
	}
	.ys-step-first {
		margin-top: 4px;
	}
	.ys-b.playing {
		background: var(--playing);
	}
	.ys-ar {
		line-height: 2.05;
	}
	.ys-bm {
		font-size: 13px;
		color: var(--muted-foreground);
		margin-top: 5px;
		line-height: 1.55;
	}
	.ys-mrk {
		display: inline-grid;
		place-items: center;
		min-width: 1.4em;
		height: 1.4em;
		padding: 0 0.1em;
		margin: 0 0.25em;
		border: 1.5px solid var(--gold);
		border-radius: 50%;
		font-size: 0.45em;
		font-family: 'Figtree', sans-serif;
		font-weight: 700;
		color: var(--gold);
		vertical-align: middle;
		line-height: 1;
	}
	.ys-times {
		font-size: 0.42em;
	}
</style>
