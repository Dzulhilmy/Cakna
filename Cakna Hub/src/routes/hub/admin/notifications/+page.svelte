<script lang="ts">
	import { Plus, Trash2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { NOTIFICATION_TYPE_LABELS } from '$lib/types';

	let { data } = $props();
	const { notifications } = $derived(data);

	function fmtDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-MY', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	const typeBadge: Record<string, string> = {
		kemalangan: 'bg-red-100 text-red-700',
		takziah: 'bg-zinc-100 text-zinc-700',
		kesihatan: 'bg-blue-100 text-blue-700',
		umum: 'bg-rose-100 text-rose-700'
	};
</script>

<svelte:head><title>Announcements · Cakna Hub Admin</title></svelte:head>

<div class="space-y-8">
	<header class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Announcements</h1>
			<p class="mt-1.5 text-zinc-500">
				{notifications.length} announcement{notifications.length !== 1 ? 's' : ''} sent.
			</p>
		</div>
		<a
			href="/hub/admin/notifications/new"
			class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
		>
			<Plus size={16} /> New Announcement
		</a>
	</header>

	{#if notifications.length === 0}
		<div class="rounded-2xl border border-zinc-200 bg-white py-16 text-center text-sm text-zinc-400">
			No announcements sent yet.
		</div>
	{:else}
		<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
			<table class="w-full text-sm">
				<thead class="border-b border-zinc-100 bg-zinc-50">
					<tr>
						<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Title</th>
						<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden sm:table-cell">Type</th>
						<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden md:table-cell">Audience</th>
						<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden lg:table-cell">Date</th>
						<th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-zinc-100">
					{#each notifications as n (n.id)}
						<tr>
							<td class="px-5 py-3">
								<p class="font-medium text-zinc-900">{n.title}</p>
								{#if n.content}
									<p class="mt-0.5 text-xs text-zinc-400 line-clamp-1">{n.content}</p>
								{/if}
							</td>
							<td class="px-5 py-3 hidden sm:table-cell">
								<span class="rounded-full px-2 py-0.5 text-xs font-medium {typeBadge[n.type] ?? 'bg-zinc-100 text-zinc-700'}">
									{NOTIFICATION_TYPE_LABELS[n.type] ?? n.type}
								</span>
							</td>
							<td class="px-5 py-3 text-zinc-500 hidden md:table-cell capitalize">{n.audience}</td>
							<td class="px-5 py-3 text-zinc-400 text-xs hidden lg:table-cell">{fmtDate(n.createdAt)}</td>
							<td class="px-5 py-3 text-right">
								<form method="POST" action="?/delete" use:enhance class="inline-flex">
									<input type="hidden" name="id" value={n.id} />
									<button
										type="submit"
										onclick={(e) => { if (!confirm('Delete this announcement?')) e.preventDefault(); }}
										class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
									>
										<Trash2 size={12} /> Delete
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
