<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { cores } from '$lib/cores';

	let { data, form } = $props();
</script>

<svelte:head><title>New Funding Application · Cakna Hub</title></svelte:head>

<main class="mx-auto max-w-2xl px-6 py-12">
	<a href="/society/funding" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">
		<ArrowLeft size={16} /> Back
	</a>

	<h1 class="mt-6 text-2xl font-bold tracking-tight text-zinc-900">New Funding Application</h1>
	<p class="mt-1.5 text-zinc-500">Isi borang ini untuk memohon pembiayaan program.</p>

	{#if form?.error}
		<div class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</div>
	{/if}

	<form method="POST" class="mt-8 space-y-5">
		<div class="grid gap-5 sm:grid-cols-2">
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium text-zinc-700">Nama Program <span class="text-rose-500">*</span></span>
				<input name="namaProgram" required class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100" placeholder="Nama program / acara" />
			</label>
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium text-zinc-700">Cawangan <span class="text-rose-500">*</span></span>
				<input name="cawangan" required class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100" placeholder="Cawangan anda" />
			</label>
		</div>

		<div class="grid gap-5 sm:grid-cols-2">
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium text-zinc-700">Tarikh Program <span class="text-rose-500">*</span></span>
				<input name="tarikh" type="date" required class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100" />
			</label>
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium text-zinc-700">Kluster Core <span class="text-rose-500">*</span></span>
				<select name="kluster" required class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100">
					<option value="">Pilih kluster…</option>
					{#each cores as c (c.id)}
						<option value={c.id}>{c.name}</option>
					{/each}
				</select>
			</label>
		</div>

		<div class="grid gap-5 sm:grid-cols-2">
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium text-zinc-700">Nama Francaisi</span>
				<input name="namaFrancaisi" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100" />
			</label>
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium text-zinc-700">Jumlah Perbelanjaan (RM)</span>
				<input name="jumlahPerbelanjaan" type="number" min="0" step="0.01" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100" placeholder="0.00" />
			</label>
		</div>

		<label class="flex flex-col gap-1.5">
			<span class="text-sm font-medium text-zinc-700">Lokasi</span>
			<input name="lokasi" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100" />
		</label>

		<label class="flex flex-col gap-1.5">
			<span class="text-sm font-medium text-zinc-700">Penerangan Program</span>
			<textarea name="penerangan" rows="3" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none"></textarea>
		</label>

		<label class="flex flex-col gap-1.5">
			<span class="text-sm font-medium text-zinc-700">Impak / Tujuan</span>
			<textarea name="impak" rows="2" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none"></textarea>
		</label>

		<div class="flex justify-end gap-3 pt-2">
			<a href="/society/funding" class="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Batal</a>
			<button type="submit" class="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Hantar Permohonan</button>
		</div>
	</form>
</main>
