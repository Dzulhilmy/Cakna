<script>
	import { onMount } from 'svelte';
	import { ChevronLeft, Navigation } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { city } from '$lib/state/stores.svelte';
	import { qiblaBearing, startCompass } from '$lib/utils/qibla.ts';

	const CITIES = [
		{ name: 'Kuala Lumpur',    lat: 3.1390,  lng: 101.6869 },
		{ name: 'Putrajaya',       lat: 2.9264,  lng: 101.6964 },
		{ name: 'Shah Alam',       lat: 3.0738,  lng: 101.5183 },
		{ name: 'Ipoh',            lat: 4.5975,  lng: 101.0901 },
		{ name: 'Kuala Kangsar',   lat: 4.7681,  lng: 100.9389 },
		{ name: 'George Town',     lat: 5.4141,  lng: 100.3288 },
		{ name: 'Alor Setar',      lat: 6.1248,  lng: 100.3673 },
		{ name: 'Kangar',          lat: 6.4414,  lng: 100.1986 },
		{ name: 'Kota Bharu',      lat: 6.1254,  lng: 102.2386 },
		{ name: 'Kuala Terengganu',lat: 5.3302,  lng: 103.1408 },
		{ name: 'Kuantan',         lat: 3.8077,  lng: 103.3260 },
		{ name: 'Seremban',        lat: 2.7297,  lng: 101.9381 },
		{ name: 'Melaka',          lat: 2.1896,  lng: 102.2501 },
		{ name: 'Johor Bahru',     lat: 1.4927,  lng: 103.7414 },
		{ name: 'Kuching',         lat: 1.5533,  lng: 110.3592 },
		{ name: 'Sibu',            lat: 2.3063,  lng: 111.8179 },
		{ name: 'Miri',            lat: 4.3995,  lng: 113.9914 },
		{ name: 'Kota Kinabalu',   lat: 5.9804,  lng: 116.0735 },
		{ name: 'Sandakan',        lat: 5.8402,  lng: 118.1179 },
		{ name: 'Tawau',           lat: 4.2456,  lng: 117.8912 },
		{ name: 'Labuan',          lat: 5.2831,  lng: 115.2308 }
	];

	let bearing = $state(0);
	/** @type {number|null} */
	let heading = $state(null);
	let compassErr = $state(false);
	let gpsLoading = $state(false);
	let gpsError = $state('');
	/** @type {(() => void)|null} */
	let cleanup = $state(null);

	const cityIdx = $derived(typeof city.value === 'number' ? city.value : 0);
	const loc = $derived(
		typeof city.value === 'object' && 'g' in city.value
			? { name: 'GPS', lat: city.value.g[0], lng: city.value.g[1] }
			: CITIES[cityIdx] ?? CITIES[0]
	);

	// Arrow rotation: bearing relative to device heading, or just bearing if no compass
	const arrowRotation = $derived(heading !== null ? bearing - heading : bearing);

	function updateBearing() {
		bearing = qiblaBearing(loc.lat, loc.lng);
	}

	// Recompute bearing when loc changes
	$effect(() => {
		void loc;
		updateBearing();
	});

	onMount(async () => {
		updateBearing();
		try {
			cleanup = await startCompass((h) => { heading = h; });
		} catch {
			compassErr = true;
		}
		return () => { cleanup?.(); };
	});

	async function useGps() {
		gpsLoading = true;
		gpsError = '';
		try {
			await new Promise((resolve, reject) => {
				if (!navigator.geolocation) return reject(new Error('unsupported'));
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						city.value = { g: [pos.coords.latitude, pos.coords.longitude] };
						resolve(undefined);
					},
					() => reject(new Error('denied')),
					{ timeout: 12000, maximumAge: 600000 }
				);
			});
		} catch {
			gpsError = 'Lokasi tidak dapat dikesan. Sila benarkan akses lokasi.';
		} finally {
			gpsLoading = false;
		}
	}

	async function requestCompass() {
		try {
			cleanup?.();
			cleanup = await startCompass((h) => { heading = h; });
			compassErr = false;
		} catch {
			compassErr = true;
		}
	}

	const bearingDisplay = $derived(bearing.toFixed(1));

	// Tick marks for the compass ring (every 10 degrees)
	const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
	const cardinals = [
		{ deg: 0,   label: 'U' },
		{ deg: 90,  label: 'T' },
		{ deg: 180, label: 'S' },
		{ deg: 270, label: 'B' }
	];
</script>

<svelte:head><title>Kiblat — Cakna</title></svelte:head>

<div class="qibla-root">
	<header class="qibla-header">
		<a href="https://cakna.org/hub" class="hdr-btn" aria-label="Kembali">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Kiblat</span>
			{#if loc.name !== 'GPS'}
				<span class="hdr-sub">{loc.name}</span>
			{/if}
		</div>
		<button class="hdr-btn" onclick={useGps} disabled={gpsLoading} aria-label="Guna GPS">
			<Navigation size={18} />
		</button>
	</header>

	<main class="qibla-main">
		{#if gpsError}
			<p class="error-msg">{gpsError}</p>
		{/if}

		<!-- Compass -->
		<div class="compass-wrap">
			<!-- Outer ring rotates with device heading so N always points device North -->
			<svg
				class="compass-svg"
				viewBox="0 0 240 240"
				xmlns="http://www.w3.org/2000/svg"
				aria-label="Kompas kiblat"
			>
				<!-- Background circle -->
				<circle cx="120" cy="120" r="110" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />

				<!-- Rotating ring group: rotates opposite to device heading so cardinal labels track compass north -->
				<g style="transform-origin: 120px 120px; transform: rotate({-(heading ?? 0)}deg)">
					<!-- Tick marks -->
					{#each ticks as deg (deg)}
						{@const rad = (deg - 90) * Math.PI / 180}
						{@const inner = deg % 30 === 0 ? 86 : 92}
						{@const outer = 100}
						<line
							x1={120 + inner * Math.cos(rad)}
							y1={120 + inner * Math.sin(rad)}
							x2={120 + outer * Math.cos(rad)}
							y2={120 + outer * Math.sin(rad)}
							stroke={deg % 90 === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}
							stroke-width={deg % 90 === 0 ? 1.5 : 0.8}
						/>
					{/each}

					<!-- Cardinal labels -->
					{#each cardinals as c (c.deg)}
						{@const rad = (c.deg - 90) * Math.PI / 180}
						{@const r2 = 74}
						<text
							x={120 + r2 * Math.cos(rad)}
							y={120 + r2 * Math.sin(rad) + 4}
							text-anchor="middle"
							font-size="12"
							font-weight="700"
							fill={c.deg === 0 ? 'rgba(248,113,113,0.9)' : 'rgba(255,255,255,0.55)'}
						>{c.label}</text>
					{/each}
				</g>

				<!-- Qibla arrow: rotates by (bearing - heading) so it always points to Mecca -->
				<g style="transform-origin: 120px 120px; transform: rotate({arrowRotation}deg)">
					<!-- Arrow shaft -->
					<line x1="120" y1="120" x2="120" y2="42" stroke="rgba(199,162,75,0.9)" stroke-width="2.5" stroke-linecap="round" />
					<!-- Arrowhead -->
					<polygon points="120,28 113,48 127,48" fill="rgba(199,162,75,0.95)" />
					<!-- Kaaba icon at tip -->
					<text x="120" y="22" text-anchor="middle" font-size="14">🕋</text>
					<!-- Tail dot -->
					<circle cx="120" cy="120" r="5" fill="rgba(199,162,75,0.8)" />
					<!-- Tail line (opposite direction) -->
					<line x1="120" y1="120" x2="120" y2="175" stroke="rgba(199,162,75,0.25)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 3" />
				</g>

				<!-- Center dot -->
				<circle cx="120" cy="120" r="3" fill="rgba(255,255,255,0.3)" />
			</svg>

			<!-- Compass status -->
			{#if compassErr}
				<button class="enable-compass-btn" onclick={requestCompass}>
					Aktifkan Kompas
				</button>
			{:else if heading === null}
				<p class="compass-hint">Memuat kompas…</p>
			{/if}
		</div>

		<!-- Bearing info -->
		<div class="bearing-card">
			<p class="bearing-label">Kiblat dari lokasi anda</p>
			<p class="bearing-value">{bearingDisplay}°</p>
			<p class="bearing-city">{loc.name}</p>
		</div>

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
	</main>
</div>

<SideNav active="qibla" />

<style>
	.qibla-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: #070e14;
		color: #e2e8f0;
		padding-left: 76px;
	}

	/* ── Header ── */
	.qibla-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: rgba(7, 14, 20, 0.96);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
	}
	.hdr-btn {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.hdr-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.08); }
	.hdr-btn:disabled { opacity: 0.5; cursor: not-allowed; }
	.hdr-center {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.hdr-title {
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.75);
	}
	.hdr-sub {
		font-size: 10px;
		color: rgba(34, 197, 94, 0.65);
		margin-top: 1px;
	}

	/* ── Main ── */
	.qibla-main {
		padding: 24px 16px 40px;
	}

	.error-msg {
		font-size: 12px;
		color: #f87171;
		text-align: center;
		margin-bottom: 16px;
	}

	/* ── Compass ── */
	.compass-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		margin-bottom: 24px;
	}
	.compass-svg {
		width: min(240px, 65vw);
		height: min(240px, 65vw);
	}
	.enable-compass-btn {
		padding: 8px 20px;
		border-radius: 10px;
		background: rgba(199, 162, 75, 0.15);
		border: 1px solid rgba(199, 162, 75, 0.3);
		color: #c7a24b;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.enable-compass-btn:hover { background: rgba(199, 162, 75, 0.25); }
	.compass-hint {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.3);
		margin: 0;
	}

	/* ── Bearing card ── */
	.bearing-card {
		text-align: center;
		padding: 20px;
		border-radius: 16px;
		background: linear-gradient(135deg, rgba(199, 162, 75, 0.08), rgba(199, 162, 75, 0.03));
		border: 1px solid rgba(199, 162, 75, 0.18);
		margin-bottom: 28px;
	}
	.bearing-label {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(199, 162, 75, 0.55);
		margin: 0 0 6px;
	}
	.bearing-value {
		font-size: 42px;
		font-weight: 800;
		color: #c7a24b;
		line-height: 1;
		margin: 0 0 6px;
		letter-spacing: -0.02em;
	}
	.bearing-city {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.4);
		margin: 0;
	}

	/* ── City section ── */
	.city-section { margin-bottom: 20px; }
	.section-label {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.25);
		margin-bottom: 10px;
	}
	.city-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 6px;
	}
	.city-btn {
		padding: 8px 10px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.5);
		font-size: 12px;
		cursor: pointer;
		text-align: center;
		transition: all 0.15s;
	}
	.city-btn:hover { background: rgba(255, 255, 255, 0.07); color: rgba(255, 255, 255, 0.8); }
	.city-active {
		background: rgba(199, 162, 75, 0.1);
		border-color: rgba(199, 162, 75, 0.28);
		color: #c7a24b;
	}
</style>
