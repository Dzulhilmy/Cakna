<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	let { data } = $props();
	const { core, programs } = $derived(data);
</script>
<svelte:head><title>{core.name} Core · Cakna Hub</title></svelte:head>
<main class="mx-auto max-w-4xl px-6 py-12">
	<a href="/core" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"><ArrowLeft size={16} /> 7 Core</a>
	<div class="mt-6">
		<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{core.tagline}</p>
		<h1 class="mt-1 text-3xl font-bold tracking-tight text-zinc-900">{core.name}</h1>
		<p class="mt-3 text-zinc-600">{core.tagline}</p>
	</div>
	<div class="mt-10">
		<h2 class="text-base font-semibold text-zinc-800">Programs</h2>
		{#if programs.length === 0}
			<p class="mt-3 text-sm text-zinc-400">No programs listed yet.</p>
		{:else}
			<ul class="mt-4 grid gap-3 sm:grid-cols-2">
				{#each programs as p (p.id)}
					<li>
						<a href="/core/{core.id}/{p.slug}" class="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50">
							<p class="font-medium text-zinc-900">{p.name}</p>
							{#if p.description}<p class="mt-1 text-sm text-zinc-500 line-clamp-2">{p.description}</p>{/if}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</main>
