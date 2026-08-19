<script lang="ts">
	import StatusBadge from '$lib/components/society/StatusBadge.svelte';
	import { formatRM } from '$lib/format';
	let { data } = $props();
	const { applications } = $derived(data);
</script>
<svelte:head><title>Funding · Cakna Hub Admin</title></svelte:head>
<div class="space-y-8">
	<header>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Funding Applications</h1>
		<p class="mt-1.5 text-zinc-500">{applications.length} total applications.</p>
	</header>
	<div class="rounded-2xl border border-zinc-200 bg-white overflow-x-auto">
		<table class="w-full text-sm">
			<thead class="border-b border-zinc-100 bg-zinc-50">
				<tr>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Program</th>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Cawangan</th>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Status</th>
					<th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Amount</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-100">
				{#each applications as a (a.id)}
					<tr>
						<td class="px-5 py-3">
							<a href="/society/funding/{a.id}" class="font-medium text-zinc-900 hover:text-rose-600">{a.namaProgram}</a>
							<p class="text-xs text-zinc-400">{a.reference}</p>
						</td>
						<td class="px-5 py-3 text-zinc-500">{a.cawangan}</td>
						<td class="px-5 py-3"><StatusBadge status={a.status} /></td>
						<td class="px-5 py-3 text-right tabular-nums text-zinc-700">{formatRM(a.jumlahPerbelanjaan)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if applications.length === 0}
			<div class="py-12 text-center text-sm text-zinc-400">No applications yet.</div>
		{/if}
	</div>
</div>
