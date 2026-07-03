<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import AuthForm from '$lib/components/modules/AuthForm.svelte';
	import { settings } from '$lib/state/stores.svelte';

	const ms = $derived(settings.value.uiLang === 'ms');
</script>

<PageHeader title={ms ? 'Log masuk' : 'Sign in'} back="/menu" />

<AuthForm mode="login" />
