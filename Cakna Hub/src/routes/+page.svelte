<script lang="ts">
	import PublicLanding from '$lib/components/public/PublicLanding.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>HOME Cakna</title>
</svelte:head>

<PublicLanding content={data.content} programsByCore={data.programsByCore ?? undefined} />
