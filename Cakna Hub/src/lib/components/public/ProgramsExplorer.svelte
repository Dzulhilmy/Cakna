<script lang="ts">
	import { ChevronDown, HeartHandshake, Briefcase, HeartPulse, Smartphone, GraduationCap, Rocket, Leaf } from 'lucide-svelte';
	import type { Component } from 'svelte';
	import { cores, slugify } from '$lib/cores';

	const iconMap: Record<string, Component> = {
		HeartHandshake, Briefcase, HeartPulse, Smartphone, GraduationCap, Rocket, Leaf
	};

	let { programsByCore }: { programsByCore?: Record<string, { slug: string; name: string; description: string }[]> } = $props();

	let openId = $state<string | null>(null);

	const byCore = $derived(
		programsByCore ??
			Object.fromEntries(
				cores.map((c) => [
					c.id,
					c.programs.map((name) => ({ slug: slugify(name), name, description: '' })),
				]),
			),
	);
</script>

<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each cores as core (core.id)}
		{@const expanded = openId === core.id}
		{@const programs = byCore[core.id] ?? []}
		{@const Icon = iconMap[core.icon] ?? Briefcase}
		<div class="rounded-2xl border bg-white transition-colors {expanded ? 'border-rose-300 shadow-sm' : 'border-zinc-200'}">
			<button
				type="button"
				onclick={() => (openId = expanded ? null : core.id)}
				aria-expanded={expanded}
				class="flex w-full items-start gap-4 rounded-2xl p-5 text-left transition-colors hover:bg-zinc-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
			>
				<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
					<Icon size={20} strokeWidth={1.75} />
				</span>
				<span class="min-w-0 flex-1">
					<span class="block text-base font-semibold text-zinc-900">{core.name}</span>
					<span class="mt-0.5 block text-sm text-zinc-500">{core.tagline}</span>
				</span>
				<ChevronDown size={18} class="mt-1 shrink-0 transition-transform {expanded ? 'rotate-180 text-rose-500' : 'text-zinc-400'}" />
			</button>
			{#if expanded}
				<div class="border-t border-zinc-100 px-5 pb-5 pt-4">
					<p class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Programs</p>
					{#if programs.length === 0}
						<p class="mt-2 text-sm text-zinc-400">No programs listed yet.</p>
					{:else}
						<ul class="mt-2 space-y-2.5">
							{#each programs as p (p.slug)}
								<li class="flex gap-2">
									<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400"></span>
									<div class="min-w-0">
										<p class="text-sm font-medium text-zinc-800">{p.name}</p>
										{#if p.description}
											<p class="mt-0.5 line-clamp-2 text-xs text-zinc-500">{p.description}</p>
										{/if}
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
</div>
