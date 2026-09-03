<script lang="ts">
	import { page } from '$app/state';

	let { role }: { role: string } = $props();

	// Shared links: admin + reviewer + pic
	const baseLinks = [
		{ href: '/hub/admin/dashboard', label: 'Dashboard' },
		{ href: '/hub/admin/funding', label: 'Funding' },
		{ href: '/hub/admin/calendar', label: 'QC Calendar' }
	];

	// reviewer + admin (not pic)
	const reviewerLinks = [
		{ href: '/hub/admin/analytics', label: 'Analytics' },
		{ href: '/hub/admin/notifications', label: 'Announcements' }
	];

	// admin only
	const adminOnlyLinks = [
		{ href: '/hub/admin/programs', label: 'Programs' },
		{ href: '/hub/admin/site', label: 'Website' },
		{ href: '/hub/admin/media', label: 'Media' },
		{ href: '/hub/admin/users', label: 'Users' },
		{ href: '/hub/admin/halaqah', label: 'Halaqah' }
	];

	const links = $derived.by(() => {
		if (role === 'admin') return [...baseLinks, ...reviewerLinks, ...adminOnlyLinks];
		if (role === 'reviewer') return [...baseLinks, ...reviewerLinks];
		return baseLinks; // pic
	});

	const pathname = $derived(page.url.pathname);
	const mathuratActive = $derived(pathname === '/hub/admin/mathurat');
</script>

<nav class="flex flex-col gap-0.5 pt-1">
	{#each links as link (link.href)}
		{@const active = pathname === link.href || pathname.startsWith(link.href + '/')}
		<a
			href={link.href}
			aria-current={active ? 'page' : undefined}
			class="relative inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors {active
				? 'bg-rose-50 text-rose-700'
				: 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'}"
		>
			{#if active}
				<span class="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-rose-500"></span>
			{/if}
			{link.label}
		</a>
	{/each}

	<div class="my-2 border-t border-zinc-200/60"></div>

	<a
		href="/hub/admin/mathurat"
		aria-current={mathuratActive ? 'page' : undefined}
		class="relative inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors {mathuratActive ? 'bg-rose-50 text-rose-700' : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'}"
	>
		{#if mathuratActive}
			<span class="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-rose-500"></span>
		{/if}
		Mathurat Dashboard
	</a>
</nav>
