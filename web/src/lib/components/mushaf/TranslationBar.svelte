<script lang="ts">
	import type { PageBundle } from '$lib/api/types';
	import { player } from '$lib/state/player.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { X } from '@lucide/svelte';

	interface Props {
		bundle: PageBundle;
	}
	let { bundle }: Props = $props();

	const ayah = $derived(
		player.playingG >= 1 && settings.value.showTrans && !settings.value.inlineTrans
			? (bundle.ayahs.find((a) => a.global === player.playingG) ?? null)
			: null
	);
</script>

{#if ayah}
	<div class="fixed inset-x-0 z-30 flex justify-center px-3" style="bottom: calc(64px + var(--safe-b));">
		<div class="w-full max-w-[680px] rounded-2xl border border-gold-soft bg-card/95 p-3 shadow-lg backdrop-blur">
			<div class="mb-1 flex items-center justify-between">
				<span class="text-[11px] font-bold tracking-wider text-gold">{ayah.surah}:{ayah.ayah}</span>
				<button
					class="text-muted-foreground"
					aria-label="close"
					onclick={() => (settings.value.showTrans = false)}
				>
					<X size={14} />
				</button>
			</div>
			{#if settings.value.translit}
				<p class="mb-1 text-[12.5px] italic leading-snug text-muted-foreground">{ayah.translit}</p>
			{/if}
			<p class="max-h-28 overflow-y-auto text-[13.5px] leading-relaxed">
				{ayah.tr[settings.value.transLang]}
			</p>
		</div>
	</div>
{/if}
