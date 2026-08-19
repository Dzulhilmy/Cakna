<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';

	let { data, children } = $props();
</script>

<AdminShell user={data.user}>
	{@render children()}
</AdminShell>
