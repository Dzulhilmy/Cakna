<script lang="ts">
	interface Props {
		label: string;
		value: string;
		hint?: string;
		dot?: 'rose' | 'amber' | 'zinc' | 'pink';
	}
	let { label, value, hint, dot }: Props = $props();

	const dotColors: Record<string, string> = {
		rose: 'bg-rose-500',
		pink: 'bg-pink-400',
		amber: 'bg-amber-400',
		zinc: 'bg-zinc-400'
	};
</script>

<div class="rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-sm">
	<div class="flex items-start justify-between gap-2">
		<p class="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
		{#if dot}
			<span class="mt-0.5 h-2 w-2 shrink-0 rounded-full {dotColors[dot] ?? 'bg-zinc-400'}"></span>
		{/if}
	</div>
	<p class="mt-2.5 text-3xl font-bold tracking-tight text-zinc-900">{value}</p>
	{#if hint}
		<p class="mt-1.5 text-xs text-zinc-400">{hint}</p>
	{/if}
</div>
