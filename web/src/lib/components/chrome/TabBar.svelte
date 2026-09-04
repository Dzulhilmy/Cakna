<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { settings } from '$lib/state/stores.svelte';
	import { BookOpen, Clock, House, LayoutGrid, HandHeart } from '@lucide/svelte';

	const labels = $derived(
		settings.value.uiLang === 'en'
			? { home: 'Home', read: 'Mushaf', solat: 'Prayers', zikir: 'Dhikr', more: 'More' }
			: { home: 'Utama', read: 'Mushaf', solat: 'Solat', zikir: 'Zikir', more: 'Lagi' }
	);

	const tabs = $derived([
		{ href: `${base}/`, label: labels.home, icon: House },
		{ href: `${base}/read`, label: labels.read, icon: BookOpen },
		{ href: `${base}/solat`, label: labels.solat, icon: Clock },
		{ href: `${base}/zikir`, label: labels.zikir, icon: HandHeart },
		{ href: `${base}/menu`, label: labels.more, icon: LayoutGrid }
	]);

	function isActive(href: string): boolean {
		const p = page.url.pathname;
		return href === `${base}/` ? p === `${base}/` : p.startsWith(href);
	}
</script>

<nav
	class="fixed inset-x-0 bottom-0 z-40 border-t bg-card"
	style="padding-bottom: var(--safe-b);"
>
	<div class="mx-auto flex max-w-[680px]">
		{#each tabs as tab (tab.href)}
			<a
				href={tab.href}
				class="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors
					{isActive(tab.href) ? 'text-primary' : 'text-muted-foreground'}"
			>
				<tab.icon size={21} strokeWidth={isActive(tab.href) ? 2.4 : 1.8} />
				{tab.label}
			</a>
		{/each}
	</div>
</nav>
