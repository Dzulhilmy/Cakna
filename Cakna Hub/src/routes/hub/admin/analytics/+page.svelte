<script lang="ts">
	import { formatRM } from '$lib/format';
	let { data } = $props();
	const { byCluster, byState, total } = $derived(data);
	const maxCluster = $derived(byCluster.reduce((m, c) => Math.max(m, c.total), 0));
	const maxState = $derived(byState.reduce((m, s) => Math.max(m, s.total), 0));
</script>
<svelte:head><title>Analytics · Cakna Hub Admin</title></svelte:head>
<div class="space-y-8">
	<header>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Analytics</h1>
		<p class="mt-1.5 text-zinc-500">{total} funding applications in total.</p>
	</header>

	<section class="rounded-2xl border border-zinc-200 bg-white p-6">
		<h2 class="text-base font-semibold text-zinc-800 mb-5">By Core Cluster</h2>
		<div class="space-y-3">
			{#each byCluster as row (row.cluster)}
				<div class="flex items-center gap-3">
					<span class="w-28 truncate text-sm text-zinc-600">{row.label}</span>
					<div class="flex-1 rounded-full bg-zinc-100 h-3 overflow-hidden">
						<div class="h-full rounded-full bg-rose-400" style="width:{maxCluster ? Math.round((row.total / maxCluster) * 100) : 0}%"></div>
					</div>
					<span class="w-24 text-right text-sm tabular-nums text-zinc-700">{formatRM(row.total)}</span>
					<span class="w-12 text-right text-xs text-zinc-400">{row.count}</span>
				</div>
			{:else}
				<p class="text-sm text-zinc-400">No data.</p>
			{/each}
		</div>
	</section>

	<section class="rounded-2xl border border-zinc-200 bg-white p-6">
		<h2 class="text-base font-semibold text-zinc-800 mb-5">By State</h2>
		<div class="space-y-3">
			{#each byState as row (row.state)}
				<div class="flex items-center gap-3">
					<span class="w-36 truncate text-sm text-zinc-600">{row.state}</span>
					<div class="flex-1 rounded-full bg-zinc-100 h-3 overflow-hidden">
						<div class="h-full rounded-full bg-amber-400" style="width:{maxState ? Math.round((row.total / maxState) * 100) : 0}%"></div>
					</div>
					<span class="w-24 text-right text-sm tabular-nums text-zinc-700">{formatRM(row.total)}</span>
					<span class="w-12 text-right text-xs text-zinc-400">{row.count}</span>
				</div>
			{:else}
				<p class="text-sm text-zinc-400">No data.</p>
			{/each}
		</div>
	</section>
</div>
