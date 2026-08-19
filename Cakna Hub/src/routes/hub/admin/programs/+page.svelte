<script lang="ts">
	import {
		Plus,
		Trash2,
		Pencil,
		Check,
		X,
		ImagePlus,
		Image as ImageIcon,
		HeartHandshake,
		Briefcase,
		HeartPulse,
		Smartphone,
		GraduationCap,
		Rocket,
		Leaf
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { cores } from '$lib/cores';
	import type { Program } from '$lib/types';
	import MediaPicker from '$lib/components/admin/MediaPicker.svelte';

	const coreIcons: Record<string, typeof HeartHandshake> = {
		assist: HeartHandshake,
		biz: Briefcase,
		circle: HeartPulse,
		digital: Smartphone,
		edu: GraduationCap,
		future: Rocket,
		green: Leaf
	};

	let { data, form } = $props();
	const programs = $derived(data.programs as Program[]);

	const byCore = $derived.by(() => {
		const map: Record<string, Program[]> = {};
		for (const c of cores) map[c.id] = [];
		for (const p of programs) {
			(map[p.coreId] ??= []).push(p);
		}
		return map;
	});

	const totalCount = $derived(programs.length);

	// Edit state
	let editId = $state<string | null>(null);
	let editName = $state('');
	let editCoreId = $state('');
	let editDesc = $state('');
	let editImage = $state('');

	// Per-core add state
	let addingForCore = $state<string | null>(null);
	let newName = $state('');
	let newDesc = $state('');
	let newImage = $state('');
	let newCoreId = $state('');

	// Global add modal
	let globalAddOpen = $state(false);
	let globalCoreId = $state(cores[0]?.id ?? '');
	let globalName = $state('');
	let globalDesc = $state('');

	function startEdit(p: Program) {
		editId = p.id;
		editName = p.name;
		editCoreId = p.coreId;
		editDesc = p.description ?? '';
		editImage = p.image ?? '';
		addingForCore = null;
	}

	function cancelEdit() {
		editId = null;
	}

	function startAdd(coreId: string) {
		addingForCore = coreId;
		newCoreId = coreId;
		newName = '';
		newDesc = '';
		newImage = '';
		editId = null;
		globalAddOpen = false;
	}

	function cancelAdd() {
		addingForCore = null;
	}

	// Media picker
	let pickerOpen = $state(false);
	let pickerFn = $state<((url: string) => void) | null>(null);

	function pick(fn: (url: string) => void) {
		pickerFn = fn;
		pickerOpen = true;
	}

	function onPickerSelect(url: string) {
		pickerFn?.(url);
		pickerFn = null;
	}

	const isImg = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

	const inp =
		'rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white';
	const ta = inp + ' resize-none';
	const lbl = 'text-xs font-medium text-zinc-500';
</script>

<svelte:head><title>Programs · Cakna Hub Admin</title></svelte:head>

{#if pickerOpen}
	<MediaPicker
		bind:open={pickerOpen}
		onSelect={(url) => {
			onPickerSelect(url);
		}}
	/>
{/if}

<!-- Global add modal -->
{#if globalAddOpen}
	<button
		class="fixed inset-0 z-40 bg-black/30"
		onclick={() => (globalAddOpen = false)}
		aria-label="Close"
	></button>
	<div
		class="fixed inset-x-4 top-24 z-50 mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-base font-bold text-zinc-900">Add Program</h2>
			<button type="button" onclick={() => (globalAddOpen = false)} class="text-zinc-400 hover:text-zinc-600">
				<X size={18} />
			</button>
		</div>
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					globalAddOpen = false;
					globalName = '';
					globalDesc = '';
				};
			}}
			class="space-y-4"
		>
			<label class="flex flex-col gap-1.5">
				<span class={lbl}>Core</span>
				<select name="coreId" bind:value={globalCoreId} required class={inp}>
					{#each cores as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1.5">
				<span class={lbl}>Program Name</span>
				<input name="name" bind:value={globalName} required placeholder="e.g. Edu Maths" class={inp} />
			</label>
			<label class="flex flex-col gap-1.5">
				<span class={lbl}>Description <span class="font-normal text-zinc-400">(optional)</span></span>
				<textarea name="description" bind:value={globalDesc} rows={2} placeholder="Short description…" class={ta}></textarea>
			</label>
			<div class="flex justify-end gap-2 pt-2">
				<button
					type="button"
					onclick={() => (globalAddOpen = false)}
					class="rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
				>Cancel</button>
				<button
					type="submit"
					class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
				>
					<Plus size={15} /> Add Program
				</button>
			</div>
		</form>
	</div>
{/if}

<div class="space-y-8">
	<!-- Header -->
	<header class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Programs</h1>
			<p class="mt-1.5 text-zinc-500">
				Manage the programs shown under each core — add, edit, or remove them and their details.
			</p>
		</div>
		<button
			type="button"
			onclick={() => (globalAddOpen = true)}
			class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
		>
			<Plus size={16} /> Add program
		</button>
	</header>

	{#if form?.error}
		<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<p class="text-sm text-zinc-500">{totalCount} program{totalCount !== 1 ? 's' : ''} across 7 cores</p>

	<!-- Cores -->
	<div class="space-y-8">
		{#each cores as core (core.id)}
			{@const corePrograms = byCore[core.id] ?? []}
			{@const CoreIcon = coreIcons[core.id]}

			<section class="space-y-3">
				<!-- Core header -->
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2.5">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
							<svelte:component this={CoreIcon} size={16} />
						</div>
						<span class="font-semibold text-zinc-900">{core.name}</span>
						<span class="text-sm text-zinc-400">{corePrograms.length}</span>
					</div>
					<button
						type="button"
						onclick={() => startAdd(core.id)}
						class="text-sm font-medium text-rose-600 hover:text-rose-700"
					>
						+ Add
					</button>
				</div>

				<!-- Programs grid -->
				{#if corePrograms.length > 0 || addingForCore === core.id}
					<div class="grid gap-3 sm:grid-cols-2">
						{#each corePrograms as p (p.id)}
							{#if editId === p.id}
								<!-- Edit card -->
								<div class="rounded-2xl border border-rose-300 bg-rose-50/40 p-4">
									<form
										method="POST"
										action="?/update"
										id="edit-{p.id}"
										use:enhance={() => {
											return async ({ update }) => {
												await update();
												editId = null;
											};
										}}
										class="space-y-3"
									>
										<input type="hidden" name="id" value={p.id} />
										<input type="hidden" name="coreId" value={editCoreId} />

										<label class="flex flex-col gap-1">
											<span class={lbl}>Name</span>
											<input name="name" bind:value={editName} required class={inp} />
										</label>

										<label class="flex flex-col gap-1">
											<span class={lbl}>Description</span>
											<textarea
												name="description"
												bind:value={editDesc}
												rows={2}
												placeholder="Short description…"
												class={ta}
											></textarea>
										</label>

										<div class="flex flex-col gap-1">
											<span class={lbl}>Image</span>
											<div class="flex items-center gap-2">
												{#if isImg(editImage)}
													<img src={editImage} alt="" class="h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-cover" />
												{:else}
													<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-400">
														<ImageIcon size={14} />
													</div>
												{/if}
												<input
													name="image"
													bind:value={editImage}
													placeholder="/uploads/image.jpg"
													class={inp}
												/>
												<button
													type="button"
													class="shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 hover:border-rose-300 hover:text-rose-600"
													onclick={() => pick((url) => (editImage = url))}
												>
													<ImagePlus size={13} />
												</button>
											</div>
										</div>

										<div class="flex items-center justify-end gap-2 pt-1">
											<button
												type="button"
												onclick={cancelEdit}
												class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50"
											>
												<X size={12} /> Cancel
											</button>
											<button
												type="submit"
												class="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
											>
												<Check size={12} /> Save
											</button>
										</div>
									</form>
								</div>
							{:else}
								<!-- Program card -->
								<div class="group relative rounded-2xl border border-zinc-200 bg-white p-4">
									<!-- Actions (top-right) -->
									<div class="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
										<button
											type="button"
											onclick={() => startEdit(p)}
											class="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-rose-300 hover:text-rose-600"
											title="Edit"
										>
											<Pencil size={12} />
										</button>
										<form method="POST" action="?/delete" use:enhance>
											<input type="hidden" name="id" value={p.id} />
											<button
												type="submit"
												onclick={(e) => { if (!confirm('Delete this program?')) e.preventDefault(); }}
												class="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-red-300 hover:text-red-600"
												title="Delete"
											>
												<Trash2 size={12} />
											</button>
										</form>
									</div>

									<!-- Image -->
									<div class="mb-3 h-28 w-full overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50">
										{#if isImg(p.image ?? '')}
											<img src={p.image} alt={p.name} class="h-full w-full object-cover" />
										{:else}
											<div class="flex h-full w-full items-center justify-center text-zinc-300">
												<ImageIcon size={28} />
											</div>
										{/if}
									</div>

									<!-- Details -->
									<p class="font-semibold text-zinc-900">{p.name}</p>
									<p class="mt-0.5 line-clamp-2 text-sm text-zinc-400">
										{p.description || 'No description yet.'}
									</p>
								</div>
							{/if}
						{/each}

						<!-- Inline add card -->
						{#if addingForCore === core.id}
							<div class="rounded-2xl border border-dashed border-rose-300 bg-rose-50/30 p-4">
								<form
									method="POST"
									action="?/create"
									use:enhance={() => {
										return async ({ update }) => {
											await update();
											addingForCore = null;
											newName = '';
											newDesc = '';
											newImage = '';
										};
									}}
									class="space-y-3"
								>
									<input type="hidden" name="coreId" value={core.id} />

									<label class="flex flex-col gap-1">
										<span class={lbl}>Program Name</span>
										<input name="name" bind:value={newName} required placeholder="e.g. Edu Maths" class={inp} />
									</label>

									<label class="flex flex-col gap-1">
										<span class={lbl}>Description <span class="font-normal text-zinc-400">(optional)</span></span>
										<textarea
											name="description"
											bind:value={newDesc}
											rows={2}
											placeholder="Short description…"
											class={ta}
										></textarea>
									</label>

									<div class="flex flex-col gap-1">
										<span class={lbl}>Image <span class="font-normal text-zinc-400">(optional)</span></span>
										<div class="flex items-center gap-2">
											<input
												name="image"
												bind:value={newImage}
												placeholder="/uploads/image.jpg"
												class={inp}
											/>
											<button
												type="button"
												class="shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 hover:border-rose-300 hover:text-rose-600"
												onclick={() => pick((url) => (newImage = url))}
											>
												<ImagePlus size={13} />
											</button>
										</div>
									</div>

									<div class="flex items-center justify-end gap-2 pt-1">
										<button
											type="button"
											onclick={cancelAdd}
											class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50"
										>
											<X size={12} /> Cancel
										</button>
										<button
											type="submit"
											class="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
										>
											<Plus size={12} /> Add
										</button>
									</div>
								</form>
							</div>
						{/if}
					</div>
				{:else}
					<div class="flex items-center justify-between rounded-2xl border border-dashed border-zinc-200 px-5 py-4 text-sm text-zinc-400">
						<span>No programs yet</span>
					</div>
				{/if}
			</section>
		{/each}
	</div>
</div>
