<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import StatusBadge from '$lib/components/society/StatusBadge.svelte';
	import { formatRM } from '$lib/format';
	import { stageForStatus, canActOnStage } from '$lib/types';

	let { data, form } = $props();
	const { app } = $derived(data);
	const user = $derived(data.user ?? null);
	const stage = $derived(stageForStatus(app.status));
	const canAct = $derived(user && stage ? canActOnStage(user.role, stage) : false);
</script>

<svelte:head><title>{app.namaProgram} · Cakna Hub</title></svelte:head>

<main class="mx-auto max-w-3xl px-6 py-12">
	<a href="/society/funding" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">
		<ArrowLeft size={16} /> Funding Applications
	</a>

	<div class="mt-6 flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">{app.namaProgram}</h1>
			<p class="mt-0.5 text-sm text-zinc-400">{app.reference} · {app.cawangan}</p>
		</div>
		<StatusBadge status={app.status} />
	</div>

	{#if form?.error}
		<div class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</div>
	{/if}

	<dl class="mt-8 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:grid-cols-2">
		{#each [
			['Tarikh', app.tarikh],
			['Lokasi', app.lokasi],
			['Kluster', app.kluster],
			['Nama Francaisi', app.namaFrancaisi],
			['Jumlah Perbelanjaan', formatRM(app.jumlahPerbelanjaan)],
			['Jumlah Peserta', app.jumlahPeserta],
			['Kategori Penerima', app.kategoriPenerima],
			['Sumber Dana', app.sumberDana],
		] as [label, value] (label)}
			{#if value}
				<div>
					<dt class="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</dt>
					<dd class="mt-1 text-sm text-zinc-800">{value}</dd>
				</div>
			{/if}
		{/each}
	</dl>

	{#if app.penerangan}
		<div class="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
			<h2 class="text-sm font-semibold text-zinc-700">Penerangan Program</h2>
			<p class="mt-2 text-sm leading-relaxed text-zinc-600">{app.penerangan}</p>
		</div>
	{/if}

	{#if app.impak}
		<div class="mt-4 rounded-2xl border border-zinc-200 bg-white p-6">
			<h2 class="text-sm font-semibold text-zinc-700">Impak</h2>
			<p class="mt-2 text-sm leading-relaxed text-zinc-600">{app.impak}</p>
		</div>
	{/if}

	{#if canAct && stage}
		<div class="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
			<h2 class="text-base font-semibold text-amber-900">Review</h2>
			<p class="mt-1 text-sm text-amber-700">Semak permohonan ini dan buat keputusan.</p>
			<form method="POST" action="?/review" class="mt-4 space-y-3">
				<input type="hidden" name="stage" value={stage} />
				<textarea name="note" rows="2" placeholder="Nota (pilihan)…" class="w-full rounded-lg border border-amber-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"></textarea>
				<div class="flex gap-2">
					<button type="submit" name="decision" value="approved" class="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Lulus</button>
					<button type="submit" name="decision" value="needs_revision" class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Perlu Semakan</button>
				</div>
			</form>
		</div>
	{/if}

	{#if app.status === 'needs_revision' && user?.role === 'franchisee'}
		<div class="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6">
			<h2 class="text-base font-semibold text-rose-900">Hantar Semula</h2>
			<form method="POST" action="?/resubmit" class="mt-4 space-y-3">
				<textarea name="note" rows="2" placeholder="Nota tambahan…" class="w-full rounded-lg border border-rose-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"></textarea>
				<button type="submit" class="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Hantar Semula</button>
			</form>
		</div>
	{/if}

	{#if app.reviewLog && app.reviewLog.length > 0}
		<div class="mt-8">
			<h2 class="text-sm font-semibold text-zinc-700">History</h2>
			<ul class="mt-3 space-y-2">
				{#each app.reviewLog as entry (entry.at)}
					<li class="flex gap-3 text-sm">
						<span class="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-rose-300"></span>
						<div>
							<span class="font-medium capitalize text-zinc-800">{entry.decision}</span>
							<span class="text-zinc-400"> by {entry.by} ({entry.byRole})</span>
							{#if entry.note}<p class="mt-0.5 text-xs text-zinc-500">{entry.note}</p>{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</main>
