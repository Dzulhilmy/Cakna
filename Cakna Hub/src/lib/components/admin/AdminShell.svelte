<script lang="ts">
	import AdminSidebar from './AdminSidebar.svelte';
	import type { HubUser } from '$lib/types';

	interface Props {
		user: HubUser;
		contentClassName?: string;
		children: import('svelte').Snippet;
	}
	let { user, contentClassName = 'mx-auto max-w-5xl px-6 py-8 md:py-10', children }: Props = $props();
</script>

<div class="min-h-screen bg-zinc-50/40 md:flex">
	<AdminSidebar {user} />
	<main class="flex-1 min-w-0">
		<div class={contentClassName}>
			{@render children()}
		</div>
	</main>
</div>
