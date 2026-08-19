<script lang="ts">
	import { FileText, ClipboardList, BookOpen, BookMarked } from 'lucide-svelte';

	const DOCS = [
		{ slug: 'policy', label: 'Polisi', desc: 'Dasar dan polisi rasmi HOME CAKNA', Icon: FileText },
		{ slug: 'sop', label: 'SOP', desc: 'Standard Operating Procedure', Icon: ClipboardList },
		{ slug: 'guidelines', label: 'Garis Panduan', desc: 'Panduan pelaksanaan program', Icon: BookOpen },
		{ slug: 'manual', label: 'Manual', desc: 'Manual pengguna & teknikal', Icon: BookMarked },
	] as const;
</script>

<section class="border-t border-zinc-100 bg-zinc-50 py-12">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-8 text-center">
			<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">Rujukan Rasmi</p>
			<h2 class="mt-1 text-2xl font-bold tracking-tight text-zinc-900">Polisi, SOP &amp; Panduan</h2>
			<p class="mt-2 text-sm text-zinc-500">Untuk Team, Subsidiari, Francaisi &amp; Pihak Luar</p>
		</div>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each DOCS as { slug, label, desc, Icon } (slug)}
				<a
					href="/docs/{slug}"
					class="group flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"
				>
					<span class="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100">
						<Icon size={22} />
					</span>
					<div>
						<p class="text-base font-semibold text-zinc-900">{label}</p>
						<p class="mt-0.5 text-xs text-zinc-500">{desc}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
