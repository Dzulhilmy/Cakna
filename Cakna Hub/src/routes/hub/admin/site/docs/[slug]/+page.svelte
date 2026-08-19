<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';

	let { data, form } = $props();

	const slugLabels: Record<string, string> = {
		policy: 'Polisi',
		sop: 'SOP',
		guidelines: 'Garis Panduan',
		manual: 'Manual'
	};

	let title = $state(data.doc?.title ?? '');
	let subtitle = $state(data.doc?.subtitle ?? '');
	let content = $state(data.doc?.content ?? '');
	let lastUpdated = $state(data.doc?.lastUpdated ?? '');

	const label = slugLabels[data.slug] ?? data.slug;

	const inp =
		'rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white';
	const ta = inp + ' resize-y';
	const lbl = 'text-sm font-medium text-zinc-700';
</script>

<svelte:head><title>{label} · Dokumen · Cakna Hub Admin</title></svelte:head>

<div class="space-y-6 pb-16">
	<div class="flex items-center gap-3">
		<a
			href="/hub/admin/site/docs"
			class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
		>
			<ArrowLeft size={16} /> Dokumen
		</a>
		<span class="text-zinc-300">/</span>
		<h1 class="text-xl font-bold text-zinc-900">{label}</h1>
	</div>

	{#if form?.error}
		<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<form method="POST" class="space-y-5">
		<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
			<label class="flex flex-col gap-1.5">
				<span class={lbl}>Tajuk</span>
				<input name="title" bind:value={title} class={inp} placeholder="Polisi" required />
			</label>

			<label class="flex flex-col gap-1.5">
				<span class={lbl}>
					Subtajuk
					<span class="font-normal text-zinc-400">(optional)</span>
				</span>
				<input
					name="subtitle"
					bind:value={subtitle}
					class={inp}
					placeholder="Dasar dan polisi rasmi…"
				/>
			</label>

			<label class="flex flex-col gap-1.5">
				<span class={lbl}>
					Kandungan
					<span class="font-normal text-zinc-400">(perenggan dipisah dengan baris kosong)</span>
				</span>
				<textarea
					name="content"
					bind:value={content}
					rows={12}
					class={ta}
					placeholder="Tulis kandungan dokumen di sini…"
				></textarea>
			</label>

			<label class="flex flex-col gap-1.5">
				<span class={lbl}>Dikemaskini</span>
				<input name="lastUpdated" bind:value={lastUpdated} class={inp} placeholder="2026" />
			</label>
		</div>

		<div class="flex items-center justify-between">
			<a href="/hub/admin/site/docs" class="text-sm text-zinc-500 hover:text-zinc-900">
				← Batal
			</a>
			<button
				type="submit"
				class="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
			>
				Simpan perubahan
			</button>
		</div>
	</form>
</div>
