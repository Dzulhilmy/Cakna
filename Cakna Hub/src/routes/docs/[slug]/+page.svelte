<script lang="ts">
	import PublicShell from '$lib/components/public/PublicShell.svelte';
	import { ArrowLeft, BookOpen } from 'lucide-svelte';
	let { data } = $props();
	const { slug, doc, content } = $derived(data);

	const slugLabels: Record<string, string> = {
		policy: 'Polisi',
		sop: 'SOP',
		guidelines: 'Garis Panduan',
		manual: 'Manual'
	};
	const label = slugLabels[slug] ?? slug;
</script>
<svelte:head><title>{doc?.title ?? label} · {content.brand.name}</title></svelte:head>
<PublicShell {content}>
	<main class="mx-auto max-w-3xl px-6 py-16">
		<a href="/" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">
			<ArrowLeft size={16} /> Laman Utama
		</a>

		{#if doc}
			<div class="mt-8 flex items-start gap-4">
				<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
					<BookOpen size={20} />
				</span>
				<div>
					<h1 class="text-3xl font-bold tracking-tight text-zinc-900">{doc.title}</h1>
					{#if doc.subtitle}
						<p class="mt-1.5 text-base text-zinc-500">{doc.subtitle}</p>
					{/if}
				</div>
			</div>

			{#if doc.content}
				<div class="mt-8 space-y-4">
					{#each doc.content.split(/\n\s*\n/).filter(Boolean) as p}
						<p class="leading-relaxed text-zinc-700">{p}</p>
					{/each}
				</div>
			{:else}
				<p class="mt-8 text-zinc-500">Kandungan dokumen ini sedang disediakan.</p>
			{/if}

			{#if doc.lastUpdated}
				<p class="mt-10 text-sm text-zinc-400">Dikemaskini: {doc.lastUpdated}</p>
			{/if}
		{:else}
			<div class="mt-8 flex items-start gap-4">
				<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
					<BookOpen size={20} />
				</span>
				<div>
					<h1 class="text-3xl font-bold tracking-tight text-zinc-900">{label}</h1>
					<p class="mt-1.5 text-zinc-500">Kandungan dokumen ini sedang disediakan oleh admin.</p>
				</div>
			</div>
		{/if}
	</main>
</PublicShell>
