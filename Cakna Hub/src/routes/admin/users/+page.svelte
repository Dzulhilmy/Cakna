<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { ROLE_LABELS } from '$lib/types';
	import type { Role } from '$lib/types';

	let { data } = $props();
	const { users, pending } = $derived(data);

	type Tab = 'all' | 'host' | 'franchisee' | 'pic' | 'admin';

	let activeTab = $state<Tab>('all');
	let syncing = $state(false);

	const tabs: { id: Tab; label: string }[] = [
		{ id: 'all', label: 'All' },
		{ id: 'host', label: 'Host' },
		{ id: 'franchisee', label: 'Franchisee' },
		{ id: 'pic', label: 'PIC' },
		{ id: 'admin', label: 'Admin' }
	];

	const tabCounts = $derived({
		all: users.length,
		host: users.filter((u) => u.role === 'host').length,
		franchisee: users.filter((u) => u.role === 'franchisee').length,
		pic: users.filter((u) => u.role === 'pic' || u.role === 'reviewer').length,
		admin: users.filter((u) => u.role === 'admin').length
	});

	const filtered = $derived(
		activeTab === 'all'
			? users
			: activeTab === 'pic'
				? users.filter((u) => u.role === 'pic' || u.role === 'reviewer')
				: users.filter((u) => u.role === activeTab)
	);

	const roleOptions: Role[] = ['admin', 'host', 'franchisee', 'pic'];
</script>

<svelte:head><title>Users · Cakna Hub Admin</title></svelte:head>

<div class="space-y-6">
	<header class="flex items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Users</h1>
			<p class="mt-1 text-sm text-zinc-500">
				{users.length} account{users.length !== 1 ? 's' : ''} total.
				{#if pending > 0}
					<span class="text-amber-600 font-medium">{pending} pending approval.</span>
				{:else}
					No accounts pending approval.
				{/if}
			</p>
		</div>
		<form
			method="POST"
			action="?/syncUsers"
			use:enhance={() => {
				syncing = true;
				return async ({ update }) => {
					await update();
					syncing = false;
				};
			}}
		>
			<button
				type="submit"
				disabled={syncing}
				class="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
			>
				{#if syncing}
					<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
					</svg>
					Syncing…
				{:else}
					Sync from Cakna
				{/if}
			</button>
		</form>
	</header>

	{#if $page.form?.synced !== undefined}
		<div class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
			Synced {$page.form.synced} user{$page.form.synced !== 1 ? 's' : ''} from Cakna.
		</div>
	{/if}
	{#if $page.form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
			Sync failed: {$page.form.error}
		</div>
	{/if}

	<!-- Tabs -->
	<div class="flex gap-1 border-b border-zinc-200">
		{#each tabs as tab (tab.id)}
			<button
				onclick={() => (activeTab = tab.id)}
				class="relative px-4 py-2.5 text-sm font-medium transition-colors {activeTab === tab.id
					? 'text-rose-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-rose-600'
					: 'text-zinc-500 hover:text-zinc-800'}"
			>
				{tab.label}
				<span
					class="ml-1.5 rounded-full px-1.5 py-0.5 text-xs {activeTab === tab.id
						? 'bg-rose-100 text-rose-700'
						: 'bg-zinc-100 text-zinc-500'}"
				>
					{tabCounts[tab.id]}
				</span>
			</button>
		{/each}
	</div>

	<!-- Table -->
	<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
		<table class="w-full text-sm">
			<thead class="border-b border-zinc-100 bg-zinc-50">
				<tr>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Name</th>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Email</th>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Role</th>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Status</th>
					<th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-100">
				{#each filtered as u (u.id)}
					<tr>
						<td class="px-5 py-3 font-medium text-zinc-900">{u.name || '—'}</td>
						<td class="px-5 py-3 text-zinc-500">{u.email}</td>
						<td class="px-5 py-3">
							<form method="POST" action="?/setRole" use:enhance class="inline-flex">
								<input type="hidden" name="id" value={u.id} />
								<select
									name="role"
									onchange={(e) => (e.currentTarget as HTMLSelectElement).form?.requestSubmit()}
									class="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-700"
								>
									{#each roleOptions as r (r)}
										<option value={r} selected={r === u.role || (r === 'pic' && u.role === 'reviewer')}
											>{ROLE_LABELS[r]}</option
										>
									{/each}
								</select>
							</form>
						</td>
						<td class="px-5 py-3">
							<form method="POST" action="?/setStatus" use:enhance class="inline-flex">
								<input type="hidden" name="id" value={u.id} />
								<select
									name="status"
									onchange={(e) => (e.currentTarget as HTMLSelectElement).form?.requestSubmit()}
									class="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs {u.status === 'active'
										? 'text-rose-700'
										: 'text-amber-700'}"
								>
									<option value="active" selected={u.status === 'active'}>Active</option>
									<option value="pending" selected={u.status === 'pending'}>Pending</option>
								</select>
							</form>
						</td>
						<td class="px-5 py-3 text-right">
							<form method="POST" action="?/delete" use:enhance class="inline-flex">
								<input type="hidden" name="id" value={u.id} />
								<button
									type="submit"
									onclick={(e) => {
										if (!confirm('Delete this user?')) e.preventDefault();
									}}
									class="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
									>Delete</button
								>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if filtered.length === 0}
			<div class="py-12 text-center text-sm text-zinc-400">
				No {activeTab === 'all' ? '' : activeTab + ' '}users yet.
			</div>
		{/if}
	</div>
</div>
