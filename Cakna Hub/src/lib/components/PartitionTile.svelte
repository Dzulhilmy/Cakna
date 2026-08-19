<script lang="ts">
	interface Props {
		href: string;
		label: string;
		description: string;
		icon?: any;
		external?: boolean;
	}
	let { href, label, description, icon: Icon, external = false }: Props = $props();
</script>

<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	data-sveltekit-reload={external ? true : undefined}
	class="group flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"
>
	{#if Icon}
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600">
			<Icon size={22} />
		</div>
	{/if}
	<div class="flex-1">
		<p class="text-xl font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-rose-700">
			{label}
		</p>
		<p class="mt-1.5 text-sm leading-relaxed text-zinc-500">{description}</p>
	</div>
	<span class="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 transition-colors group-hover:text-rose-700">
		Continue →
	</span>
</a>
