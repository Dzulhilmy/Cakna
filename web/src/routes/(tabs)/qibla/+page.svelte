<script lang="ts">
	// Arah Kiblat — port of the sample's panelQiblat (index.html L1104+, logic L3897+).
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import { t } from '$lib/state/i18n.svelte';
	import { solat } from '$lib/state/solat.svelte';
	import { qiblaBearing, startCompass } from '$lib/utils/qibla';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let heading = $state(0);
	let stopCompass: (() => void) | null = null;

	const qb = $derived.by(() => {
		const l = solat.loc;
		return l ? qiblaBearing(l.lat, l.lng) : null;
	});

	onMount(() => {
		solat.loadCities();
	});
	onDestroy(() => {
		stopCompass?.();
		stopCompass = null;
	});

	async function enableCompass() {
		try {
			stopCompass?.();
			stopCompass = await startCompass((h) => (heading = h));
			toast(t('t_comp_on'));
		} catch (e) {
			const msg = e instanceof Error ? e.message : '';
			toast(msg === 'denied' ? t('t_comp_deny') : t('t_comp_no'));
		}
	}
</script>

<PageHeader title={t('p_qiblat')} back="/" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<div class="flex flex-col items-center gap-3.5 rounded-2xl border bg-card px-4 py-6">
		<svg viewBox="0 0 200 200" style="width:min(70vw,260px);height:min(70vw,260px)">
			<circle cx="100" cy="100" r="94" fill="none" stroke="var(--border)" stroke-width="2" />
			<g transform="rotate({-heading} 100 100)">
				<text
					x="100"
					y="24"
					text-anchor="middle"
					font-size="14"
					font-weight="700"
					fill="var(--foreground)">U</text
				>
				<text x="182" y="105" text-anchor="middle" font-size="12" fill="var(--muted-foreground)"
					>T</text
				>
				<text x="100" y="188" text-anchor="middle" font-size="12" fill="var(--muted-foreground)"
					>S</text
				>
				<text x="18" y="105" text-anchor="middle" font-size="12" fill="var(--muted-foreground)"
					>B</text
				>
			</g>
			<g transform="rotate({(qb ?? 0) - heading} 100 100)">
				<path d="M100 30 L108 100 L100 92 L92 100 Z" fill="var(--gold)" />
				<circle cx="100" cy="100" r="5" fill="var(--primary)" />
				<text x="100" y="46" text-anchor="middle" font-size="16">🕋</text>
			</g>
		</svg>
		<div class="text-[15px] text-muted-foreground">
			{t('qb_pre')}
			<b class="text-[22px] tabular-nums text-foreground">{qb === null ? '—' : qb.toFixed(1) + '°'}</b>
			{t('qb_from')}
		</div>
		<Button onclick={enableCompass}>{t('comp_btn')}</Button>
		<div class="mt-1 text-center text-xs leading-relaxed text-muted-foreground">
			{t('note_qiblat')}
		</div>
	</div>
</div>
