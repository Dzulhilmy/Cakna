<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { settings } from '$lib/state/stores.svelte';

	const isDark = $derived(settings.value.theme === 'dark');

	function toggle() {
		settings.value.theme = isDark ? 'light' : 'dark';
	}
</script>

<button
	class="theme-toggle"
	class:dark={isDark}
	onclick={toggle}
	aria-label={isDark ? 'Tukar ke mod cerah' : 'Tukar ke mod gelap'}
	title={isDark ? 'Mod Cerah' : 'Mod Gelap'}
>
	<span class="thumb">
		{#if isDark}
			<Moon size={12} strokeWidth={2.2} />
		{:else}
			<Sun size={12} strokeWidth={2.2} />
		{/if}
	</span>
</button>

<style>
	.theme-toggle {
		width: 52px;
		height: 28px;
		border-radius: 9999px;
		cursor: pointer;
		border: none;
		padding: 3px;
		display: flex;
		align-items: center;
		background: #ffffff;
		box-shadow:
			0 2px 8px rgba(0,0,0,0.18),
			0 0 0 1px rgba(0,0,0,0.07);
		transition: background 0.3s ease, box-shadow 0.3s ease;
	}

	.theme-toggle.dark {
		background: #1a1f2e;
		box-shadow:
			0 2px 8px rgba(0,0,0,0.5),
			0 0 0 1px rgba(255,255,255,0.08);
	}

	.thumb {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fef3c7;
		color: #d97706;
		flex-shrink: 0;
		transition:
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			background 0.3s ease,
			color 0.3s ease;
		transform: translateX(0);
	}

	.theme-toggle.dark .thumb {
		background: #1e3a5f;
		color: #93c5fd;
		transform: translateX(24px);
	}
</style>
