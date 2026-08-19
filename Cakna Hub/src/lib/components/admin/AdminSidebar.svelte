<script lang="ts">
	import { page } from '$app/state';
	import type { HubUser } from '$lib/types';
	import { roleLabel } from '$lib/types';
	import AdminNav from './AdminNav.svelte';

	let { user }: { user: HubUser } = $props();
	let open = $state(false);

	$effect(() => {
		// close mobile menu on navigation
		page.url.pathname;
		open = false;
	});
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') open = false; }} />

<aside class="no-print border-b border-zinc-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-b-0 md:border-r md:bg-zinc-50/60">
	<div class="flex items-center justify-between gap-3 px-4 py-3.5 md:px-5 md:py-4">
		<a href="/" class="flex items-center gap-2 group">
			<img src="/logo.jpg" alt="Cakna" class="h-14 w-auto" style="mix-blend-mode:multiply" />
			<span class="text-sm font-bold tracking-wide text-zinc-700">Cakna <span class="text-rose-600">Hub</span></span>
		</a>
		<div class="flex items-center gap-1">
			<a href="/" class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 md:hidden">
				← Hub
			</a>
			<button
				type="button"
				onclick={() => (open = !open)}
				aria-expanded={open}
				aria-label={open ? 'Close menu' : 'Open menu'}
				class="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100 md:hidden"
			>
				{#if open}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
				{:else}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
				{/if}
			</button>
		</div>
	</div>

	<div class="{open ? 'block' : 'hidden'} border-t border-zinc-200 md:flex md:flex-1 md:flex-col md:border-t-0 md:overflow-hidden">
		<div class="admin-nav-scroll px-3 py-3 md:flex-1 md:overflow-y-auto">
			<AdminNav role={user.role} />
		</div>
		<div class="border-t border-zinc-200 bg-white p-3">
			<div class="mb-1.5 flex items-center gap-2.5 px-2 py-1.5">
				<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700">
					{user.name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase()}
				</span>
				<div class="min-w-0">
					<p class="truncate text-sm font-medium leading-tight text-zinc-800">{user.name}</p>
					<p class="text-xs text-zinc-400">{roleLabel(user.role)}</p>
				</div>
			</div>
			<div class="flex flex-col gap-0.5">
				<form method="POST" action="/logout">
					<button type="submit" class="inline-flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900">
						<svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>
						Log out
					</button>
				</form>
				<a href="/" class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900">
					<svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
					Back to hub
				</a>
			</div>
		</div>
	</div>
</aside>
