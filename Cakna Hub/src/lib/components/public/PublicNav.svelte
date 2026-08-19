<script lang="ts">
	import { Heart, Menu, X } from 'lucide-svelte';
	import type { SiteContent } from '$lib/site';

	let { brand, nav }: { brand: SiteContent['brand']; nav: SiteContent['nav'] } = $props();

	let open = $state(false);
	const loginUrl = 'https://cakna.org/auth/login';
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') open = false; }} />

<header class="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
		<a href="/" onclick={() => (open = false)} class="flex items-center gap-2">
			{#if brand.logoImage}
				<img src={brand.logoImage} alt={brand.name} class="h-16 w-auto" />
			{:else}
				<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
					<Heart size={16} fill="currentColor" stroke-width={0} />
				</span>
				<span class="text-lg font-bold tracking-tight text-zinc-900">
					{brand.name} <span class="text-rose-600">{brand.accentWord}</span>
				</span>
			{/if}
		</a>

		<nav class="hidden items-center gap-7 md:flex">
			{#each nav as n (n.href + n.label)}
				<a href={n.href} class="text-sm font-medium text-zinc-600 transition-colors hover:text-rose-700">
					{n.label}
				</a>
			{/each}
		</nav>

		<div class="hidden items-center gap-2 md:flex">
			<a href={loginUrl} class="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:text-rose-700">
				Log in
			</a>
		</div>

		<button
			type="button"
			onclick={() => (open = !open)}
			aria-expanded={open}
			aria-label={open ? 'Close menu' : 'Open menu'}
			class="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100 md:hidden"
		>
			{#if open}<X size={22} />{:else}<Menu size={22} />{/if}
		</button>
	</div>

	{#if open}
		<div class="border-t border-zinc-200 bg-white md:hidden">
			<nav class="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
				{#each nav as n (n.href + n.label)}
					<a
						href={n.href}
						onclick={() => (open = false)}
						class="rounded-lg px-2 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-rose-700"
					>
						{n.label}
					</a>
				{/each}
				<div class="mt-2 border-t border-zinc-100 pt-3">
					<a
						href={loginUrl}
						onclick={() => (open = false)}
						class="block rounded-lg border border-zinc-300 px-3.5 py-2.5 text-center text-sm font-medium text-zinc-700 transition-colors hover:border-rose-300 hover:text-rose-700"
					>
						Log in
					</a>
				</div>
			</nav>
		</div>
	{/if}
</header>
