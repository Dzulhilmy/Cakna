<script lang="ts">
	import TabBar from '$lib/components/chrome/TabBar.svelte';

	let { children } = $props();
</script>

<div class="min-h-dvh pb-24">
	{@render children()}
</div>
<TabBar />
