<script lang="ts">
	import { ArrowLeft, BookOpen } from 'lucide-svelte';
	import type { DocPage } from '$lib/site';

	let { data } = $props();

	const docsData = $derived(
		((data.content as Record<string, unknown>).docs as Record<string, DocPage>) ?? {}
	);

	const slugs = [
		{ slug: 'policy', label: 'Polisi' },
		{ slug: 'sop', label: 'SOP' },
		{ slug: 'guidelines', label: 'Garis Panduan' },
		{ slug: 'manual', label: 'Manual' }
	];
</script>

<svelte:head><title>Polisi, SOP & Panduan · Website · Cakna Hub Admin</title></svelte:head>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a
			href="/hub/admin/site"
			class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
		>
			<ArrowLeft size={16} /> Website
		</a>
		<span class="text-zinc-300">/</span>
		<h1 class="text-xl font-bold text-zinc-900">Polisi, SOP & Panduan</h1>
	</div>

	<div class="grid gap-3 sm:grid-cols-2">
		{#each slugs as d (d.slug)}
			<a
				href="/hub/admin/site/docs/{d.slug}"
				class="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-rose-200 hover:bg-rose-50"
			>
				<div
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
				>
					<BookOpen size={16} />
				</div>
				<div class="min-w-0">
					<p class="font-medium text-zinc-900">{d.label}</p>
					<p class="mt-0.5 truncate text-sm text-zinc-400">
						{docsData[d.slug]?.title ?? 'No content yet'}
					</p>
				</div>
			</a>
		{/each}
	</div>
</div>
