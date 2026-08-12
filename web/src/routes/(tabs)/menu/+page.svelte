<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import { auth } from '$lib/state/auth.svelte';
	import { t } from '$lib/state/i18n.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import {
		BookHeart,
		ChevronRight,
		Clock,
		Compass,
		Droplet,
		GraduationCap,
		HandHeart,
		Heart,
		ListChecks,
		ListOrdered,
		LogIn,
		LogOut,
		Moon,
		Percent,
		Search,
		Settings,
		Star,
		Sunrise,
		Target,
		UserRound
	} from '@lucide/svelte';

	const en = $derived(settings.value.uiLang === 'en');

	interface Mod {
		href: string;
		label: string;
		icon: typeof Clock;
	}
	const groups = $derived<{ title: string; mods: Mod[] }[]>([
		{
			title: t('modg_g1'),
			mods: [
				{ href: '/solat', label: t('mod_panelSolat'), icon: Clock },
				{ href: '/qibla', label: t('mod_panelQiblat'), icon: Compass },
				{ href: '/zikir', label: t('mod_panelZikir'), icon: HandHeart },
				{ href: '/mathurat', label: t('mathurat'), icon: Sunrise },
				{ href: '/yasin', label: t('p_yasin'), icon: BookHeart },
				{ href: '/selawat', label: t('p_selawat'), icon: Heart }
			]
		},
		{
			title: en ? 'Reference' : 'Rujukan',
			mods: [
				{ href: '/asma', label: t('mod_panelAsma'), icon: Star },
				{ href: '/doa', label: t('mod_panelDoa'), icon: Droplet },
				{ href: '/ibadah', label: t('p_ibadah'), icon: ListChecks },
				{ href: '/mengaji', label: t('p_mengaji'), icon: GraduationCap }
			]
		},
		{
			title: en ? 'Tools' : 'Alat',
			mods: [
				{ href: '/khatam', label: t('mod_panelSasaran'), icon: Target },
				{ href: '/puasa', label: t('p_puasa'), icon: Moon },
				{ href: '/zakat', label: t('p_zakat'), icon: Percent },
				{ href: '/search', label: t('srch_title'), icon: Search },
				{ href: '/surah', label: t('tab_surah'), icon: ListOrdered }
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
					<a
						href={m.href}
						class="flex items-center gap-2.5 rounded-2xl border bg-card px-3.5 py-3 text-[13.5px] font-medium transition-colors hover:bg-accent"
					>
						<m.icon size={19} class="shrink-0 text-primary" />
						<span class="truncate">{m.label}</span>
					</a>
				{/each}
			</div>
		</section>
	{/each}

	<section class="mb-5">
		<a
			href="/settings"
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
				href="/auth/login"
				class="mt-2 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 transition-colors hover:bg-accent"
			>
				<LogIn size={19} class="shrink-0 text-primary" />
				<span class="flex-1 text-[13.5px] font-medium">{en ? 'Sign in' : 'Log masuk'}</span>
				<ChevronRight size={17} class="text-muted-foreground" />
			</a>
		{/if}
	</section>
</div>
