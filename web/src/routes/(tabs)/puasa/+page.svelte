<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { PZ_REASONS, PZ_TYPES } from '$lib/quran/tajweed';
	import { t } from '$lib/state/i18n.svelte';
	import { puasa, settings, todayKey, type PuasaRecord } from '$lib/state/stores.svelte';
	import { hijriParts, nextRamadanIn } from '$lib/utils/hijri';
	import { X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	const en = $derived(settings.value.uiLang === 'en');
	const li = $derived(en ? 1 : 0); // PZ_* label index by UI language
	const loc = $derived(en ? 'en-GB' : 'ms-MY');

	/* Kiraan — port of the sample's pzCounts()/renderPuasa() */
	const counts = $derived.by(() => {
		let u = 0;
		let q = 0;
		for (const r of puasa.value.recs) {
			if (r.t === 'u') u++;
			else if (r.t === 'q') q++;
		}
		return { u, q };
	});
	const missed = $derived(counts.u + (puasa.value.adj || 0));
	const paid = $derived(counts.q);
	const left = $derived(Math.max(0, missed - paid));
	const ramadanIn = $derived(left > 0 ? nextRamadanIn() : null);

	/* Borang tambah rekod */
	const today = todayKey();
	let date = $state(todayKey());
	let type = $state<PuasaRecord['t']>('u');
	let reason = $state('haid');

	function addRecord() {
		if (!date) {
			toast(t('pz_date'));
			return;
		}
		const rec: PuasaRecord = { d: date, t: type };
		if (type === 'u') rec.r = reason;
		puasa.value.recs.push(rec);
		if (navigator.vibrate) navigator.vibrate(15);
		toast(t('t_pz_saved'));
	}

	/* Senarai — sorted view; delete by record identity in the original array */
	const sorted = $derived([...puasa.value.recs].sort((a, b) => b.d.localeCompare(a.d)));
	let toDelete = $state.raw<PuasaRecord | null>(null);

	function confirmDelete() {
		if (!toDelete) return;
		const i = puasa.value.recs.indexOf(toDelete);
		if (i >= 0) puasa.value.recs.splice(i, 1);
		toDelete = null;
		toast(t('t_pz_del'));
	}

	function fmtGreg(d: string): string {
		return new Date(d + 'T12:00:00').toLocaleDateString(loc, {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
	function fmtHijri(d: string): string {
		return hijriParts(new Date(d + 'T12:00:00'), settings.value.uiLang)?.str ?? '';
	}

	// Chip colours per type — port of the sample's .pz-chip.{u,q,s,r}
	const CHIP: Record<PuasaRecord['t'], string> = {
		u: 'bg-destructive/15 text-destructive',
		q: 'bg-primary text-primary-foreground',
		s: 'border border-gold text-gold',
		r: 'bg-playing text-primary'
	};
</script>

<PageHeader title={t('p_puasa')} back="/menu" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<!-- Kaunter -->
	<div class="grid grid-cols-3 gap-3">
		<div class="rounded-2xl border bg-card p-3 text-center">
			<b class="block font-display text-2xl tabular-nums">{missed}</b>
			<span class="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">{t('pz_missed')}</span>
		</div>
		<div class="rounded-2xl border bg-card p-3 text-center">
			<b class="block font-display text-2xl tabular-nums">{paid}</b>
			<span class="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">{t('pz_paid')}</span>
		</div>
		<div class="rounded-2xl border bg-card p-3 text-center">
			<b class="block font-display text-2xl tabular-nums text-gold">{left}</b>
			<span class="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">{t('pz_left')}</span>
		</div>
	</div>

	<!-- Peringatan Ramadan -->
	{#if left > 0}
		<div class="mt-2.5 rounded-xl border border-gold px-3.5 py-3 text-[13px] font-semibold text-gold">
			{ramadanIn !== null ? t('pz_urgent', { n: ramadanIn, b: left }) : t('pz_left') + ': ' + left}
		</div>
	{:else if paid > 0 || missed > 0}
		<div class="mt-2.5 rounded-xl border border-primary/50 px-3.5 py-3 text-[13px] font-semibold text-primary">
			{t('pz_clear')}
		</div>
	{/if}

	<!-- Baki terdahulu (pelarasan manual) -->
	<Card.Root class="mt-3 rounded-2xl">
		<Card.Content class="grid gap-2">
			<Label for="pz-adj" class="text-xs font-bold text-muted-foreground">{t('pz_adj')}</Label>
			<Input
				id="pz-adj"
				type="number"
				min="0"
				inputmode="numeric"
				value={puasa.value.adj}
				oninput={(e) => {
					puasa.value.adj = Math.max(0, parseInt(e.currentTarget.value) || 0);
				}}
			/>
		</Card.Content>
	</Card.Root>

	<!-- Tambah rekod -->
	<Card.Root class="mt-3 rounded-2xl">
		<Card.Content class="grid gap-2">
			<div class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t('pz_add')}</div>

			<Label for="pz-date" class="mt-1 text-xs font-bold text-muted-foreground">{t('pz_date')}</Label>
			<Input id="pz-date" type="date" max={today} bind:value={date} />

			<Label class="mt-2 text-xs font-bold text-muted-foreground">{t('pz_type')}</Label>
			<Select.Root type="single" bind:value={type}>
				<Select.Trigger class="w-full">{PZ_TYPES[type][li]}</Select.Trigger>
				<Select.Content>
					{#each Object.keys(PZ_TYPES) as k (k)}
						<Select.Item value={k}>{PZ_TYPES[k][li]}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			{#if type === 'u'}
				<Label class="mt-2 text-xs font-bold text-muted-foreground">{t('pz_reason')}</Label>
				<Select.Root type="single" bind:value={reason}>
					<Select.Trigger class="w-full">{PZ_REASONS[reason][li]}</Select.Trigger>
					<Select.Content>
						{#each Object.keys(PZ_REASONS) as k (k)}
							<Select.Item value={k}>{PZ_REASONS[k][li]}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/if}

			<Button class="mt-3 w-full" onclick={addRecord}>{t('pz_save')}</Button>
		</Card.Content>
	</Card.Root>

	<!-- Sejarah rekod -->
	<Card.Root class="mt-3 rounded-2xl">
		<Card.Content>
			<div class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t('pz_list')}</div>
			{#if sorted.length === 0}
				<div class="px-1 py-3.5 text-sm text-muted-foreground">{t('pz_empty')}</div>
			{:else}
				{#each sorted as r (r)}
					<div class="flex items-center gap-2.5 border-b py-2.5 last:border-b-0">
						<span
							class="flex-none rounded-full px-2.5 py-[3px] text-[10px] font-extrabold tracking-wide {CHIP[r.t]}"
						>
							{PZ_TYPES[r.t][li]}
						</span>
						<span class="min-w-0 flex-1">
							<b class="block text-[13.5px]">{fmtGreg(r.d)}</b>
							<small class="text-[11.5px] text-muted-foreground">
								{fmtHijri(r.d)}{r.t === 'u' && r.r ? ' · ' + PZ_REASONS[r.r][li] : ''}
							</small>
						</span>
						<button
							class="grid h-8 w-8 flex-none place-items-center rounded-lg text-muted-foreground hover:bg-accent"
							aria-label={t('del')}
							onclick={() => (toDelete = r)}
						>
							<X size={16} />
						</button>
					</div>
				{/each}
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Nota -->
	<div class="mt-3 rounded-xl border px-3.5 py-3 text-[12.5px] leading-relaxed text-muted-foreground">
		{t('pz_note')}
	</div>
</div>

<!-- Sahkan padam -->
<AlertDialog.Root
	open={toDelete !== null}
	onOpenChange={(o: boolean) => {
		if (!o) toDelete = null;
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{en ? 'Delete record?' : 'Padam rekod?'}</AlertDialog.Title>
			<AlertDialog.Description>
				{#if toDelete}
					{PZ_TYPES[toDelete.t][li]} — {fmtGreg(toDelete.d)}
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{en ? 'Cancel' : 'Batal'}</AlertDialog.Cancel>
			<AlertDialog.Action onclick={confirmDelete}>{t('del')}</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
