<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { mathuratState, todayKey } from '$lib/state/stores.svelte';
	import type { MathuratState } from '$lib/state/stores.svelte';

	type Versi = 'sughra' | 'kubra';
	type Waktu = 'pagi' | 'petang';

	const BULAN_MS = [
		'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
		'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
	];
	const HARI_MS = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];

	// Local selection state
	let pilihV = $state<Versi>('sughra');
	let pilihM = $state<Waktu>('pagi');

	// Month navigation — offset from current month (0 = now, -1 = last month, etc.)
	let bulanOffset = $state(0);

	const st = () => mathuratState.value as MathuratState | null;

	// Initialise selection from stored state
	$effect(() => {
		const s = st();
		if (s) {
			pilihV = s.version;
			pilihM = s.mode;
		}
	});

	// Compute the displayed month's year + month (0-based)
	const bulanTampak = $derived.by(() => {
		const d = new Date();
		d.setDate(1);
		d.setMonth(d.getMonth() + bulanOffset);
		return { year: d.getFullYear(), month: d.getMonth() };
	});

	const rekod = $derived(st()?.rekod ?? {});

	// All days in the displayed month with their completion data
	const hariDalamBulan = $derived.by(() => {
		const { year, month } = bulanTampak;
		const bilHari = new Date(year, month + 1, 0).getDate();
		const today = todayKey();
		return Array.from({ length: bilHari }, (_, i) => {
			const d = i + 1;
			const k = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
			const r = rekod[k] || {};
			const isMasa = k <= today;
			return { d, k, pagi: !!r.pagi, petang: !!r.petang, isMasa, isHariIni: k === today };
		});
	});

	// What weekday does the 1st fall on? (0 = Ahad … 6 = Sab)
	const offsetAwal = $derived(
		new Date(bulanTampak.year, bulanTampak.month, 1).getDay()
	);

	// Monthly stats
	const statsBulan = $derived.by(() => {
		const { year, month } = bulanTampak;
		const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
		let hariAda = 0, sesiAda = 0;
		for (const [k, v] of Object.entries(rekod)) {
			if (!k.startsWith(prefix)) continue;
			const dua = (v.pagi ? 1 : 0) + (v.petang ? 1 : 0);
			if (dua > 0) hariAda++;
			sesiAda += dua;
		}
		return { hariAda, sesiAda };
	});

	function mulakan() {
		if (st()) {
			st()!.version = pilihV;
			st()!.mode = pilihM;
		}
		goto(`${base}/mathurat?v=${pilihV}&m=${pilihM}`);
	}
</script>

<div class="mt">
	<!-- Header -->
	<div class="mt-kepala">
		<button class="mt-balik" aria-label="Kembali" onclick={() => history.back()}>←</button>
		<span class="mt-tajuk-hal">Rekod Wirid</span>
		<span style="width:38px"></span>
	</div>

	<div class="mt-wrap">
		<!-- Month navigation -->
		<div class="mt-bulan-nav">
			<button class="mt-anak-panah" aria-label="Bulan lepas" onclick={() => bulanOffset--}>‹</button>
			<div class="mt-bulan-label">
				<span class="mt-bulan-nama">{BULAN_MS[bulanTampak.month]}</span>
				<span class="mt-bulan-tahun">{bulanTampak.year}</span>
			</div>
			<button
				class="mt-anak-panah"
				aria-label="Bulan seterusnya"
				disabled={bulanOffset >= 0}
				onclick={() => bulanOffset++}
			>›</button>
		</div>

		<!-- Stats summary -->
		<div class="mt-stats-baris">
			<div class="mt-stat-item">
				<span class="mt-stat-angka">{statsBulan.hariAda}</span>
				<span class="mt-stat-label">hari berwirid</span>
			</div>
			<div class="mt-stat-divider"></div>
			<div class="mt-stat-item">
				<span class="mt-stat-angka">{statsBulan.sesiAda}</span>
				<span class="mt-stat-label">sesi selesai</span>
			</div>
			<div class="mt-stat-divider"></div>
			<div class="mt-stat-item">
				<span class="mt-stat-angka">{hariDalamBulan.filter(h => h.isMasa && h.pagi && h.petang).length}</span>
				<span class="mt-stat-label">hari penuh</span>
			</div>
		</div>

		<!-- Calendar grid -->
		<div class="mt-kalender">
			<!-- Day headers -->
			{#each HARI_MS as hari (hari)}
				<div class="mt-hari-tajuk">{hari}</div>
			{/each}
			<!-- Empty cells before first day -->
			{#each Array.from({ length: offsetAwal }) as _, i (i)}
				<div class="mt-sel-kosong"></div>
			{/each}
			<!-- Day cells -->
			{#each hariDalamBulan as h (h.k)}
				<div
					class="mt-sel"
					class:masa-depan={!h.isMasa}
					class:hari-ini={h.isHariIni}
					class:penuh={h.pagi && h.petang}
					class:separa={h.isMasa && (h.pagi || h.petang) && !(h.pagi && h.petang)}
				>
					<span class="mt-sel-angka">{h.d}</span>
					{#if h.isMasa}
						<div class="mt-sel-dots">
							<span class="mt-sel-dot pagi" class:isi={h.pagi}></span>
							<span class="mt-sel-dot petang" class:isi={h.petang}></span>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Legend -->
		<div class="mt-lagenda">
			<span class="mt-lagenda-item">
				<span class="mt-lagenda-dot pagi isi"></span> Pagi
			</span>
			<span class="mt-lagenda-item">
				<span class="mt-lagenda-dot petang isi"></span> Petang
			</span>
			<span class="mt-lagenda-item">
				<span class="mt-lagenda-dot pagi isi"></span><span class="mt-lagenda-dot petang isi" style="margin-left:2px"></span> Lengkap
			</span>
		</div>

		<!-- Divider -->
		<div class="mt-divider"></div>

		<!-- Start session section -->
		<p class="mt-label-seksyen">Pilih versi wirid</p>
		<div class="mt-segmen">
			{#each (['sughra', 'kubra'] as const) as v (v)}
				<button
					class="mt-segmen-btn"
					class:aktif={pilihV === v}
					aria-pressed={pilihV === v}
					onclick={() => (pilihV = v)}
				>
					{v === 'sughra' ? 'Sughra' : 'Kubra'}
					<span class="mt-segmen-n">{v === 'sughra' ? '32' : '46'} item</span>
				</button>
			{/each}
		</div>

		<p class="mt-label-seksyen">Pilih waktu wirid</p>
		<div class="mt-grid2">
			{#each (['pagi', 'petang'] as const) as m (m)}
				<button
					class="mt-waktu"
					class:aktif={pilihM === m}
					aria-pressed={pilihM === m}
					onclick={() => (pilihM = m)}
				>
					<div style="font-size:26px">{m === 'pagi' ? '🌅' : '🌇'}</div>
					<div class="mt-waktu-nama">{m === 'pagi' ? 'Pagi' : 'Petang'}</div>
					<div class="mt-waktu-nota">{m === 'pagi' ? 'Subuh — Zohor' : 'Asar — Maghrib'}</div>
				</button>
			{/each}
		</div>

		<button class="mt-btn-mula" onclick={mulakan}>
			Mulakan Wirid →
		</button>
	</div>
</div>

<style>
	.mt {
		--mt-paper: #f3f6f2;
		--mt-ink: #0d3b33;
		--mt-ink-soft: #3e5b53;
		--mt-mist: #dce7e0;
		--mt-emerald: #0e5f52;
		--mt-emerald-deep: #0a473e;
		--mt-bronze: #b08a3e;
		--mt-bronze-soft: #e7d9bc;
		--mt-white: #ffffff;
		background: var(--mt-paper);
		color: var(--mt-ink);
		min-height: calc(100dvh - 56px);
		font-family: var(--font-sans, system-ui, sans-serif);
	}
	:global(.dark) .mt {
		--mt-paper: #0e1b18;
		--mt-ink: #e9f1ed;
		--mt-ink-soft: #9fb8ae;
		--mt-mist: #20342e;
		--mt-emerald: #1e7a67;
		--mt-emerald-deep: #8ecfbe;
		--mt-bronze: #d6b36e;
		--mt-bronze-soft: #4a3d22;
		--mt-white: #152622;
	}

	/* Header */
	.mt-kepala {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 18px 10px;
		background: var(--mt-paper);
		border-bottom: 1px solid var(--mt-mist);
	}
	.mt-balik {
		background: none;
		border: none;
		font-size: 22px;
		cursor: pointer;
		color: var(--mt-ink-soft);
		width: 38px;
		padding: 0;
	}
	.mt-tajuk-hal {
		font-size: 16px;
		font-weight: 700;
		color: var(--mt-ink);
	}

	/* Content wrapper */
	.mt-wrap {
		max-width: 440px;
		margin: 0 auto;
		padding: 20px 20px 48px;
		display: flex;
		flex-direction: column;
	}

	/* Month nav */
	.mt-bulan-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}
	.mt-anak-panah {
		background: var(--mt-white);
		border: 1px solid var(--mt-mist);
		border-radius: 99px;
		width: 36px;
		height: 36px;
		font-size: 18px;
		cursor: pointer;
		color: var(--mt-ink-soft);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.mt-anak-panah:disabled {
		opacity: 0.3;
		cursor: default;
	}
	.mt-bulan-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
	}
	.mt-bulan-nama {
		font-size: 18px;
		font-weight: 700;
		color: var(--mt-ink);
	}
	.mt-bulan-tahun {
		font-size: 12px;
		color: var(--mt-ink-soft);
	}

	/* Stats row */
	.mt-stats-baris {
		display: flex;
		align-items: center;
		background: var(--mt-white);
		border-radius: 16px;
		padding: 14px 16px;
		box-shadow: 0 4px 16px rgba(13, 59, 51, 0.07);
		margin-bottom: 20px;
		gap: 0;
	}
	.mt-stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.mt-stat-angka {
		font-size: 22px;
		font-weight: 700;
		color: var(--mt-emerald);
		line-height: 1;
	}
	.mt-stat-label {
		font-size: 11px;
		color: var(--mt-ink-soft);
		text-align: center;
	}
	.mt-stat-divider {
		width: 1px;
		height: 36px;
		background: var(--mt-mist);
	}

	/* Calendar */
	.mt-kalender {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 4px;
		margin-bottom: 12px;
	}
	.mt-hari-tajuk {
		text-align: center;
		font-size: 11px;
		font-weight: 600;
		color: var(--mt-ink-soft);
		padding: 4px 0 8px;
		letter-spacing: 0.04em;
	}
	.mt-sel-kosong { display: block; }
	.mt-sel {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 7px 2px 6px;
		border-radius: 10px;
		background: var(--mt-white);
		box-shadow: 0 1px 4px rgba(13, 59, 51, 0.05);
		transition: background 0.2s;
		min-height: 52px;
	}
	.mt-sel.masa-depan {
		background: transparent;
		box-shadow: none;
		opacity: 0.35;
	}
	.mt-sel.hari-ini {
		box-shadow: 0 0 0 2px var(--mt-emerald);
	}
	.mt-sel.separa {
		background: color-mix(in srgb, var(--mt-emerald) 10%, var(--mt-white));
	}
	.mt-sel.penuh {
		background: color-mix(in srgb, var(--mt-bronze) 15%, var(--mt-white));
	}
	:global(.dark) .mt-sel.separa {
		background: color-mix(in srgb, var(--mt-emerald) 18%, var(--mt-white));
	}
	:global(.dark) .mt-sel.penuh {
		background: color-mix(in srgb, var(--mt-bronze) 20%, var(--mt-white));
	}
	.mt-sel-angka {
		font-size: 13px;
		font-weight: 600;
		color: var(--mt-ink);
		line-height: 1;
	}
	.mt-sel.masa-depan .mt-sel-angka {
		color: var(--mt-ink-soft);
	}
	.mt-sel-dots {
		display: flex;
		gap: 3px;
		align-items: center;
	}
	.mt-sel-dot {
		width: 6px;
		height: 6px;
		border-radius: 99px;
		border: 1.5px solid transparent;
	}
	.mt-sel-dot.pagi {
		border-color: var(--mt-emerald);
	}
	.mt-sel-dot.pagi.isi {
		background: var(--mt-emerald);
		border-color: var(--mt-emerald);
	}
	.mt-sel-dot.petang {
		border-color: var(--mt-bronze);
	}
	.mt-sel-dot.petang.isi {
		background: var(--mt-bronze);
		border-color: var(--mt-bronze);
	}

	/* Legend */
	.mt-lagenda {
		display: flex;
		gap: 16px;
		justify-content: center;
		margin-bottom: 24px;
	}
	.mt-lagenda-item {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 11.5px;
		color: var(--mt-ink-soft);
	}
	.mt-lagenda-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 99px;
		border: 1.5px solid transparent;
	}
	.mt-lagenda-dot.pagi { border-color: var(--mt-emerald); }
	.mt-lagenda-dot.pagi.isi { background: var(--mt-emerald); }
	.mt-lagenda-dot.petang { border-color: var(--mt-bronze); }
	.mt-lagenda-dot.petang.isi { background: var(--mt-bronze); }

	/* Divider */
	.mt-divider {
		height: 1px;
		background: var(--mt-mist);
		margin: 0 0 4px;
	}

	/* Session selector — reuse home screen styles */
	.mt-label-seksyen {
		margin: 24px 0 12px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mt-ink-soft);
	}
	.mt-segmen {
		display: flex;
		background: var(--mt-mist);
		border-radius: 99px;
		padding: 4px;
	}
	.mt-segmen-btn {
		flex: 1;
		border: none;
		border-radius: 99px;
		padding: 11px 0;
		cursor: pointer;
		font-weight: 700;
		font-size: 14px;
		transition: all 0.2s ease;
		background: transparent;
		color: var(--mt-ink-soft);
	}
	.mt-segmen-btn.aktif {
		background: var(--mt-emerald);
		color: #fff;
		box-shadow: 0 6px 16px rgba(14, 95, 82, 0.3);
	}
	.mt-segmen-n {
		font-size: 11px;
		font-weight: 600;
		opacity: 0.8;
		margin-left: 6px;
	}
	.mt-grid2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.mt-waktu {
		border: 2px solid var(--mt-mist);
		background: var(--mt-white);
		color: var(--mt-ink);
		border-radius: 18px;
		padding: 18px 12px;
		cursor: pointer;
		text-align: center;
		transition: all 0.2s ease;
	}
	.mt-waktu.aktif {
		border-color: var(--mt-emerald);
		background: var(--mt-emerald);
		color: #fff;
		box-shadow: 0 10px 24px rgba(14, 95, 82, 0.28);
	}
	.mt-waktu-nama {
		font-weight: 700;
		margin-top: 6px;
		font-size: 15px;
	}
	.mt-waktu-nota {
		font-size: 11px;
		opacity: 0.75;
		margin-top: 2px;
	}
	.mt-btn-mula {
		margin-top: 20px;
		background: var(--mt-emerald);
		color: #fff;
		border: none;
		border-radius: 16px;
		padding: 16px;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 10px 26px rgba(14, 95, 82, 0.32);
		transition: opacity 0.15s;
		letter-spacing: 0.01em;
	}
	.mt-btn-mula:active {
		opacity: 0.85;
	}
</style>
