<script lang="ts">
	import { NOTIFICATION_TYPE_LABELS } from '$lib/types';
	let { data, form } = $props();
</script>
<svelte:head><title>New Notification · Cakna Hub Admin</title></svelte:head>
<div class="mx-auto max-w-xl space-y-8">
	<header>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Send Notification</h1>
		<p class="mt-1.5 text-zinc-500">Push an announcement to Hub users.</p>
	</header>
	{#if form?.error}
		<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</div>
	{/if}
	<form method="POST" class="space-y-5">
		<div class="grid gap-5 sm:grid-cols-2">
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium text-zinc-700">Type</span>
				<select name="type" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100">
					{#each Object.entries(NOTIFICATION_TYPE_LABELS) as [k, v] (k)}
						<option value={k}>{v}</option>
					{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium text-zinc-700">Audience</span>
				<select name="audience" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100">
					<option value="all">All users</option>
					<option value="franchisee">Franchisees</option>
					<option value="admin">Admins</option>
				</select>
			</label>
		</div>
		<label class="flex flex-col gap-1.5">
			<span class="text-sm font-medium text-zinc-700">Title <span class="text-rose-500">*</span></span>
			<input name="title" required class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100" />
		</label>
		<label class="flex flex-col gap-1.5">
			<span class="text-sm font-medium text-zinc-700">Content <span class="text-rose-500">*</span></span>
			<textarea name="content" rows="4" required class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none"></textarea>
		</label>
		<label class="flex flex-col gap-1.5">
			<span class="text-sm font-medium text-zinc-700">Callout (optional highlight)</span>
			<input name="callout" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100" />
		</label>
		<div class="flex justify-end gap-3 pt-2">
			<a href="/admin/dashboard" class="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</a>
			<button type="submit" class="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Send</button>
		</div>
	</form>
</div>
