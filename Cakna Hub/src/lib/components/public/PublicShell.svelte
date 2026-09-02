<script lang="ts">
	import { Heart, Phone, Mail } from 'lucide-svelte';
	import type { SiteContent } from '$lib/site';
	import PublicNav from './PublicNav.svelte';
	import DocsSection from './DocsSection.svelte';
	import { publicLang } from '$lib/state/publicLang.svelte';

	let { content, children }: { content: SiteContent; children: import('svelte').Snippet } = $props();
	const { brand, nav, footer } = $derived(content);
	const lang = $derived(publicLang.value);
	const linksLabel = $derived(lang === 'en' ? 'Links' : 'Pautan');
	const contactLabel = $derived(lang === 'en' ? 'Contact' : 'Hubungi');
	const loginLabel = $derived(lang === 'en' ? 'Log in' : 'Log masuk');
</script>

<div class="min-h-screen bg-white text-zinc-800">
	<PublicNav {brand} {nav} />

	{@render children()}

	<DocsSection />

	<footer id="hubungi" class="bg-zinc-900 text-zinc-300">
		<div class="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
			<div class="lg:col-span-2">
				<div class="flex items-center gap-2">
					{#if brand.logoImage}
						<img src={brand.logoImage} alt={brand.name} class="h-10 w-auto brightness-0 invert" />
					{:else}
						<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
							<Heart size={16} fill="currentColor" stroke-width={0} />
						</span>
						<span class="text-lg font-bold text-white">
							{brand.name} <span class="text-rose-400">{brand.accentWord}</span>
						</span>
					{/if}
				</div>
				<p class="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">{footer.tagline}</p>
			</div>

			<div>
				<p class="text-sm font-semibold text-white">{linksLabel}</p>
				<ul class="mt-3 space-y-2 text-sm text-zinc-400">
					{#each nav as n (n.href + n.label)}
						<li><a href={n.href} class="hover:text-rose-400">{n.label}</a></li>
					{/each}
					<li><a href="https://cakna.org/auth/login" class="hover:text-rose-400">{loginLabel}</a></li>
				</ul>
			</div>

			<div>
				<p class="text-sm font-semibold text-white">{contactLabel}</p>
				<ul class="mt-3 space-y-2 text-sm text-zinc-400">
					{#if footer.phone}
						<li class="flex items-center gap-2"><Phone size={14} /> {footer.phone}</li>
					{/if}
					{#if footer.email}
						<li class="flex items-center gap-2"><Mail size={14} /> {footer.email}</li>
					{/if}
				</ul>
			</div>
		</div>
		<div class="border-t border-zinc-800 py-5 text-center text-xs text-zinc-500">
			{footer.copyright}
		</div>
	</footer>
</div>
