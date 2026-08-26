<script lang="ts">
	import {
		Home,
		BookOpen,
		Clock,
		BookMarked,
		Radio,
		HandHeart,
		Heart,
		Star,
		Droplet,
		Compass,
		Moon,
		Sun,
		Percent,
		Search,
		ListOrdered,
		BookHeart,
		GraduationCap,
		Target,
		Grid2X2,
		X,
		ChevronRight,
		ChevronLeft
	} from 'lucide-svelte';
	import MathuratPicker from './MathuratPicker.svelte';
	import { settings } from '$lib/state/stores.svelte';

	const isDark = $derived(settings.value.theme === 'dark');
	function toggleTheme() {
		settings.value.theme = isDark ? 'light' : 'dark';
	}

	let { active = 'home' }: { active?: string } = $props();

	let moreOpen = $state(false);
	let mathuratOpen = $state(false);
	let navCollapsed = $state(false);

	$effect(() => {
		navCollapsed = window.innerWidth < 768;
	});

	function toggleNav() {
		navCollapsed = !navCollapsed;
		if (navCollapsed) {
			moreOpen = false;
			mathuratOpen = false;
		}
	}

	const mainNav = [
		{ id: 'home', icon: Home, label: 'Utama', href: '/hub' },
		{ id: 'mushaf', icon: BookOpen, label: 'Mushaf Digital', href: '/mushaf' },
		{ id: 'solat', icon: Clock, label: 'Waktu Solat', href: '/solat' },
		{ id: 'mathurat', icon: BookMarked, label: "Al-Ma'thurat", href: '/mathurat' },
		{ id: 'halaqah', icon: Radio, label: 'Halaqah', href: '/halaqah' }
	];

	const moreItems = [
		{ label: 'Zikir & Tasbih', href: '/zikir', icon: HandHeart },
		{ label: 'Selawat Nabi', href: '/selawat', icon: Heart },
		{ label: 'Asmaul Husna', href: '/asma', icon: Star },
		{ label: 'Doa Al-Quran', href: '/doa', icon: Droplet },
		{ label: 'Kiblat', href: '/qibla', icon: Compass },
		{ label: 'Rekod Puasa', href: '/puasa', icon: Moon },
		{ label: 'Kalkulator Zakat', href: '/zakat', icon: Percent },
		{ label: 'Cari Ayat', href: '/search', icon: Search },
		{ label: 'Senarai Surah', href: '/surah', icon: ListOrdered },
		{ label: 'Surah Yasin', href: '/yasin', icon: BookHeart },
		{ label: 'Panduan Ibadah', href: '/ibadah', icon: GraduationCap },
		{ label: 'Asas Mengaji', href: '/mengaji', icon: GraduationCap },
		{ label: 'Khatam', href: '/khatam', icon: Target }
	];
</script>

<!-- Backdrop overlays -->
{#if moreOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-40" onclick={() => (moreOpen = false)}></div>
{/if}
{#if mathuratOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-40" onclick={() => (mathuratOpen = false)}></div>
{/if}

<!-- Pill sidebar -->
<div class="nav-outer" class:collapsed={navCollapsed}>
	<nav class="flex flex-col items-center" aria-label="Main navigation">
		<div class="side-pill flex flex-col items-center gap-1 rounded-[2rem] px-2 py-3">
			<!-- Logo -->
			<div class="logo-btn mb-2 flex h-10 w-10 items-center justify-center rounded-full overflow-hidden">
				<img src="/logo.jpg" alt="Cakna" class="h-full w-full object-contain" />
			</div>

			<!-- Nav items -->
			{#each mainNav as item (item.id)}
				{#if item.id === 'mathurat'}
					<button
						onclick={() => { mathuratOpen = !mathuratOpen; moreOpen = false; }}
						class="nav-item relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200"
						class:active={mathuratOpen || active === item.id}
						aria-label={item.label}
						title={item.label}
					>
						<item.icon size={20} strokeWidth={1.8} />
						<span class="tooltip pointer-events-none absolute left-14 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium opacity-0 transition-opacity duration-150">
							{item.label}
						</span>
					</button>
				{:else}
					<a
						href={item.href}
						class="nav-item relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200"
						class:active={active === item.id}
						aria-label={item.label}
						title={item.label}
					>
						<item.icon size={20} strokeWidth={1.8} />
						<span class="tooltip pointer-events-none absolute left-14 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium opacity-0 transition-opacity duration-150">
							{item.label}
						</span>
					</a>
				{/if}
			{/each}

			<!-- Divider -->
			<div class="divider my-1 h-px w-8 rounded-full"></div>

			<!-- More button -->
			<button
				onclick={() => (moreOpen = !moreOpen)}
				class="nav-item flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200"
				class:active={moreOpen}
				aria-label="Lagi"
				title="Lagi"
			>
				{#if moreOpen}
					<X size={20} strokeWidth={1.8} />
				{:else}
					<Grid2X2 size={20} strokeWidth={1.8} />
				{/if}
			</button>

			<!-- Theme toggle -->
			<button
				onclick={toggleTheme}
				class="theme-btn flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200"
				aria-label={isDark ? 'Mod Cerah' : 'Mod Gelap'}
				title={isDark ? 'Tukar ke Mod Cerah' : 'Tukar ke Mod Gelap'}
			>
				{#if isDark}
					<Sun size={18} strokeWidth={1.8} />
				{:else}
					<Moon size={18} strokeWidth={1.8} />
				{/if}
			</button>
		</div>
	</nav>

	<!-- Collapse toggle tab -->
	<button
		class="collapse-toggle"
		onclick={toggleNav}
		aria-label={navCollapsed ? 'Buka navigasi' : 'Tutup navigasi'}
	>
		{#if navCollapsed}
			<ChevronRight size={14} strokeWidth={2.5} />
		{:else}
			<ChevronLeft size={14} strokeWidth={2.5} />
		{/if}
	</button>
</div>

<!-- Mathurat picker panel -->
{#if mathuratOpen && !navCollapsed}
	<div class="more-panel fixed left-20 top-1/2 z-50 w-64 -translate-y-1/2 overflow-hidden rounded-2xl">
		<MathuratPicker onclose={() => (mathuratOpen = false)} />
	</div>
{/if}

<!-- More panel -->
{#if moreOpen && !navCollapsed}
	<div
		class="more-panel fixed left-20 top-1/2 z-50 w-56 -translate-y-1/2 overflow-hidden rounded-2xl"
		style="max-height: min(480px, 85vh)"
	>
		<div class="flex items-center justify-between px-4 py-3">
			<span class="text-xs font-semibold uppercase tracking-widest text-white/40">Lagi</span>
		</div>
		<div class="overflow-y-auto px-2 pb-3" style="max-height: calc(min(480px, 85vh) - 44px)">
			{#each moreItems as item (item.href)}
				<a
					href={item.href}
					class="more-item flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150"
					onclick={() => (moreOpen = false)}
				>
					<span class="more-icon flex h-7 w-7 items-center justify-center rounded-lg">
						<item.icon size={15} strokeWidth={1.8} />
					</span>
					<span class="text-sm font-medium text-white/80">{item.label}</span>
					<ChevronRight size={14} class="ml-auto text-white/30" />
				</a>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Brand palette: cakna.org rose — #b34a6e (600), #6e2942 (800) */

	.nav-outer {
		position: fixed;
		left: 0;
		top: 50%;
		z-index: 50;
		display: flex;
		align-items: center;
		transform: translateY(-50%) translateX(1rem);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Pill is ~60px wide (px-2 = 8px each side + w-11 = 44px) */
	.nav-outer.collapsed {
		transform: translateY(-50%) translateX(-60px);
	}

	.collapse-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 44px;
		background: rgba(84, 32, 47, 0.75);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.09);
		border-left: none;
		border-radius: 0 0.6rem 0.6rem 0;
		color: rgba(255, 255, 255, 0.55);
		cursor: pointer;
		transition: color 0.15s, background 0.15s;
		box-shadow: 3px 0 10px rgba(0, 0, 0, 0.25);
		flex-shrink: 0;
	}

	.collapse-toggle:hover {
		color: rgba(255, 255, 255, 0.95);
		background: rgba(110, 41, 66, 0.85);
	}

	.side-pill {
		background: rgba(84, 32, 47, 0.75);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.09);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.35),
			inset 0 1px 0 rgba(255, 255, 255, 0.07);
	}

	.logo-btn {
		background: rgba(179, 74, 110, 0.55);
		color: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.nav-item {
		color: rgba(255, 255, 255, 0.5);
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.09);
		color: rgba(255, 255, 255, 0.9);
	}

	.nav-item.active {
		background: rgba(255, 255, 255, 0.95);
		color: #6e2942;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.nav-item:hover .tooltip {
		opacity: 1;
	}

	.tooltip {
		background: rgba(84, 32, 47, 0.92);
		backdrop-filter: blur(8px);
		color: rgba(255, 255, 255, 0.92);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.divider {
		background: rgba(255, 255, 255, 0.09);
	}

	.more-panel {
		background: rgba(58, 21, 32, 0.93);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.09);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
	}

	.more-item:hover {
		background: rgba(255, 255, 255, 0.07);
	}

	.more-icon {
		background: rgba(179, 74, 110, 0.35);
		color: rgba(255, 255, 255, 0.65);
	}

	.theme-btn {
		color: rgba(255, 255, 255, 0.45);
	}

	.theme-btn:hover {
		background: rgba(255, 255, 255, 0.09);
		color: rgba(255, 255, 255, 0.9);
	}
</style>
