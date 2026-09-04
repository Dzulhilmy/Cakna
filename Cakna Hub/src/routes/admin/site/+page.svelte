<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	let { data } = $props();
	const sections = [
		{ key: 'brand', label: 'Brand & Nav' },
		{ key: 'hero', label: 'Home Hero' },
		{ key: 'about', label: 'Home About Section' },
		{ key: 'programs', label: 'Home Programs Section' },
		{ key: 'impact', label: 'Home Impact Section' },
		{ key: 'cta', label: 'Home CTA Section' },
		{ key: 'footer', label: 'Footer' },
		{ key: 'customSections', label: 'Custom Sections' },
		{ key: 'aboutPage', label: 'About Page' },
		{ key: 'csrPage', label: 'CSR / Berita Page' },
		{ key: 'sectionOrder', label: 'Section Order' },
	];
</script>
<svelte:head><title>Site Content · Cakna Hub Admin</title></svelte:head>
<div class="space-y-8">
	<header>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Site Content</h1>
		<p class="mt-1.5 text-zinc-500">Edit the public-facing landing page content by section.</p>
	</header>
	<div class="grid gap-3 sm:grid-cols-2">
		{#each sections as s (s.key)}
			<a href="/admin/site/{s.key}" class="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-rose-200 hover:bg-rose-50">
				<span class="font-medium text-zinc-900">{s.label}</span>
				<ArrowRight size={16} class="text-zinc-400" />
			</a>
		{/each}
		<a href="/admin/site/setem" class="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-rose-200 hover:bg-rose-50">
			<span class="font-medium text-zinc-900">SeTem Page</span>
			<ArrowRight size={16} class="text-zinc-400" />
		</a>
		<a href="/admin/site/docs" class="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-rose-200 hover:bg-rose-50">
			<span class="font-medium text-zinc-900">Documents (Policy, SOP…)</span>
			<ArrowRight size={16} class="text-zinc-400" />
		</a>
	</div>
</div>
