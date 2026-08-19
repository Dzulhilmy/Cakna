<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	let { data } = $props();
	const { event } = $derived(data);
</script>
<svelte:head><title>{event.title} · Cakna Hub</title></svelte:head>
<main class="mx-auto max-w-3xl px-6 py-12">
	<a href="/society/events" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"><ArrowLeft size={16} /> Events</a>
	<h1 class="mt-6 text-2xl font-bold tracking-tight text-zinc-900">{event.title}</h1>
	<dl class="mt-8 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:grid-cols-2">
		{#each [['Tarikh', event.tarikh],['Lokasi', event.lokasi],['Kluster', event.kluster],['Anjuran', event.anjuran],['Jumlah Peserta', event.jumlahPeserta]] as [label, value] (label)}
			{#if value}
				<div>
					<dt class="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</dt>
					<dd class="mt-1 text-sm text-zinc-800">{value}</dd>
				</div>
			{/if}
		{/each}
	</dl>
	{#if event.penerangan}
		<div class="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
			<h2 class="text-sm font-semibold text-zinc-700">Penerangan</h2>
			<p class="mt-2 text-sm leading-relaxed text-zinc-600">{event.penerangan}</p>
		</div>
	{/if}
	{#if event.images && event.images.length > 0}
		<div class="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3">
			{#each event.images as src, i}
				<img {src} alt="" class="aspect-[4/3] w-full rounded-2xl border border-zinc-200 object-cover" />
			{/each}
		</div>
	{/if}
</main>
