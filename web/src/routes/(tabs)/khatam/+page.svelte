<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Progress } from '$lib/components/ui/progress';
	import * as Select from '$lib/components/ui/select';
	import { t } from '$lib/state/i18n.svelte';
	import { khatamToasted, read, readlog, settings, sgdays, todayKey } from '$lib/state/stores.svelte';
	import { toast } from 'svelte-sonner';

	const DAY_OPTS = [7, 15, 30, 60, 90];

	// ---------- Statistik ----------
	const pagesRead = $derived(read.value.length);
	const left = $derived(604 - pagesRead);
	const pct = $derived(Math.round((pagesRead / 604) * 100));
	const todayCount = $derived(readlog.value[todayKey()] ?? 0);

	/* Port of the sample's streakDays(): start today; if today has no
	   entry, start counting from yesterday. */
	const streak = $derived.by(() => {
		let n = 0;
		const d = new Date();
		if (!readlog.value[todayKey(d)]) d.setDate(d.getDate() - 1); // hari ini belum baca — mula kira dari semalam
		while ((readlog.value[todayKey(d)] ?? 0) > 0) {
			n++;
			d.setDate(d.getDate() - 1);
		}
		return n;
	});

	// ---------- Pelan khatam ----------
	function dayLabel(v: number): string {
		return `${v} ${t('days')}${v === 30 ? t('month') : ''}`;
	}
	const planHtml = $derived.by(() => {
		if (left === 0) return t('sg_done');
		const perDay = Math.ceil(left / sgdays.value) || 0;
		const tarikh = new Date(Date.now() + sgdays.value * 86400000).toLocaleDateString(
			settings.value.uiLang === 'en' ? 'en-GB' : 'ms-MY',
			{ day: 'numeric', month: 'long', year: 'numeric' }
		);
		return t('sg_plan', { d: sgdays.value, p: perDay, t: tarikh });
	});

	// ---------- Heatmap aktiviti bacaan (12 minggu × 7 hari) ----------
	const heatCells = $derived.by(() => {
		const now = Date.now();
		const cells: { key: string; n: number }[] = [];
		for (let i = 83; i >= 0; i--) {
			const key = todayKey(new Date(now - i * 86400000));
			cells.push({ key, n: readlog.value[key] ?? 0 });
		}
		return cells;
	});
	function heatBg(n: number): string {
		if (n === 0) return '';
		return `background:${n < 3 ? 'var(--heat-1)' : n < 8 ? 'var(--heat-2)' : 'var(--heat-3)'}`;
	}

	// ---------- Set semula rekod khatam ----------
	function resetRead() {
		read.value = [];
		khatamToasted.value = false;
		toast(t('t_reset'));
	}
</script>

<PageHeader title={t('p_sasaran')} back="/" />

<div class="mx-auto max-w-[680px] space-y-4 px-4 py-4">
	<!-- Kemajuan khatam -->
	<div class="rounded-2xl border bg-card p-4">
		<div class="mb-2 flex items-baseline justify-between gap-2">
			<div class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
				{t('st_prog')}
			</div>
			<div class="text-[12px] tabular-nums text-muted-foreground">
				{pagesRead} / 604 {t('st_pages')} ({pct}%)
			</div>
		</div>
		<Progress value={pagesRead} max={604} class="h-2" />

		<div class="mt-4 grid grid-cols-2 gap-2.5">
			<div class="rounded-xl border bg-background p-3 text-center">
				<b class="block font-display text-2xl tabular-nums">{pagesRead}</b>
				<span class="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{t('sg_read')}</span>
			</div>
			<div class="rounded-xl border bg-background p-3 text-center">
				<b class="block font-display text-2xl tabular-nums">{todayCount}</b>
				<span class="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{t('sg_today')}</span>
			</div>
			<div class="rounded-xl border bg-background p-3 text-center">
				<b class="block font-display text-2xl tabular-nums">{streak}</b>
				<span class="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{t('sg_streak')}</span>
			</div>
			<div class="rounded-xl border bg-background p-3 text-center">
				<b class="block font-display text-2xl tabular-nums text-gold">{left}</b>
				<span class="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{t('sg_left')}</span>
			</div>
		</div>
	</div>

	<!-- Tempoh sasaran khatam -->
	<div class="rounded-2xl border bg-card p-4">
		<div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
			{t('sg_dur')}
		</div>
		<Select.Root
			type="single"
			value={String(sgdays.value)}
			onValueChange={(v: string) => {
				sgdays.value = +v;
			}}
		>
			<Select.Trigger class="w-full">{dayLabel(sgdays.value)}</Select.Trigger>
			<Select.Content>
				{#each DAY_OPTS as d (d)}
					<Select.Item value={String(d)}>{dayLabel(d)}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<div class="mt-3 rounded-xl border border-dashed border-gold px-3.5 py-3 text-[12px] leading-relaxed text-muted-foreground [&_b]:text-foreground">
			{@html planHtml}
		</div>
	</div>

	<!-- Aktiviti bacaan (12 minggu) -->
	<div class="rounded-2xl border bg-card p-4">
		<div class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
			{t('lbl_heat')}
		</div>
		<div class="mt-2.5 grid grid-cols-14 gap-1">
			{#each heatCells as cell (cell.key)}
				<div
					class="aspect-square rounded-[3px] {cell.n === 0 ? 'bg-muted' : ''}"
					style={heatBg(cell.n)}
					title={cell.key + (cell.n ? ` · ${cell.n} ${t('st_pages')}` : '')}
				></div>
			{/each}
		</div>
	</div>

	<!-- Set semula rekod khatam -->
	<AlertDialog.Root>
		<AlertDialog.Trigger
			class="w-full rounded-xl border bg-card p-3 text-[13.5px] font-semibold text-destructive active:bg-accent"
		>
			{t('reset_read')}
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{t('reset_read')}</AlertDialog.Title>
				<AlertDialog.Description>
					{settings.value.uiLang === 'en'
						? 'This clears the record of all pages read (the khatam tracker). Your daily activity log is kept. Continue?'
						: 'Ini akan memadam rekod semua halaman yang telah dibaca (penjejak khatam). Log aktiviti harian anda dikekalkan. Teruskan?'}
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>
					{settings.value.uiLang === 'en' ? 'Cancel' : 'Batal'}
				</AlertDialog.Cancel>
				<AlertDialog.Action variant="destructive" onclick={resetRead}>
					{t('reset')}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
