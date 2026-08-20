<script lang="ts">
	import type { Snippet } from 'svelte';
	import SideNav from './SideNav.svelte';

	let { active, children }: { active: string; children: Snippet } = $props();
</script>

<div class="hub-bg relative min-h-screen overflow-hidden">
	<!-- Particle dots -->
	<div class="particles" aria-hidden="true">
		{#each Array(24) as _, i}
			<span
				class="particle"
				style="
					left: {(i * 37 + 11) % 100}%;
					top: {(i * 53 + 7) % 100}%;
					animation-delay: {(i * 0.4) % 3}s;
					width: {i % 3 === 0 ? 2.5 : 1.5}px;
					height: {i % 3 === 0 ? 2.5 : 1.5}px;
					opacity: {0.15 + (i % 4) * 0.1};
				"
			></span>
		{/each}
	</div>

	<div class="glow-top" aria-hidden="true"></div>
	<div class="glow-bottom" aria-hidden="true"></div>

	<SideNav {active} />

	<main class="min-h-screen px-6 py-10 lg:px-12">
		{@render children()}
	</main>
</div>

<style>
	.hub-bg {
		background:
			radial-gradient(ellipse 80% 60% at 30% 40%, rgba(22, 90, 55, 0.5) 0%, transparent 60%),
			radial-gradient(ellipse 60% 50% at 70% 70%, rgba(10, 55, 35, 0.4) 0%, transparent 55%),
			linear-gradient(160deg, #0a2a1a 0%, #061510 50%, #020807 100%);
	}

	.glow-top {
		position: absolute;
		top: -120px;
		left: 10%;
		width: 400px;
		height: 300px;
		background: radial-gradient(ellipse, rgba(34, 197, 94, 0.07) 0%, transparent 70%);
		pointer-events: none;
	}

	.glow-bottom {
		position: absolute;
		bottom: -80px;
		right: 10%;
		width: 300px;
		height: 250px;
		background: radial-gradient(ellipse, rgba(16, 120, 65, 0.05) 0%, transparent 70%);
		pointer-events: none;
	}

	.particles {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.particle {
		position: absolute;
		border-radius: 50%;
		background: white;
		animation: twinkle 3s ease-in-out infinite alternate;
	}

	@keyframes twinkle {
		from { opacity: var(--base-opacity, 0.15); }
		to { opacity: calc(var(--base-opacity, 0.15) + 0.2); }
	}
</style>
