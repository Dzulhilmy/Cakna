<script lang="ts">
	import { onMount } from 'svelte';
	import { city } from '$lib/state/stores.svelte';
	import { fmtT, ALL_PRAYERS, nextPrayer, prayerTimes, nowInTz, tzOffset, MAIN_PRAYERS, type NextPrayer, type PrayerTimes } from '$lib/utils/solar';
	import { ChevronLeft, MapPin, Navigation, Clock, Moon, MoonStar, SunDim, Sun, CloudSun, SunMoon, Star, Landmark } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';

	// Hardcoded Malaysian city coordinates — no API needed
	const CITIES: { name: string; lat: number; lng: number; tz: string; zone: string }[] = [
		{ name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, tz: 'Asia/Kuala_Lumpur', zone: 'WLY01' },
		{ name: 'Putrajaya', lat: 2.9264, lng: 101.6964, tz: 'Asia/Kuala_Lumpur', zone: 'WLY02' },
		{ name: 'Shah Alam', lat: 3.0738, lng: 101.5183, tz: 'Asia/Kuala_Lumpur', zone: 'SGR01' },
		{ name: 'Ipoh', lat: 4.5975, lng: 101.0901, tz: 'Asia/Kuala_Lumpur', zone: 'PRK01' },
		{ name: 'Kuala Kangsar', lat: 4.7681, lng: 100.9389, tz: 'Asia/Kuala_Lumpur', zone: 'PRK02' },
		{ name: 'George Town', lat: 5.4141, lng: 100.3288, tz: 'Asia/Kuala_Lumpur', zone: 'PNG01' },
		{ name: 'Alor Setar', lat: 6.1248, lng: 100.3673, tz: 'Asia/Kuala_Lumpur', zone: 'KDH01' },
		{ name: 'Kangar', lat: 6.4414, lng: 100.1986, tz: 'Asia/Kuala_Lumpur', zone: 'PLS01' },
		{ name: 'Kota Bharu', lat: 6.1254, lng: 102.2386, tz: 'Asia/Kuala_Lumpur', zone: 'KTN01' },
		{ name: 'Kuala Terengganu', lat: 5.3302, lng: 103.1408, tz: 'Asia/Kuala_Lumpur', zone: 'TRG01' },
		{ name: 'Kuantan', lat: 3.8077, lng: 103.3260, tz: 'Asia/Kuala_Lumpur', zone: 'PHG01' },
		{ name: 'Seremban', lat: 2.7297, lng: 101.9381, tz: 'Asia/Kuala_Lumpur', zone: 'NGS01' },
		{ name: 'Melaka', lat: 2.1896, lng: 102.2501, tz: 'Asia/Kuala_Lumpur', zone: 'MLK01' },
		{ name: 'Johor Bahru', lat: 1.4927, lng: 103.7414, tz: 'Asia/Kuala_Lumpur', zone: 'JHR01' },
		{ name: 'Kuching', lat: 1.5533, lng: 110.3592, tz: 'Asia/Kuching', zone: 'SWK01' },
		{ name: 'Sibu', lat: 2.3063, lng: 111.8179, tz: 'Asia/Kuching', zone: 'SWK02' },
		{ name: 'Miri', lat: 4.3995, lng: 113.9914, tz: 'Asia/Kuching', zone: 'SWK04' },
		{ name: 'Kota Kinabalu', lat: 5.9804, lng: 116.0735, tz: 'Asia/Kuching', zone: 'SBH01' },
		{ name: 'Sandakan', lat: 5.8402, lng: 118.1179, tz: 'Asia/Kuching', zone: 'SBH02' },
		{ name: 'Tawau', lat: 4.2456, lng: 117.8912, tz: 'Asia/Kuching', zone: 'SBH03' },
		{ name: 'Labuan', lat: 5.2831, lng: 115.2308, tz: 'Asia/Kuching', zone: 'LBN01' }
	];

	const PRAYER_ICONS = {
		Imsak: MoonStar, Subuh: Moon, Syuruk: SunDim, Zohor: Sun, Asar: CloudSun, Maghrib: SunMoon, Isyak: Star
	};

	// Resolve current city
	const cityIdx = $derived(typeof city.value === 'number' ? city.value : 0);
	const loc = $derived(
		typeof city.value === 'object' && 'g' in city.value
			? { name: 'GPS', lat: city.value.g[0], lng: city.value.g[1], tz: Intl.DateTimeFormat().resolvedOptions().timeZone }
			: CITIES[cityIdx] ?? CITIES[0]
	);

	// Compute prayer times locally (no API needed)
	const todayTimes = $derived.by(() => {
		void tick; // recompute when tick changes
		return prayerTimes(loc.lat, loc.lng, new Date(), tzOffset(loc.tz, new Date()));
	});

	const nextPr = $derived.by((): NextPrayer | null => {
		void tick;
		return nextPrayer(loc.lat, loc.lng, loc.tz);
	});

	let tick = $state(0);
	let gpsLoading = $state(false);
	let gpsError = $state<string | null>(null);

	onMount(() => {
		const t = setInterval(() => tick++, 30000);
		return () => clearInterval(t);
	});

	async function useGps() {
		gpsLoading = true;
		gpsError = null;
		try {
			await new Promise<void>((resolve, reject) => {
				if (!navigator.geolocation) return reject(new Error('unsupported'));
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						city.value = { g: [pos.coords.latitude, pos.coords.longitude] };
						resolve();
					},
					() => reject(new Error('denied')),
					{ timeout: 12000, maximumAge: 600000 }
				);
			});
		} catch {
			gpsError = 'Lokasi tidak dapat dikesan. Pastikan kebenaran lokasi diberikan.';
		} finally {
			gpsLoading = false;
		}
	}

	function fmtDiff(diff: number): string {
		const total = Math.round(diff * 60);
		if (total <= 0) return 'Sekarang';
		const h = Math.floor(total / 60);
		const m = total % 60;
		if (h > 0) return `${h}j ${m}m lagi`;
		return `${m} minit lagi`;
	}
</script>

<svelte:head><title>Waktu Solat — Cakna</title></svelte:head>

<div class="solat-root">
	<header class="solat-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Waktu Solat</span>
			<span class="hdr-loc">
				<MapPin size={10} />
				{loc.name}
			</span>
		</div>
		<button class="hdr-btn" onclick={useGps} aria-label="GPS" disabled={gpsLoading}>
			<Navigation size={18} />
		</button>
	</header>

	<main class="solat-main">
		{#if gpsError}
			<p class="error-msg">{gpsError}</p>
		{/if}

		<!-- Next prayer highlight -->
		{#if nextPr}
			<div class="next-card">
				<div class="next-icon"><svelte:component this={PRAYER_ICONS[nextPr.name] ?? Landmark} size={40} /></div>
				<div class="next-info">
					<span class="next-label">Solat Seterusnya</span>
					<span class="next-name">{nextPr.name}</span>
					<span class="next-time">{fmtT(todayTimes[nextPr.name])}</span>
					<span class="next-diff">{fmtDiff(nextPr.diff)}</span>
				</div>
			</div>
		{/if}

		<!-- Full timetable -->
		<section class="prayers-section">
			<h2 class="section-label">Jadual Hari Ini</h2>
			<div class="prayers-list">
				{#each ALL_PRAYERS as p (p)}
					{@const t = todayTimes[p]}
					{@const isNext = nextPr?.name === p}
					{#if isFinite(t)}
						<div class="prayer-row" class:prayer-next={isNext}>
							<span class="p-icon"><svelte:component this={PRAYER_ICONS[p] ?? Landmark} size={18} /></span>
							<span class="p-name">{p}</span>
							<span class="p-time">{fmtT(t)}</span>
							{#if isNext}
								<span class="p-badge">Seterusnya</span>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</section>

		<!-- City selector -->
		<section class="city-section">
			<h2 class="section-label">Pilih Bandar</h2>
			<div class="city-grid">
				{#each CITIES as c, i (c.name)}
					<button
						class="city-btn"
						class:city-active={typeof city.value === 'number' && city.value === i}
						onclick={() => (city.value = i)}
					>
						{c.name}
					</button>
				{/each}
			</div>
		</section>

		<p class="source-note">Pengiraan astronomi — parameter JAKIM (Subuh 20°, Isyak 18°)</p>
	</main>
</div>

<SideNav active="solat" />

<style>
	.solat-root {
		display: flex; flex-direction: column;
		min-height: 100dvh;
		background: #070e14; color: #e2e8f0;
		padding-left: 76px;
	}
	.solat-header {
		position: sticky; top: 0; z-index: 20;
		display: flex; align-items: center; gap: 12px;
		padding: 12px 16px;
		background: rgba(7,14,20,0.96);
		border-bottom: 1px solid rgba(255,255,255,0.06);
		backdrop-filter: blur(8px);
	}
	.hdr-btn {
		display: grid; place-items: center;
		width: 36px; height: 36px;
		border-radius: 10px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.07);
		color: rgba(255,255,255,0.5);
		cursor: pointer; text-decoration: none;
		transition: background 0.15s;
	}
	.hdr-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
	.hdr-btn:disabled { opacity: 0.5; cursor: not-allowed; }
	.hdr-center { flex: 1; display: flex; flex-direction: column; align-items: center; }
	.hdr-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.75); }
	.hdr-loc { display: flex; align-items: center; gap: 4px; font-size: 11px; color: rgba(34,197,94,0.65); margin-top: 1px; }

	.solat-main { padding: 20px 16px 40px; }

	.error-msg { font-size: 12px; color: #f87171; margin-bottom: 12px; text-align: center; }

	.next-card {
		display: flex; align-items: center; gap: 16px;
		padding: 20px;
		background: linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.05));
		border: 1px solid rgba(34,197,94,0.2);
		border-radius: 20px;
		margin-bottom: 24px;
	}
	.next-icon { display: flex; align-items: center; justify-content: center; color: rgba(74,222,128,0.9); }
	.next-info { display: flex; flex-direction: column; gap: 2px; }
	.next-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(74,222,128,0.6); }
	.next-name { font-size: 22px; font-weight: 700; color: rgba(74,222,128,0.95); }
	.next-time { font-size: 36px; font-weight: 800; color: #e2e8f0; line-height: 1.1; letter-spacing: -0.02em; }
	.next-diff { font-size: 13px; color: rgba(255,255,255,0.4); }

	.section-label {
		font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
		text-transform: uppercase; color: rgba(255,255,255,0.25);
		margin-bottom: 10px;
	}
	.prayers-section { margin-bottom: 28px; }
	.prayers-list { display: flex; flex-direction: column; gap: 4px; }
	.prayer-row {
		display: flex; align-items: center; gap: 12px;
		padding: 12px 14px;
		border-radius: 12px;
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.04);
	}
	.prayer-next { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.2); }
	.p-icon { width: 28px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.45); }
	.p-name { flex: 1; font-size: 14px; color: rgba(255,255,255,0.75); }
	.p-time { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.85); }
	.p-badge {
		font-size: 10px; font-weight: 600; padding: 3px 8px;
		border-radius: 6px; background: rgba(34,197,94,0.2); color: rgba(74,222,128,0.9);
	}

	.city-section { margin-bottom: 20px; }
	.city-grid {
		display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 6px;
	}
	.city-btn {
		padding: 8px 10px;
		border-radius: 10px;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.06);
		color: rgba(255,255,255,0.5);
		font-size: 12px; cursor: pointer; text-align: center;
		transition: all 0.15s;
	}
	.city-btn:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.8); }
	.city-active { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.25); color: rgba(74,222,128,0.9); }

	.source-note {
		font-size: 11px; color: rgba(255,255,255,0.18); text-align: center;
	}
</style>
