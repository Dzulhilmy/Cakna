<script lang="ts">
	import '../app.css';
	import { settings } from '$lib/state/stores.svelte';
	import HalaqahBar from '$lib/components/chrome/HalaqahBar.svelte';

	let { children } = $props();

	$effect(() => {
		document.documentElement.dataset.theme = settings.value.theme;
	});
</script>

{@render children()}
<HalaqahBar />
