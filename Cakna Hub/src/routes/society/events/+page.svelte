<script lang="ts">
	import { Plus, ArrowLeft } from 'lucide-svelte';
	let { data } = $props();
	const { events } = $derived(data);
</script>
<svelte:head><title>Events · Cakna Hub</title></svelte:head>
<main class="mx-auto max-w-4xl px-6 py-12">
	<a href="/" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"><ArrowLeft size={16} /> Home</a>
	<div class="mt-6 flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Events</h1>
			<p class="mt-1.5 text-zinc-500">Programme events submitted by franchisees.</p>
		</div>
		<a href="/society/events/new" class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"><Plus size={16} /> New Event</a>
	</div>
	{#if events.length === 0}
		<div class="mt-16 text-center text-zinc-400"><p class="text-lg font-medium">No events yet.</p></div>
	{:else}
		<ul class="mt-8 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white">
			{#each events as e (e.id)}
				<li>
					<a href="/society/events/{e.id}" class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-zinc-50">
						<div class="min-w-0">
							<p class="truncate text-sm font-semibold text-zinc-900">{e.title}</p>
							<p class="mt-0.5 text-xs text-zinc-400">{e.tarikh} · {e.lokasi}</p>
						</div>
						<span class="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">{e.kluster}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>
