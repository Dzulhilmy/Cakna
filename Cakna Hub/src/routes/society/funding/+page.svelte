<script lang="ts">
	import { Plus, ArrowLeft } from 'lucide-svelte';
	import StatusBadge from '$lib/components/society/StatusBadge.svelte';
	import { formatRM } from '$lib/format';

	let { data } = $props();
	const { applications } = $derived(data);
</script>

<svelte:head><title>Funding Applications · Cakna Hub</title></svelte:head>

<main class="mx-auto max-w-4xl px-6 py-12">
	<a href="/" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900">
		<ArrowLeft size={16} /> Home
	</a>

	<div class="mt-6 flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Funding Applications</h1>
			<p class="mt-1.5 text-zinc-500">Events and programmes submitted for funding.</p>
		</div>
		<a href="/society/funding/new" class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">
			<Plus size={16} /> New Application
		</a>
	</div>

	{#if applications.length === 0}
		<div class="mt-16 text-center text-zinc-400">
			<p class="text-lg font-medium">No applications yet.</p>
			<p class="mt-1 text-sm">Submit the first one using the button above.</p>
		</div>
	{:else}
		<ul class="mt-8 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white">
			{#each applications as a (a.id)}
				<li>
					<a href="/society/funding/{a.id}" class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-zinc-50">
						<div class="min-w-0">
							<p class="truncate text-sm font-semibold text-zinc-900">{a.namaProgram}</p>
							<p class="mt-0.5 text-xs text-zinc-400">{a.reference} · {a.cawangan}</p>
						</div>
						<div class="flex shrink-0 items-center gap-3">
							<StatusBadge status={a.status} />
							<span class="text-sm font-medium tabular-nums text-zinc-700">{formatRM(a.jumlahPerbelanjaan)}</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>
