<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import { gToSA, juzOf, pageRange, SURAHS, TOTAL_PAGES } from '$lib/quran/meta';
	import { t } from '$lib/state/i18n.svelte';
	import { solat } from '$lib/state/solat.svelte';
	import { read, settings } from '$lib/state/stores.svelte';
	import { hijriParts, isFastDay } from '$lib/utils/hijri';
	import { fmtT, nowInTz } from '$lib/utils/solar';
	import {
		BookOpen,
		Clock,
		Compass,
		Droplet,
		HandHeart,
		MapPin,
		Star,
		Target
	} from '@lucide/svelte';

	// Refresh the clock/prayer countdown every 30 s, like the sample's solat timer.
	onMount(() => {
		solat.loadCities();
		const iv = setInterval(() => solat.tick++, 30000);
		return () => clearInterval(iv);
	});

	const now = $derived.by(() => {
		void solat.tick;
		return new Date();
	});

	// Greeting + dates (sample renderHome L3519+)
	const greetKey = $derived(
		now.getHours() < 12 ? 'greet_am' : now.getHours() < 19 ? 'greet_pm' : 'greet_ev'
	);
	const dateStr = $derived(
		now.toLocaleDateString(settings.value.uiLang === 'en' ? 'en-GB' : 'ms-MY', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);
	const hijri = $derived(hijriParts(now, settings.value.uiLang));
	const fast = $derived(isFastDay(now));

	// Sambung bacaan
	const pg = $derived(settings.value.page);
	const firstG = $derived(pageRange(pg)[0]);
	const surahName = $derived(SURAHS[gToSA(firstG).s - 1].name_translit);
	const readCount = $derived(read.value.length);
	const pct = $derived(Math.round((readCount / TOTAL_PAGES) * 100));

	// Solat seterusnya
	const next = $derived(solat.next);
	const nextTime = $derived.by(() => {
		if (!next || !solat.loc || !isFinite(next.diff)) return '—';
		// now + diff = the prayer's clock time (also correct for tomorrow's Subuh)
		return fmtT(nowInTz(solat.loc.tz) + next.diff);
	});
	const countdown = $derived.by(() => {
		if (!next || !isFinite(next.diff)) return '';
		const j = Math.floor(next.diff);
		const m = Math.floor((next.diff - j) * 60);
		return t('next_in', { t: (j > 0 ? `${j} ${t('jam')} ` : '') + `${m} ${t('minit')}` });
	});

	const shortcuts = [
		{ href: '/solat', key: 'mod_panelSolat', icon: Clock },
		{ href: '/qibla', key: 'mod_panelQiblat', icon: Compass },
		{ href: '/zikir', key: 'mod_panelZikir', icon: HandHeart },
		{ href: '/asma', key: 'mod_panelAsma', icon: Star },
		{ href: '/doa', key: 'mod_panelDoa', icon: Droplet },
		{ href: '/khatam', key: 'mod_panelSasaran', icon: Target }
	];
</script>

<div class="mx-auto max-w-[680px] px-4 py-4">
	<!-- Brand -->
	<div class="flex items-center gap-3 pt-1">
		<div class="grid h-10 w-10 place-items-center rounded-2xl border border-gold-soft text-gold">
			<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6" class="h-7 w-7">
				<path d="M22 2 l5.9 8.2 9.6 2.4 -6.2 7.7 .7 9.9 -10 -3.7 -10 3.7 .7 -9.9 -6.2 -7.7 9.6 -2.4 Z" />
				<circle cx="22" cy="18" r="5.5" />
				<path d="M13 36 h18 M16 41 h12" stroke-linecap="round" />
			</svg>
		</div>
		<div class="min-w-0 flex-1">
			<h1 class="font-display text-[22px] leading-tight">Cakna</h1>
			<p class="text-[11px] tracking-wide text-muted-foreground">{t('sub')}</p>
		</div>
	</div>

	<!-- Greeting + date hero -->
	<div class="mt-5">
		<div class="font-display text-xl">{t(greetKey)}</div>
		<p class="mt-1 text-[13px] leading-relaxed text-muted-foreground">
			{dateStr}
			{#if hijri}
				<br />{hijri.str}{#if fast.any}<b class="text-gold">&nbsp;· ✦ {t('fast_today')}</b>{/if}
			{/if}
		</p>
	</div>

	<!-- Sambung bacaan -->
	<a
		href={`/read/${pg}`}
		class="mt-4 block rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm transition-transform active:scale-[0.99]"
	>
		<div class="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-80">
			{t('h_cont')}
		</div>
		<div class="mt-1 font-display text-xl">{t('page')} {pg} · {surahName}</div>
		<div class="mt-0.5 text-[12px] opacity-80">
			{t('juz')} {juzOf(firstG)} · {readCount} / {TOTAL_PAGES} {t('st_pages')} ({pct}%)
		</div>
		<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-foreground/20">
			<div
				class="h-full rounded-full bg-[var(--gold)]"
				style={`width:${(readCount / TOTAL_PAGES) * 100}%`}
			></div>
		</div>
	</a>

	<!-- Solat seterusnya -->
	<a
		href="/solat"
		class="mt-3 flex items-center gap-3 rounded-2xl border bg-card p-4 transition-transform active:scale-[0.99]"
	>
		<div class="min-w-0 flex-1">
			<div class="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
				{t('h_next_prayer')}
			</div>
			<div class="mt-0.5 font-display text-xl">{next?.name ?? '—'}</div>
			{#if countdown}
				<div class="text-[12px] text-muted-foreground">{countdown}</div>
			{/if}
			{#if solat.loc}
				<div class="mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground">
					<MapPin size={12} class="shrink-0" />
					<span class="truncate">{solat.loc.name}</span>
				</div>
			{/if}
		</div>
		<div class="font-display text-2xl text-gold">{nextTime}</div>
	</a>

	<!-- Kemajuan khatam -->
	<a
		href="/khatam"
		class="mt-3 block rounded-2xl border bg-card p-4 transition-transform active:scale-[0.99]"
	>
		<div class="flex items-baseline justify-between gap-2 text-[13px]">
			<span class="text-muted-foreground">{t('st_prog')}</span>
			<b>{readCount} / {TOTAL_PAGES} {t('st_pages')}</b>
		</div>
		<Progress value={readCount} max={TOTAL_PAGES} class="mt-2.5 h-2" />
	</a>

	<!-- Modul -->
	<div class="mt-5">
		<div class="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
			{t('h_mods')}
		</div>
		<div class="mt-2 grid grid-cols-2 gap-2">
			{#each shortcuts as s (s.href)}
				<a
					href={s.href}
					class="flex items-center gap-2.5 rounded-2xl border bg-card px-3.5 py-3 text-[13.5px] font-medium transition-colors hover:bg-accent"
				>
					<s.icon size={19} class="shrink-0 text-primary" />
					<span class="truncate">{t(s.key)}</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- Buka mushaf -->
	<Button href="/read" class="mt-5 h-12 w-full rounded-2xl text-[15px]">
		<BookOpen size={18} />
		{t('h_open')}
	</Button>
</div>
