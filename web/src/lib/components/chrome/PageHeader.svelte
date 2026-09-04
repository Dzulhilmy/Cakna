<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { base } from '$app/paths';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		back?: string;
		actions?: Snippet;
	}
	let { title, subtitle = '', back = '/', actions }: Props = $props();

	// Prefix root-relative back paths with the app base (/web in prod).
	const backHref = $derived(
		back.startsWith('/') && !back.startsWith(base) ? base + back : back
	);
</script>

<header class="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
	<div class="mx-auto flex h-14 max-w-[680px] items-center gap-2 px-3">
		<a href={backHref} class="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-background">
			<ArrowLeft size={20} />
		</a>
		<div class="min-w-0 flex-1 text-center">
			<h1 class="truncate font-display text-[16px]">{title}</h1>
			{#if subtitle}<p class="text-[11px] tracking-wide text-muted-foreground">{subtitle}</p>{/if}
		</div>
		<div class="grid min-w-10 place-items-center">
			{#if actions}{@render actions()}{/if}
		</div>
	</div>
</header>
