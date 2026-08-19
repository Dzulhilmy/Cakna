<script lang="ts">
	import { ArrowLeft, Bell } from 'lucide-svelte';
	let { data } = $props();
	const { notices } = $derived(data);
</script>
<svelte:head><title>Notifications · Cakna Hub</title></svelte:head>
<main class="mx-auto max-w-2xl px-6 py-12">
	<a href="/" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"><ArrowLeft size={16} /> Home</a>
	<div class="mt-6 flex items-center gap-3">
		<Bell size={22} class="text-rose-600" />
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Notifications</h1>
	</div>
	{#if notices.length === 0}
		<div class="mt-16 text-center text-zinc-400">
			<p class="text-lg font-medium">No notifications.</p>
		</div>
	{:else}
		<ul class="mt-6 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white">
			{#each notices as n (n.id)}
				<li class="px-5 py-4 {n.readBy?.includes(data.user?.id ?? '') ? 'opacity-60' : ''}">
					{#if n.href}
						<a href={n.href} class="block hover:text-rose-600">
							<p class="text-sm font-semibold text-zinc-900">{n.title}</p>
							<p class="mt-0.5 text-xs text-zinc-500">{n.body}</p>
						</a>
					{:else}
						<p class="text-sm font-semibold text-zinc-900">{n.title}</p>
						<p class="mt-0.5 text-xs text-zinc-500">{n.body}</p>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>
