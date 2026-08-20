<script lang="ts">
	import '../app.css';
	import { settings } from '$lib/state/stores.svelte';

	let { children } = $props();

	$effect(() => {
		document.documentElement.dataset.theme = settings.value.theme;
	});
</script>

{@render children()}
