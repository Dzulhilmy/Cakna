<script lang="ts">
	import PartitionTile from './PartitionTile.svelte';
	import SideNav from './SideNav.svelte';
	import type { HubUser } from '$lib/types';
	import { roleLabel } from '$lib/types';
	import { BookOpen, LayoutGrid, Users, LogOut, Bell, ShieldCheck, CircleUser } from 'lucide-svelte';

	let { user }: { user?: HubUser | null } = $props();
	const isStaff = $derived(user?.role === 'admin' || user?.role === 'reviewer' || user?.role === 'pic');
</script>

<SideNav active="home" />

<main class="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
	<div class="absolute inset-x-0 top-0 flex items-center justify-end gap-4 p-6">
		<a href="/notifications" title="Announcements" class="text-zinc-400 transition-colors hover:text-rose-500">
			<Bell size={18} strokeWidth={1.75} />
		</a>
		{#if user}
			<span title="{roleLabel(user.role)} · {user.name}" class="cursor-default text-zinc-400 transition-colors hover:text-zinc-600">
				<CircleUser size={18} strokeWidth={1.75} />
			</span>
		{/if}
		<form method="POST" action="/logout">
			<button type="submit" title="Log out" class="text-zinc-400 transition-colors hover:text-rose-600">
				<LogOut size={18} strokeWidth={1.75} />
			</button>
		</form>
	</div>

	<div class="text-center">
		<h1 class="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
			Cakna <span class="text-rose-600">Hub</span>
		</h1>
		<p class="mx-auto mt-4 max-w-xl text-zinc-500">
			{#if user}Welcome back, {user.name.split(' ')[0]}. Choose a partition to continue.{:else}Choose a partition to continue.{/if}
		</p>
	</div>

	<div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		<PartitionTile href="/core" label="7 Core" description="Assist, Biz, Circle, Digital, Edu, Future & Green." icon={LayoutGrid} />
		<PartitionTile href="/society" label="Society & Others" description="Community programs and everything else." icon={Users} />
		<PartitionTile href="https://cakna.org/menu" label="Mushaf Digital" description="Quran, solat times, mathurat, zikir & more." icon={BookOpen} external />
	</div>

	{#if isStaff}
		<div class="mt-10 text-center">
			<a href="/hub/admin/dashboard" class="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-rose-600">
				<ShieldCheck size={15} strokeWidth={1.75} />
				Admin
			</a>
		</div>
	{/if}
</main>
