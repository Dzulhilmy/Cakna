<script lang="ts">
	let { data } = $props();
	const { events, applications } = $derived(data);
	const items = $derived([
		...events.map((e) => ({ date: e.tarikh, title: e.title, type: 'event' as const, id: e.id })),
		...applications.map((a) => ({ date: a.tarikh, title: a.namaProgram, type: 'funding' as const, id: a.id })),
	].sort((a, b) => a.date.localeCompare(b.date)));
</script>
<svelte:head><title>Calendar · Cakna Hub Admin</title></svelte:head>
<div class="space-y-8">
	<header>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">QC Calendar</h1>
		<p class="mt-1.5 text-zinc-500">Approved programmes and events sorted by date.</p>
	</header>
	<div class="rounded-2xl border border-zinc-200 bg-white divide-y divide-zinc-100">
		{#each items as item (item.id + item.type)}
			<div class="flex items-center gap-4 px-5 py-4">
				<div class="shrink-0 text-center w-14">
					<p class="text-xs text-zinc-400 uppercase">{item.date.slice(5, 7)}/{item.date.slice(8, 10)}</p>
					<p class="font-bold text-lg text-zinc-800">{item.date.slice(0, 4)}</p>
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate font-medium text-zinc-900">{item.title}</p>
					<span class="inline-block rounded-full px-2 py-0.5 text-xs {item.type === 'event' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}">{item.type}</span>
				</div>
			</div>
		{:else}
			<div class="py-12 text-center text-sm text-zinc-400">No scheduled items.</div>
		{/each}
	</div>
</div>
