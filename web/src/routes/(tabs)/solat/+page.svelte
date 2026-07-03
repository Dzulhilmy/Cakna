<script lang="ts">
	// Waktu Solat — port of the sample's panelSolat (index.html L1069+, logic L3830+),
	// city select (L3854+), in-page azan notifications (L3091+).
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import HijriCalendarCard from '$lib/components/modules/HijriCalendarCard.svelte';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { t } from '$lib/state/i18n.svelte';
	import { solat } from '$lib/state/solat.svelte';
	import { city, settings } from '$lib/state/stores.svelte';
	import { ALL_PRAYERS, fmtT, nextPrayer, nowInTz } from '$lib/utils/solar';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	onMount(() => {
		solat.loadCities();
		const iv = setInterval(() => solat.tick++, 30000); // sample refreshes every 30s
		return () => clearInterval(iv);
	});

	// refetch official JAKIM times whenever the location changes
	$effect(() => {
		void city.value;
		solat.loadOfficial();
	});

	/* ---------- City select ---------- */
	let citySel = $state('0');
	$effect(() => {
		citySel = typeof city.value === 'object' && city.value !== null ? 'gps' : String(city.value);
	});
	const cityLabel = $derived(
		citySel === 'gps' ? '📍 ' + t('gps_loc') : (solat.cities[+citySel]?.name ?? t('loc'))
	);

	async function onCityChange(v: string) {
		if (v === 'gps') {
			if (!navigator.geolocation) {
				toast(t('t_gps_err'));
				citySel = typeof city.value === 'number' ? String(city.value) : '0';
				return;
			}
			toast(t('t_gps_wait'));
			try {
				const loc = await solat.useGps();
				solat.gpsName = t('gps_loc');
				toast(t('t_gps_ok', { c: loc.lat.toFixed(2) + ', ' + loc.lng.toFixed(2) }));
			} catch {
				toast(t('t_gps_err'));
				citySel = typeof city.value === 'number' ? String(city.value) : '0';
			}
			return;
		}
		city.value = +v;
	}

	/* ---------- Next prayer + times ---------- */
	const np = $derived(solat.next);
	const countText = $derived.by(() => {
		if (!np || !isFinite(np.diff)) return '';
		const j = Math.floor(np.diff);
		const m = Math.floor((np.diff - j) * 60);
		return t('next_in', { t: (j > 0 ? j + ' ' + t('jam') + ' ' : '') + m + ' ' + t('minit') });
	});

	/* ---------- Azan notifications (while the app is open) ---------- */
	let azTimer: ReturnType<typeof setTimeout> | null = null;

	function fireAzan(n: string) {
		try {
			if (typeof Notification !== 'undefined' && Notification.permission === 'granted')
				new Notification(t('t_azan', { n }), { body: (solat.loc?.name ?? '') + ' · Cakna' });
		} catch {
			/* notifications unavailable */
		}
		toast(t('t_azan', { n }));
		if (navigator.vibrate) navigator.vibrate([250, 120, 250]);
	}

	function scheduleAzan() {
		if (azTimer) clearTimeout(azTimer);
		azTimer = null;
		if (!settings.value.azan) return;
		const l = solat.loc;
		if (!l) return;
		try {
			// official JAKIM times when available, astronomical otherwise
			const np = solat.next ?? nextPrayer(l.lat, l.lng, l.tz);
			let ms = np.diff * 3600000;
			// sample fallback: high-latitude tomorrow-Subuh NaN -> assume 05:00
			if (!isFinite(ms)) ms = (24 - nowInTz(l.tz) + 5) * 3600000;
			azTimer = setTimeout(() => {
				fireAzan(np.name);
				azTimer = setTimeout(scheduleAzan, 65000);
			}, Math.max(1000, ms));
		} catch {
			/* keep silent, like the sample */
		}
	}

	// (Re)schedule whenever the toggle or the location changes; clear on destroy.
	$effect(() => {
		void settings.value.azan;
		void solat.loc;
		scheduleAzan();
		return () => {
			if (azTimer) clearTimeout(azTimer);
			azTimer = null;
		};
	});

	async function onAzanToggle(on: boolean) {
		if (on && typeof Notification !== 'undefined' && Notification.permission === 'default') {
			try {
				await Notification.requestPermission();
			} catch {
				/* ignored */
			}
		}
		toast(on ? t('t_azan_on') : t('t_azan_off'));
	}
</script>

<PageHeader title={t('p_solat')} back="/" />

<div class="mx-auto flex max-w-[680px] flex-col gap-3 px-4 py-4">
	<!-- Lokasi -->
	<div class="rounded-2xl border bg-card p-4">
		<div class="mb-2 text-[11px] font-bold tracking-[.09em] uppercase text-muted-foreground">
			{t('loc')}
		</div>
		<Select.Root type="single" bind:value={citySel} onValueChange={onCityChange}>
			<Select.Trigger class="w-full">{cityLabel}</Select.Trigger>
			<Select.Content>
				<Select.Item value="gps">📍 {t('gps_loc')}</Select.Item>
				<Select.Group>
					<Select.GroupHeading>Malaysia</Select.GroupHeading>
					{#each solat.cities as c, i (c.id)}
						{#if c.is_malaysia}<Select.Item value={String(i)}>{c.name}</Select.Item>{/if}
					{/each}
				</Select.Group>
				<Select.Group>
					<Select.GroupHeading>{t('intl')}</Select.GroupHeading>
					{#each solat.cities as c, i (c.id)}
						{#if !c.is_malaysia}<Select.Item value={String(i)}>{c.name}</Select.Item>{/if}
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Waktu seterusnya + senarai waktu -->
	{#if np}
		<div class="rounded-2xl border bg-card p-4">
			<div class="pt-1.5 pb-3 text-center">
				<div class="text-[13px] font-bold tracking-[.05em] text-gold">{countText}</div>
				<div class="font-display text-[26px]">{np.name}</div>
			</div>
			<div>
				{#each ALL_PRAYERS as k (k)}
					<div
						class="flex items-center justify-between border-b px-1 py-[11px] text-[14.5px] last:border-b-0 {k ===
						np.name
							? 'rounded-lg bg-accent px-2 font-bold text-primary'
							: ''}"
					>
						<span>{k}</span>
						<b class="tabular-nums">{fmtT(np.times[k])}</b>
					</div>
				{/each}
			</div>
			<div class="pt-2 text-center text-[11px] tracking-wide text-muted-foreground">
				{#if solat.official}
					✓ {settings.value.uiLang === 'en'
						? `Official JAKIM e-Solat times · Zone ${solat.official.zone}`
						: `Waktu rasmi JAKIM e-Solat · Zon ${solat.official.zone}`}
				{:else}
					{settings.value.uiLang === 'en'
						? 'Astronomical estimate (Subuh 20°, Isyak 18°)'
						: 'Anggaran astronomi (Subuh 20°, Isyak 18°)'}
				{/if}
			</div>
		</div>
	{/if}

	<!-- Notifikasi azan -->
	<div class="rounded-2xl border bg-card p-4">
		<div class="flex items-center justify-between gap-3 px-0.5 py-1">
			<span class="text-sm">{t('azan_lbl')}</span>
			<Switch bind:checked={settings.value.azan} onCheckedChange={onAzanToggle} />
		</div>
		<div class="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t('azan_note')}</div>
	</div>

	<!-- Kalendar Hijrah -->
	<HijriCalendarCard events={data.events} />

	<!-- Nota -->
	<div class="rounded-2xl border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
		{t('note_solat')}
	</div>
</div>
