<script lang="ts">
	import { segmentTaj } from '$lib/quran/tajweed';
	import { settings } from '$lib/state/stores.svelte';

	interface Props {
		text: string;
		taj?: number[] | null;
		/** rem-based multiplier of --arabic-size (sample scales per module) */
		scale?: number;
		class?: string;
	}
	let { text, taj = null, scale = 0.85, class: cls = '' }: Props = $props();

	const segments = $derived(segmentTaj(text, taj, settings.value.tajweed));
</script>

<p
	dir="rtl"
	class="font-arabic leading-[2] {cls}"
	style="font-size: calc(var(--arabic-size) * {scale});"
>
	{#each segments as seg, i (i)}
		{#if seg.rule !== null}<i class="tj t{seg.rule}">{seg.text}</i>{:else}{seg.text}{/if}
	{/each}
</p>
