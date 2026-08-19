<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	let { data } = $props();
	const { core, program } = $derived(data);
</script>
<svelte:head><title>{program.name} · {core.name} · Cakna Hub</title></svelte:head>
<main class="mx-auto max-w-3xl px-6 py-12">
	<a href="/core/{core.id}" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"><ArrowLeft size={16} /> {core.name}</a>
	<h1 class="mt-6 text-2xl font-bold tracking-tight text-zinc-900">{program.name}</h1>
	{#if program.description}
		<p class="mt-4 text-zinc-600 leading-relaxed">{program.description}</p>
	{/if}
	{#if program.image}
		<img src={program.image} alt={program.name} class="mt-8 w-full rounded-2xl border border-zinc-200 object-cover aspect-video" />
	{/if}
</main>
