<script lang="ts">
	import { page } from '$app/state';
	import TabBar from '$lib/components/chrome/TabBar.svelte';

	let { children } = $props();

	// Auth pages render as a full-screen branded card (like the pre-deployment
	// login), so they suppress the tab bar and its reserved padding.
	const bare = $derived(page.url.pathname.startsWith('/auth/'));
</script>

{#if bare}
	{@render children()}
{:else}
	<!-- The extra padding reserves room for the minimised halaqah bar when one is
	     showing (--halaqah-h is 0px otherwise), so it never floats over content. -->
	<div class="min-h-dvh pb-24" style="padding-bottom: calc(6rem + var(--halaqah-h, 0px));">
		{@render children()}
	</div>
	<TabBar />
{/if}
