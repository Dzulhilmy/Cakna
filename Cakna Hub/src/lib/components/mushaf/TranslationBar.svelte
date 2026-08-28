<script lang="ts">
	import type { PageBundle } from '$lib/api/types';
	import { player } from '$lib/state/player.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { X } from 'lucide-svelte';

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
	<!-- clears the full reader bottom bar: 64px icon row + ~40px jump form + gap -->
	<div class="fixed inset-x-0 z-30 flex justify-center px-3" style="bottom: calc(112px + var(--safe-b));">
		<div class="tr-card w-full max-w-[680px] rounded-2xl border p-3 shadow-lg backdrop-blur">
			<div class="mb-1 flex items-center justify-between">
				<span class="text-[11px] font-bold tracking-wider text-gold">{ayah.surah}:{ayah.ayah}</span>
				<button
					class="tr-close"
					aria-label="close"
					onclick={() => (settings.value.showTrans = false)}
				>
					<X size={14} />
				</button>
			</div>
			<div class="max-h-[40dvh] overflow-y-auto overscroll-contain pb-1">
				{#if settings.value.translit}
					<p class="tr-translit mb-1 text-[13px] italic leading-snug">{ayah.translit}</p>
				{/if}
				<p class="text-[15px] leading-relaxed">
					{ayah.tr[settings.value.transLang]}
				</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.tr-card {
		background-color: color-mix(in srgb, var(--card) 95%, transparent);
		color: var(--card-foreground);
		border-color: var(--gold-soft);
	}
	.tr-close {
		color: var(--muted-foreground);
	}
	.tr-translit {
		color: var(--muted-foreground);
	}
</style>
