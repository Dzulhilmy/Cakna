<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import { auth } from '$lib/state/auth.svelte';
	import { t } from '$lib/state/i18n.svelte';
	import { settings, mathuratState, todayKey } from '$lib/state/stores.svelte';
	import type { MathuratState } from '$lib/state/stores.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import {
		BookHeart,
		ChevronRight,
		Clock,
		Compass,
		Droplet,
		GraduationCap,
		HandHeart,
		Heart,
		LayoutGrid,
		ListChecks,
		ListOrdered,
		LogIn,
		LogOut,
		Moon,
		Percent,
		Radio,
		Search,
		Settings,
		ShieldCheck,
		Star,
		Sunrise,
		Target,
		UserRound
	} from '@lucide/svelte';

	const en = $derived(settings.value.uiLang === 'en');

	/* ── Mathurat quick-launch sheet ── */
	let showMathuratSheet = $state(false);
	let mtVersion = $state<'sughra' | 'kubra'>('sughra');
	let mtMode = $state<'pagi' | 'petang'>('pagi');

	const mtSt = $derived(mathuratState.value as MathuratState | null);
	const mtToday = $derived.by(() => {
		if (!mtSt) return { pagi: false, petang: false };
		const r = mtSt.rekod[todayKey()] ?? {};
		return { pagi: !!r.pagi, petang: !!r.petang };
	});
	const mtStreak = $derived.by(() => {
		if (!mtSt) return 0;
		let s = 0;
		const d = new Date();
		if (!mtSt.rekod[todayKey(d)]) d.setDate(d.getDate() - 1);
		while (mtSt.rekod[todayKey(d)]) { s++; d.setDate(d.getDate() - 1); }
		return s;
	});

	function openMathurat() {
		if (mtSt) {
			mtVersion = mtSt.version;
			mtMode = mtSt.mode;
		} else {
			mtMode = new Date().getHours() >= 12 ? 'petang' : 'pagi';
		}
		showMathuratSheet = true;
	}

	function launchMathurat() {
		showMathuratSheet = false;
		goto(`${base}/mathurat?v=${mtVersion}&m=${mtMode}`);
	}

	interface Mod {
		href: string;
		label: string;
		icon: typeof Clock;
	}
	const groups = $derived<{ title: string; mods: Mod[] }[]>([
		{
			title: t('modg_g1'),
			mods: [
				{ href: `${base}/solat`, label: t('mod_panelSolat'), icon: Clock },
				{ href: `${base}/qibla`, label: t('mod_panelQiblat'), icon: Compass },
				{ href: `${base}/zikir`, label: t('mod_panelZikir'), icon: HandHeart },
				{ href: `${base}/mathurat`, label: t('mathurat'), icon: Sunrise },
				{ href: `${base}/yasin`, label: t('p_yasin'), icon: BookHeart },
				{ href: `${base}/halaqah`, label: en ? 'Halaqah' : 'Halaqah', icon: Radio },
				{ href: `${base}/selawat`, label: t('p_selawat'), icon: Heart }
			]
		},
		{
			title: en ? 'Reference' : 'Rujukan',
			mods: [
				{ href: `${base}/asma`, label: t('mod_panelAsma'), icon: Star },
				{ href: `${base}/doa`, label: t('mod_panelDoa'), icon: Droplet },
				{ href: `${base}/ibadah`, label: t('p_ibadah'), icon: ListChecks },
				{ href: `${base}/mengaji`, label: t('p_mengaji'), icon: GraduationCap }
			]
		},
		{
			title: en ? 'Tools' : 'Alat',
			mods: [
				{ href: `${base}/khatam`, label: t('mod_panelSasaran'), icon: Target },
				{ href: `${base}/puasa`, label: t('p_puasa'), icon: Moon },
				{ href: `${base}/zakat`, label: t('p_zakat'), icon: Percent },
				{ href: `${base}/search`, label: t('srch_title'), icon: Search },
				{ href: `${base}/surah`, label: t('tab_surah'), icon: ListOrdered }
			]
		}
	]);

	let loggingOut = $state(false);
	async function logout() {
		loggingOut = true;
		try {
			await auth.logout();
		} finally {
			loggingOut = false;
		}
	}
</script>

<PageHeader title={en ? 'More' : 'Lagi'} back="/" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	{#each groups as g (g.title)}
		<section class="mb-5">
			<h2
				class="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
			>
				{g.title}
				<span class="font-normal">{g.mods.length}</span>
			</h2>
			<div class="grid grid-cols-2 gap-2">
				{#each g.mods as m (m.href)}
					{#if m.href === `${base}/mathurat`}
						<button
							onclick={openMathurat}
							class="flex items-center gap-2.5 rounded-2xl border bg-card px-3.5 py-3 text-[13.5px] font-medium transition-colors hover:bg-accent text-left"
						>
							<m.icon size={19} class="shrink-0 text-primary" />
							<span class="truncate">{m.label}</span>
						</button>
					{:else}
						<a
							href={m.href}
							class="flex items-center gap-2.5 rounded-2xl border bg-card px-3.5 py-3 text-[13.5px] font-medium transition-colors hover:bg-accent"
						>
							<m.icon size={19} class="shrink-0 text-primary" />
							<span class="truncate">{m.label}</span>
						</a>
					{/if}
				{/each}
			</div>
		</section>
	{/each}

	<section class="mb-5">
		{#if auth.user}
			<!-- Cakna Hub entry — visible to all logged-in users. Hub auth resolves
			     the user's role from the hub-server; non-members land as 'member'. -->
			<a
				href="/hub"
				data-sveltekit-reload
				class="mb-2 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3.5 transition-colors hover:bg-primary/10"
			>
				<LayoutGrid size={19} class="shrink-0 text-primary" />
				<span class="flex-1 text-[13.5px] font-medium">
					{en ? 'Cakna Hub' : 'Cakna Hub'}
				</span>
				<ChevronRight size={17} class="text-muted-foreground" />
			</a>
		{/if}
		{#if auth.user?.is_admin}
			<a
				href="/hub/admin"
				data-sveltekit-reload
				class="mb-2 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3.5 transition-colors hover:bg-primary/10"
			>
				<ShieldCheck size={19} class="shrink-0 text-primary" />
				<span class="flex-1 text-[13.5px] font-medium">
					{en ? 'Admin panel' : 'Panel Admin'}
				</span>
				<ChevronRight size={17} class="text-muted-foreground" />
			</a>
		{/if}

		<a
			href="{base}/settings"
			class="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 transition-colors hover:bg-accent"
		>
			<Settings size={19} class="shrink-0 text-primary" />
			<span class="flex-1 text-[13.5px] font-medium">{t('settings')}</span>
			<ChevronRight size={17} class="text-muted-foreground" />
		</a>

		{#if auth.user}
			<div class="mt-2 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5">
				<UserRound size={19} class="shrink-0 text-primary" />
				<div class="min-w-0 flex-1">
					<div class="truncate text-[13.5px] font-medium">{auth.user.email}</div>
					<div class="text-[11px] text-muted-foreground">
						{en ? 'Signed in' : 'Log masuk sebagai'}
					</div>
				</div>
				<Button variant="outline" size="sm" onclick={logout} disabled={loggingOut}>
					<LogOut size={15} />
					{en ? 'Sign out' : 'Log keluar'}
				</Button>
			</div>
		{:else}
			<a
				href="{base}/auth/login"
				class="mt-2 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 transition-colors hover:bg-accent"
			>
				<LogIn size={19} class="shrink-0 text-primary" />
				<span class="flex-1 text-[13.5px] font-medium">{en ? 'Sign in' : 'Log masuk'}</span>
				<ChevronRight size={17} class="text-muted-foreground" />
			</a>
		{/if}
	</section>
</div>

<!-- ── Mathurat quick-launch sheet ── -->
{#if showMathuratSheet}
	<!-- backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/40"
		role="presentation"
		onclick={() => (showMathuratSheet = false)}
	></div>

	<!-- sheet -->
	<div class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[520px] rounded-t-3xl bg-card shadow-2xl">
		<!-- drag handle -->
		<div class="flex justify-center pt-3 pb-1">
			<div class="h-1 w-10 rounded-full bg-muted-foreground/30"></div>
		</div>

		<div class="px-5 pb-8 pt-2">
			<!-- header -->
			<div class="mb-4 flex items-center justify-between">
				<div>
					<p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
						Al-Ma'thurat
					</p>
					<h2 class="mt-0.5 text-[18px] font-bold leading-tight">Pilih wirid</h2>
				</div>
				<button
					onclick={() => (showMathuratSheet = false)}
					class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
					aria-label="Tutup"
				>✕</button>
			</div>

			<!-- today's progress -->
			<div class="mb-4 flex items-center gap-3 rounded-2xl border bg-muted/40 px-4 py-3">
				<div class="flex-1">
					{#if mtStreak > 0}
						<p class="text-[14px] font-bold text-emerald-700 dark:text-emerald-400">🔥 {mtStreak} hari berturut-turut</p>
					{:else}
						<p class="text-[14px] font-bold text-muted-foreground">Mulakan istiqamah hari ini</p>
					{/if}
					<p class="mt-0.5 text-[12px] text-muted-foreground">
						Hari ini:
						{#if mtToday.pagi && mtToday.petang}
							Pagi ✓ · Petang ✓
						{:else if mtToday.pagi}
							Pagi ✓ · Petang belum
						{:else if mtToday.petang}
							Pagi belum · Petang ✓
						{:else}
							Belum ada sesi hari ini
						{/if}
					</p>
				</div>
			</div>

			<!-- version picker -->
			<p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Versi wirid</p>
			<div class="mb-4 grid grid-cols-2 gap-2">
				{#each [{ v: 'sughra', label: 'Sughra', sub: '32 bacaan' }, { v: 'kubra', label: 'Kubra', sub: '46 bacaan' }] as opt (opt.v)}
					<button
						onclick={() => (mtVersion = opt.v as 'sughra' | 'kubra')}
						class="rounded-2xl border-2 px-4 py-3 text-left transition-all
							{mtVersion === opt.v
								? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-600'
								: 'border-border bg-card text-foreground hover:bg-accent'}"
					>
						<div class="text-[15px] font-bold">{opt.label}</div>
						<div class="text-[11px] opacity-75">{opt.sub}</div>
					</button>
				{/each}
			</div>

			<!-- mode picker -->
			<p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Waktu</p>
			<div class="mb-5 grid grid-cols-2 gap-2">
				{#each [{ m: 'pagi', emoji: '🌅', label: 'Pagi', sub: 'Subuh — Zohor', done: mtToday.pagi }, { m: 'petang', emoji: '🌇', label: 'Petang', sub: 'Asar — Maghrib', done: mtToday.petang }] as opt (opt.m)}
					<button
						onclick={() => (mtMode = opt.m as 'pagi' | 'petang')}
						class="relative rounded-2xl border-2 px-4 py-3 text-left transition-all
							{mtMode === opt.m
								? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-600'
								: 'border-border bg-card text-foreground hover:bg-accent'}"
					>
						{#if opt.done}
							<span class="absolute right-3 top-2.5 text-[10px] font-bold
								{mtMode === opt.m ? 'text-white/80' : 'text-emerald-600 dark:text-emerald-400'}">✓ Selesai</span>
						{/if}
						<div class="mb-0.5 text-[20px]">{opt.emoji}</div>
						<div class="text-[15px] font-bold">{opt.label}</div>
						<div class="text-[11px] opacity-75">{opt.sub}</div>
					</button>
				{/each}
			</div>

			<!-- launch button -->
			<button
				onclick={launchMathurat}
				class="w-full rounded-2xl bg-emerald-600 px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-emerald-700/30 transition-opacity hover:opacity-90 active:opacity-80"
			>
				Mula Wirid {mtVersion === 'sughra' ? 'Sughra' : 'Kubra'} — {mtMode === 'pagi' ? 'Pagi' : 'Petang'}
			</button>
		</div>
	</div>
{/if}
