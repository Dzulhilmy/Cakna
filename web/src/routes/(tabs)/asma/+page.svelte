<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { t } from '$lib/state/i18n.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<PageHeader title={t('p_asma')} back="/menu" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<div class="rounded-2xl border bg-card px-4">
		{#each data.asma as n (n.position)}
			<div class="flex items-center gap-3 border-b py-3 last:border-b-0">
				<span
					class="grid h-[30px] w-[30px] flex-none place-items-center rounded-full border border-gold text-[11px] font-bold text-gold"
				>
					{n.position}
				</span>
				<div class="min-w-0 flex-1">
					<div class="text-sm font-semibold">{n.translit}</div>
					<div class="text-[12.5px] leading-snug text-muted-foreground">
						{settings.value.uiLang === 'en' ? n.meaning_en : n.meaning_ms}
					</div>
				</div>
				<span dir="rtl" class="font-arabic min-w-24 flex-none text-right text-2xl leading-relaxed">
					{n.arabic}
				</span>
			</div>
		{/each}
	</div>
</div>
