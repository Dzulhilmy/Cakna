<script lang="ts">
	import Hub from '$lib/components/Hub.svelte';

	let { data } = $props();
</script>

<svelte:head><title>Cakna Hub</title></svelte:head>

<Hub user={data.user} />
