<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { RULE_NAMES, TJ_CHIPS, TJ_DESC } from '$lib/quran/tajweed';
	import { t } from '$lib/state/i18n.svelte';
	import { settings } from '$lib/state/stores.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
	}
	let { open, onclose }: Props = $props();
</script>

<Drawer.Root {open} onOpenChange={(o: boolean) => !o && onclose()}>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title class="font-display">{t('tj_guide')}</Drawer.Title>
		</Drawer.Header>
		<div class="max-h-[65dvh] overflow-y-auto px-4 pb-8">
			{#each RULE_NAMES as name, r (r)}
				<div class="flex items-start gap-3 border-b py-2.5 last:border-0">
					<span class="font-arabic tj t{r} min-w-10 text-center text-2xl leading-none">{TJ_CHIPS[r]}</span>
					<div>
						<div class="text-sm font-semibold">{name}</div>
						<div class="text-xs leading-relaxed text-muted-foreground">
							{TJ_DESC[settings.value.uiLang]?.[r] ?? TJ_DESC.ms[r]}
						</div>
					</div>
				</div>
			{/each}
			<p class="pt-3 text-[11.5px] leading-relaxed text-muted-foreground">{t('tj_note')}</p>
		</div>
	</Drawer.Content>
</Drawer.Root>
