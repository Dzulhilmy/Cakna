<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	let { data, form } = $props();
	const { content, section } = $derived(data);
	const sectionData = $derived((content as Record<string, unknown>)[section]);
	let json = $state('');
	$effect(() => { json = JSON.stringify(sectionData, null, 2); });
</script>
<svelte:head><title>{section} · Site Content · Cakna Hub Admin</title></svelte:head>
<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a href="/admin/site" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"><ArrowLeft size={16} /> Site</a>
		<span class="text-zinc-300">/</span>
		<h1 class="text-xl font-bold text-zinc-900 capitalize">{section}</h1>
	</div>
	{#if form?.error}
		<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</div>
	{/if}
	<form method="POST" class="space-y-4">
		<label class="flex flex-col gap-1.5">
			<span class="text-sm font-medium text-zinc-700">JSON Content</span>
			<textarea name="json" rows="24" bind:value={json} class="rounded-xl border border-zinc-300 px-4 py-3 font-mono text-xs text-zinc-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 resize-y"></textarea>
		</label>
		<div class="flex justify-end gap-3">
			<a href="/admin/site" class="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</a>
			<button type="submit" class="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Save</button>
		</div>
	</form>
</div>
