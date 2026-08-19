<script lang="ts">
	import { ArrowLeft, ChevronRight, HeartHandshake, Briefcase, HeartPulse, Smartphone, GraduationCap, Rocket, Leaf } from 'lucide-svelte';
	import type { Component } from 'svelte';

	let { data } = $props();
	const { cores } = $derived(data);

	const iconMap: Record<string, Component> = {
		HeartHandshake,
		Briefcase,
		HeartPulse,
		Smartphone,
		GraduationCap,
		Rocket,
		Leaf
	};
</script>

<svelte:head><title>7 Core · Cakna Hub</title></svelte:head>

<div class="min-h-screen bg-zinc-50">
	<!-- Top bar -->
	<header class="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
		<span class="text-base font-semibold text-zinc-900">
			Cakna <span class="text-rose-600">Hub</span>
		</span>
		<a
			href="/hub"
			class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-600 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
		>
			<ArrowLeft size={15} strokeWidth={2} />
			Back to hub
		</a>
	</header>

	<main class="mx-auto max-w-5xl px-6 py-12">
		<!-- Page title -->
		<div class="mb-10">
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">7 Core</h1>
			<p class="mt-1 text-sm text-zinc-500">The seven core initiatives of Cakna.</p>
		</div>

		<!-- Core grid -->
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each cores as core (core.id)}
				{@const Icon = iconMap[core.icon] ?? Briefcase}
				<a
					href="/core/{core.id}"
					class="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-rose-200 hover:shadow-md"
				>
					<!-- Card header -->
					<div class="flex items-start justify-between gap-3">
						<div class="flex items-center gap-3">
							<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
								<Icon size={18} strokeWidth={1.75} />
							</div>
							<div>
								<p class="font-semibold text-zinc-900">{core.name}</p>
								<p class="text-xs text-zinc-400 leading-snug">{core.tagline}</p>
							</div>
						</div>
						<ChevronRight size={16} strokeWidth={1.75} class="mt-0.5 shrink-0 text-zinc-300 transition-colors group-hover:text-rose-400" />
					</div>

					<!-- Divider -->
					<div class="my-4 border-t border-zinc-100"></div>

					<!-- Programs -->
					<div class="flex items-start gap-2 text-xs">
						<span class="shrink-0 pt-0.5 text-zinc-400 font-medium w-14">Program</span>
						<div class="flex flex-wrap gap-1">
							{#each core.programs as prog (prog)}
								<span class="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">{prog}</span>
							{/each}
						</div>
					</div>

					<!-- PIC -->
					<div class="mt-2.5 flex items-start gap-2 text-xs">
						<span class="shrink-0 pt-0.5 text-zinc-400 font-medium w-14">PIC</span>
						<span class="text-zinc-600">{core.pic.join(', ')}</span>
					</div>
				</a>
			{/each}
		</div>
	</main>
</div>
