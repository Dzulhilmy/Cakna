<script lang="ts">
	import {
		Plus, Trash2, Pencil, X, Check, ImagePlus, ChevronDown, ChevronUp,
		GripVertical, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Image, List
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { CustomSection, SectionBlock, SectionBlockType } from '$lib/site';
	import MediaPicker from './MediaPicker.svelte';

	interface Props {
		sections: CustomSection[];
		formAction: string;
		pageKey: string;
		onSaved?: () => void;
	}

	let { sections = $bindable([]), formAction, pageKey, onSaved }: Props = $props();

	const json = $derived(JSON.stringify(sections));

	let saved = $state(false);
	let editId = $state<string | null>(null);
	let addingNew = $state(false);

	function freshSection(): Omit<CustomSection, 'id'> {
		return {
			background: 'white',
			eyebrow: '',
			title: '',
			blocks: [{ id: uid(), type: 'paragraph', content: '' }],
			ctaLabel: '',
			ctaHref: '',
		};
	}

	function uid() { return Math.random().toString(36).slice(2, 10); }

	let newSection = $state(freshSection());

	function addSection() {
		if (!newSection.title.trim()) return;
		sections.push({ ...newSection, id: uid() });
		newSection = freshSection();
		addingNew = false;
		editId = sections[sections.length - 1]?.id ?? null;
	}

	function remove(id: string) {
		const i = sections.findIndex((s) => s.id === id);
		if (i >= 0) sections.splice(i, 1);
		if (editId === id) editId = null;
	}

	function move(id: string, dir: -1 | 1) {
		const i = sections.findIndex((s) => s.id === id);
		const j = i + dir;
		if (j < 0 || j >= sections.length) return;
		[sections[i], sections[j]] = [sections[j], sections[i]];
	}

	// ── Section drag-and-drop ──────────────────────────────────────────────────
	let draggingId = $state<string | null>(null);
	let dragOverId = $state<string | null>(null);

	function onDragStart(id: string) { draggingId = id; }
	function onDragOver(e: DragEvent, id: string) { e.preventDefault(); if (id !== draggingId) dragOverId = id; }
	function onDrop(targetId: string) {
		if (!draggingId || draggingId === targetId) { draggingId = null; dragOverId = null; return; }
		const from = sections.findIndex((s) => s.id === draggingId);
		const to = sections.findIndex((s) => s.id === targetId);
		if (from < 0 || to < 0) return;
		const [item] = sections.splice(from, 1);
		sections.splice(to, 0, item);
		draggingId = null; dragOverId = null;
	}
	function onDragEnd() { draggingId = null; dragOverId = null; }

	// ── Block drag within a section ────────────────────────────────────────────
	let blockDraggingId = $state<string | null>(null);
	let blockDragOverId = $state<string | null>(null);
	let blockDragSectionId = $state<string | null>(null);

	function blockDragStart(sectionId: string, blockId: string) {
		blockDraggingId = blockId; blockDragSectionId = sectionId;
	}
	function blockDragOver(e: DragEvent, blockId: string) {
		e.preventDefault(); if (blockId !== blockDraggingId) blockDragOverId = blockId;
	}
	function blockDrop(sec: CustomSection, targetId: string) {
		if (!blockDraggingId || blockDraggingId === targetId) { blockDraggingId = null; blockDragOverId = null; blockDragSectionId = null; return; }
		const from = sec.blocks.findIndex((b) => b.id === blockDraggingId);
		const to = sec.blocks.findIndex((b) => b.id === targetId);
		if (from < 0 || to < 0) return;
		const copy = [...sec.blocks];
		const [item] = copy.splice(from, 1);
		copy.splice(to, 0, item);
		sec.blocks = copy;
		blockDraggingId = null; blockDragOverId = null; blockDragSectionId = null;
	}
	function blockDragEnd() { blockDraggingId = null; blockDragOverId = null; blockDragSectionId = null; }

	// ── Bullet description expand state ───────────────────────────────────────

	// ── Media picker ──────────────────────────────────────────────────────────
	let pickerOpen = $state(false);
	let pickerFn = $state<((url: string) => void) | null>(null);
	function pick(fn: (url: string) => void) { pickerFn = fn; pickerOpen = true; }
	function onPickerSelect(url: string) { pickerFn?.(url); pickerFn = null; }

	// ── Block helpers ─────────────────────────────────────────────────────────
	function addBlock(sec: CustomSection, type: SectionBlockType) {
		const block: SectionBlock = { id: uid(), type };
		if (type === 'paragraph' || type === 'text') block.content = '';
		if (type === 'image') { block.images = []; block.imageStyle = 'gallery'; }
		if (type === 'bulletList') block.items = [''];
		sec.blocks = [...sec.blocks, block];
	}

	function removeBlock(sec: CustomSection, blockId: string) {
		sec.blocks = sec.blocks.filter((b) => b.id !== blockId);
	}

	const blockTypeIcon: Record<SectionBlockType, typeof AlignLeft> = {
		paragraph: AlignLeft,
		text: Type,
		image: Image,
		bulletList: List,
	};
	const blockTypeLabel: Record<SectionBlockType, string> = {
		paragraph: 'Paragraph',
		text: 'Text',
		image: 'Image',
		bulletList: 'Bullet List',
	};

	const isImg = (u: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(u);

	const inp = 'rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white';
	const ta = inp + ' resize-y';
	const lbl = 'text-sm font-medium text-zinc-700';
	const browseCls = 'shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 hover:border-rose-300 hover:text-rose-600';
	const thumbCls = 'h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-cover bg-zinc-50';
	const emptyThumbCls = 'h-9 w-9 shrink-0 rounded-lg border border-zinc-200 bg-zinc-100';
</script>

{#if pickerOpen}
	<MediaPicker bind:open={pickerOpen} onselect={onPickerSelect} onclose={() => (pickerFn = null)} />
{/if}

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm font-semibold text-zinc-800">Custom Sections</p>
			<p class="text-xs text-zinc-400 mt-0.5">Extra blocks appended to this page</p>
		</div>
		{#if saved}<span class="flex items-center gap-1 text-sm font-medium text-rose-600"><Check size={14} /> Saved</span>{/if}
	</div>

	<form
		method="POST"
		action={formAction}
		use:enhance={() => async ({ update }) => {
			await update({ invalidateAll: false });
			saved = true;
			setTimeout(() => (saved = false), 2500);
			onSaved?.();
		}}
	>
		<input type="hidden" name="json" value={json} />
		<input type="hidden" name="pageKey" value={pageKey} />

		<!-- Section list -->
		<div class="space-y-2 mb-3">
			{#each sections as sec, i (sec.id)}
				<div
					role="listitem"
					class="rounded-2xl border bg-white overflow-hidden transition-colors {draggingId === sec.id ? 'opacity-50 border-rose-300' : dragOverId === sec.id ? 'border-rose-400 shadow-md' : 'border-zinc-200'}"
					draggable="true"
					ondragstart={() => onDragStart(sec.id)}
					ondragover={(e) => onDragOver(e, sec.id)}
					ondrop={() => onDrop(sec.id)}
					ondragend={onDragEnd}
				>
					<!-- Header row -->
					<div class="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-2.5">
						<div class="flex items-center gap-2 min-w-0">
							<div class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing" aria-hidden="true">
								<GripVertical size={15} />
							</div>
							<span class="text-xs text-zinc-400 shrink-0">{sec.blocks.length} block{sec.blocks.length === 1 ? '' : 's'}</span>
							<span class="text-sm font-medium text-zinc-900 truncate">{sec.title || '(no title)'}</span>
						</div>
						<div class="flex shrink-0 items-center gap-1 ml-2">
							<button type="button" onclick={() => move(sec.id, -1)} disabled={i === 0} class="p-1.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"><ChevronUp size={13} /></button>
							<button type="button" onclick={() => move(sec.id, 1)} disabled={i === sections.length - 1} class="p-1.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"><ChevronDown size={13} /></button>
							<button type="button" onclick={() => (editId = editId === sec.id ? null : sec.id)}
								class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-50">
								<Pencil size={11} />{editId === sec.id ? 'Close' : 'Edit'}
							</button>
							<button type="button" onclick={() => { if (confirm('Delete this section?')) remove(sec.id); }}
								class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50">
								<Trash2 size={11} />
							</button>
						</div>
					</div>

					<!-- Edit panel -->
					{#if editId === sec.id}
						<div class="space-y-4 p-4">
							<!-- Section meta -->
							<div class="grid gap-3 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Background</span>
									<select class={inp} value={sec.background} onchange={(e) => (sec.background = e.currentTarget.value as 'white' | 'tint')}>
										<option value="white">White</option>
										<option value="tint">Tint (light rose)</option>
									</select>
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow <span class="font-normal text-zinc-400">(optional)</span></span>
									<input class={inp} value={sec.eyebrow ?? ''} oninput={(e) => (sec.eyebrow = e.currentTarget.value)} placeholder="Optional label above title" />
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Section Title</span>
								<input class={inp} value={sec.title} oninput={(e) => (sec.title = e.currentTarget.value)} />
							</label>

							<!-- Blocks -->
							<div>
								<p class="mb-2 {lbl}">Content Blocks</p>
								<div class="space-y-2">
									{#each sec.blocks as block (block.id)}
										{@const BlockIcon = blockTypeIcon[block.type]}
										<div
											role="listitem"
											class="rounded-xl border bg-zinc-50/80 overflow-hidden transition-colors {blockDraggingId === block.id ? 'opacity-50 border-rose-300' : blockDragOverId === block.id ? 'border-rose-400 shadow-sm' : 'border-zinc-200'}"
											draggable="true"
											ondragstart={() => blockDragStart(sec.id, block.id)}
											ondragover={(e) => blockDragOver(e, block.id)}
											ondrop={() => blockDrop(sec, block.id)}
											ondragend={blockDragEnd}
										>
											<!-- Block header -->
											<div class="flex items-center gap-2 px-3 py-2 bg-white border-b border-zinc-100">
												<div class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing" aria-hidden="true">
													<GripVertical size={13} />
												</div>
												<BlockIcon size={13} class="shrink-0 text-zinc-400" />
												<span class="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{blockTypeLabel[block.type]}</span>
												<div class="ml-auto">
													<button type="button" onclick={() => removeBlock(sec, block.id)}
														class="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50">
														<X size={12} />
													</button>
												</div>
											</div>

											<!-- Block content editor -->
											<div class="p-3">
												{#if block.type === 'paragraph'}
													<textarea
														class={ta}
														rows="3"
														placeholder="Write your paragraph content here…"
														oninput={(e) => (block.content = e.currentTarget.value)}
													>{block.content ?? ''}</textarea>
													<div class="mt-2 flex items-center gap-1">
														<span class="text-xs text-zinc-400 mr-1">Align:</span>
														{#each ([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight], ['justify', AlignJustify]] as [string, typeof AlignLeft][]) as [val, Icon]}
															<button type="button"
																onclick={() => (block.align = val as typeof block.align)}
																class="rounded p-1.5 {(block.align ?? 'left') === val ? 'bg-rose-100 text-rose-600' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'}">
																<Icon size={13} />
															</button>
														{/each}
													</div>

												{:else if block.type === 'text'}
													<input
														class={inp}
														value={block.content ?? ''}
														placeholder="Short text line (e.g. subheading, label, annotation)"
														oninput={(e) => (block.content = e.currentTarget.value)}
													/>

												{:else if block.type === 'image'}
													<div class="space-y-2.5">
														<div class="flex gap-3 items-center">
															<label class="flex flex-col gap-1 flex-1">
																<span class="text-xs text-zinc-500">Display style</span>
																<select class={inp} value={block.imageStyle ?? 'gallery'} onchange={(e) => (block.imageStyle = e.currentTarget.value as typeof block.imageStyle)}>
																	<option value="gallery">Gallery (grid)</option>
																	<option value="background">Background image</option>
																	<option value="both">Both (bg + gallery)</option>
																</select>
															</label>
														</div>
														<div class="space-y-2">
															{#each (block.images ?? []) as img, ii (ii)}
																<div class="flex items-center gap-2">
																	{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
																	<input class={inp} value={img} oninput={(e) => { if (!block.images) block.images = []; block.images[ii] = e.currentTarget.value; }} placeholder="/uploads/image.jpg" />
																	<button type="button" class={browseCls} onclick={() => pick((url) => { if (!block.images) block.images = []; block.images[ii] = url; })}><ImagePlus size={13} /></button>
																	<button type="button" onclick={() => { block.images = (block.images ?? []).filter((_, i) => i !== ii); }} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
																</div>
															{/each}
														</div>
														<div class="flex gap-2">
															<button type="button" onclick={() => { block.images = [...(block.images ?? []), '']; }} class="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700"><Plus size={12} /> Add URL</button>
															<button type="button" onclick={() => pick((url) => { block.images = [...(block.images ?? []), url]; })} class="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-rose-600"><ImagePlus size={12} /> Pick</button>
														</div>
														<label class="flex flex-col gap-1">
															<span class="text-xs text-zinc-500">Caption (optional)</span>
															<input class={inp} value={block.caption ?? ''} oninput={(e) => (block.caption = e.currentTarget.value)} placeholder="Image caption…" />
														</label>
													</div>

												{:else if block.type === 'bulletList'}
													<div class="space-y-2">
														{#each (block.items ?? []) as _, bi (bi)}
															<div class="rounded-lg border border-zinc-200 bg-white overflow-hidden">
																<div class="flex items-center gap-2 p-2">
																	<input
																		class="{inp} flex-1"
																		value={block.items![bi]}
																		oninput={(e) => { if (!block.items) block.items = []; block.items[bi] = e.currentTarget.value; }}
																		placeholder="Bullet item…"
																	/>
																	<button type="button" onclick={() => {
																		block.items = (block.items ?? []).filter((_, i) => i !== bi);
																		if (block.itemDescriptions) block.itemDescriptions = block.itemDescriptions.filter((_, i) => i !== bi);
																	}} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
																</div>
																<div class="border-t border-zinc-100 px-2 pb-2">
																	<textarea
																		class="{ta} mt-2 text-xs"
																		rows="2"
																		placeholder="Description shown on expand…"
																		oninput={(e) => {
																			if (!block.itemDescriptions) block.itemDescriptions = Array((block.items ?? []).length).fill('');
																			block.itemDescriptions[bi] = e.currentTarget.value;
																		}}
																	>{block.itemDescriptions?.[bi] ?? ''}</textarea>
																</div>
															</div>
														{/each}
														<button type="button" onclick={() => {
															const len = (block.items ?? []).length;
															block.items = [...(block.items ?? []), ''];
															block.itemDescriptions = [...(block.itemDescriptions ?? Array(len).fill('') as string[]), ''];
														}} class="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700">
															<Plus size={12} /> Add bullet
														</button>
													</div>
												{/if}
											</div>
										</div>
									{/each}
								</div>

								<!-- Add block buttons -->
								<div class="mt-3 flex flex-wrap gap-2">
									<span class="text-xs text-zinc-400 self-center">Add block:</span>
									{#each (['paragraph', 'text', 'image', 'bulletList'] as SectionBlockType[]) as btype}
										{@const BIcon = blockTypeIcon[btype]}
										<button type="button" onclick={() => addBlock(sec, btype)}
											class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 hover:border-rose-300 hover:text-rose-600">
											<BIcon size={12} /> {blockTypeLabel[btype]}
										</button>
									{/each}
								</div>
							</div>

							<!-- Optional CTA -->
							<div class="grid gap-3 sm:grid-cols-2 pt-1 border-t border-zinc-100">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>CTA Label <span class="font-normal text-zinc-400">(optional)</span></span>
									<input class={inp} value={sec.ctaLabel ?? ''} oninput={(e) => (sec.ctaLabel = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>CTA Link</span>
									<input class={inp} value={sec.ctaHref ?? ''} oninput={(e) => (sec.ctaHref = e.currentTarget.value)} placeholder="/about" />
								</label>
							</div>
						</div>
					{/if}
				</div>
			{/each}

			{#if sections.length === 0 && !addingNew}
				<div class="rounded-2xl border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">
					No custom sections yet
				</div>
			{/if}
		</div>

		<!-- Add new section inline -->
		{#if addingNew}
			<div class="space-y-4 rounded-2xl border border-rose-200 bg-white p-4 mb-3">
				<p class="text-sm font-semibold text-zinc-900">New Section</p>
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Background</span>
						<select class={inp} value={newSection.background} onchange={(e) => (newSection.background = e.currentTarget.value as 'white' | 'tint')}>
							<option value="white">White</option>
							<option value="tint">Tint</option>
						</select>
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Eyebrow</span>
						<input class={inp} value={newSection.eyebrow ?? ''} oninput={(e) => (newSection.eyebrow = e.currentTarget.value)} placeholder="Optional" />
					</label>
				</div>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Title <span class="text-rose-500">*</span></span>
					<input class={inp} value={newSection.title} oninput={(e) => (newSection.title = e.currentTarget.value)} />
				</label>
				<p class="text-xs text-zinc-400">Starts with a paragraph block. You can add more blocks after creating the section.</p>
				<div class="flex items-center gap-2">
					<button type="button" onclick={addSection}
						class="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
						<Plus size={14} /> Add
					</button>
					<button type="button" onclick={() => { addingNew = false; newSection = freshSection(); }}
						class="rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50">Cancel</button>
				</div>
			</div>
		{:else}
			<button type="button" onclick={() => (addingNew = true)}
				class="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-600 hover:border-rose-300 hover:text-rose-600">
				<Plus size={15} /> Add section
			</button>
		{/if}

		<div class="flex justify-end">
			<button type="submit"
				class="rounded-xl {saved ? 'bg-rose-700 hover:bg-rose-800' : 'bg-rose-600 hover:bg-rose-700'} px-5 py-2.5 text-sm font-semibold text-white">
				{saved ? '✓ Saved' : 'Save sections'}
			</button>
		</div>
	</form>
</div>
