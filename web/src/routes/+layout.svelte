<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import MiniPlayer from '$lib/components/chrome/MiniPlayer.svelte';
	import OnboardingOverlay from '$lib/components/chrome/OnboardingOverlay.svelte';
	import { t } from '$lib/state/i18n.svelte';
	import { auth } from '$lib/state/auth.svelte';
	import { player } from '$lib/state/player.svelte';
	import { settings, onboarded } from '$lib/state/stores.svelte';
	import { pullAndMerge, setupPersistence } from '$lib/state/sync.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	// theme + arabic size + lang, applied live
	$effect(() => {
		const s = settings.value;
		const root = document.documentElement;
		root.dataset.theme = s.theme;
		root.classList.toggle('dark', s.theme === 'dark');
		root.style.setProperty('--arabic-size', `${s.fontSize}px`);
		root.lang = s.uiLang;
	});

	setupPersistence();

	onMount(async () => {
		player.onError = () => toast.error(t('t_audio'));
		await auth.init();
		if (auth.user) {
			pullAndMerge().catch(() => {});
		}
	});
</script>

<Toaster position="top-center" richColors />

{#if !onboarded.value}
	<OnboardingOverlay />
{/if}

{@render children()}

<MiniPlayer />
