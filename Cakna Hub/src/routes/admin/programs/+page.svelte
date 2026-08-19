<script lang="ts">
	import { Plus, Trash2 } from 'lucide-svelte';
	import { cores } from '$lib/cores';
	let { data, form } = $props();
	const { programs } = $derived(data);
</script>
<svelte:head><title>Programs · Cakna Hub Admin</title></svelte:head>
<div class="space-y-8">
	<header class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Programs</h1>
			<p class="mt-1.5 text-zinc-500">Manage the programme catalog for the 7 Core.</p>
		</div>
	</header>

	{#if form?.error}
		<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</div>
	{/if}

	<div class="rounded-2xl border border-zinc-200 bg-white p-6">
		<h2 class="text-sm font-semibold text-zinc-800 mb-4">Add Program</h2>
		<form method="POST" action="?/create" class="flex flex-wrap gap-3 items-end">
			<label class="flex flex-col gap-1 flex-1 min-w-0">
				<span class="text-xs text-zinc-500">Core</span>
				<select name="coreId" required class="rounded-lg border border-zinc-300 px-3 py-2 text-sm">
					{#each cores as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1 flex-[2] min-w-0">
				<span class="text-xs text-zinc-500">Program Name</span>
				<input name="name" required class="rounded-lg border border-zinc-300 px-3 py-2 text-sm" placeholder="e.g. Edu Maths" />
			</label>
			<button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 whitespace-nowrap">
				<Plus size={16} /> Add
			</button>
		</form>
	</div>

	<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
		<table class="w-full text-sm">
			<thead class="border-b border-zinc-100 bg-zinc-50">
				<tr>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Program</th>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Core</th>
					<th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-100">
				{#each programs as p (p.id)}
					<tr>
						<td class="px-5 py-3 font-medium text-zinc-900">{p.name}</td>
						<td class="px-5 py-3 text-zinc-500">{p.coreId}</td>
						<td class="px-5 py-3 text-right">
							<form method="POST" action="?/delete" class="inline-flex">
								<input type="hidden" name="id" value={p.id} />
								<button type="submit" onclick={(e) => { if (!confirm('Delete this program?')) e.preventDefault(); }} class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50">
									<Trash2 size={12} /> Delete
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if programs.length === 0}
			<div class="py-12 text-center text-sm text-zinc-400">No programs yet.</div>
		{/if}
	</div>
</div>
