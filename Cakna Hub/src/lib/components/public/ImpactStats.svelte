<script lang="ts">
	import type { SiteContent } from '$lib/site';
	let { stats }: { stats: SiteContent['impact']['stats'] } = $props();
</script>

<div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
	{#each stats as s (s.label)}
		<div class="text-center">
			<p class="text-4xl font-bold tracking-tight text-rose-600">{s.value}</p>
			<p class="mt-1.5 text-sm font-medium text-zinc-600">{s.label}</p>
		</div>
	{/each}
</div>
