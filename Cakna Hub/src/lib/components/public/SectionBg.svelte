<script lang="ts">
	import { onMount } from 'svelte';

	let { images = [], overlay = 'medium' }: { images?: string[]; overlay?: string } = $props();
	let currentIndex = $state(0);
	const alpha = $derived(overlay === 'light' ? 0.15 : overlay === 'dark' ? 0.5 : 0.3);

	onMount(() => {
		if (images.length <= 1) return;
		const iv = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, 5000);
		return () => clearInterval(iv);
	});
</script>

{#if images.length > 0}
	<div class="pointer-events-none absolute inset-0 bg-zinc-900" aria-hidden="true">
		{#each images as img, i}
			<div
				class="absolute inset-0 transition-opacity duration-1000"
				style="background-image:url({img});background-size:cover;background-position:center;opacity:{i === currentIndex ? 1 : 0};"
			></div>
		{/each}
		<div class="absolute inset-0 z-10" style="background:rgba(0,0,0,{alpha});"></div>
	</div>
{/if}
