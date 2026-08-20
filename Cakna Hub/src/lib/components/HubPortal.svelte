<script lang="ts">
	import {
		BookOpen,
		Clock,
		BookMarked,
		Radio,
		HandHeart,
		Compass,
		Heart,
		Star,
		Search,
		Moon
	} from 'lucide-svelte';
	import HubShell from './HubShell.svelte';

	const quickCards = [
		{ label: 'Mushaf Digital', sublabel: 'Baca Al-Quran', href: '/mushaf', icon: BookOpen },
		{ label: 'Waktu Solat', sublabel: 'Jadual solat hari ini', href: '/solat', icon: Clock },
		{ label: "Al-Ma'thurat", sublabel: 'Wirid pagi & petang', href: '/mathurat', icon: BookMarked },
		{ label: 'Halaqah', sublabel: 'Sesi pembelajaran', href: '/halaqah', icon: Radio },
		{ label: 'Zikir & Tasbih', sublabel: 'Zikir harian', href: 'https://cakna.org/zikir', icon: HandHeart },
		{ label: 'Kiblat', sublabel: 'Arah kiblat', href: 'https://cakna.org/qibla', icon: Compass },
		{ label: 'Selawat Nabi', sublabel: 'Selawat & salutasi', href: 'https://cakna.org/selawat', icon: Heart },
		{ label: 'Asmaul Husna', sublabel: '99 nama Allah', href: 'https://cakna.org/asma', icon: Star },
		{ label: 'Cari Ayat', sublabel: 'Carian dalam Al-Quran', href: 'https://cakna.org/search', icon: Search },
		{ label: 'Rekod Puasa', sublabel: 'Jejaki puasa sunat', href: 'https://cakna.org/puasa', icon: Moon }
	];
</script>

<HubShell active="home">
	<header class="mb-10 pt-4">
		<p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400/60">
			Selamat datang
		</p>
		<h1 class="mt-1 text-3xl font-bold tracking-tight text-white lg:text-4xl">
			Cakna <span class="text-rose-400">Hub</span>
		</h1>
		<p class="mt-2 text-sm text-white/40">
			Portal akses pantas kepada semua ciri Mushaf Digital.
		</p>
	</header>

	<section>
		<h2 class="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30">
			Akses Pantas
		</h2>
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each quickCards as card (card.href)}
				<a href={card.href} class="card group flex flex-col gap-3 rounded-2xl p-4 transition-all duration-200">
					<div class="card-icon flex h-10 w-10 items-center justify-center rounded-xl">
						<card.icon size={20} strokeWidth={1.7} />
					</div>
					<div>
						<div class="text-sm font-semibold text-white/85 transition-colors duration-150 group-hover:text-white">
							{card.label}
						</div>
						<div class="mt-0.5 text-[11px] text-white/35">
							{card.sublabel}
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<footer class="mt-auto pt-12 pb-4">
		<a
			href="https://cakna.org"
			class="inline-flex items-center gap-1.5 text-xs text-white/20 transition-colors hover:text-white/40"
		>
			cakna.org
		</a>
	</footer>
</HubShell>

<style>
	.card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.card:hover {
		background: rgba(255, 255, 255, 0.07);
		border-color: rgba(255, 255, 255, 0.1);
		transform: translateY(-1px);
	}

	.card-icon {
		background: rgba(34, 197, 94, 0.12);
		color: rgba(74, 222, 128, 0.85);
	}
</style>
