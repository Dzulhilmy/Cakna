<script lang="ts">
	/**
	 * Persistent halaqah bar — the minimised call.
	 *
	 * Mounted in the root layout (like MiniPlayer) so it is present on every route.
	 * Hidden while the user is in the room itself; everywhere else it shows who is
	 * reciting, which page they are on, and gets you back in one tap.
	 */
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { halaqah } from '$lib/halaqah/store.svelte';
	import AudioVisualizer from '$lib/components/modules/AudioVisualizer.svelte';

	const s = $derived(halaqah.session);
	const inRoom = $derived(page.url.pathname.startsWith('/halaqah/'));
	const visible = $derived(!!s?.connected && !inRoom);

	const speaking = $derived(s?.members.find((m) => m.speaking)?.name ?? null);
	const label = $derived(speaking ?? s?.title ?? 'Halaqah');

	/** Human name for a route, so the room shows "Al-Ma'thurat" not "/mathurat". */
	const ROUTE_LABELS: Record<string, string> = {
		'/mathurat': "Al-Ma'thurat",
		'/surah': 'Senarai Surah',
		'/asma': 'Asmaul Husna',
		'/doa': 'Doa Al-Quran',
		'/yasin': 'Surah Yasin',
		'/zikir': 'Zikir & Tasbih',
		'/ibadah': 'Panduan Ibadah',
		'/mengaji': 'Asas Mengaji',
		'/solat': 'Waktu Solat',
		'/qibla': 'Arah Kiblat',
		'/khatam': 'Sasaran Khatam',
		'/puasa': 'Rekod Puasa',
		'/zakat': 'Kalkulator Zakat',
		'/search': 'Cari Ayat',
		'/menu': 'Lagi',
		'/settings': 'Tetapan',
		'/read': 'Mushaf',
		'/': 'Utama'
	};

	/**
	 * While minimised, the mic-holder's own browsing IS the shared view: whatever
	 * they open is broadcast so the room can follow them there. Reading a mushaf
	 * page shares the page itself; anything else shares the destination.
	 */
	$effect(() => {
		const sess = halaqah.session;
		const path = page.url.pathname;
		if (!sess?.connected || !sess.canSpeak || !sess.sharing) return;
		// The room view is the room itself — nothing to share from there.
		if (path.startsWith('/halaqah')) return;
		// The Ma'thurat page publishes its own richer share (which wirid item), so
		// leave it alone — a generic route share here would immediately clobber it.
		if (path === '/mathurat') return;

		const m = path.match(/^\/read\/(\d+)$/);
		if (m) {
			void sess.setShare({ kind: 'page', page: Number(m[1]) });
		} else {
			void sess.setShare({
				kind: 'route',
				path,
				label: ROUTE_LABELS[path] ?? path.replace(/^\//, '')
			});
		}
	});

	// The reader is a different route, so jumping there keeps the call alive.
	const readerHref = $derived(`/read/${s?.page ?? 1}`);
	const onReaderPage = $derived(page.url.pathname === readerHref);

	/** What is actually on show — the bar used to always claim "halaman N", which
	 *  was simply wrong while the reciter was sharing the wirid or another screen. */
	const shareLabel = $derived.by(() => {
		const sh = s?.share;
		if (!sh) return 'tidak berkongsi skrin';
		if (sh.kind === 'page') return `halaman ${sh.page}`;
		if (sh.kind === 'mathurat')
			return `Al-Ma'thurat · item ${sh.idx + 1}`;
		return sh.label;
	});
	/** The jump-to-page chip only makes sense for a shared mushaf page. */
	const showPageChip = $derived(s?.share?.kind === 'page' && !onReaderPage);

	/**
	 * Publish the bar's height so page content can reserve room for it. Without
	 * this the bar floats over whatever is at the bottom of the page — on the
	 * Ma'thurat reader it covered the translation and collided with the tap
	 * counter, which is fixed at 96px.
	 */
	let barH = $state(0);
	$effect(() => {
		const px = visible ? `${barH + 12}px` : '0px';
		document.documentElement.style.setProperty('--halaqah-h', px);
		return () => document.documentElement.style.setProperty('--halaqah-h', '0px');
	});
</script>

{#if visible && s}
	<div class="wrap" style="bottom: calc(64px + var(--safe-b));">
		<div class="bar" bind:clientHeight={barH}>
			<button class="main" onclick={() => goto(`/halaqah/${s.slug}`)}>
				<span class="viz" aria-hidden="true">
					<AudioVisualizer track={s.floorTrack} live={!!speaking} height={26} bars={10} />
				</span>
				<span class="txt">
					<span class="ttl">{label}</span>
					<span class="sub">
						{speaking ? 'sedang membaca' : 'halaqah aktif'} · {shareLabel}
					</span>
				</span>
			</button>

			{#if showPageChip}
				<!-- Jump to the reciter's page without leaving the call. -->
				<a class="pg" href={readerHref} aria-label="Buka halaman pembaca">
					{s.page}
				</a>
			{/if}

			<button class="end" onclick={() => halaqah.leave()} aria-label="Keluar halaqah">✕</button>
		</div>
	</div>
{/if}

<style>
	.wrap {
		position: fixed;
		inset-inline: 0;
		z-index: 40;
		display: flex;
		justify-content: center;
		padding: 0 16px;
		pointer-events: none;
	}
	.bar {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		max-width: 420px;
		padding: 6px 8px 6px 10px;
		border-radius: 16px;
		border: 1px solid var(--border, #e4dcc8);
		background: var(--card, #fff);
		box-shadow: 0 8px 24px rgba(13, 59, 51, 0.16);
	}
	.main {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 10px;
		background: none;
		border: 0;
		padding: 4px 2px;
		cursor: pointer;
		text-align: start;
		color: inherit;
	}
	.viz { width: 54px; flex-shrink: 0; }
	.txt { min-width: 0; display: flex; flex-direction: column; }
	.ttl {
		font-size: 13px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.sub { font-size: 11px; color: var(--muted-foreground, #5c6b63); }
	.pg {
		flex-shrink: 0;
		min-width: 38px;
		height: 32px;
		padding: 0 9px;
		border-radius: 9px;
		border: 1px solid var(--border, #e4dcc8);
		display: grid;
		place-items: center;
		font-size: 12.5px;
		font-weight: 600;
		text-decoration: none;
		color: var(--primary, #155b44);
	}
	.end {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		border-radius: 9px;
		border: 0;
		background: var(--muted, #f0ece1);
		color: var(--muted-foreground, #5c6b63);
		font-size: 13px;
		cursor: pointer;
	}
</style>
