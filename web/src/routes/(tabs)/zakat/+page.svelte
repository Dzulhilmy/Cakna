<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from '$lib/components/ui/tabs';
	import { t } from '$lib/state/i18n.svelte';
	import {
		DEFAULT_GOLD_PRICE,
		NISAB_GRAMS,
		fmtRM,
		zakatGold,
		zakatIncome,
		zakatSavings
	} from '$lib/utils/zakat';

	type ZkMode = 'income' | 'sav' | 'gold';
	let mode = $state<ZkMode>('income');

	// Raw number inputs (empty/invalid → undefined); clamp negatives to 0 like the sample.
	let goldPriceRaw = $state<number | undefined>(DEFAULT_GOLD_PRICE);
	let amtRaw = $state<number | undefined>(undefined);

	const price = $derived(Math.max(0, Number(goldPriceRaw) || 0));
	const amt = $derived(Math.max(0, Number(amtRaw) || 0));
	const nisab = $derived(NISAB_GRAMS * price);

	const result = $derived(
		mode === 'income'
			? zakatIncome(amt, price)
			: mode === 'sav'
				? zakatSavings(amt, price)
				: zakatGold(amt, price)
	);
	const ok = $derived(result.due !== null);

	const sub = $derived.by(() => {
		if (!ok) return amt > 0 ? t('zk_below') : '';
		if (mode === 'income')
			return `${t('zk_yearly')}: ${fmtRM(amt * 12)} · ${fmtRM(result.monthly ?? 0)} ${t('zk_permonth')}`;
		if (mode === 'sav') return `2.5% × ${fmtRM(amt)}`;
		return `${t('zk_goldval')}: ${fmtRM(amt * price)}`;
	});

	const amtLabel = $derived(
		mode === 'income' ? t('zk_monthly') : mode === 'sav' ? t('zk_lowbal') : t('zk_weight')
	);
</script>

<PageHeader title={t('p_zakat')} back="/menu" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<Tabs.Root
		value={mode}
		onValueChange={(v) => {
			mode = v as ZkMode;
			amtRaw = undefined; // sample clears the amount when switching mode
		}}
	>
		<Tabs.List class="grid h-10 w-full grid-cols-3">
			<Tabs.Trigger value="income">{t('zk_income')}</Tabs.Trigger>
			<Tabs.Trigger value="sav">{t('zk_sav')}</Tabs.Trigger>
			<Tabs.Trigger value="gold">{t('zk_gold')}</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<div class="mt-3 space-y-3">
		<div class="rounded-2xl border bg-card p-4">
			<Label for="zk-gold-price" class="mb-2 text-xs font-bold text-muted-foreground">
				{t('zk_goldprice')}
			</Label>
			<Input
				id="zk-gold-price"
				type="number"
				min="1"
				inputmode="decimal"
				class="h-11 rounded-xl text-[15px]"
				bind:value={goldPriceRaw}
			/>
			<p class="mt-2 text-xs leading-relaxed text-muted-foreground">
				{t('zk_nisab')}: {fmtRM(nisab)} (85g × {fmtRM(price)})
			</p>
		</div>

		<div class="rounded-2xl border bg-card p-4">
			<Label for="zk-amt" class="mb-2 text-xs font-bold text-muted-foreground">{amtLabel}</Label>
			<Input
				id="zk-amt"
				type="number"
				min="0"
				inputmode="decimal"
				placeholder="0"
				class="h-11 rounded-xl text-[15px]"
				bind:value={amtRaw}
			/>
		</div>

		<div class="rounded-2xl border bg-card p-5 text-center">
			<div class="text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
				{t('zk_due')}
			</div>
			<div class="my-1 font-display text-[32px] text-primary">
				{ok ? fmtRM(result.due ?? 0) : '—'}
			</div>
			{#if sub}
				<div class="text-[12.5px] text-muted-foreground">{sub}</div>
			{/if}
		</div>

		<p class="text-xs leading-relaxed text-muted-foreground">{t('zk_note')}</p>
	</div>
</div>
