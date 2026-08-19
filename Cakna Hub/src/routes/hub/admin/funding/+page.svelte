<script lang="ts">
	import { enhance } from '$app/forms';
	import { X, Plus, Pencil, Trash2, ExternalLink } from 'lucide-svelte';
	import StatusBadge from '$lib/components/society/StatusBadge.svelte';
	import { formatRM } from '$lib/format';
	import type { FundingApplication } from '$lib/types';

	let { data, form } = $props();
	const { applications } = $derived(data);

	type ModalMode = 'create' | 'edit' | null;
	let modalMode = $state<ModalMode>(null);
	let editingApp = $state<FundingApplication | null>(null);

	function openCreate() {
		editingApp = null;
		modalMode = 'create';
	}

	function openEdit(app: FundingApplication) {
		editingApp = app;
		modalMode = 'edit';
	}

	function closeModal() {
		modalMode = null;
		editingApp = null;
	}

	const inputCls =
		'w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400';
</script>

<svelte:head><title>Funding · Cakna Hub Admin</title></svelte:head>

<div class="space-y-8">
	<!-- Page header -->
	<header class="flex items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Funding Applications</h1>
			<p class="mt-1.5 text-sm text-zinc-500">{applications.length} total applications.</p>
		</div>
		<button
			onclick={openCreate}
			class="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700"
		>
			<Plus size={15} />
			New Application
		</button>
	</header>

	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<!-- Table -->
	<div class="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
		<table class="w-full text-sm">
			<thead class="border-b border-zinc-100 bg-zinc-50">
				<tr>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Program</th>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Cawangan</th>
					<th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Status</th>
					<th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Amount</th>
					<th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Action</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-100">
				{#each applications as a (a.id)}
					<tr class="hover:bg-zinc-50/50">
						<td class="px-5 py-3">
							<p class="font-medium text-zinc-900">{a.namaProgram}</p>
							<p class="text-xs text-zinc-400">{a.reference}</p>
						</td>
						<td class="px-5 py-3 text-zinc-500">{a.cawangan}</td>
						<td class="px-5 py-3"><StatusBadge status={a.status} /></td>
						<td class="px-5 py-3 text-right tabular-nums text-zinc-700">{formatRM(a.jumlahPerbelanjaan)}</td>
						<td class="px-5 py-3">
							<div class="flex items-center justify-end gap-0.5">
								<a
									href="/society/funding/{a.id}"
									class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
									title="View"
								>
									<ExternalLink size={14} />
								</a>
								<button
									onclick={() => openEdit(a)}
									class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
									title="Edit"
								>
									<Pencil size={14} />
								</button>
								<form
									method="POST"
									action="?/delete"
									use:enhance={() => async ({ update }) => { await update(); }}
								>
									<input type="hidden" name="id" value={a.id} />
									<button
										type="submit"
										onclick={(e) => {
											if (!confirm('Delete this application? This cannot be undone.')) e.preventDefault();
										}}
										class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
										title="Delete"
									>
										<Trash2 size={14} />
									</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if applications.length === 0}
			<div class="py-12 text-center text-sm text-zinc-400">No applications yet.</div>
		{/if}
	</div>
</div>

<!-- Backdrop -->
{#if modalMode}
	<div
		class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
		onclick={closeModal}
		aria-hidden="true"
	></div>

	<!-- Slide-over panel -->
	<aside class="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl sm:w-[600px]">
		<!-- Panel header -->
		<div class="flex shrink-0 items-center justify-between border-b border-zinc-100 px-6 py-4">
			<h2 class="text-base font-semibold text-zinc-900">
				{modalMode === 'create' ? 'New Application' : `Edit · ${editingApp?.namaProgram}`}
			</h2>
			<button
				onclick={closeModal}
				class="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
			>
				<X size={18} />
			</button>
		</div>

		<!-- Form — keyed so inputs remount when switching between records -->
		{#key modalMode + (editingApp?.id ?? '')}
			<form
				method="POST"
				action={modalMode === 'create' ? '?/create' : '?/update'}
				use:enhance={() => async ({ result, update }) => {
					if (result.type === 'success') closeModal();
					await update();
				}}
				class="flex flex-1 flex-col overflow-hidden"
			>
				{#if modalMode === 'edit' && editingApp}
					<input type="hidden" name="id" value={editingApp.id} />
				{/if}

				<div class="flex-1 space-y-6 overflow-y-auto px-6 py-5">
					<!-- Program -->
					<fieldset class="space-y-3">
						<legend class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Program</legend>
						<div class="grid gap-3 sm:grid-cols-2">
							<label class="space-y-1 sm:col-span-2">
								<span class="text-xs font-medium text-zinc-600">Nama Program <span class="text-rose-500">*</span></span>
								<input type="text" name="namaProgram" value={editingApp?.namaProgram ?? ''} required class={inputCls} />
							</label>
							<label class="space-y-1">
								<span class="text-xs font-medium text-zinc-600">Kluster</span>
								<input type="text" name="kluster" value={editingApp?.kluster ?? ''} class={inputCls} />
							</label>
							<label class="space-y-1">
								<span class="text-xs font-medium text-zinc-600">Tarikh</span>
								<input type="text" name="tarikh" value={editingApp?.tarikh ?? ''} class={inputCls} />
							</label>
							<label class="space-y-1 sm:col-span-2">
								<span class="text-xs font-medium text-zinc-600">Lokasi</span>
								<input type="text" name="lokasi" value={editingApp?.lokasi ?? ''} class={inputCls} />
							</label>
						</div>
					</fieldset>

					<!-- Organisasi -->
					<fieldset class="space-y-3">
						<legend class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Organisasi</legend>
						<div class="grid gap-3 sm:grid-cols-2">
							<label class="space-y-1">
								<span class="text-xs font-medium text-zinc-600">Cawangan <span class="text-rose-500">*</span></span>
								<input type="text" name="cawangan" value={editingApp?.cawangan ?? ''} required class={inputCls} />
							</label>
							<label class="space-y-1">
								<span class="text-xs font-medium text-zinc-600">Nama Francaisi</span>
								<input type="text" name="namaFrancaisi" value={editingApp?.namaFrancaisi ?? ''} class={inputCls} />
							</label>
							<label class="space-y-1 sm:col-span-2">
								<span class="text-xs font-medium text-zinc-600">AJK</span>
								<input type="text" name="ajk" value={editingApp?.ajk ?? ''} class={inputCls} />
							</label>
						</div>
					</fieldset>

					<!-- Peserta -->
					<fieldset class="space-y-3">
						<legend class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Peserta</legend>
						<div class="grid gap-3 sm:grid-cols-2">
							<label class="space-y-1">
								<span class="text-xs font-medium text-zinc-600">Jumlah Peserta</span>
								<input type="text" name="jumlahPeserta" value={editingApp?.jumlahPeserta ?? ''} class={inputCls} />
							</label>
							<label class="space-y-1">
								<span class="text-xs font-medium text-zinc-600">Kategori Penerima</span>
								<input type="text" name="kategoriPenerima" value={editingApp?.kategoriPenerima ?? ''} class={inputCls} />
							</label>
							<label class="space-y-1 sm:col-span-2">
								<span class="text-xs font-medium text-zinc-600">Nama Komuniti</span>
								<input type="text" name="namaKomuniti" value={editingApp?.namaKomuniti ?? ''} class={inputCls} />
							</label>
						</div>
					</fieldset>

					<!-- Kewangan -->
					<fieldset class="space-y-3">
						<legend class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Kewangan</legend>
						<div class="grid gap-3 sm:grid-cols-2">
							<label class="space-y-1">
								<span class="text-xs font-medium text-zinc-600">Jumlah Perbelanjaan (RM)</span>
								<input type="number" step="0.01" min="0" name="jumlahPerbelanjaan" value={editingApp?.jumlahPerbelanjaan ?? ''} class={inputCls} />
							</label>
							<label class="space-y-1">
								<span class="text-xs font-medium text-zinc-600">Sumber Dana</span>
								<input type="text" name="sumberDana" value={editingApp?.sumberDana ?? ''} class={inputCls} />
							</label>
						</div>
					</fieldset>

					<!-- Keterangan -->
					<fieldset class="space-y-3">
						<legend class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Keterangan</legend>
						<label class="block space-y-1">
							<span class="text-xs font-medium text-zinc-600">Penerangan</span>
							<textarea name="penerangan" rows="3" class="{inputCls} resize-none">{editingApp?.penerangan ?? ''}</textarea>
						</label>
						<label class="block space-y-1">
							<span class="text-xs font-medium text-zinc-600">Impak</span>
							<textarea name="impak" rows="2" class="{inputCls} resize-none">{editingApp?.impak ?? ''}</textarea>
						</label>
						<label class="block space-y-1">
							<span class="text-xs font-medium text-zinc-600">Cadangan</span>
							<textarea name="cadangan" rows="2" class="{inputCls} resize-none">{editingApp?.cadangan ?? ''}</textarea>
						</label>
						<label class="block space-y-1">
							<span class="text-xs font-medium text-zinc-600">Pautan Gambar</span>
							<input type="text" name="pautanGambar" value={editingApp?.pautanGambar ?? ''} class={inputCls} />
						</label>
					</fieldset>
				</div>

				<!-- Panel footer -->
				<div class="flex shrink-0 items-center justify-end gap-2 border-t border-zinc-100 px-6 py-4">
					<button
						type="button"
						onclick={closeModal}
						class="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
					>
						{modalMode === 'create' ? 'Create Application' : 'Save Changes'}
					</button>
				</div>
			</form>
		{/key}
	</aside>
{/if}
