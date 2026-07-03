<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { player } from '$lib/state/player.svelte';
	import { gToSA, pageOf, SURAHS } from '$lib/quran/meta';
	import { Square } from '@lucide/svelte';

	const visible = $derived(player.playingG >= 1 && !page.url.pathname.startsWith('/read'));
	const label = $derived.by(() => {
		if (player.playingG < 1) return '';
		const { s, a } = gToSA(player.playingG);
		return `${SURAHS[s - 1].name_translit} · ${s}:${a}`;
	});
</script>

{#if visible}
	<div
		class="fixed inset-x-0 z-40 flex justify-center px-4"
		style="bottom: calc(64px + var(--safe-b));"
	>
		<button
			class="flex w-full max-w-[420px] items-center gap-3 rounded-2xl border border-gold-soft bg-card px-4 py-2.5 shadow-lg"
			onclick={() => goto(`/read/${pageOf(player.playingG)}`)}
		>
			<span class="relative flex h-2.5 w-2.5">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"></span>
				<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
			</span>
			<span class="flex-1 truncate text-left text-sm font-medium">{label}</span>
			<span
				role="button"
				tabindex="0"
				class="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:text-destructive"
				onclick={(e) => {
					e.stopPropagation();
					player.stop();
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.stopPropagation();
						player.stop();
					}
				}}
			>
				<Square size={16} fill="currentColor" />
			</span>
		</button>
	</div>
{/if}
