<script lang="ts">
	import PublicLanding from '$lib/components/public/PublicLanding.svelte';
	import { publicLang } from '$lib/state/publicLang.svelte';
	import { buildEnglishContent } from '$lib/publicContent';

	let { data } = $props();
	const enContent = $derived(buildEnglishContent(data.content));
	const content = $derived(publicLang.value === 'en' ? enContent : data.content);
</script>

<svelte:head>
	<title>HOME Cakna</title>
</svelte:head>

<PublicLanding {content} programsByCore={data.programsByCore ?? undefined} />
