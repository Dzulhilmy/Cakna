<script lang="ts">
	// Al-Ma'thurat — modul zikir pagi & petang, kaunter tasbih satu-item.
	// Port penuh reka bentuk modul artifact (emerald/bronze): skrin utama
	// (versi + progres + istiqamah), skrin bacaan (tap-untuk-kira, leret,
	// salin/kongsi per ayat, info fadhilat), tetapan paparan dan skrin
	// selesai. Progres kekal berasingan bagi Sughra (32) dan Kubra (46).
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import {
		MASTER,
		type MathuratMasterItem,
		type TeksWaktu,
		type Waktu
	} from '$lib/data/mathurat-master';
	import { mathuratState, todayKey } from '$lib/state/stores.svelte';
	import type { MathuratState, MathuratTetapan } from '$lib/state/stores.svelte';
	import { solat } from '$lib/state/solat.svelte';
	import { halaqah } from '$lib/halaqah/store.svelte';
	import { nowInTz, prayerTimes, tzOffset } from '$lib/utils/solar';

	/* ---------- senarai item mengikut versi ---------- */
	type Versi = 'sughra' | 'kubra';
	const VKEY = { sughra: 's', kubra: 'k' } as const;
	interface Item extends Omit<MathuratMasterItem, 'reps'> {
		reps: number;
	}
	const itemsFor = (v: Versi): Item[] =>
		MASTER.filter((it) => it.reps[VKEY[v]] != null).map((it) => ({
			...it,
			reps: it.reps[VKEY[v]]!
		}));
	const LISTS: Record<Versi, Item[]> = { sughra: itemsFor('sughra'), kubra: itemsFor('kubra') };
	const TOTALS: Record<Versi, number> = {
		sughra: LISTS.sughra.reduce((s, it) => s + it.reps, 0),
		kubra: LISTS.kubra.reduce((s, it) => s + it.reps, 0)
	};
	const VERSI_LABEL: Record<Versi, { nama: string; penuh: string; n: number }> = {
		sughra: { nama: 'Sughra', penuh: 'Wazifah Sughra', n: LISTS.sughra.length },
		kubra: { nama: 'Kubra', penuh: 'Wazifah Kubra', n: LISTS.kubra.length }
	};
	const JENIS_LABEL = { quran: 'Al-Quran', zikir: "Zikir Ma'thur", doa: 'Doa' } as const;
	const BASMALAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

	/* ---------- utiliti teks ---------- */
	const AR_KE_LATIN: Record<string, string> = {
		'٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
		'٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
	};
	const noAyat = (seg: string): string | null => {
		const m = seg.match(/﴿([٠-٩]+)﴾\s*$/);
		return m ? m[1].split('').map((d) => AR_KE_LATIN[d]).join('') : null;
	};
	/* pecah teks Arab kepada ayat berdasarkan penanda ﴿n﴾; null jika satu sahaja */
	const pecahAyat = (teks: string): string[] | null => {
		const parts = teks.match(/[^﴿﴾]*﴿[٠-٩]+﴾/g);
		if (!parts || parts.length < 2) return null;
		return parts.map((s) => s.trim());
	};
	const pickTime = (f: TeksWaktu, mode: Waktu): string => (typeof f === 'string' ? f : f[mode]);
	const pickText = (
		item: Item,
		version: Versi,
		mode: Waktu,
		key: 'ar' | 'bm' | 'bi' | 'rumi'
	): string => {
		const kField = item[(key + 'K') as 'arK' | 'bmK' | 'biK' | 'rumiK'];
		const base = version === 'kubra' && kField ? kField : item[key];
		return pickTime(base, mode);
	};
	const defaultMode = (): Waktu => (new Date().getHours() >= 12 ? 'petang' : 'pagi');
	const freshCounts = (v: Versi) => LISTS[v].map(() => 0);

	const TETAPAN_LALAI: MathuratTetapan = {
		arSaiz: 32, bmSaiz: 15, paparBm: true, paparRumi: false,
		jajarAr: 'kanan', jajarBm: 'kiri', bahasa: 'bm',
		getar: true, autoMaju: true, skrinTerang: false, autoWaktu: false
	};
	const JAJAR = { kanan: 'right', tengah: 'center', kiri: 'left' } as const;

	/* ---------- keadaan ---------- */
	let screen = $state<'home' | 'baca' | 'tetapan' | 'selesai'>('home');
	let loaded = $state(false);
	let pulse = $state(0);
	let disalin = $state(false);
	let modAyat = $state<'salin' | 'kongsi' | null>(null);
	let infoBuka = $state(false);
	let ayatDisalin = $state(-2); // -2 = tiada, -1 = keseluruhan, i = ayat
	let prevScreen: 'home' | 'baca' = 'home';
	let modeManual = false;
	let swipeBaru = 0;
	let sentuh: { x: number; y: number } | null = null;
	let wakeLock: WakeLockSentinel | null = null;

	// Migrasi: bentuk v1 (s_pagi/…) atau null → lalai v2. Progres v1 adalah
	// kiraan harian sahaja, tiada nilai kekal untuk dibawa.
	function migrate(): MathuratState {
		const cur = mathuratState.value as (MathuratState & { v?: 's' | 'k' }) | null;
		if (cur && (cur as MathuratState).v2) {
			const st = cur as MathuratState;
			// baiki panjang array jika data induk berubah
			for (const v of ['sughra', 'kubra'] as const) {
				if (!Array.isArray(st.counts[v]) || st.counts[v].length !== LISTS[v].length)
					st.counts[v] = freshCounts(v);
				st.idx[v] = Math.min(st.idx[v] ?? 0, LISTS[v].length - 1);
			}
			st.tetapan = { ...TETAPAN_LALAI, ...st.tetapan };
			if (!st.rekod || typeof st.rekod !== 'object') st.rekod = {};
			return st;
		}
		return {
			v2: true,
			version: cur?.v === 'k' ? 'kubra' : 'sughra',
			mode: defaultMode(),
			idx: { sughra: 0, kubra: 0 },
			counts: { sughra: freshCounts('sughra'), kubra: freshCounts('kubra') },
			tetapan: { ...TETAPAN_LALAI },
			rekod: {}
		};
	}

	onMount(() => {
		mathuratState.value = migrate();

		// Quick-launch from menu sheet: apply version + mode and go straight to baca
		const paramV = page.url.searchParams.get('v') as Versi | null;
		const paramM = page.url.searchParams.get('m') as 'pagi' | 'petang' | null;
		if (paramV === 'sughra' || paramV === 'kubra') st().version = paramV;
		history.replaceState({}, '', '/mathurat');

		loaded = true;
		if (st().tetapan.autoWaktu) autoIkutWaktu();

		if ((paramV === 'sughra' || paramV === 'kubra') && (paramM === 'pagi' || paramM === 'petang')) {
			mulaSesi(paramM);
		}
	});

	const st = () => mathuratState.value as MathuratState;

	/* ---------- nilai terbitan ---------- */
	const version = $derived(loaded ? st().version : 'sughra');
	const mode = $derived(loaded ? st().mode : 'pagi');
	const tetapan = $derived(loaded ? st().tetapan : TETAPAN_LALAI);
	const list = $derived(LISTS[version]);
	const total = $derived(TOTALS[version]);
	const vCounts = $derived(loaded ? st().counts[version] : []);
	const vIdx = $derived(loaded ? st().idx[version] : 0);
	const item = $derived(list[vIdx]);
	const done = $derived(vCounts[vIdx] ?? 0);

	/* When the mic-holder is reading this page during a halaqah, broadcast which
	   wirid item they are on so the room renders it in place — the same way it
	   renders a shared mushaf page. Read-only for everyone else: their own
	   progress is never touched by what the reciter is doing. */
	$effect(() => {
		const sess = halaqah.session;
		if (!loaded || !sess?.connected || !sess.canSpeak || !sess.sharing) return;
		void sess.setShare({ kind: 'mathurat', version, mode, idx: vIdx });
	});
	const baki = $derived(item.reps - done);
	const arText = $derived(pickText(item, version, mode, 'ar'));
	const bmText = $derived(pickText(item, version, mode, 'bm'));
	const rumiText = $derived(pickText(item, version, mode, 'rumi'));
	const terjText = $derived(
		tetapan.bahasa === 'bi' ? pickText(item, version, mode, 'bi') || bmText : bmText
	);
	const totalDone = $derived(vCounts.reduce((s, c, i) => s + Math.min(c, list[i].reps), 0));
	const pct = $derived(Math.round((totalDone / total) * 100));
	const sesiSelesai = $derived(totalDone === total);
	const senaraiAyat = $derived(pecahAyat(arText));

	/* ---------- petunjuk "ulang 3 kali" (Doa Rabitah) ----------
	   Frasa فَوَثِّقِ اللَّهُمَّ رَابِطَتَهَا dibaca tiga kali. Teks induk sudah
	   membawa penanda ﴿٣×﴾; di sini kita serlahkan frasa itu dan papar kad
	   peringatan. (Dahulu sebuah skrip vanilla disuntik ke dalam shell SPA —
	   mathurat-hint.js — dengan MutationObserver + CSS Custom Highlight API;
	   dalam Svelte ia cukup diisytiharkan begini.) */
	const FRASA_3X = 'فَوَثِّقِ اللَّهُمَّ رَابِطَتَهَا';
	const bahagian3x = $derived.by(() => {
		const i = arText.indexOf(FRASA_3X);
		if (i < 0) return null;
		return { pra: arText.slice(0, i), frasa: FRASA_3X, pasca: arText.slice(i + FRASA_3X.length) };
	});

	/* ---------- streak & rekod ---------- */
	const kiraStreak = (rekod: MathuratState['rekod']) => {
		let s = 0;
		const d = new Date();
		if (!rekod[todayKey(d)]) d.setDate(d.getDate() - 1);
		while (rekod[todayKey(d)]) {
			s++;
			d.setDate(d.getDate() - 1);
		}
		return s;
	};
	const streak = $derived(loaded ? kiraStreak(st().rekod) : 0);
	const nSesiBulan = $derived.by(() => {
		if (!loaded) return 0;
		const kini = new Date();
		const awalan = `${kini.getFullYear()}-${String(kini.getMonth() + 1).padStart(2, '0')}-`;
		return Object.entries(st().rekod).reduce(
			(n, [k, v]) => n + (k.startsWith(awalan) ? (v.pagi ? 1 : 0) + (v.petang ? 1 : 0) : 0),
			0
		);
	});
	const hari7 = $derived.by(() => {
		void loaded;
		return Array.from({ length: 7 }).map((_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - (6 - i));
			const k = todayKey(d);
			const r = (loaded ? st().rekod[k] : undefined) || {};
			return { k, d: d.getDate(), pagi: !!r.pagi, petang: !!r.petang };
		});
	});

	/* ---------- tindakan ---------- */
	const setVIdx = (i: number) => {
		st().idx[version] = Math.max(0, Math.min(list.length - 1, i));
	};
	function tap() {
		if (Date.now() - swipeBaru < 450) return;
		if (baki <= 0) return;
		if (tetapan.getar && navigator.vibrate) navigator.vibrate(12);
		pulse++;
		const arr = st().counts[version];
		arr[vIdx] = Math.min((arr[vIdx] ?? 0) + 1, item.reps);
		const habisItem = arr[vIdx] >= item.reps;
		const semuaSiap = arr.every((c, i) => c >= list[i].reps);
		if (!habisItem) return;
		setTimeout(() => {
			if (semuaSiap) {
				const k = todayKey();
				st().rekod[k] = { ...(st().rekod[k] || {}), [st().mode]: true };
				screen = 'selesai';
			} else if (st().tetapan.autoMaju) {
				const cur = st().idx[version];
				if (cur < list.length - 1) setVIdx(cur + 1);
				else {
					const fi = arr.findIndex((c, i) => c < list[i].reps);
					if (fi !== -1) setVIdx(fi);
				}
			}
		}, 420);
	}
	const undoOne = () => {
		const arr = st().counts[version];
		arr[vIdx] = Math.max(0, (arr[vIdx] ?? 0) - 1);
	};
	function resetVersi() {
		st().counts[version] = freshCounts(version);
		setVIdx(0);
		screen = 'home';
	}
	function mulaSesi(m: Waktu) {
		modeManual = true;
		st().mode = m;
		if (sesiSelesai) {
			st().counts[version] = freshCounts(version);
			setVIdx(0);
		} else {
			const first = vCounts.findIndex((c, i) => c < list[i].reps);
			setVIdx(first === -1 ? 0 : first);
		}
		screen = 'baca';
	}
	const bukaTetapan = (dari: 'home' | 'baca') => {
		prevScreen = dari;
		screen = 'tetapan';
	};
	const ubah = (patch: Partial<MathuratTetapan>) => {
		st().tetapan = { ...st().tetapan, ...patch };
		if (patch.autoWaktu) autoIkutWaktu();
	};

	/* auto pagi/petang: guna waktu Zohor rasmi JAKIM (atau kiraan astronomi)
	   daripada keadaan solat aplikasi — bukan anggaran berasingan */
	async function autoIkutWaktu() {
		try {
			await solat.loadCities();
			const l = solat.loc;
			if (!l || modeManual) return;
			const zohor =
				solat.official?.times.Zohor ??
				prayerTimes(l.lat, l.lng, new Date(), tzOffset(l.tz, new Date())).Zohor;
			if (isFinite(zohor)) st().mode = nowInTz(l.tz) >= zohor ? 'petang' : 'pagi';
		} catch {
			/* kekal ikut jam biasa */
		}
	}

	/* leretan kiri/kanan di skrin bacaan */
	function onTouchStart(e: TouchEvent) {
		sentuh = { x: e.touches[0].clientX, y: e.touches[0].clientY };
	}
	function onTouchEnd(e: TouchEvent) {
		if (!sentuh) return;
		const dx = e.changedTouches[0].clientX - sentuh.x;
		const dy = e.changedTouches[0].clientY - sentuh.y;
		sentuh = null;
		if (Math.abs(dx) > 60 && Math.abs(dy) < 50) {
			swipeBaru = Date.now();
			setVIdx(dx < 0 ? vIdx + 1 : vIdx - 1);
		}
	}

	/* ---------- salin & kongsi ---------- */
	const teksItem = () => {
		const bsm = item.basmalah ? BASMALAH + '\n' : '';
		return `${item.tajuk} — Al-Ma'thurat ${VERSI_LABEL[version].penuh} (${item.reps}×)\n\n${bsm}${arText}\n\n${terjText}`;
	};
	const teksAyat = (seg: string) => {
		const no = noAyat(seg);
		return `${item.tajuk}${no ? ` · Ayat ${no}` : ''}\n\n${seg}`;
	};
	async function salinKeClipboard(teks: string): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(teks);
			return true;
		} catch {
			return false;
		}
	}
	async function buatSalin(teks: string) {
		if (await salinKeClipboard(teks)) {
			disalin = true;
			setTimeout(() => (disalin = false), 1600);
		}
	}
	async function buatKongsi(tajuk: string, teks: string) {
		if (navigator.share) {
			try {
				await navigator.share({ title: tajuk, text: teks });
			} catch {
				/* dibatalkan pengguna */
			}
		} else await buatSalin(teks);
	}
	const salinTeks = (e: Event) => {
		e.stopPropagation();
		if (senaraiAyat) modAyat = 'salin';
		else buatSalin(teksItem());
	};
	const kongsiTeks = (e: Event) => {
		e.stopPropagation();
		if (senaraiAyat) modAyat = 'kongsi';
		else buatKongsi(item.tajuk, teksItem());
	};
	async function pilihAyat(i: number, seg: string | null) {
		const teks = i === -1 ? teksItem() : teksAyat(seg!);
		if (modAyat === 'salin') {
			if (await salinKeClipboard(teks)) {
				ayatDisalin = i;
				setTimeout(() => (ayatDisalin = -2), 1400);
			}
		} else {
			await buatKongsi(item.tajuk, teks);
			modAyat = null;
		}
	}

	$effect(() => {
		void vIdx;
		void version;
		disalin = false;
		modAyat = null;
		ayatDisalin = -2;
		infoBuka = false;
	});

	/* kekalkan skrin terang semasa bacaan (jika diaktifkan) */
	$effect(() => {
		const mahu = loaded && tetapan.skrinTerang && screen === 'baca';
		const lepas = () => {
			wakeLock?.release().catch(() => {});
			wakeLock = null;
		};
		if (!mahu) {
			lepas();
			return;
		}
		let aktif = true;
		const minta = async () => {
			try {
				if (aktif && 'wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
			} catch {
				/* tidak disokong / ditolak */
			}
		};
		minta();
		const onVis = () => {
			if (document.visibilityState === 'visible') minta();
		};
		document.addEventListener('visibilitychange', onVis);
		return () => {
			aktif = false;
			document.removeEventListener('visibilitychange', onVis);
			lepas();
		};
	});

	/* cincin kaunter */
	const ring = 104, stroke = 6;
	const r = (ring - stroke) / 2;
	const circ = 2 * Math.PI * r;
	const fillFrac = $derived(item.reps === 0 ? 1 : done / item.reps);
</script>

{#if screen === 'home'}
	<PageHeader title="Al-Ma'thurat" subtitle="Wirid pagi & petang" back="/menu" />
{/if}

<div class="mt">
	{#if !loaded}
		<div class="mt-memuat">Memuatkan…</div>
	{:else if screen === 'home'}
		<!-- ================= SKRIN UTAMA ================= -->
		<div class="mt-wrap">
			<div class="mt-atas">
				<p class="mt-eyebrow">Cakna · Al-Ma'thurat</p>
				<button class="mt-ikon mt-ikon-lg" aria-label="Tetapan" onclick={() => bukaTetapan('home')}>⚙</button>
			</div>
			<h1 class="mt-arab mt-tajuk-arab">الْمَأْثُورَات</h1>
			<p class="mt-subtajuk">
				Wirid Imam Hasan al-Banna · {VERSI_LABEL[version].penuh} · {VERSI_LABEL[version].n} bacaan
			</p>

			<!-- pilih versi wirid -->
			<div class="mt-segmen">
				{#each ['sughra', 'kubra'] as const as v (v)}
					<button
						class="mt-segmen-btn"
						class:aktif={version === v}
						aria-pressed={version === v}
						onclick={() => (st().version = v)}
					>
						{VERSI_LABEL[v].nama}
						<span class="mt-segmen-n">{VERSI_LABEL[v].n} item</span>
					</button>
				{/each}
			</div>

			<!-- kad progres -->
			<div class="mt-kad">
				<div class="mt-baris-antara">
					<span class="mt-kecil">
						{sesiSelesai ? 'Sesi lengkap — mula sesi baharu' : totalDone > 0 ? 'Sesi belum selesai' : 'Belum bermula'}
					</span>
					<span class="mt-pct">{pct}%</span>
				</div>
				<div class="mt-bar"><div class="mt-bar-isi" style="width:{pct}%"></div></div>
				<p class="mt-kecil" style="margin:10px 0 0">
					{totalDone} / {total} ulangan · item
					{Math.min(vCounts.filter((c, i) => c >= list[i].reps).length + 1, list.length)} / {list.length}
				</p>
			</div>

			<!-- kad istiqamah -->
			<div class="mt-kad mt-baris-antara" style="margin-top:14px; gap:14px">
				<div>
					<div class="mt-streak">{streak > 0 ? `🔥 ${streak} hari` : 'Mulakan hari ini'}</div>
					<div class="mt-kecil" style="margin-top:2px">
						{streak > 0 ? 'berturut-turut berwirid' : 'bina istiqamah wirid harian'} · {nSesiBulan} sesi bulan ini
					</div>
				</div>
				<div class="mt-dots7">
					{#each hari7 as h (h.k)}
						<div class="mt-dot7" title="{h.k}: {h.pagi ? 'pagi ' : ''}{h.petang ? 'petang' : ''}{!h.pagi && !h.petang ? 'tiada' : ''}">
							<span class="mt-dot" class:penuh={h.pagi && h.petang} class:separa={(h.pagi || h.petang) && !(h.pagi && h.petang)}></span>
							<span class="mt-dot-tarikh">{h.d}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- pilih waktu -->
			<p class="mt-label-seksyen">Pilih waktu wirid</p>
			<div class="mt-grid2">
				{#each ['pagi', 'petang'] as const as m (m)}
					<button class="mt-waktu" class:aktif={mode === m} onclick={() => mulaSesi(m)}>
						<div style="font-size:26px">{m === 'pagi' ? '🌅' : '🌇'}</div>
						<div class="mt-waktu-nama">{m === 'pagi' ? 'Pagi' : 'Petang'}</div>
						<div class="mt-waktu-nota">{m === 'pagi' ? 'Subuh — Zohor' : 'Asar — Maghrib'}</div>
					</button>
				{/each}
			</div>

			{#if totalDone > 0 && !sesiSelesai}
				<button class="mt-btn-sambung" onclick={() => (screen = 'baca')}>
					Sambung {VERSI_LABEL[version].nama} dari item {vIdx + 1}
				</button>
			{/if}
			{#if totalDone > 0}
				<button class="mt-btn-pautan" onclick={resetVersi}>Set semula sesi {VERSI_LABEL[version].nama}</button>
			{/if}
		</div>
	{:else if screen === 'tetapan'}
		<!-- ================= SKRIN TETAPAN ================= -->
		<div class="mt-wrap" style="max-width:480px">
			<div style="display:flex; align-items:center; gap:8px">
				<button class="mt-balik" aria-label="Kembali" onclick={() => (screen = prevScreen)}>←</button>
				<h2 style="margin:0; font-size:18px">Tetapan</h2>
			</div>
			<div class="mt-kad" style="margin-top:16px; padding:4px 20px">
				{#snippet baris(label: string, nota: string | null, akhir: boolean, kawalan: import('svelte').Snippet)}
					<div class="mt-tetapan-baris" class:akhir>
						<div>
							<div style="font-size:14px; font-weight:600">{label}</div>
							{#if nota}<div class="mt-kecil" style="margin-top:2px; max-width:190px">{nota}</div>{/if}
						</div>
						{@render kawalan()}
					</div>
				{/snippet}
				{#snippet stepper(nilai: number, min: number, max: number, langkah: number, onUbah: (v: number) => void)}
					<div class="mt-stepper">
						<button aria-label="Kecilkan" disabled={nilai <= min} onclick={() => onUbah(Math.max(min, nilai - langkah))}>−</button>
						<span>{nilai}</span>
						<button aria-label="Besarkan" disabled={nilai >= max} onclick={() => onUbah(Math.min(max, nilai + langkah))}>+</button>
					</div>
				{/snippet}
				{#snippet pilih(nilai: string, pilihan: string[], onUbah: (v: string) => void)}
					<div class="mt-pilih">
						{#each pilihan as pl (pl)}
							<button aria-pressed={nilai === pl} class:aktif={nilai === pl} onclick={() => onUbah(pl)}>{pl}</button>
						{/each}
					</div>
				{/snippet}
				{#snippet suis(aktif: boolean, label: string, onUbah: (v: boolean) => void)}
					<button role="switch" aria-checked={aktif} aria-label={label} class="mt-suis" class:aktif onclick={() => onUbah(!aktif)}>
						<span></span>
					</button>
				{/snippet}

				{@render baris('Saiz teks Arab', null, false, sA)}
				{#snippet sA()}{@render stepper(tetapan.arSaiz, 24, 44, 2, (v) => ubah({ arSaiz: v }))}{/snippet}
				{@render baris('Saiz terjemahan', null, false, sB)}
				{#snippet sB()}{@render stepper(tetapan.bmSaiz, 12, 20, 1, (v) => ubah({ bmSaiz: v }))}{/snippet}
				{@render baris('Bahasa terjemahan', 'Bahasa Melayu atau Bahasa Inggeris', false, sC)}
				{#snippet sC()}{@render pilih(tetapan.bahasa === 'bi' ? 'English' : 'B. Melayu', ['B. Melayu', 'English'], (v) => ubah({ bahasa: v === 'English' ? 'bi' : 'bm' }))}{/snippet}
				{@render baris('Papar transliterasi rumi', 'Bacaan dalam tulisan rumi di bawah teks Arab', false, sD)}
				{#snippet sD()}{@render suis(tetapan.paparRumi, 'Papar transliterasi rumi', (v) => ubah({ paparRumi: v }))}{/snippet}
				{@render baris('Jajaran teks Arab', null, false, sE)}
				{#snippet sE()}{@render pilih(tetapan.jajarAr, ['kanan', 'tengah', 'kiri'], (v) => ubah({ jajarAr: v as MathuratTetapan['jajarAr'] }))}{/snippet}
				{@render baris('Jajaran terjemahan & rumi', null, false, sF)}
				{#snippet sF()}{@render pilih(tetapan.jajarBm, ['kiri', 'tengah', 'kanan'], (v) => ubah({ jajarBm: v as MathuratTetapan['jajarBm'] }))}{/snippet}
				{@render baris('Papar terjemahan', 'Sembunyikan untuk fokus pada teks Arab sahaja', false, sG)}
				{#snippet sG()}{@render suis(tetapan.paparBm, 'Papar terjemahan', (v) => ubah({ paparBm: v }))}{/snippet}
				{@render baris('Getaran sentuhan', 'Getar ringan setiap kali ulangan dikira', false, sH)}
				{#snippet sH()}{@render suis(tetapan.getar, 'Getaran sentuhan', (v) => ubah({ getar: v }))}{/snippet}
				{@render baris('Auto ke bacaan seterusnya', 'Berpindah sendiri apabila ulangan item selesai', false, sI)}
				{#snippet sI()}{@render suis(tetapan.autoMaju, 'Auto ke bacaan seterusnya', (v) => ubah({ autoMaju: v }))}{/snippet}
				{@render baris('Auto pagi/petang ikut waktu solat', 'Guna waktu Zohor lokasi anda (JAKIM / astronomi)', false, sJ)}
				{#snippet sJ()}{@render suis(tetapan.autoWaktu, 'Auto pagi/petang ikut waktu solat', (v) => ubah({ autoWaktu: v }))}{/snippet}
				{@render baris('Kekalkan skrin terang', 'Skrin tidak akan tertidur semasa membaca wirid', true, sK)}
				{#snippet sK()}{@render suis(tetapan.skrinTerang, 'Kekalkan skrin terang', (v) => ubah({ skrinTerang: v }))}{/snippet}
			</div>

			<!-- pratonton saiz -->
			<div class="mt-kad" style="margin-top:16px">
				<p class="mt-label-seksyen" style="margin:0">Pratonton</p>
				<p class="mt-arab" style="font-size:{tetapan.arSaiz}px; margin:8px 0 0">{BASMALAH}</p>
				{#if tetapan.paparBm}
					<p class="mt-kecil" style="margin:6px 0 0; font-size:{tetapan.bmSaiz}px; line-height:1.8">
						{tetapan.bahasa === 'bi'
							? 'In the name of Allah, the Most Gracious, the Most Merciful.'
							: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang.'}
					</p>
				{/if}
			</div>
			<button class="mt-btn-pautan" onclick={() => (st().tetapan = { ...TETAPAN_LALAI })}>
				Kembali ke tetapan asal
			</button>
		</div>
	{:else if screen === 'selesai'}
		<!-- ================= SKRIN SELESAI ================= -->
		<div class="mt-selesai">
			<div style="font-size:60px">🌙</div>
			<h2 class="mt-arab" style="font-size:40px; margin:18px 0 6px; color:var(--mt-emerald-deep)">تَقَبَّلَ اللَّهُ</h2>
			<p class="mt-kecil" style="max-width:320px; line-height:1.7; margin:0">
				Alhamdulillah — wirid {mode === 'pagi' ? 'pagi' : 'petang'} Al-Ma'thurat
				{VERSI_LABEL[version].penuh} telah lengkap, {total} ulangan disempurnakan. Semoga Allah
				menerima amalan ini.
			</p>
			{#if streak > 0}
				<div class="mt-pil-streak">🔥 {streak} hari berturut-turut</div>
			{/if}
			<button
				class="mt-btn-bronze"
				onclick={() =>
					buatKongsi(
						"Al-Ma'thurat",
						`Alhamdulillah — Wirid ${mode === 'pagi' ? 'pagi' : 'petang'} Al-Ma'thurat ${VERSI_LABEL[version].penuh} lengkap — ${total} ulangan disempurnakan${streak > 1 ? ` · 🔥 ${streak} hari berturut-turut` : ''}.`
					)}
			>
				↗ Kongsi pencapaian
			</button>
			<button class="mt-btn-emerald" onclick={resetVersi}>Kembali ke laman utama</button>
		</div>
	{:else}
		<!-- ================= SKRIN BACAAN ================= -->
		<div class="mt-baca">
			<div class="mt-baca-kepala">
				<button class="mt-balik" aria-label="Kembali" onclick={() => (screen = 'home')}>←</button>
				<div style="text-align:center">
					<div style="font-weight:700; font-size:17px">
						{String(vIdx + 1).padStart(2, '0')}/{list.length}
						<span class="mt-pil-reps">{item.reps}×</span>
					</div>
					<div class="mt-eyebrow" style="margin-top:2px; letter-spacing:0.1em">
						{VERSI_LABEL[version].nama} · {mode === 'pagi' ? 'Wirid Pagi' : 'Wirid Petang'} · {JENIS_LABEL[item.jenis]}
					</div>
				</div>
				<div style="display:flex; align-items:center">
					<button class="mt-aa" aria-label="Tetapan paparan" onclick={() => bukaTetapan('baca')}>Aa</button>
					<button class="mt-undo" aria-label="Undo ulangan" disabled={done === 0} onclick={undoOne}>↺</button>
				</div>
			</div>
			<div class="mt-bar" style="margin:0 18px; height:4px">
				<div class="mt-bar-isi" style="width:{pct}%; background:var(--mt-emerald)"></div>
			</div>

			<!-- kandungan — tap di mana-mana untuk kira -->
			<div
				class="mt-kandungan"
				role="button"
				tabindex="0"
				aria-label="Tap untuk kira ulangan"
				onclick={tap}
				onkeydown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tap(); } }}
				ontouchstart={onTouchStart}
				ontouchend={onTouchEnd}
			>
				<div class="mt-baris-antara" style="gap:10px; margin-bottom:14px">
					<p style="margin:0; font-size:13px; font-weight:600; color:var(--mt-emerald-deep)">{item.tajuk}</p>
					<div style="display:flex; gap:6px; flex-shrink:0">
						<button class="mt-cip mt-cip-info" aria-label="Faedah dan sumber" onclick={(e) => { e.stopPropagation(); infoBuka = true; }}>ⓘ</button>
						<button class="mt-cip" class:berjaya={disalin} aria-label="Salin bacaan ini" onclick={salinTeks}>
							{disalin ? '✓ Disalin' : '⧉ Salin'}
						</button>
						<button class="mt-cip" aria-label="Kongsi bacaan ini" onclick={kongsiTeks}>↗ Kongsi</button>
					</div>
				</div>
				{#if item.basmalah}
					{#key `bsm-${version}-${vIdx}`}
						<p class="mt-arab mt-fadeup" style="font-size:{Math.round(tetapan.arSaiz * 0.8)}px; text-align:center; margin:0 0 18px; color:var(--mt-emerald-deep)">
							{BASMALAH}
						</p>
					{/key}
				{/if}
				{#key `ar-${version}-${vIdx}`}
					<p class="mt-arab mt-fadeup" style="font-size:{arText.length > 400 ? Math.round(tetapan.arSaiz * 0.82) : tetapan.arSaiz}px; text-align:{JAJAR[tetapan.jajarAr]}; margin:0">
						{#if bahagian3x}{bahagian3x.pra}<mark class="mt-3x">{bahagian3x.frasa}</mark>{bahagian3x.pasca}{:else}{arText}{/if}
					</p>
					{#if bahagian3x}
						<div class="mt-3x-kad" aria-label="Bahagian ini dibaca tiga kali">
							<div class="mt-3x-kepala">
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M17 2.1 21 6l-4 3.9" /><path d="M3 12.9V11a4 4 0 0 1 4-4h14" />
									<path d="M7 21.9 3 18l4-3.9" /><path d="M21 11.1V13a4 4 0 0 1-4 4H3" />
								</svg>
								<span>Ulang 3 kali</span>
							</div>
							<div class="mt-arab mt-3x-frasa" dir="rtl">{FRASA_3X}</div>
						</div>
					{/if}
				{/key}
				{#if tetapan.paparRumi && rumiText}
					{#key `rm-${version}-${vIdx}`}
						<p class="mt-fadeup" style="margin-top:20px; font-size:{tetapan.bmSaiz}px; line-height:1.9; font-style:italic; color:var(--mt-emerald-deep); text-align:{JAJAR[tetapan.jajarBm]}">
							{rumiText}
						</p>
					{/key}
				{/if}
				{#if tetapan.paparBm}
					{#key `bm-${version}-${vIdx}`}
						<p class="mt-fadeup mt-kecil" style="margin-top:{tetapan.paparRumi ? 18 : 26}px; font-size:{tetapan.bmSaiz}px; line-height:1.8; text-align:{JAJAR[tetapan.jajarBm]}">
							{terjText}
						</p>
					{/key}
				{/if}
				{#if item.reps <= 10}
					<div style="display:flex; gap:8px; margin-top:22px; flex-wrap:wrap">
						{#each Array.from({ length: item.reps }) as _, i (i)}
							<span class="mt-titik" class:isi={i < done}></span>
						{/each}
					</div>
				{:else}
					<p style="margin-top:22px; font-size:13px; font-weight:700; color:var(--mt-bronze)">{done} / {item.reps} ulangan</p>
				{/if}
			</div>

			<!-- navigasi manual -->
			<div class="mt-nav">
				<button aria-label="Item sebelumnya" disabled={vIdx === 0} onclick={() => setVIdx(vIdx - 1)}>‹</button>
				<button aria-label="Item seterusnya" disabled={vIdx === list.length - 1} onclick={() => setVIdx(vIdx + 1)}>›</button>
			</div>

			<!-- butang tasbih -->
			<div class="mt-tasbih-wrap">
				{#key pulse}
					<button
						class="mt-tasbih"
						class:habis={baki === 0}
						class:denyut={pulse > 0}
						style="width:{ring}px; height:{ring}px"
						aria-label="Kira ulangan, {done} daripada {item.reps}"
						onclick={tap}
					>
						<svg width={ring} height={ring} style="position:absolute; inset:0; transform:rotate(-90deg)">
							<circle cx={ring / 2} cy={ring / 2} {r} fill="none" stroke="rgba(255,255,255,0.22)" stroke-width={stroke} />
							<circle
								cx={ring / 2} cy={ring / 2} {r} fill="none"
								stroke="var(--mt-bronze-soft)" stroke-width={stroke}
								stroke-dasharray={circ} stroke-dashoffset={circ * (1 - fillFrac)}
								stroke-linecap="round" style="transition: stroke-dashoffset .35s ease"
							/>
						</svg>
						<span style="position:relative; font-size:{done > 99 ? 28 : 36}px; font-weight:700">{baki === 0 ? '✓' : done}</span>
						<span class="mt-tasbih-tap">/ {item.reps}</span>
					</button>
				{/key}
			</div>

			<!-- lembar info faedah & sumber -->
			{#if infoBuka}
				<div class="mt-tirai" role="presentation" onclick={(e) => { e.stopPropagation(); infoBuka = false; }}>
					<div class="mt-lembar" role="dialog" aria-label="Faedah dan sumber" onclick={(e) => e.stopPropagation()}>
						<div class="mt-baris-antara" style="align-items:flex-start; gap:12px">
							<div>
								<div style="font-weight:700; font-size:16px; color:var(--mt-emerald-deep)">{item.tajuk}</div>
								<div class="mt-eyebrow" style="margin-top:4px; letter-spacing:0.1em">
									{JENIS_LABEL[item.jenis]} · {item.reps}× ulangan
								</div>
							</div>
							<button class="mt-ikon" aria-label="Tutup" onclick={() => (infoBuka = false)}>✕</button>
						</div>
						<p style="margin:14px 0 0; font-size:14px; line-height:1.9">{item.info}</p>
					</div>
				</div>
			{/if}

			<!-- lembar pilih ayat untuk salin / kongsi -->
			{#if modAyat && senaraiAyat}
				<div class="mt-tirai" role="presentation" onclick={(e) => { e.stopPropagation(); modAyat = null; }}>
					<div class="mt-lembar mt-lembar-tinggi" role="dialog" aria-label={modAyat === 'salin' ? 'Salin ayat' : 'Kongsi ayat'} onclick={(e) => e.stopPropagation()}>
						<div class="mt-baris-antara" style="padding-bottom:10px">
							<div>
								<div style="font-weight:700; font-size:15px">{modAyat === 'salin' ? 'Salin ayat' : 'Kongsi ayat'}</div>
								<div class="mt-kecil" style="margin-top:2px; font-size:12px">{item.tajuk} · pilih ayat</div>
							</div>
							<button class="mt-ikon" aria-label="Tutup" onclick={() => (modAyat = null)}>✕</button>
						</div>
						<div style="overflow-y:auto; padding-bottom:8px">
							<button class="mt-ayat-btn mt-ayat-semua" class:dipilih={ayatDisalin === -1} onclick={() => pilihAyat(-1, null)}>
								{ayatDisalin === -1 ? '✓ Disalin' : `Keseluruhan bacaan (${senaraiAyat.length} ayat + terjemahan)`}
							</button>
							{#each senaraiAyat as seg, i (i)}
								<button class="mt-ayat-btn" class:dipilih={ayatDisalin === i} onclick={() => pilihAyat(i, seg)}>
									<span class="mt-ayat-no" class:dipilih={ayatDisalin === i}>
										{ayatDisalin === i ? '✓ Disalin' : `Ayat ${noAyat(seg) || i + 1}`}
									</span>
									<span class="mt-arab" style="display:block; font-size:19px; line-height:1.9">
										{seg.length > 130 ? seg.slice(0, 130) + '…' : seg}
									</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* palet modul — emerald & bronze; ikut mod gelap aplikasi (.dark) */
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
	.mt-arab {
		font-family: var(--font-arabic, 'Amiri Quran', 'Scheherazade New', serif);
		direction: rtl;
		line-height: 2.1;
	}
	/* petunjuk "ulang 3 kali" — frasa diserlah + kad peringatan */
	.mt-3x { background: #fbe7b0; color: inherit; border-radius: 3px; padding: 0 2px; }
	.mt-3x-kad {
		margin: 12px auto 6px;
		max-width: 600px;
		background: #fbf1d6;
		border: 1px solid #e9d9a8;
		border-radius: 12px;
		padding: 11px 16px 13px;
		text-align: center;
	}
	.mt-3x-kepala {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		color: #8a6522;
		font: 600 12.5px/1 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
		letter-spacing: 0.02em;
	}
	.mt-3x-frasa { margin-top: 7px; font-size: 21px; color: #0b3d2e; line-height: 1.9; }
	:global(.dark) .mt-3x { background: #6b5518; }
	:global(.dark) .mt-3x-kad { background: #2a2416; border-color: #4a3d22; }
	:global(.dark) .mt-3x-frasa { color: var(--mt-emerald); }
	.mt-memuat { display: grid; place-items: center; min-height: 40vh; color: var(--mt-ink-soft); }
	/* The trailing padding clears the minimised halaqah bar (0px when absent),
	   otherwise the translation runs underneath it. */
	.mt-wrap { max-width: 480px; margin: 0 auto; padding: 24px 24px calc(40px + var(--halaqah-h, 0px)); display: flex; flex-direction: column; }
	.mt-atas { display: flex; align-items: center; justify-content: space-between; }
	.mt-eyebrow { letter-spacing: 0.22em; font-size: 11px; font-weight: 600; color: var(--mt-bronze); text-transform: uppercase; margin: 0; }
	.mt-ikon { background: var(--mt-white); border: 1px solid var(--mt-mist); border-radius: 99px; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; line-height: 1; cursor: pointer; color: var(--mt-ink-soft); box-shadow: 0 3px 10px rgba(13, 59, 51, 0.08); flex-shrink: 0; }
	/* Settings gear only (not the ✕ close buttons that also use .mt-ikon): a larger, more prominent tap target. */
	.mt-ikon-lg { width: 44px; height: 44px; font-size: 24px; }
	.mt-tajuk-arab { font-size: 54px; text-align: center; margin: 30px 0 4px; color: var(--mt-emerald-deep); line-height: 1.4; font-weight: 400; }
	.mt-subtajuk { text-align: center; margin: 0; color: var(--mt-ink-soft); font-size: 14px; }
	.mt-segmen { margin-top: 26px; display: flex; background: var(--mt-mist); border-radius: 99px; padding: 4px; }
	.mt-segmen-btn { flex: 1; border: none; border-radius: 99px; padding: 11px 0; cursor: pointer; font-weight: 700; font-size: 14px; transition: all 0.2s ease; background: transparent; color: var(--mt-ink-soft); }
	.mt-segmen-btn.aktif { background: var(--mt-emerald); color: #fff; box-shadow: 0 6px 16px rgba(14, 95, 82, 0.3); }
	.mt-segmen-n { font-size: 11px; font-weight: 600; opacity: 0.8; margin-left: 6px; }
	.mt-kad { margin-top: 18px; background: var(--mt-white); border-radius: 20px; padding: 18px 22px; box-shadow: 0 8px 28px rgba(13, 59, 51, 0.08); }
	.mt-baris-antara { display: flex; align-items: center; justify-content: space-between; }
	.mt-kecil { font-size: 13px; color: var(--mt-ink-soft); }
	.mt-pct { font-size: 22px; font-weight: 700; color: var(--mt-emerald); }
	.mt-bar { height: 8px; background: var(--mt-mist); border-radius: 99px; margin-top: 12px; overflow: hidden; }
	.mt-bar-isi { height: 100%; background: linear-gradient(90deg, var(--mt-emerald), var(--mt-bronze)); border-radius: 99px; transition: width 0.5s ease; }
	.mt-streak { font-size: 20px; font-weight: 700; color: var(--mt-emerald-deep); }
	.mt-dots7 { display: flex; gap: 6px; }
	.mt-dot7 { display: flex; flex-direction: column; align-items: center; gap: 4px; }
	.mt-dot { width: 12px; height: 12px; border-radius: 99px; background: var(--mt-mist); transition: background 0.3s; }
	.mt-dot.separa { background: var(--mt-emerald); }
	.mt-dot.penuh { background: var(--mt-bronze); }
	.mt-dot-tarikh { font-size: 9px; color: var(--mt-ink-soft); }
	.mt-label-seksyen { margin: 30px 0 12px; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mt-ink-soft); }
	.mt-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
	.mt-waktu { border: 2px solid var(--mt-mist); background: var(--mt-white); color: var(--mt-ink); border-radius: 18px; padding: 18px 12px; cursor: pointer; text-align: center; transition: all 0.2s ease; }
	.mt-waktu.aktif { border-color: var(--mt-emerald); background: var(--mt-emerald); color: #fff; box-shadow: 0 10px 24px rgba(14, 95, 82, 0.28); }
	.mt-waktu-nama { font-weight: 700; margin-top: 6px; font-size: 15px; }
	.mt-waktu-nota { font-size: 11px; opacity: 0.75; margin-top: 2px; }
	.mt-btn-sambung { margin-top: 16px; background: var(--mt-bronze); color: #fff; border: none; border-radius: 16px; padding: 15px; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(176, 138, 62, 0.3); }
	.mt-btn-pautan { margin-top: 10px; background: transparent; color: var(--mt-ink-soft); border: none; font-size: 13px; cursor: pointer; text-decoration: underline; }
	/* skrin bacaan */
	.mt-baca { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; min-height: calc(100dvh - 96px); }
	.mt-baca-kepala { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px 8px; }
	.mt-balik { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--mt-ink-soft); }
	.mt-pil-reps { background: var(--mt-emerald); color: #fff; font-size: 11px; font-weight: 700; border-radius: 99px; padding: 3px 8px; vertical-align: middle; }
	.mt-aa { background: none; border: none; font-size: 15px; font-weight: 700; cursor: pointer; color: var(--mt-ink-soft); padding: 0 6px; }
	.mt-undo { background: none; border: none; font-size: 20px; cursor: pointer; color: var(--mt-ink-soft); padding: 0 4px; }
	.mt-undo:disabled { color: var(--mt-mist); cursor: default; }
	.mt-kandungan { flex: 1; overflow-y: auto; padding: 24px 24px 250px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
	.mt-cip { background: var(--mt-white); color: var(--mt-ink-soft); border: 1px solid var(--mt-mist); border-radius: 99px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
	.mt-cip.berjaya { background: var(--mt-emerald); color: #fff; border-color: var(--mt-emerald); }
	.mt-cip-info { width: 30px; padding: 6px 0; color: var(--mt-bronze); font-weight: 700; }
	.mt-titik { width: 10px; height: 10px; border-radius: 99px; background: var(--mt-mist); transition: background 0.25s; }
	.mt-titik.isi { background: var(--mt-bronze); }
	/* Lifted clear of the minimised halaqah bar, which sits just above the tab bar. */
	.mt-nav { position: fixed; bottom: calc(148px + var(--halaqah-h, 0px)); left: 22px; right: 22px; display: flex; justify-content: space-between; pointer-events: none; z-index: 20; }
	.mt-nav button { pointer-events: auto; background: var(--mt-white); border: 1px solid var(--mt-mist); border-radius: 99px; width: 48px; height: 48px; font-size: 18px; cursor: pointer; color: var(--mt-ink); box-shadow: 0 4px 14px rgba(13, 59, 51, 0.1); }
	.mt-nav button:disabled { color: var(--mt-mist); cursor: default; }
	.mt-tasbih-wrap { position: fixed; bottom: calc(96px + var(--halaqah-h, 0px)); left: 0; right: 0; display: flex; justify-content: center; pointer-events: none; z-index: 20; }
	.mt-tasbih { pointer-events: auto; border-radius: 50%; border: none; position: relative; background: var(--mt-emerald); color: #fff; cursor: pointer; box-shadow: 0 14px 34px rgba(10, 71, 62, 0.4); }
	.mt-tasbih.habis { background: var(--mt-bronze); }
	.mt-tasbih.denyut { animation: mt-tap-pulse 0.28s ease; }
	.mt-tasbih-tap { position: absolute; bottom: 15px; left: 0; right: 0; font-size: 10px; letter-spacing: 0.12em; opacity: 0.8; }
	/* lembar bawah */
	.mt-tirai { position: fixed; inset: 0; background: rgba(13, 59, 51, 0.45); z-index: 50; display: flex; align-items: flex-end; justify-content: center; }
	.mt-lembar { background: var(--mt-paper); width: 100%; max-width: 560px; max-height: 60vh; border-radius: 22px 22px 0 0; overflow-y: auto; box-shadow: 0 -12px 40px rgba(10, 71, 62, 0.3); padding: 18px 22px 30px; }
	.mt-lembar-tinggi { max-height: 72vh; display: flex; flex-direction: column; padding-bottom: 16px; }
	.mt-ayat-btn { display: block; width: 100%; text-align: right; background: var(--mt-white); border: 1px solid var(--mt-mist); border-radius: 14px; padding: 12px 16px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; color: var(--mt-ink); }
	.mt-ayat-btn.dipilih { background: var(--mt-emerald); border-color: var(--mt-emerald); color: #fff; }
	.mt-ayat-btn.dipilih .mt-arab { color: #fff; }
	.mt-ayat-semua { text-align: left; font-size: 13px; font-weight: 700; padding: 13px 16px; }
	.mt-ayat-no { display: block; text-align: left; font-size: 11px; font-weight: 700; color: var(--mt-bronze); margin-bottom: 4px; }
	.mt-ayat-no.dipilih { color: #fff; }
	/* tetapan */
	.mt-tetapan-baris { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 0; border-bottom: 1px solid var(--mt-mist); }
	.mt-tetapan-baris.akhir { border-bottom: none; }
	.mt-stepper { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
	.mt-stepper button { width: 36px; height: 36px; border-radius: 99px; border: 1px solid var(--mt-mist); background: var(--mt-white); font-size: 18px; cursor: pointer; color: var(--mt-ink); }
	.mt-stepper button:disabled { color: var(--mt-mist); cursor: default; }
	.mt-stepper span { min-width: 26px; text-align: center; font-weight: 700; font-size: 15px; }
	.mt-pilih { display: flex; background: var(--mt-mist); border-radius: 99px; padding: 3px; flex-shrink: 0; }
	.mt-pilih button { border: none; border-radius: 99px; padding: 6px 11px; font-size: 11px; font-weight: 700; cursor: pointer; text-transform: capitalize; background: transparent; color: var(--mt-ink-soft); transition: all 0.15s; }
	.mt-pilih button.aktif { background: var(--mt-white); color: var(--mt-emerald-deep); box-shadow: 0 2px 8px rgba(13, 59, 51, 0.12); }
	.mt-suis { width: 52px; height: 30px; border-radius: 99px; border: none; cursor: pointer; background: var(--mt-mist); position: relative; transition: background 0.2s; flex-shrink: 0; }
	.mt-suis.aktif { background: var(--mt-emerald); }
	.mt-suis span { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 99px; background: #fff; transition: left 0.2s; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); }
	.mt-suis.aktif span { left: 25px; }
	/* selesai */
	.mt-selesai { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 32px; text-align: center; min-height: calc(100dvh - 96px); }
	.mt-pil-streak { margin-top: 18px; background: var(--mt-white); border-radius: 99px; padding: 9px 20px; font-size: 14px; font-weight: 700; color: var(--mt-emerald-deep); box-shadow: 0 6px 20px rgba(13, 59, 51, 0.1); }
	.mt-btn-bronze { margin-top: 26px; background: var(--mt-bronze); color: #fff; border: none; border-radius: 16px; padding: 14px 30px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 26px rgba(176, 138, 62, 0.3); }
	.mt-btn-emerald { margin-top: 12px; background: var(--mt-emerald); color: #fff; border: none; border-radius: 16px; padding: 15px 34px; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 26px rgba(14, 95, 82, 0.3); }
	.mt-fadeup { animation: mt-fade-up 0.35s ease; }
	@keyframes mt-fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
	@keyframes mt-tap-pulse { 0% { transform: scale(1); } 45% { transform: scale(0.9); } 100% { transform: scale(1); } }
	@media (prefers-reduced-motion: reduce) {
		.mt-fadeup, .mt-tasbih.denyut { animation: none; }
	}
	.mt button:focus-visible { outline: 3px solid var(--mt-bronze); outline-offset: 2px; }
</style>
