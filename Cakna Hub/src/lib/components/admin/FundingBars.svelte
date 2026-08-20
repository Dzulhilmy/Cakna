<script lang="ts">
	import { formatCompactRM } from '$lib/format';

	interface Row { label: string; collected: number; given: number; meta?: string }
	let { rows }: { rows: Row[] } = $props();

	const maxVal = $derived(Math.max(...rows.map((r) => r.collected), 1));
</script>

{#if rows.length === 0}
	<p class="py-6 text-center text-sm text-zinc-400">No funding data yet.</p>
{:else}
	<div class="space-y-3">
		{#each rows as row (row.label)}
			<div>
				<div class="mb-1 flex items-baseline justify-between gap-2">
					<span class="text-sm font-medium text-zinc-700">{row.label}</span>
					<span class="text-xs text-zinc-400">{row.meta ?? ''}</span>
				</div>
				<div class="relative h-7 overflow-hidden rounded-lg bg-zinc-100">
					<!-- collected bar -->
					<div
						class="absolute inset-y-0 left-0 rounded-lg bg-rose-400/60"
						style="width: {(row.collected / maxVal) * 100}%"
					></div>
					<!-- given bar -->
					<div
						class="absolute inset-y-0 left-0 rounded-lg bg-amber-400/80"
						style="width: {(row.given / maxVal) * 100}%"
					></div>
					<div class="absolute inset-0 flex items-center justify-end pr-2">
						<span class="text-xs font-semibold text-zinc-700">
							{formatCompactRM(row.collected)}
						</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
