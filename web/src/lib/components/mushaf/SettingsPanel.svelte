<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Slider } from '$lib/components/ui/slider';
	import { Switch } from '$lib/components/ui/switch';
	import { Separator } from '$lib/components/ui/separator';
	import { QARIS } from '$lib/quran/tajweed';
	import { t } from '$lib/state/i18n.svelte';
	import { player } from '$lib/state/player.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { toast } from 'svelte-sonner';

	const s = settings;

	const themes = [
		{ value: 'light', label: () => t('th_light') },
		{ value: 'sepia', label: () => t('th_sepia') },
		{ value: 'dark', label: () => t('th_dark') }
	];
	const uiLangs = [
		{ value: 'ms', label: 'Bahasa Melayu' },
		{ value: 'en', label: 'English' }
	];
	const transLangs = [
		{ value: 'ms', label: 'Bahasa Melayu (Basmeih)' },
		{ value: 'en', label: 'English (Sahih International)' },
		{ value: 'id', label: 'Indonesia (Kemenag)' }
	];
	const speeds = [
		{ value: '0.75', label: () => t('spd_slow') },
		{ value: '1', label: () => t('spd_norm') },
		{ value: '1.25', label: () => t('spd_125') },
		{ value: '1.5', label: () => t('spd_fast') }
	];
	const repeats = [
		{ value: '1', label: () => t('rep1') },
		{ value: '2', label: () => '2' + t('repx') },
		{ value: '3', label: () => '3' + t('repx') },
		{ value: '5', label: () => '5' + t('repx') }
	];
	const aligns: { value: 'justify' | 'center' | 'right'; label: string }[] = [
		{ value: 'justify', label: 'Justify' },
		{ value: 'center', label: 'Center' },
		{ value: 'right', label: 'Right' }
	];

	let fontValue = $state(settings.value.fontSize);
	$effect(() => {
		fontValue = settings.value.fontSize;
	});
</script>

<div class="flex flex-col gap-5 px-1 pb-4">
	<div class="grid gap-2">
		<Label>{t('lbl_theme')}</Label>
		<Select.Root type="single" bind:value={s.value.theme}>
			<Select.Trigger class="w-full">{themes.find((x) => x.value === s.value.theme)?.label()}</Select.Trigger>
			<Select.Content>
				{#each themes as th (th.value)}
					<Select.Item value={th.value}>{th.label()}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="grid gap-2">
		<Label>{t('lbl_font')} — {fontValue}px</Label>
		<Slider
			type="single"
			min={20}
			max={60}
			step={2}
			bind:value={fontValue}
			onValueCommit={(v: number) => (s.value.fontSize = v)}
		/>
	</div>

	<div class="grid gap-2">
		<Label>{t('lbl_align')}</Label>
		<div class="flex gap-2">
			{#each aligns as al (al.value)}
				<button
					class="flex-1 rounded-lg border py-1.5 text-sm {s.value.align === al.value
						? 'border-primary bg-accent text-accent-foreground'
						: 'text-muted-foreground'}"
					onclick={() => (s.value.align = al.value)}
				>
					{al.label}
				</button>
			{/each}
		</div>
	</div>

	<Separator />

	<div class="grid gap-2">
		<Label>{t('lbl_qari')}</Label>
		<Select.Root type="single" bind:value={s.value.qari} onValueChange={() => player.qariChanged()}>
			<Select.Trigger class="w-full">{QARIS.find((q) => q.id === s.value.qari)?.name}</Select.Trigger>
			<Select.Content>
				{#each QARIS as q (q.id)}
					<Select.Item value={q.id}>{q.name}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="grid gap-2">
		<Label>{t('lbl_speed')}</Label>
		<Select.Root
			type="single"
			value={String(s.value.speed)}
			onValueChange={(v: string) => {
				s.value.speed = +v as typeof s.value.speed;
				player.speedChanged();
			}}
		>
			<Select.Trigger class="w-full">{speeds.find((x) => +x.value === s.value.speed)?.label()}</Select.Trigger>
			<Select.Content>
				{#each speeds as sp (sp.value)}
					<Select.Item value={sp.value}>{sp.label()}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="grid gap-2">
		<Label>{t('rep')}</Label>
		<Select.Root
			type="single"
			value={String(s.value.repeat)}
			onValueChange={(v: string) => {
				s.value.repeat = +v as typeof s.value.repeat;
				player.repeatChanged();
				if (+v > 1) toast(t('t_rep', { n: v }));
			}}
		>
			<Select.Trigger class="w-full">{repeats.find((x) => +x.value === s.value.repeat)?.label()}</Select.Trigger>
			<Select.Content>
				{#each repeats as r (r.value)}
					<Select.Item value={r.value}>{r.label()}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<Separator />

	<div class="flex items-center justify-between">
		<Label>{t('tj')}</Label>
		<Switch
			checked={s.value.tajweed}
			onCheckedChange={(v: boolean) => {
				s.value.tajweed = v;
				toast(t(v ? 't_tj_on' : 't_tj_off'));
			}}
		/>
	</div>

	<div class="flex items-center justify-between">
		<Label>{t('inl')}</Label>
		<Switch checked={s.value.inlineTrans} onCheckedChange={(v: boolean) => (s.value.inlineTrans = v)} />
	</div>

	<div class="flex items-center justify-between">
		<Label>{t('lbl_tlr')}</Label>
		<Switch checked={s.value.translit} onCheckedChange={(v: boolean) => (s.value.translit = v)} />
	</div>

	<div class="flex items-center justify-between">
		<Label>{t('lbl_hide')}</Label>
		<Switch
			checked={s.value.hideMode}
			onCheckedChange={(v: boolean) => {
				s.value.hideMode = v;
				toast(t(v ? 't_hide_on' : 't_hide_off'));
			}}
		/>
	</div>

	<Separator />

	<div class="grid gap-2">
		<Label>{t('lbl_ui')}</Label>
		<Select.Root type="single" bind:value={s.value.uiLang} onValueChange={() => toast(t('t_lang'))}>
			<Select.Trigger class="w-full">{uiLangs.find((x) => x.value === s.value.uiLang)?.label}</Select.Trigger>
			<Select.Content>
				{#each uiLangs as l (l.value)}
					<Select.Item value={l.value}>{l.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="grid gap-2">
		<Label>{t('lbl_tl')}</Label>
		<Select.Root type="single" bind:value={s.value.transLang} onValueChange={() => toast(t('t_tlang'))}>
			<Select.Trigger class="w-full">{transLangs.find((x) => x.value === s.value.transLang)?.label}</Select.Trigger>
			<Select.Content>
				{#each transLangs as l (l.value)}
					<Select.Item value={l.value}>{l.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</div>
