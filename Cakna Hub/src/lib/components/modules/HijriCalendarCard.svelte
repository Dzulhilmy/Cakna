<script lang="ts">
	// Hijri calendar card — port of the sample's renderHijri() (index.html L3036+).
	import type { HijriEvent } from '$lib/api/types';
	import { t } from '$lib/state/i18n.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { hijriParts, isFastDay, nextBidh, upcomingEvents } from '$lib/utils/hijri';

	let { events }: { events: HijriEvent[] } = $props();

	const cal = $derived.by(() => {
		const lang = settings.value.uiLang;
		const hp = hijriParts(new Date(), lang);
		if (!hp) return null; // sample hides the card when ICU has no islamic calendar
		const en = lang === 'en';
		const locale = en ? 'en-GB' : 'ms-MY';
		const fmt = (d: Date) =>
			d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
		const today = new Date();
		const f = isFastDay(today);
		const why = [
			f.mon ? (en ? 'Monday' : 'Isnin') : '',
			f.thu ? (en ? 'Thursday' : 'Khamis') : '',
			f.bidh ? 'Ayyamul Bidh' : ''
		]
			.filter(Boolean)
			.join(' · ');
		// Next Monday & Thursday
		let nMon: Date | null = null;
		let nThu: Date | null = null;
		for (let i = 1; i <= 7; i++) {
			const d = new Date(today.getTime() + i * 86400000);
			if (d.getDay() === 1 && !nMon) nMon = d;
			if (d.getDay() === 4 && !nThu) nThu = d;
		}
		// Next Ayyamul Bidh (hijri 13-15)
		const bidhStart = nextBidh(today);
		const upcoming = upcomingEvents(events, today).map((x) => ({
			label: t(x.key),
			date: x.date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
		}));
		return {
			str: hp.str,
			fastWhy: f.any ? why : null,
			monThu: (nMon ? fmt(nMon) : '—') + ' · ' + (nThu ? fmt(nThu) : '—'),
			bidh: bidhStart
				? fmt(bidhStart) + ' – ' + fmt(new Date(bidhStart.getTime() + 2 * 86400000))
				: null,
			upcoming
		};
	});
</script>

{#if cal}
	<div class="rounded-2xl border bg-card p-4">
		<div class="mb-2 text-[11px] font-bold tracking-[.09em] uppercase text-muted-foreground">
			{t('hijri_title')}
		</div>
		<div class="my-0.5 font-display text-xl">{cal.str}</div>
		{#if cal.fastWhy}
			<div class="mb-1.5 text-[13px] font-bold text-gold">✦ {t('fast_today')} ({cal.fastWhy})</div>
		{/if}
		<div class="text-[12.5px] leading-[1.9] text-muted-foreground">
			<b class="text-foreground">{t('fast_mon')}:</b>
			{cal.monThu}<br />
			{#if cal.bidh}
				<b class="text-foreground">{t('fast_bidh')}:</b>
				{cal.bidh}
			{/if}
		</div>
		{#if cal.upcoming.length}
			<div class="mt-2.5 text-xs font-extrabold tracking-[.06em] uppercase text-muted-foreground">
				{t('hijri_events')}
			</div>
			<table class="w-full border-collapse text-[13.5px]">
				<tbody>
					{#each cal.upcoming as ev (ev.label)}
						<tr class="border-b last:border-b-0">
							<td class="px-1 py-2">{ev.label}</td>
							<td class="px-1 py-2 text-right font-bold text-primary">{ev.date}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
		<div class="mt-2.5 text-xs leading-relaxed text-muted-foreground">{t('hijri_note')}</div>
	</div>
{/if}
