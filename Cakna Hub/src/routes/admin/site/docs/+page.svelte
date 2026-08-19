<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	let { data } = $props();
	const docs = $derived((data.content as Record<string, unknown>).docs as Record<string, { title: string; body: string }> ?? {});
	const slugs = ['policy', 'sop', 'guidelines', 'manual'];
</script>
<svelte:head><title>Docs · Site Content · Cakna Hub Admin</title></svelte:head>
<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a href="/admin/site" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"><ArrowLeft size={16} /> Site</a>
		<span class="text-zinc-300">/</span>
		<h1 class="text-xl font-bold text-zinc-900">Documents</h1>
	</div>
	<div class="grid gap-3 sm:grid-cols-2">
		{#each slugs as slug (slug)}
			<a href="/admin/site/docs-{slug}" class="rounded-2xl border border-zinc-200 bg-white px-5 py-4 hover:border-rose-200">
				<p class="font-medium capitalize text-zinc-900">{slug}</p>
				<p class="mt-0.5 text-sm text-zinc-400 line-clamp-2">{docs[slug]?.title ?? 'No content yet'}</p>
			</a>
		{/each}
	</div>
</div>
