<script lang="ts">
	import { tick } from 'svelte';
	import { ArrowLeft, Plus, Trash2, Pencil, ImagePlus, GripVertical, Check, RefreshCw, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Image, List, X } from 'lucide-svelte';
	import type { CustomSection, SectionBlock, SectionBlockType, PageKey, AboutSectionKey, SetemSectionKey, CsrSectionKey } from '$lib/site';
	import {
		PAGE_KEYS,
		ABOUT_SECTIONS, DEFAULT_ABOUT_ORDER,
		SETEM_SECTIONS, DEFAULT_SETEM_ORDER,
		CSR_SECTIONS, DEFAULT_CSR_ORDER,
	} from '$lib/site';
	import { enhance } from '$app/forms';
	import MediaPicker from '$lib/components/admin/MediaPicker.svelte';
	import CustomSectionsEditor from '$lib/components/admin/CustomSectionsEditor.svelte';

	let { data, form } = $props();
	const section = data.section as string;

	const rawSection = (data.content as Record<string, unknown>)[section];
	let s = $state(structuredClone(rawSection ?? (section === 'nav' ? [] : {})));

	// Ensure required arrays/nested objects exist
	if (section === 'hero' || section === 'cta') {
		const o = s as Record<string, unknown>;
		if (!Array.isArray(o.bgImages)) o.bgImages = [];
		if (!o.primaryCta || typeof o.primaryCta !== 'object') o.primaryCta = { label: '', href: '' };
		if (!o.secondaryCta || typeof o.secondaryCta !== 'object') o.secondaryCta = { label: '', href: '' };
	}
	if (section === 'about') {
		const o = s as Record<string, unknown>;
		if (!Array.isArray(o.quoteBgImages)) o.quoteBgImages = [];
	}
	if (section === 'impact') {
		const o = s as Record<string, unknown>;
		if (!Array.isArray(o.stats)) o.stats = [];
	}
	if (section === 'homeGallery') {
		const o = s as Record<string, unknown>;
		if (!Array.isArray(o.images)) o.images = [];
	}
	if (section === 'partners') {
		const o = s as Record<string, unknown>;
		if (!Array.isArray(o.logos)) o.logos = [];
	}
	if (section === 'aboutPage') {
		const o = s as Record<string, unknown>;
		if (!Array.isArray(o.heroBgImages)) o.heroBgImages = [];
		if (!Array.isArray(o.ctaBgImages)) o.ctaBgImages = [];
		if (!Array.isArray(o.purpose)) o.purpose = [];
		if (!Array.isArray(o.stats)) o.stats = [];
	}
	if (section === 'setemPage') {
		const o = s as Record<string, unknown>;
		if (!Array.isArray(o.heroBgImages)) o.heroBgImages = [];
		if (!Array.isArray(o.ctaBgImages)) o.ctaBgImages = [];
		if (!Array.isArray(o.gapStats)) o.gapStats = [];
		if (!Array.isArray(o.expect)) o.expect = [];
		if (!Array.isArray(o.audience)) o.audience = [];
		if (!Array.isArray(o.steps)) o.steps = [];
	}
	if (section === 'csrPage') {
		const o = s as Record<string, unknown>;
		if (!Array.isArray(o.heroBgImages)) o.heroBgImages = [];
		if (!Array.isArray(o.ctaBgImages)) o.ctaBgImages = [];
		if (!Array.isArray(o.stories)) o.stories = [];
	}
	if (section === 'customSections') {
		const cs = s as Record<string, unknown>;
		for (const k of PAGE_KEYS) {
			if (!Array.isArray(cs[k])) cs[k] = [];
		}
	}

	const json = $derived(JSON.stringify(s));

	const sectionLabel: Record<string, string> = {
		brand: 'Brand',
		nav: 'Navigation Links',
		hero: 'Hero Section',
		about: 'About Section',
		programs: 'Programs Section',
		impact: 'Impact Section',
		cta: 'CTA Section',
		footer: 'Contact & Footer',
		homeGallery: 'Home Gallery',
		partners: 'Partners',
		customSections: 'Custom Sections',
		aboutPage: 'About Us',
		setemPage: 'SETEM',
		csrPage: 'CSR Stories'
	};

	const overlayOptions = ['light', 'medium', 'dark'] as const;

	// CSR stories expand state
	let csrEditIdx = $state<number | null>(null);

	// Custom sections for sub-pages (initialised once from content)
	const _cs = ((data.content as Record<string, unknown>).customSections ?? {}) as Record<string, import('$lib/site').CustomSection[]>;
	let homeCustom  = $state<CustomSection[]>(structuredClone(_cs.home ?? []));
	let aboutCustom = $state<CustomSection[]>(structuredClone(_cs.about ?? []));
	let setemCustom = $state<CustomSection[]>(structuredClone(_cs.setem ?? []));
	let csrCustom   = $state<CustomSection[]>(structuredClone(_cs.csr ?? []));

	// Section order state per page
	const _so = (data.content as Record<string, unknown>).sectionOrder as Record<string, string[]> | undefined;
	let aboutOrder = $state<AboutSectionKey[]>(structuredClone((_so?.aboutPage ?? DEFAULT_ABOUT_ORDER) as AboutSectionKey[]));
	let setemOrder = $state<SetemSectionKey[]>(structuredClone((_so?.setemPage ?? DEFAULT_SETEM_ORDER) as SetemSectionKey[]));
	let csrOrder   = $state<CsrSectionKey[]>(structuredClone((_so?.csrPage ?? DEFAULT_CSR_ORDER) as CsrSectionKey[]));

	let orderSaved = $state(false);
	function flashOrderSaved() { orderSaved = true; setTimeout(() => (orderSaved = false), 2500); }

	// Hidden order-save forms – submitted programmatically after each drag-drop
	let aboutOrderForm: HTMLFormElement | undefined = $state();
	let setemOrderForm: HTMLFormElement | undefined = $state();
	let csrOrderForm: HTMLFormElement | undefined = $state();
	const aboutOrderJson = $derived(JSON.stringify(aboutOrder));
	const setemOrderJson = $derived(JSON.stringify(setemOrder));
	const csrOrderJson = $derived(JSON.stringify(csrOrder));

	// Section order drag
	let orderDragging = $state<string | null>(null);
	let orderDragOver = $state<string | null>(null);

	function orderDragStart(key: string) { orderDragging = key; }
	function orderDragOverFn(key: string) { if (key !== orderDragging) orderDragOver = key; }
	async function orderDrop<T extends string>(order: T[], targetKey: T, form?: HTMLFormElement) {
		const from = orderDragging as T;
		if (!from || from === targetKey) { orderDragging = null; orderDragOver = null; return; }
		const fi = order.indexOf(from);
		const ti = order.indexOf(targetKey);
		if (fi < 0 || ti < 0) return;
		order.splice(fi, 1);
		order.splice(ti, 0, from);
		orderDragging = null; orderDragOver = null;
		if (form) { await tick(); form.requestSubmit(); }
	}
	function orderDragEnd() { orderDragging = null; orderDragOver = null; }

	// customSections page tab state
	let csPage = $state<PageKey>('home');
	const csPageLabels: Record<PageKey, string> = {
		home: 'Home',
		about: 'About',
		setem: 'SETEM',
		csr: 'CSR Stories'
	};

	// Split-panel: active sub-section for multi-section pages
	const isMultiSection = section === 'aboutPage' || section === 'setemPage' || section === 'csrPage';
	const pageSectionsMeta = section === 'aboutPage' ? ABOUT_SECTIONS
		: section === 'setemPage' ? SETEM_SECTIONS
		: section === 'csrPage' ? CSR_SECTIONS
		: [];
	const pageOrder = $derived(
		section === 'aboutPage' ? aboutOrder
		: section === 'setemPage' ? setemOrder
		: section === 'csrPage' ? csrOrder
		: []
	);
	const pageOrderForm = $derived(
		section === 'aboutPage' ? aboutOrderForm
		: section === 'setemPage' ? setemOrderForm
		: section === 'csrPage' ? csrOrderForm
		: undefined
	);
	const pagePreviewPath = section === 'aboutPage' ? '/about'
		: section === 'setemPage' ? '/setem'
		: '/csr-stories';

	let activeSubSection = $state(pageSectionsMeta[0]?.key ?? '');

	// Save flash for multi-section pages
	let savedFlash = $state(false);
	function flashSaved() { savedFlash = true; setTimeout(() => (savedFlash = false), 2500); }

	// Preview iframe ref
	let previewIframe = $state<HTMLIFrameElement | undefined>(undefined);
	function refreshPreview() { if (previewIframe) previewIframe.src = previewIframe.src; }

	// Inline custom section management
	let addingNewCustom = $state(false);
	let newCustomTitle = $state('');

	function uid() { return Math.random().toString(36).slice(2, 10); }

	function getCustomArr() {
		return section === 'aboutPage' ? aboutCustom : section === 'setemPage' ? setemCustom : csrCustom;
	}
	function getCustomKey() {
		return section === 'aboutPage' ? 'about' : section === 'setemPage' ? 'setem' : 'csr';
	}

	function addCustomSection() {
		if (!newCustomTitle.trim()) return;
		const arr = getCustomArr();
		const id = uid();
		arr.push({ id, title: newCustomTitle.trim(), background: 'white', eyebrow: '', blocks: [{ id: uid(), type: 'paragraph' as SectionBlockType, content: '' }], ctaLabel: '', ctaHref: '' });
		newCustomTitle = '';
		addingNewCustom = false;
		activeSubSection = id;
	}

	function removeCustomSection(secId: string) {
		const arr = getCustomArr();
		const i = arr.findIndex((s) => s.id === secId);
		if (i >= 0) arr.splice(i, 1);
		if (activeSubSection === secId) activeSubSection = pageOrder.filter((k) => k !== 'customSections')[0] ?? '';
	}

	function addBlock(sec: CustomSection, type: SectionBlockType) {
		const block = { id: uid(), type } as SectionBlock;
		if (type === 'paragraph' || type === 'text') (block as { content?: string }).content = '';
		if (type === 'image') { (block as { images?: string[]; imageStyle?: string }).images = []; (block as { imageStyle?: string }).imageStyle = 'gallery'; }
		if (type === 'bulletList') (block as { items?: string[] }).items = [''];
		sec.blocks = [...sec.blocks, block];
	}

	function removeBlock(sec: CustomSection, blockId: string) {
		sec.blocks = sec.blocks.filter((b) => b.id !== blockId);
	}

	const activeIsCustomSection = $derived(getCustomArr().some((s) => s.id === activeSubSection));

	// Unified nav order: regular section keys + custom section IDs merged in position
	const unifiedNavItems = $derived.by(() => {
		const result: string[] = [];
		for (const key of pageOrder) {
			if (key === 'customSections') {
				for (const sec of getCustomArr()) result.push(sec.id);
			} else {
				result.push(key);
			}
		}
		// custom sections not yet in pageOrder (shouldn't happen, but be safe)
		const existing = new Set(result);
		for (const sec of getCustomArr()) {
			if (!existing.has(sec.id)) result.push(sec.id);
		}
		return result;
	});

	// Hidden form for auto-saving custom section order after unified drag
	let customOrderForm: HTMLFormElement | undefined = $state();
	const customOrderJson = $derived(JSON.stringify(getCustomArr()));
	const customOrderKey = $derived(getCustomKey());

	// Unified drop — handles both regular keys and custom section IDs
	async function unifiedDrop(targetId: string) {
		if (!orderDragging || orderDragging === targetId) { orderDragging = null; orderDragOver = null; return; }
		const items = [...unifiedNavItems];
		const from = items.indexOf(orderDragging);
		const to = items.indexOf(targetId);
		if (from < 0 || to < 0) { orderDragging = null; orderDragOver = null; return; }
		items.splice(from, 1);
		items.splice(to, 0, orderDragging);

		// Split back: regular keys vs custom IDs
		const customIdSet = new Set(getCustomArr().map((s) => s.id));
		const regularKeys: string[] = [];
		const orderedCustomIds: string[] = [];
		let customInsertPos = -1;
		for (const item of items) {
			if (customIdSet.has(item)) {
				if (customInsertPos === -1) customInsertPos = regularKeys.length;
				orderedCustomIds.push(item);
			} else {
				regularKeys.push(item);
			}
		}

		// Rebuild pageOrder with customSections marker at right position
		const newPageOrder = [...regularKeys] as typeof pageOrder;
		const hasCustomKey = (pageOrder as string[]).includes('customSections');
		if (hasCustomKey) {
			const pos = customInsertPos >= 0 ? customInsertPos : newPageOrder.length;
			(newPageOrder as string[]).splice(pos, 0, 'customSections');
		}
		pageOrder.splice(0, pageOrder.length, ...newPageOrder);

		// Reorder the custom sections array to match
		const arr = getCustomArr();
		const reordered = orderedCustomIds.map((id) => arr.find((s) => s.id === id)!).filter(Boolean);
		arr.splice(0, arr.length, ...reordered);

		orderDragging = null; orderDragOver = null;
		await tick();
		pageOrderForm?.requestSubmit();
		if (orderedCustomIds.length > 0) customOrderForm?.requestSubmit();
	}

	const blockTypeLabel: Record<SectionBlockType, string> = {
		paragraph: 'Paragraph', text: 'Text', image: 'Image', bulletList: 'Bullet List'
	};

	// Media picker shared state
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

	// Shared class strings
	const inp =
		'rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white';
	const ta = inp + ' resize-y';
	const lbl = 'text-sm font-medium text-zinc-700';
	const isImg = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

	// Thumbnail for an image URL (compact preview)
	const thumbCls = 'h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-cover bg-zinc-50';
	const emptyThumbCls = 'h-9 w-9 shrink-0 rounded-lg border border-zinc-200 bg-zinc-100';

	// Browse button
	const browseCls =
		'shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:border-rose-300 hover:text-rose-600';
</script>

<svelte:head><title>{sectionLabel[section] ?? section} · Site · Cakna Hub Admin</title></svelte:head>

<!-- Hidden order-save forms for sub-page reordering – submitted programmatically after each drag-drop -->
<form method="POST" action="?/sectionOrder" class="hidden" bind:this={aboutOrderForm}
	use:enhance={() => async ({ update }) => { await update({ invalidateAll: false }); flashOrderSaved(); }}>
	<input type="hidden" name="json" value={aboutOrderJson} />
	<input type="hidden" name="pageKey" value="aboutPage" />
</form>
<form method="POST" action="?/sectionOrder" class="hidden" bind:this={setemOrderForm}
	use:enhance={() => async ({ update }) => { await update({ invalidateAll: false }); flashOrderSaved(); }}>
	<input type="hidden" name="json" value={setemOrderJson} />
	<input type="hidden" name="pageKey" value="setemPage" />
</form>
<form method="POST" action="?/sectionOrder" class="hidden" bind:this={csrOrderForm}
	use:enhance={() => async ({ update }) => { await update({ invalidateAll: false }); flashOrderSaved(); }}>
	<input type="hidden" name="json" value={csrOrderJson} />
	<input type="hidden" name="pageKey" value="csrPage" />
</form>
<form method="POST" action="?/customSections" class="hidden" bind:this={customOrderForm}
	use:enhance={() => async ({ update }) => { await update({ invalidateAll: false }); flashOrderSaved(); }}>
	<input type="hidden" name="json" value={customOrderJson} />
	<input type="hidden" name="pageKey" value={customOrderKey} />
</form>

{#if isMultiSection}
<!-- ── Split-panel layout for aboutPage / setemPage / csrPage ──────────────── -->
<div class="-mx-6 -my-8 md:-my-10 flex divide-x divide-zinc-200 overflow-hidden" style="height: 100vh;">

	<!-- Left panel -->
	<div class="flex w-[380px] shrink-0 flex-col bg-white">

		<!-- Header -->
		<div class="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3">
			<div class="flex items-center gap-1.5 text-sm">
				<a href="/hub/admin/site" class="flex items-center gap-1 text-zinc-500 hover:text-zinc-900">
					<ArrowLeft size={13} /> Website
				</a>
				<span class="text-zinc-300">/</span>
				<span class="font-medium text-zinc-900">{sectionLabel[section] ?? section}</span>
			</div>
			<div class="flex items-center gap-2">
				{#if orderSaved}
					<span class="flex items-center gap-1 text-xs font-semibold text-emerald-600"><Check size={11} /> Order saved</span>
				{/if}
				{#if savedFlash}
					<span class="flex items-center gap-1 text-xs font-semibold text-emerald-600"><Check size={11} /> Saved</span>
				{/if}
			</div>
		</div>

		<!-- Unified section nav (regular + custom, all draggable together) -->
		<div class="shrink-0 border-b border-zinc-100 p-2">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div ondragover={(e) => { if (orderDragging) e.preventDefault(); }} ondrop={(e) => { if (orderDragging) e.preventDefault(); }}>
				{#each unifiedNavItems as itemKey (itemKey)}
					{@const meta = pageSectionsMeta.find(s => s.key === itemKey)}
					{@const customSec = meta ? null : getCustomArr().find(s => s.id === itemKey)}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						ondragover={(e) => { if (orderDragging) { e.preventDefault(); orderDragOverFn(itemKey); } }}
						ondrop={async (e) => { e.preventDefault(); await unifiedDrop(itemKey); }}
						ondragend={orderDragEnd}
						class="flex items-center gap-0.5 transition-opacity
						       {orderDragging === itemKey ? 'opacity-30' : ''}
						       {orderDragOver === itemKey && orderDragging !== itemKey ? 'rounded-lg outline outline-2 outline-rose-400 outline-offset-[-2px]' : ''}"
					>
						<span
							draggable="true"
							role="button"
							tabindex="0"
							ondragstart={(e) => { e.dataTransfer?.setData('text/plain', itemKey); e.dataTransfer && (e.dataTransfer.effectAllowed = 'move'); orderDragStart(itemKey); }}
							ondragend={orderDragEnd}
							class="shrink-0 cursor-grab p-1 text-zinc-300 hover:text-zinc-500 active:cursor-grabbing"
							aria-label="Drag to reorder {meta?.label ?? customSec?.title ?? itemKey}"
						>
							<GripVertical size={14} />
						</span>
						<button
							type="button"
							onclick={() => (activeSubSection = itemKey)}
							class="flex flex-1 items-center rounded-lg px-2 py-2 text-left text-sm transition-colors
							       {activeSubSection === itemKey ? 'bg-rose-50 text-rose-700 font-medium' : 'text-zinc-600 hover:bg-zinc-50'}"
						>
							{meta?.label ?? customSec?.title ?? itemKey}
						</button>
						{#if customSec}
							<button
								type="button"
								onclick={() => { if (confirm('Delete this section?')) removeCustomSection(itemKey); }}
								class="shrink-0 rounded-lg p-1.5 text-zinc-300 hover:text-red-500"
								aria-label="Delete {customSec.title}"
							>
								<X size={13} />
							</button>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Add section button / inline form -->
			{#if addingNewCustom}
				<div class="m-1 space-y-2 rounded-xl border border-rose-200 bg-rose-50/40 p-2">
					<input
						class="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
						placeholder="Section title…"
						bind:value={newCustomTitle}
						onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSection(); } if (e.key === 'Escape') { addingNewCustom = false; newCustomTitle = ''; } }}
					/>
					<div class="flex gap-1.5">
						<button type="button" onclick={addCustomSection}
							class="flex-1 rounded-lg bg-rose-600 py-1.5 text-xs font-semibold text-white hover:bg-rose-700">
							Add
						</button>
						<button type="button" onclick={() => { addingNewCustom = false; newCustomTitle = ''; }}
							class="flex-1 rounded-lg border border-zinc-200 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50">
							Cancel
						</button>
					</div>
				</div>
			{:else}
				<button type="button" onclick={() => (addingNewCustom = true)}
					class="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-400 hover:text-rose-600">
					<Plus size={13} /> Add section
				</button>
			{/if}
		</div>

		<!-- Active sub-section form (scrollable) -->
		<div class="flex-1 overflow-y-auto">

			{#if activeIsCustomSection}
			<!-- ── Inline custom section editor ──────────────────── -->
			{@const arr = getCustomArr()}
			{@const pk = getCustomKey()}
			{@const activeSec = arr.find(s => s.id === activeSubSection)}
			{#if activeSec}
			<form method="POST" action="?/customSections"
				use:enhance={() => async ({ update }) => { await update({ invalidateAll: false }); flashSaved(); }}>
				<input type="hidden" name="pageKey" value={pk} />
				<input type="hidden" name="json" value={JSON.stringify(arr)} />
				<div class="p-4 space-y-4">
					<p class="text-xs font-semibold uppercase tracking-wider text-zinc-400">{activeSec.title || 'Custom Section'}</p>
					<div class="grid grid-cols-2 gap-3">
						<label class="flex flex-col gap-1.5"><span class={lbl}>Background</span>
							<select class={inp} value={activeSec.background}
								onchange={(e) => (activeSec.background = e.currentTarget.value as 'white' | 'tint')}>
								<option value="white">White</option>
								<option value="tint">Tint (light rose)</option>
							</select>
						</label>
						<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
							<input class={inp} value={activeSec.eyebrow ?? ''} oninput={(e) => (activeSec.eyebrow = e.currentTarget.value)} placeholder="Optional" />
						</label>
					</div>
					<label class="flex flex-col gap-1.5"><span class={lbl}>Title</span>
						<input class={inp} value={activeSec.title} oninput={(e) => (activeSec.title = e.currentTarget.value)} />
					</label>

					<!-- Content blocks -->
					<div>
						<p class="mb-2 {lbl}">Content Blocks</p>
						<div class="space-y-2">
							{#each activeSec.blocks as block (block.id)}
								<div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80">
									<div class="flex items-center gap-2 border-b border-zinc-100 bg-white px-3 py-2">
										{#if block.type === 'paragraph'}<AlignLeft size={13} class="shrink-0 text-zinc-400" />
										{:else if block.type === 'text'}<Type size={13} class="shrink-0 text-zinc-400" />
										{:else if block.type === 'image'}<Image size={13} class="shrink-0 text-zinc-400" />
										{:else}<List size={13} class="shrink-0 text-zinc-400" />{/if}
										<span class="text-xs font-semibold uppercase tracking-wide text-zinc-500">{blockTypeLabel[block.type]}</span>
										<button type="button" onclick={() => removeBlock(activeSec, block.id)}
											class="ml-auto rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600">
											<X size={12} />
										</button>
									</div>
									<div class="p-3">
										{#if block.type === 'paragraph'}
											<textarea class={ta} rows="3" placeholder="Paragraph content…"
												oninput={(e) => (block.content = e.currentTarget.value)}>{block.content ?? ''}</textarea>
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
											<input class={inp} value={block.content ?? ''} placeholder="Short text line…"
												oninput={(e) => (block.content = e.currentTarget.value)} />
										{:else if block.type === 'image'}
											<div class="space-y-2">
												<select class={inp} value={block.imageStyle ?? 'gallery'}
													onchange={(e) => (block.imageStyle = e.currentTarget.value as typeof block.imageStyle)}>
													<option value="gallery">Gallery (grid)</option>
													<option value="background">Background image</option>
													<option value="both">Both (bg + gallery)</option>
												</select>
												{#each (block.images ?? []) as img, ii (ii)}
													<div class="flex items-center gap-2">
														{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
														<input class={inp} value={img}
															oninput={(e) => { if (!block.images) block.images = []; block.images[ii] = e.currentTarget.value; }}
															placeholder="/uploads/image.jpg" />
														<button type="button" class={browseCls}
															onclick={() => pick((url) => { if (!block.images) block.images = []; block.images[ii] = url; })}>
															<ImagePlus size={13} />
														</button>
														<button type="button" onclick={() => { block.images = (block.images ?? []).filter((_, i) => i !== ii); }}
															class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
													</div>
												{/each}
												<div class="flex gap-2">
													<button type="button"
														onclick={() => { block.images = [...(block.images ?? []), '']; }}
														class="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700"><Plus size={12} /> Add URL</button>
													<button type="button"
														onclick={() => pick((url) => { block.images = [...(block.images ?? []), url]; })}
														class="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-rose-600"><ImagePlus size={12} /> Pick</button>
												</div>
											</div>
										{:else if block.type === 'bulletList'}
											<div class="space-y-2">
												{#each (block.items ?? []) as _item, bi (bi)}
													<div class="flex items-center gap-2">
														<input class={inp} value={block.items![bi]} placeholder="Bullet item…"
															oninput={(e) => { if (!block.items) block.items = []; block.items[bi] = e.currentTarget.value; }} />
														<button type="button" onclick={() => { block.items = (block.items ?? []).filter((_, i) => i !== bi); }}
															class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
													</div>
												{/each}
												<button type="button"
													onclick={() => { block.items = [...(block.items ?? []), '']; }}
													class="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700"><Plus size={12} /> Add bullet</button>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
						<div class="mt-3 flex flex-wrap gap-2">
							<span class="self-center text-xs text-zinc-400">Add block:</span>
							{#each (['paragraph', 'text', 'image', 'bulletList'] as SectionBlockType[]) as btype}
								<button type="button" onclick={() => addBlock(activeSec, btype)}
									class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 hover:border-rose-300 hover:text-rose-600">
									{#if btype === 'paragraph'}<AlignLeft size={11} />
									{:else if btype === 'text'}<Type size={11} />
									{:else if btype === 'image'}<Image size={11} />
									{:else}<List size={11} />{/if}
									{blockTypeLabel[btype]}
								</button>
							{/each}
						</div>
					</div>

					<!-- Optional CTA -->
					<div class="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-3">
						<label class="flex flex-col gap-1.5"><span class={lbl}>CTA Label</span>
							<input class={inp} value={activeSec.ctaLabel ?? ''} oninput={(e) => (activeSec.ctaLabel = e.currentTarget.value)} placeholder="Optional" />
						</label>
						<label class="flex flex-col gap-1.5"><span class={lbl}>CTA Link</span>
							<input class={inp} value={activeSec.ctaHref ?? ''} oninput={(e) => (activeSec.ctaHref = e.currentTarget.value)} placeholder="/contact" />
						</label>
					</div>

					<div class="flex justify-end">
						<button type="submit" class="rounded-xl px-4 py-2 text-sm font-semibold text-white
							{savedFlash ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}">
							{savedFlash ? '✓ Saved' : 'Save section'}
						</button>
					</div>
				</div>
			</form>
			{/if}

			{:else}
			<!-- ── Regular section form ───────────────────────────── -->
			<form id="main-save-form" method="POST" action="?/save"
				use:enhance={() => async ({ update, result }) => {
					await update({ reset: false });
					if ((result as { type: string }).type === 'success') flashSaved();
				}}>
				<input type="hidden" name="json" value={json} />

				{#if form?.error}
					<div class="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</div>
				{/if}

				<div class="p-4">
					<!-- aboutPage sub-sections -->
					{#if section === 'aboutPage'}
						{@const ap = s as {
							eyebrow: string; heading: string;
							heroBgImages: string[]; heroOverlay: string;
							ctaBgImages: string[]; ctaOverlay: string;
							whoTitle: string; whoBody: string;
							visionTitle: string; visionText: string;
							purposeEyebrow: string; purposeTitle: string; purposeSubtitle: string;
							purpose: Array<{ title: string; desc: string }>;
							collabEyebrow: string; collabTitle: string; collabSubtitle: string;
							stats: Array<{ value: string; label: string }>;
							testimonial: string; testimonialAuthor: string;
							ctaHeading: string; ctaText: string; ctaLabel: string; ctaHref: string;
						}}

						{#if activeSubSection === 'hero'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Hero</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
										<input class={inp} value={ap.eyebrow ?? ''} oninput={(e) => (ap.eyebrow = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Overlay</span>
										<select class={inp} value={ap.heroOverlay ?? 'medium'} onchange={(e) => (ap.heroOverlay = e.currentTarget.value)}>
											{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
										</select>
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Heading</span>
									<input class={inp} value={ap.heading ?? ''} oninput={(e) => (ap.heading = e.currentTarget.value)} />
								</label>
								<div>
									<p class="mb-2 {lbl}">Background Images</p>
									<div class="space-y-2">
										{#each ap.heroBgImages as img, i (i)}
											<div class="flex items-center gap-2">
												{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
												<input class={inp} value={img} oninput={(e) => (ap.heroBgImages[i] = e.currentTarget.value)} placeholder="/uploads/hero.jpg" />
												<button type="button" class={browseCls} onclick={() => pick((url) => (ap.heroBgImages[i] = url))}><ImagePlus size={13} /></button>
												<button type="button" onclick={() => ap.heroBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
											</div>
										{/each}
									</div>
									<div class="mt-2 flex gap-2">
										<button type="button" onclick={() => ap.heroBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
										<button type="button" onclick={() => pick((url) => ap.heroBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
									</div>
								</div>
							</div>

						{:else if activeSubSection === 'whoWeAre'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Who We Are</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Who Title</span>
										<input class={inp} value={ap.whoTitle ?? ''} oninput={(e) => (ap.whoTitle = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Vision Title</span>
										<input class={inp} value={ap.visionTitle ?? ''} oninput={(e) => (ap.visionTitle = e.currentTarget.value)} />
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Who Body</span>
									<textarea class={ta} rows="4" oninput={(e) => (ap.whoBody = e.currentTarget.value)}>{ap.whoBody ?? ''}</textarea>
								</label>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Vision Text</span>
									<textarea class={ta} rows="3" oninput={(e) => (ap.visionText = e.currentTarget.value)}>{ap.visionText ?? ''}</textarea>
								</label>
							</div>

						{:else if activeSubSection === 'purpose'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Purpose</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
										<input class={inp} value={ap.purposeEyebrow ?? ''} oninput={(e) => (ap.purposeEyebrow = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Title</span>
										<input class={inp} value={ap.purposeTitle ?? ''} oninput={(e) => (ap.purposeTitle = e.currentTarget.value)} />
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Subtitle</span>
									<textarea class={ta} rows="2" oninput={(e) => (ap.purposeSubtitle = e.currentTarget.value)}>{ap.purposeSubtitle ?? ''}</textarea>
								</label>
								<div>
									<p class="mb-2 {lbl}">Purpose Items</p>
									<div class="space-y-2">
										{#each ap.purpose as item, i (i)}
											<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
												<div class="flex items-start gap-2">
													<input class={inp} value={item.title} oninput={(e) => (item.title = e.currentTarget.value)} placeholder="Purpose title" />
													<button type="button" onclick={() => ap.purpose.splice(i, 1)} class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
												</div>
												<textarea class={ta} rows="2" oninput={(e) => (item.desc = e.currentTarget.value)} placeholder="Description">{item.desc}</textarea>
											</div>
										{/each}
									</div>
									<button type="button" onclick={() => ap.purpose.push({ title: '', desc: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add item</button>
								</div>
							</div>

						{:else if activeSubSection === 'collabStats'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Collaboration & Stats</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
										<input class={inp} value={ap.collabEyebrow ?? ''} oninput={(e) => (ap.collabEyebrow = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Title</span>
										<input class={inp} value={ap.collabTitle ?? ''} oninput={(e) => (ap.collabTitle = e.currentTarget.value)} />
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Subtitle</span>
									<textarea class={ta} rows="2" oninput={(e) => (ap.collabSubtitle = e.currentTarget.value)}>{ap.collabSubtitle ?? ''}</textarea>
								</label>
								<div>
									<p class="mb-2 {lbl}">Stats</p>
									<div class="space-y-2">
										{#each ap.stats as stat, i (i)}
											<div class="flex items-center gap-2">
												<input class={inp} value={stat.value} oninput={(e) => (stat.value = e.currentTarget.value)} placeholder="5,000+" />
												<input class={inp} value={stat.label} oninput={(e) => (stat.label = e.currentTarget.value)} placeholder="Students helped" />
												<button type="button" onclick={() => ap.stats.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
											</div>
										{/each}
									</div>
									<button type="button" onclick={() => ap.stats.push({ value: '', label: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add stat</button>
								</div>
							</div>

						{:else if activeSubSection === 'testimonial'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Testimonial</p>
							<div class="space-y-4">
								<label class="flex flex-col gap-1.5"><span class={lbl}>Quote</span>
									<textarea class={ta} rows="3" oninput={(e) => (ap.testimonial = e.currentTarget.value)}>{ap.testimonial ?? ''}</textarea>
								</label>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Author</span>
									<input class={inp} value={ap.testimonialAuthor ?? ''} oninput={(e) => (ap.testimonialAuthor = e.currentTarget.value)} placeholder="Name, Role" />
								</label>
							</div>

						{:else if activeSubSection === 'cta'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Call to Action</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Heading</span>
										<input class={inp} value={ap.ctaHeading ?? ''} oninput={(e) => (ap.ctaHeading = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Overlay</span>
										<select class={inp} value={ap.ctaOverlay ?? 'medium'} onchange={(e) => (ap.ctaOverlay = e.currentTarget.value)}>
											{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
										</select>
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Body Text</span>
									<textarea class={ta} rows="2" oninput={(e) => (ap.ctaText = e.currentTarget.value)}>{ap.ctaText ?? ''}</textarea>
								</label>
								<div>
									<p class="mb-2 {lbl}">Background Images</p>
									<div class="space-y-2">
										{#each ap.ctaBgImages as img, i (i)}
											<div class="flex items-center gap-2">
												{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
												<input class={inp} value={img} oninput={(e) => (ap.ctaBgImages[i] = e.currentTarget.value)} placeholder="/uploads/cta.jpg" />
												<button type="button" class={browseCls} onclick={() => pick((url) => (ap.ctaBgImages[i] = url))}><ImagePlus size={13} /></button>
												<button type="button" onclick={() => ap.ctaBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
											</div>
										{/each}
									</div>
									<div class="mt-2 flex gap-2">
										<button type="button" onclick={() => ap.ctaBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
										<button type="button" onclick={() => pick((url) => ap.ctaBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Button Label</span>
										<input class={inp} value={ap.ctaLabel ?? ''} oninput={(e) => (ap.ctaLabel = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Button Link</span>
										<input class={inp} value={ap.ctaHref ?? ''} oninput={(e) => (ap.ctaHref = e.currentTarget.value)} placeholder="/contact" />
									</label>
								</div>
							</div>

						{:else if activeSubSection === 'customSections'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Custom Sections</p>
							<CustomSectionsEditor bind:sections={aboutCustom} formAction="?/customSections" pageKey="about" />
						{/if}

					<!-- setemPage sub-sections -->
					{:else if section === 'setemPage'}
						{@const sp = s as {
							eyebrow: string; heading: string; subtext: string;
							heroBgImages: string[]; heroOverlay: string;
							ctaBgImages: string[]; ctaOverlay: string;
							gapEyebrow: string; gapTitle: string; gapSubtitle: string;
							gapStats: Array<{ value: string; label: string }>;
							whatEyebrow: string; whatTitle: string; whatBody: string;
							expectTitle: string; expect: string[];
							audienceEyebrow: string; audienceTitle: string;
							audience: Array<{ title: string; desc: string }>;
							processEyebrow: string; processTitle: string;
							steps: Array<{ title: string; desc: string }>;
							ctaHeading: string; ctaText: string; ctaLabel: string; ctaHref: string;
						}}

						{#if activeSubSection === 'hero'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Hero</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
										<input class={inp} value={sp.eyebrow ?? ''} oninput={(e) => (sp.eyebrow = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Overlay</span>
										<select class={inp} value={sp.heroOverlay ?? 'medium'} onchange={(e) => (sp.heroOverlay = e.currentTarget.value)}>
											{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
										</select>
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Heading</span>
									<input class={inp} value={sp.heading ?? ''} oninput={(e) => (sp.heading = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Subtext</span>
									<textarea class={ta} rows="2" oninput={(e) => (sp.subtext = e.currentTarget.value)}>{sp.subtext ?? ''}</textarea>
								</label>
								<div>
									<p class="mb-2 {lbl}">Background Images</p>
									<div class="space-y-2">
										{#each sp.heroBgImages as img, i (i)}
											<div class="flex items-center gap-2">
												{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
												<input class={inp} value={img} oninput={(e) => (sp.heroBgImages[i] = e.currentTarget.value)} placeholder="/uploads/hero.jpg" />
												<button type="button" class={browseCls} onclick={() => pick((url) => (sp.heroBgImages[i] = url))}><ImagePlus size={13} /></button>
												<button type="button" onclick={() => sp.heroBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
											</div>
										{/each}
									</div>
									<div class="mt-2 flex gap-2">
										<button type="button" onclick={() => sp.heroBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
										<button type="button" onclick={() => pick((url) => sp.heroBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
									</div>
								</div>
							</div>

						{:else if activeSubSection === 'gap'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">The Gap</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
										<input class={inp} value={sp.gapEyebrow ?? ''} oninput={(e) => (sp.gapEyebrow = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Title</span>
										<input class={inp} value={sp.gapTitle ?? ''} oninput={(e) => (sp.gapTitle = e.currentTarget.value)} />
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Subtitle</span>
									<textarea class={ta} rows="2" oninput={(e) => (sp.gapSubtitle = e.currentTarget.value)}>{sp.gapSubtitle ?? ''}</textarea>
								</label>
								<div>
									<p class="mb-2 {lbl}">Gap Stats</p>
									<div class="space-y-2">
										{#each sp.gapStats as stat, i (i)}
											<div class="flex items-center gap-2">
												<input class={inp} value={stat.value} oninput={(e) => (stat.value = e.currentTarget.value)} placeholder="1 in 5" />
												<input class={inp} value={stat.label} oninput={(e) => (stat.label = e.currentTarget.value)} placeholder="children struggle" />
												<button type="button" onclick={() => sp.gapStats.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
											</div>
										{/each}
									</div>
									<button type="button" onclick={() => sp.gapStats.push({ value: '', label: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add stat</button>
								</div>
							</div>

						{:else if activeSubSection === 'whatIsSetem'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">What Is SETEM</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
										<input class={inp} value={sp.whatEyebrow ?? ''} oninput={(e) => (sp.whatEyebrow = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Title</span>
										<input class={inp} value={sp.whatTitle ?? ''} oninput={(e) => (sp.whatTitle = e.currentTarget.value)} />
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Body</span>
									<textarea class={ta} rows="4" oninput={(e) => (sp.whatBody = e.currentTarget.value)}>{sp.whatBody ?? ''}</textarea>
								</label>
							</div>

						{:else if activeSubSection === 'whatToExpect'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">What to Expect</p>
							<div class="space-y-4">
								<label class="flex flex-col gap-1.5"><span class={lbl}>Section Title</span>
									<input class={inp} value={sp.expectTitle ?? ''} oninput={(e) => (sp.expectTitle = e.currentTarget.value)} />
								</label>
								<div>
									<p class="mb-2 {lbl}">Expectations</p>
									<div class="space-y-2">
										{#each sp.expect as item, i (i)}
											<div class="flex items-center gap-2">
												<input class={inp} value={item} oninput={(e) => (sp.expect[i] = e.currentTarget.value)} placeholder="Expectation…" />
												<button type="button" onclick={() => sp.expect.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
											</div>
										{/each}
									</div>
									<button type="button" onclick={() => sp.expect.push('')} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add item</button>
								</div>
							</div>

						{:else if activeSubSection === 'whoIsItFor'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Who Is It For</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
										<input class={inp} value={sp.audienceEyebrow ?? ''} oninput={(e) => (sp.audienceEyebrow = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Title</span>
										<input class={inp} value={sp.audienceTitle ?? ''} oninput={(e) => (sp.audienceTitle = e.currentTarget.value)} />
									</label>
								</div>
								<div>
									<p class="mb-2 {lbl}">Audience Groups</p>
									<div class="space-y-2">
										{#each sp.audience as item, i (i)}
											<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
												<div class="flex items-start gap-2">
													<input class={inp} value={item.title} oninput={(e) => (item.title = e.currentTarget.value)} placeholder="Group name" />
													<button type="button" onclick={() => sp.audience.splice(i, 1)} class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
												</div>
												<textarea class={ta} rows="2" oninput={(e) => (item.desc = e.currentTarget.value)} placeholder="Description">{item.desc}</textarea>
											</div>
										{/each}
									</div>
									<button type="button" onclick={() => sp.audience.push({ title: '', desc: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add group</button>
								</div>
							</div>

						{:else if activeSubSection === 'ourProcess'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Our Process</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
										<input class={inp} value={sp.processEyebrow ?? ''} oninput={(e) => (sp.processEyebrow = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Title</span>
										<input class={inp} value={sp.processTitle ?? ''} oninput={(e) => (sp.processTitle = e.currentTarget.value)} />
									</label>
								</div>
								<div>
									<p class="mb-2 {lbl}">Steps</p>
									<div class="space-y-2">
										{#each sp.steps as step, i (i)}
											<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
												<div class="flex items-start gap-2">
													<input class={inp} value={step.title} oninput={(e) => (step.title = e.currentTarget.value)} placeholder="Step name" />
													<button type="button" onclick={() => sp.steps.splice(i, 1)} class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
												</div>
												<textarea class={ta} rows="2" oninput={(e) => (step.desc = e.currentTarget.value)} placeholder="Description">{step.desc}</textarea>
											</div>
										{/each}
									</div>
									<button type="button" onclick={() => sp.steps.push({ title: '', desc: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add step</button>
								</div>
							</div>

						{:else if activeSubSection === 'cta'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Call to Action</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Heading</span>
										<input class={inp} value={sp.ctaHeading ?? ''} oninput={(e) => (sp.ctaHeading = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Overlay</span>
										<select class={inp} value={sp.ctaOverlay ?? 'medium'} onchange={(e) => (sp.ctaOverlay = e.currentTarget.value)}>
											{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
										</select>
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Body Text</span>
									<textarea class={ta} rows="2" oninput={(e) => (sp.ctaText = e.currentTarget.value)}>{sp.ctaText ?? ''}</textarea>
								</label>
								<div>
									<p class="mb-2 {lbl}">Background Images</p>
									<div class="space-y-2">
										{#each sp.ctaBgImages as img, i (i)}
											<div class="flex items-center gap-2">
												{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
												<input class={inp} value={img} oninput={(e) => (sp.ctaBgImages[i] = e.currentTarget.value)} placeholder="/uploads/cta.jpg" />
												<button type="button" class={browseCls} onclick={() => pick((url) => (sp.ctaBgImages[i] = url))}><ImagePlus size={13} /></button>
												<button type="button" onclick={() => sp.ctaBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
											</div>
										{/each}
									</div>
									<div class="mt-2 flex gap-2">
										<button type="button" onclick={() => sp.ctaBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
										<button type="button" onclick={() => pick((url) => sp.ctaBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Button Label</span>
										<input class={inp} value={sp.ctaLabel ?? ''} oninput={(e) => (sp.ctaLabel = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Button Link</span>
										<input class={inp} value={sp.ctaHref ?? ''} oninput={(e) => (sp.ctaHref = e.currentTarget.value)} placeholder="/contact" />
									</label>
								</div>
							</div>

						{:else if activeSubSection === 'customSections'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Custom Sections</p>
							<CustomSectionsEditor bind:sections={setemCustom} formAction="?/customSections" pageKey="setem" />
						{/if}

					<!-- csrPage sub-sections -->
					{:else if section === 'csrPage'}
						{@const cp = s as {
							eyebrow: string; heading: string; subtext: string;
							heroBgImages: string[]; heroOverlay: string;
							ctaBgImages: string[]; ctaOverlay: string;
							stories: Array<{ title: string; date: string; category: string; excerpt: string; cover?: string; images?: string[] }>;
							ctaHeading: string; ctaText: string; ctaLabel: string; ctaHref: string;
						}}

						{#if activeSubSection === 'hero'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Hero</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Eyebrow</span>
										<input class={inp} value={cp.eyebrow ?? ''} oninput={(e) => (cp.eyebrow = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Overlay</span>
										<select class={inp} value={cp.heroOverlay ?? 'medium'} onchange={(e) => (cp.heroOverlay = e.currentTarget.value)}>
											{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
										</select>
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Heading</span>
									<input class={inp} value={cp.heading ?? ''} oninput={(e) => (cp.heading = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Subtext</span>
									<textarea class={ta} rows="2" oninput={(e) => (cp.subtext = e.currentTarget.value)}>{cp.subtext ?? ''}</textarea>
								</label>
								<div>
									<p class="mb-2 {lbl}">Background Images</p>
									<div class="space-y-2">
										{#each cp.heroBgImages as img, i (i)}
											<div class="flex items-center gap-2">
												{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
												<input class={inp} value={img} oninput={(e) => (cp.heroBgImages[i] = e.currentTarget.value)} placeholder="/uploads/hero.jpg" />
												<button type="button" class={browseCls} onclick={() => pick((url) => (cp.heroBgImages[i] = url))}><ImagePlus size={13} /></button>
												<button type="button" onclick={() => cp.heroBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
											</div>
										{/each}
									</div>
									<div class="mt-2 flex gap-2">
										<button type="button" onclick={() => cp.heroBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
										<button type="button" onclick={() => pick((url) => cp.heroBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
									</div>
								</div>
							</div>

						{:else if activeSubSection === 'stories'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">CSR Stories</p>
							<div class="space-y-3">
								<div class="flex items-center justify-between">
									<span class="text-sm text-zinc-500">{cp.stories.length} {cp.stories.length === 1 ? 'story' : 'stories'}</span>
									<button type="button"
										onclick={() => { cp.stories.push({ title: '', date: '', category: '', excerpt: '', cover: '', images: [] }); csrEditIdx = cp.stories.length - 1; }}
										class="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700">
										<Plus size={13} /> Add story
									</button>
								</div>
								{#each cp.stories as story, i (i)}
									<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
										<div class="flex items-center justify-between bg-zinc-50 border-b border-zinc-100 px-4 py-2.5">
											<div class="flex items-center gap-2 min-w-0">
												{#if isImg(story.cover ?? '')}<img src={story.cover} alt="" class="h-7 w-7 rounded-lg border border-zinc-200 object-cover shrink-0" />{/if}
												<div class="min-w-0">
													<p class="truncate text-sm font-medium text-zinc-900">{story.title || '(untitled)'}</p>
													<p class="text-xs text-zinc-400">{story.date || 'No date'}</p>
												</div>
											</div>
											<div class="flex shrink-0 items-center gap-1.5 ml-2">
												<button type="button" onclick={() => (csrEditIdx = csrEditIdx === i ? null : i)}
													class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50">
													<Pencil size={11} /> {csrEditIdx === i ? 'Close' : 'Edit'}
												</button>
												<button type="button"
													onclick={() => { if (confirm('Delete this story?')) { cp.stories.splice(i, 1); if (csrEditIdx === i) csrEditIdx = null; } }}
													class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
													<Trash2 size={11} />
												</button>
											</div>
										</div>
										{#if csrEditIdx === i}
											<div class="space-y-4 p-4">
												<div class="grid grid-cols-2 gap-3">
													<label class="flex flex-col gap-1.5"><span class={lbl}>Title</span>
														<input class={inp} value={story.title} oninput={(e) => (story.title = e.currentTarget.value)} placeholder="Story title" />
													</label>
													<label class="flex flex-col gap-1.5"><span class={lbl}>Category</span>
														<input class={inp} value={story.category} oninput={(e) => (story.category = e.currentTarget.value)} placeholder="Education" />
													</label>
												</div>
												<div class="grid grid-cols-2 gap-3">
													<label class="flex flex-col gap-1.5"><span class={lbl}>Date</span>
														<input class={inp} type="date" value={story.date} oninput={(e) => (story.date = e.currentTarget.value)} />
													</label>
													<div class="flex flex-col gap-1.5"><span class={lbl}>Cover Image</span>
														<div class="flex items-center gap-2">
															{#if isImg(story.cover ?? '')}<img src={story.cover} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
															<input class={inp} value={story.cover ?? ''} oninput={(e) => (story.cover = e.currentTarget.value)} placeholder="/uploads/cover.jpg" />
															<button type="button" class={browseCls} onclick={() => pick((url) => (story.cover = url))}><ImagePlus size={13} /></button>
														</div>
													</div>
												</div>
												<label class="flex flex-col gap-1.5"><span class={lbl}>Excerpt</span>
													<textarea class={ta} rows="3" oninput={(e) => (story.excerpt = e.currentTarget.value)} placeholder="Short summary…">{story.excerpt}</textarea>
												</label>
												<div>
													<p class="mb-2 {lbl}">Gallery Images</p>
													<div class="space-y-2">
														{#each (story.images ?? []) as gImg, gi (gi)}
															<div class="flex items-center gap-2">
																{#if isImg(gImg)}<img src={gImg} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
																<input class={inp} value={gImg} oninput={(e) => { if (!story.images) story.images = []; story.images[gi] = e.currentTarget.value; }} placeholder="/uploads/gallery.jpg" />
																<button type="button" class={browseCls} onclick={() => pick((url) => { if (!story.images) story.images = []; story.images[gi] = url; })}><ImagePlus size={13} /></button>
																<button type="button" onclick={() => story.images?.splice(gi, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
															</div>
														{/each}
													</div>
													<div class="mt-2 flex gap-2">
														<button type="button" onclick={() => { if (!story.images) story.images = []; story.images.push(''); }} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
														<button type="button" onclick={() => pick((url) => { if (!story.images) story.images = []; story.images.push(url); })} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
													</div>
												</div>
											</div>
										{/if}
									</div>
								{/each}
								{#if cp.stories.length === 0}
									<div class="rounded-2xl border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">No stories yet — add the first one above.</div>
								{/if}
							</div>

						{:else if activeSubSection === 'cta'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Call to Action</p>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Heading</span>
										<input class={inp} value={cp.ctaHeading ?? ''} oninput={(e) => (cp.ctaHeading = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Overlay</span>
										<select class={inp} value={cp.ctaOverlay ?? 'medium'} onchange={(e) => (cp.ctaOverlay = e.currentTarget.value)}>
											{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
										</select>
									</label>
								</div>
								<label class="flex flex-col gap-1.5"><span class={lbl}>Body Text</span>
									<textarea class={ta} rows="2" oninput={(e) => (cp.ctaText = e.currentTarget.value)}>{cp.ctaText ?? ''}</textarea>
								</label>
								<div>
									<p class="mb-2 {lbl}">Background Images</p>
									<div class="space-y-2">
										{#each cp.ctaBgImages as img, i (i)}
											<div class="flex items-center gap-2">
												{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
												<input class={inp} value={img} oninput={(e) => (cp.ctaBgImages[i] = e.currentTarget.value)} placeholder="/uploads/cta.jpg" />
												<button type="button" class={browseCls} onclick={() => pick((url) => (cp.ctaBgImages[i] = url))}><ImagePlus size={13} /></button>
												<button type="button" onclick={() => cp.ctaBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
											</div>
										{/each}
									</div>
									<div class="mt-2 flex gap-2">
										<button type="button" onclick={() => cp.ctaBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
										<button type="button" onclick={() => pick((url) => cp.ctaBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<label class="flex flex-col gap-1.5"><span class={lbl}>Button Label</span>
										<input class={inp} value={cp.ctaLabel ?? ''} oninput={(e) => (cp.ctaLabel = e.currentTarget.value)} />
									</label>
									<label class="flex flex-col gap-1.5"><span class={lbl}>Button Link</span>
										<input class={inp} value={cp.ctaHref ?? ''} oninput={(e) => (cp.ctaHref = e.currentTarget.value)} placeholder="/contact" />
									</label>
								</div>
							</div>

						{:else if activeSubSection === 'customSections'}
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Custom Sections</p>
							<CustomSectionsEditor bind:sections={csrCustom} formAction="?/customSections" pageKey="csr" />
						{/if}
					{/if}

					<!-- Save button at bottom of form -->
					<div class="mt-6 flex justify-end">
						<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedFlash ? '!bg-emerald-600' : ''}">
							{savedFlash ? '✓ Saved' : 'Save changes'}
						</button>
					</div>
				</div>
			</form>
			{/if}
		</div>
	</div>

	<!-- Right panel: live preview -->
	<div class="relative flex flex-1 flex-col overflow-hidden bg-zinc-100">
		<div class="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
			<span class="text-xs font-medium text-zinc-500">Live Preview</span>
			<button type="button" onclick={refreshPreview}
				class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:text-zinc-700">
				<RefreshCw size={12} /> Refresh
			</button>
		</div>
		<div class="relative flex-1 overflow-hidden">
			<iframe bind:this={previewIframe} src={pagePreviewPath} title="Page preview"
				class="absolute left-0 top-0 origin-top-left border-0"
				style="width: 1280px; height: calc(100% / 0.6); transform: scale(0.6);"
				loading="lazy"></iframe>
		</div>
	</div>
</div>

{:else}
<!-- ── Simple layout for single-field sections (brand, nav, footer, etc.) ── -->
<div class="space-y-6 pb-16">
	<div class="flex items-center gap-3">
		<a href="/hub/admin/site" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">
			<ArrowLeft size={16} /> Site
		</a>
		<span class="text-zinc-300">/</span>
		<h1 class="text-xl font-bold text-zinc-900">{sectionLabel[section] ?? section}</h1>
	</div>

	{#if form?.error}
		<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</div>
	{/if}

	<form method="POST" action="?/save">
		<input type="hidden" name="json" value={json} />

		<!-- ── brand ──────────────────────────────────────────── -->
		{#if section === 'brand'}
			{@const b = s as { name: string; accentWord: string; logoImage?: string }}
			<div class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Brand Name</span>
						<input
							class={inp}
							value={b.name ?? ''}
							oninput={(e) => (b.name = e.currentTarget.value)}
							placeholder="HOME CAKNA"
						/>
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Accent Word <span class="font-normal text-zinc-400">(highlighted in rose)</span></span>
						<input
							class={inp}
							value={b.accentWord ?? ''}
							oninput={(e) => (b.accentWord = e.currentTarget.value)}
							placeholder="CAKNA"
						/>
					</label>
				</div>
				<div class="flex flex-col gap-1.5">
					<span class={lbl}>Logo Image <span class="font-normal text-zinc-400">(optional)</span></span>
					<div class="flex items-center gap-2">
						{#if isImg(b.logoImage ?? '')}
							<img src={b.logoImage} alt="logo" class={thumbCls} />
						{:else}
							<div class={emptyThumbCls}></div>
						{/if}
						<input
							class={inp}
							value={b.logoImage ?? ''}
							oninput={(e) => (b.logoImage = e.currentTarget.value)}
							placeholder="/uploads/logo.png"
						/>
						<button type="button" class={browseCls} onclick={() => pick((url) => (b.logoImage = url))}>
							<ImagePlus size={13} /> Browse
						</button>
					</div>
				</div>
			</div>

		<!-- ── nav ────────────────────────────────────────────── -->
		{:else if section === 'nav'}
			{@const nav = s as Array<{ label: string; href: string }>}
			<div class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6">
				<div>
					<p class="text-sm font-semibold text-zinc-800">Navigation Links</p>
					<p class="mt-0.5 text-xs text-zinc-500">
						These links appear in the public website navigation bar.
					</p>
				</div>
				<div class="space-y-2 pt-1">
					{#each nav as link, i (i)}
						<div class="flex items-center gap-2">
							<input
								class={inp}
								value={link.label}
								oninput={(e) => (link.label = e.currentTarget.value)}
								placeholder="About Us"
							/>
							<input
								class={inp}
								value={link.href}
								oninput={(e) => (link.href = e.currentTarget.value)}
								placeholder="/about"
							/>
							<button
								type="button"
								onclick={() => nav.splice(i, 1)}
								class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
							>
								<Trash2 size={14} />
							</button>
						</div>
					{/each}
				</div>
				<button
					type="button"
					onclick={() => nav.push({ label: '', href: '' })}
					class="mt-1 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"
				>
					<Plus size={14} /> Add link
				</button>
			</div>

		<!-- ── hero ───────────────────────────────────────────── -->
		{:else if section === 'hero'}
			{@const h = s as {
				eyebrow: string;
				heading: string;
				subtext: string;
				bgImages: string[];
				overlay: string;
				primaryCta: { label: string; href: string };
				secondaryCta: { label: string; href: string };
			}}
			<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Eyebrow</span>
						<input class={inp} value={h.eyebrow ?? ''} oninput={(e) => (h.eyebrow = e.currentTarget.value)} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Image Overlay</span>
						<select class={inp} value={h.overlay ?? 'medium'} onchange={(e) => (h.overlay = e.currentTarget.value)}>
							{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
						</select>
					</label>
				</div>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Heading</span>
					<input class={inp} value={h.heading ?? ''} oninput={(e) => (h.heading = e.currentTarget.value)} />
				</label>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Subtext</span>
					<textarea class={ta} rows="3" oninput={(e) => (h.subtext = e.currentTarget.value)}>{h.subtext ?? ''}</textarea>
				</label>
				<!-- Background images -->
				<div>
					<p class="mb-2 text-sm font-medium text-zinc-700">Background Images <span class="font-normal text-zinc-400">(slideshow, optional)</span></p>
					<div class="space-y-2">
						{#each h.bgImages as img, i (i)}
							<div class="flex items-center gap-2">
								{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
								<input class={inp} value={img} oninput={(e) => (h.bgImages[i] = e.currentTarget.value)} placeholder="/uploads/hero-bg.jpg" />
								<button type="button" class={browseCls} onclick={() => pick((url) => (h.bgImages[i] = url))}><ImagePlus size={13} /></button>
								<button type="button" onclick={() => h.bgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
							</div>
						{/each}
					</div>
					<div class="mt-2 flex items-center gap-2">
						<button type="button" onclick={() => h.bgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
						<button type="button" onclick={() => pick((url) => h.bgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick from media</button>
					</div>
				</div>
				<div class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-2">
						<p class="text-sm font-medium text-zinc-700">Primary CTA</p>
						<input class={inp} value={h.primaryCta?.label ?? ''} oninput={(e) => (h.primaryCta.label = e.currentTarget.value)} placeholder="Button label" />
						<input class={inp} value={h.primaryCta?.href ?? ''} oninput={(e) => (h.primaryCta.href = e.currentTarget.value)} placeholder="/register" />
					</div>
					<div class="space-y-2">
						<p class="text-sm font-medium text-zinc-700">Secondary CTA</p>
						<input class={inp} value={h.secondaryCta?.label ?? ''} oninput={(e) => (h.secondaryCta.label = e.currentTarget.value)} placeholder="Button label" />
						<input class={inp} value={h.secondaryCta?.href ?? ''} oninput={(e) => (h.secondaryCta.href = e.currentTarget.value)} placeholder="#programs" />
					</div>
				</div>
			</div>

		<!-- ── about ──────────────────────────────────────────── -->
		{:else if section === 'about'}
			{@const a = s as {
				eyebrow: string;
				title: string;
				body: string;
				quote: string;
				quoteSub: string;
				quoteBgImages: string[];
				quoteOverlay: string;
			}}
			<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Eyebrow</span>
						<input class={inp} value={a.eyebrow ?? ''} oninput={(e) => (a.eyebrow = e.currentTarget.value)} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Title</span>
						<input class={inp} value={a.title ?? ''} oninput={(e) => (a.title = e.currentTarget.value)} />
					</label>
				</div>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Body <span class="font-normal text-zinc-400">(blank line = new paragraph)</span></span>
					<textarea class={ta} rows="5" oninput={(e) => (a.body = e.currentTarget.value)}>{a.body ?? ''}</textarea>
				</label>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Pull Quote</span>
					<textarea class={ta} rows="2" oninput={(e) => (a.quote = e.currentTarget.value)}>{a.quote ?? ''}</textarea>
				</label>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Quote Subtitle</span>
					<input class={inp} value={a.quoteSub ?? ''} oninput={(e) => (a.quoteSub = e.currentTarget.value)} />
				</label>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<p class="mb-2 text-sm font-medium text-zinc-700">Quote Background Images</p>
						<div class="space-y-2">
							{#each a.quoteBgImages as img, i (i)}
								<div class="flex items-center gap-2">
									{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
									<input class={inp} value={img} oninput={(e) => (a.quoteBgImages[i] = e.currentTarget.value)} placeholder="/uploads/quote-bg.jpg" />
									<button type="button" class={browseCls} onclick={() => pick((url) => (a.quoteBgImages[i] = url))}><ImagePlus size={13} /></button>
									<button type="button" onclick={() => a.quoteBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
								</div>
							{/each}
						</div>
						<div class="mt-2 flex items-center gap-2">
							<button type="button" onclick={() => a.quoteBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
							<button type="button" onclick={() => pick((url) => a.quoteBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick from media</button>
						</div>
					</div>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Quote Overlay</span>
						<select class={inp} value={a.quoteOverlay ?? 'medium'} onchange={(e) => (a.quoteOverlay = e.currentTarget.value)}>
							{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
						</select>
					</label>
				</div>
			</div>

		<!-- ── programs section ───────────────────────────────── -->
		{:else if section === 'programs'}
			{@const p = s as { eyebrow: string; title: string; subtitle: string; ctaLabel: string; ctaHref: string }}
			<div class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Eyebrow</span>
						<input class={inp} value={p.eyebrow ?? ''} oninput={(e) => (p.eyebrow = e.currentTarget.value)} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Title</span>
						<input class={inp} value={p.title ?? ''} oninput={(e) => (p.title = e.currentTarget.value)} />
					</label>
				</div>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Subtitle</span>
					<textarea class={ta} rows="2" oninput={(e) => (p.subtitle = e.currentTarget.value)}>{p.subtitle ?? ''}</textarea>
				</label>
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>CTA Label</span>
						<input class={inp} value={p.ctaLabel ?? ''} oninput={(e) => (p.ctaLabel = e.currentTarget.value)} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>CTA Link</span>
						<input class={inp} value={p.ctaHref ?? ''} oninput={(e) => (p.ctaHref = e.currentTarget.value)} placeholder="/core" />
					</label>
				</div>
			</div>

		<!-- ── impact ─────────────────────────────────────────── -->
		{:else if section === 'impact'}
			{@const im = s as { eyebrow: string; title: string; subtitle: string; stats: Array<{ value: string; label: string }> }}
			<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Eyebrow</span>
						<input class={inp} value={im.eyebrow ?? ''} oninput={(e) => (im.eyebrow = e.currentTarget.value)} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Title</span>
						<input class={inp} value={im.title ?? ''} oninput={(e) => (im.title = e.currentTarget.value)} />
					</label>
				</div>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Subtitle</span>
					<textarea class={ta} rows="2" oninput={(e) => (im.subtitle = e.currentTarget.value)}>{im.subtitle ?? ''}</textarea>
				</label>
				<div>
					<p class="mb-2 text-sm font-medium text-zinc-700">Impact Stats</p>
					<div class="space-y-2">
						{#each im.stats as stat, i (i)}
							<div class="flex items-center gap-2">
								<input class={inp} value={stat.value} oninput={(e) => (stat.value = e.currentTarget.value)} placeholder="5,000+" />
								<input class={inp} value={stat.label} oninput={(e) => (stat.label = e.currentTarget.value)} placeholder="Students helped" />
								<button type="button" onclick={() => im.stats.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
							</div>
						{/each}
					</div>
					<button type="button" onclick={() => im.stats.push({ value: '', label: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">
						<Plus size={14} /> Add stat
					</button>
				</div>
			</div>

		<!-- ── cta ────────────────────────────────────────────── -->
		{:else if section === 'cta'}
			{@const c = s as {
				heading: string;
				body: string;
				bgImages: string[];
				overlay: string;
				primaryCta: { label: string; href: string };
				secondaryCta: { label: string; href: string };
			}}
			<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Heading</span>
						<input class={inp} value={c.heading ?? ''} oninput={(e) => (c.heading = e.currentTarget.value)} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Image Overlay</span>
						<select class={inp} value={c.overlay ?? 'medium'} onchange={(e) => (c.overlay = e.currentTarget.value)}>
							{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
						</select>
					</label>
				</div>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Body</span>
					<textarea class={ta} rows="3" oninput={(e) => (c.body = e.currentTarget.value)}>{c.body ?? ''}</textarea>
				</label>
				<div>
					<p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p>
					<div class="space-y-2">
						{#each c.bgImages as img, i (i)}
							<div class="flex items-center gap-2">
								{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
								<input class={inp} value={img} oninput={(e) => (c.bgImages[i] = e.currentTarget.value)} placeholder="/uploads/cta-bg.jpg" />
								<button type="button" class={browseCls} onclick={() => pick((url) => (c.bgImages[i] = url))}><ImagePlus size={13} /></button>
								<button type="button" onclick={() => c.bgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
							</div>
						{/each}
					</div>
					<div class="mt-2 flex items-center gap-2">
						<button type="button" onclick={() => c.bgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
						<button type="button" onclick={() => pick((url) => c.bgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick from media</button>
					</div>
				</div>
				<div class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-2">
						<p class="text-sm font-medium text-zinc-700">Primary CTA</p>
						<input class={inp} value={c.primaryCta?.label ?? ''} oninput={(e) => (c.primaryCta.label = e.currentTarget.value)} placeholder="Button label" />
						<input class={inp} value={c.primaryCta?.href ?? ''} oninput={(e) => (c.primaryCta.href = e.currentTarget.value)} placeholder="/register" />
					</div>
					<div class="space-y-2">
						<p class="text-sm font-medium text-zinc-700">Secondary CTA</p>
						<input class={inp} value={c.secondaryCta?.label ?? ''} oninput={(e) => (c.secondaryCta.label = e.currentTarget.value)} placeholder="Button label" />
						<input class={inp} value={c.secondaryCta?.href ?? ''} oninput={(e) => (c.secondaryCta.href = e.currentTarget.value)} placeholder="/auth/login" />
					</div>
				</div>
			</div>

		<!-- ── footer ─────────────────────────────────────────── -->
		{:else if section === 'footer'}
			{@const f = s as { tagline: string; phone: string; email: string; copyright: string }}
			<div class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Tagline</span>
					<textarea class={ta} rows="2" oninput={(e) => (f.tagline = e.currentTarget.value)}>{f.tagline ?? ''}</textarea>
				</label>
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Phone</span>
						<input class={inp} value={f.phone ?? ''} oninput={(e) => (f.phone = e.currentTarget.value)} placeholder="011-2111 0110" />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Email</span>
						<input class={inp} type="email" value={f.email ?? ''} oninput={(e) => (f.email = e.currentTarget.value)} placeholder="info@home.edu.my" />
					</label>
				</div>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Copyright</span>
					<input class={inp} value={f.copyright ?? ''} oninput={(e) => (f.copyright = e.currentTarget.value)} />
				</label>
			</div>

		<!-- ── homeGallery ────────────────────────────────────── -->
		{:else if section === 'homeGallery'}
			{@const g = s as { eyebrow: string; title: string; subtitle: string; images: string[] }}
			<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Eyebrow</span>
						<input class={inp} value={g.eyebrow ?? ''} oninput={(e) => (g.eyebrow = e.currentTarget.value)} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Title</span>
						<input class={inp} value={g.title ?? ''} oninput={(e) => (g.title = e.currentTarget.value)} />
					</label>
				</div>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Subtitle</span>
					<textarea class={ta} rows="2" oninput={(e) => (g.subtitle = e.currentTarget.value)}>{g.subtitle ?? ''}</textarea>
				</label>
				<div>
					<p class="mb-2 text-sm font-medium text-zinc-700">Gallery Images</p>
					<div class="space-y-2">
						{#each g.images as img, i (i)}
							<div class="flex items-center gap-2">
								{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
								<input class={inp} value={img} oninput={(e) => (g.images[i] = e.currentTarget.value)} placeholder="/uploads/gallery-1.jpg" />
								<button type="button" class={browseCls} onclick={() => pick((url) => (g.images[i] = url))}><ImagePlus size={13} /></button>
								<button type="button" onclick={() => g.images.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
							</div>
						{/each}
					</div>
					<div class="mt-2 flex items-center gap-2">
						<button type="button" onclick={() => g.images.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
						<button type="button" onclick={() => pick((url) => g.images.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick from media</button>
					</div>
				</div>
			</div>

		<!-- ── partners ───────────────────────────────────────── -->
		{:else if section === 'partners'}
			{@const pt = s as { eyebrow: string; title: string; subtitle: string; logos: string[] }}
			<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Eyebrow</span>
						<input class={inp} value={pt.eyebrow ?? ''} oninput={(e) => (pt.eyebrow = e.currentTarget.value)} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class={lbl}>Title</span>
						<input class={inp} value={pt.title ?? ''} oninput={(e) => (pt.title = e.currentTarget.value)} />
					</label>
				</div>
				<label class="flex flex-col gap-1.5">
					<span class={lbl}>Subtitle</span>
					<textarea class={ta} rows="2" oninput={(e) => (pt.subtitle = e.currentTarget.value)}>{pt.subtitle ?? ''}</textarea>
				</label>
				<div>
					<p class="mb-2 text-sm font-medium text-zinc-700">Partner Logos</p>
					<div class="space-y-2">
						{#each pt.logos as logo, i (i)}
							<div class="flex items-center gap-2">
								{#if isImg(logo)}<img src={logo} alt="" class="{thumbCls} object-contain bg-zinc-50" />{:else}<div class={emptyThumbCls}></div>{/if}
								<input class={inp} value={logo} oninput={(e) => (pt.logos[i] = e.currentTarget.value)} placeholder="/uploads/partner.png" />
								<button type="button" class={browseCls} onclick={() => pick((url) => (pt.logos[i] = url))}><ImagePlus size={13} /></button>
								<button type="button" onclick={() => pt.logos.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
							</div>
						{/each}
					</div>
					<div class="mt-2 flex items-center gap-2">
						<button type="button" onclick={() => pt.logos.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
						<button type="button" onclick={() => pick((url) => pt.logos.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick from media</button>
					</div>
				</div>
			</div>

		<!-- ── customSections ─────────────────────────────────── -->
		{:else if section === 'customSections'}
			<div class="space-y-5">
				<!-- Page tabs -->
				<div class="flex gap-1 border-b border-zinc-200">
					{#each PAGE_KEYS as pk (pk)}
						<button
							type="button"
							onclick={() => { csPage = pk; }}
							class="relative px-4 py-2.5 text-sm font-medium transition-colors {csPage === pk
								? 'text-rose-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-rose-600'
								: 'text-zinc-500 hover:text-zinc-800'}"
						>
							{csPageLabels[pk]}
						</button>
					{/each}
				</div>

				<div class="rounded-2xl border border-zinc-200 bg-white p-6">
					{#if csPage === 'home'}
						<CustomSectionsEditor bind:sections={homeCustom} formAction="?/customSections" pageKey="home" />
					{:else if csPage === 'about'}
						<CustomSectionsEditor bind:sections={aboutCustom} formAction="?/customSections" pageKey="about" />
					{:else if csPage === 'setem'}
						<CustomSectionsEditor bind:sections={setemCustom} formAction="?/customSections" pageKey="setem" />
					{:else}
						<CustomSectionsEditor bind:sections={csrCustom} formAction="?/customSections" pageKey="csr" />
					{/if}
				</div>
			</div>

		<!-- ── aboutPage ────────────────────────────────────────── -->
		{:else if section === 'aboutPage'}
			{@const ap = s as {
				eyebrow: string; heading: string;
				heroBgImages: string[]; heroOverlay: string;
				ctaBgImages: string[]; ctaOverlay: string;
				whoTitle: string; whoBody: string;
				visionTitle: string; visionText: string;
				purposeEyebrow: string; purposeTitle: string; purposeSubtitle: string;
				purpose: Array<{ title: string; desc: string }>;
				collabEyebrow: string; collabTitle: string; collabSubtitle: string;
				stats: Array<{ value: string; label: string }>;
				testimonial: string; testimonialAuthor: string;
				ctaHeading: string; ctaText: string; ctaLabel: string; ctaHref: string;
			}}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="space-y-4" ondragover={(e) => { if (orderDragging) e.preventDefault(); }} ondrop={(e) => { if (orderDragging) e.preventDefault(); }}>
				{#if orderSaved}<div class="flex items-center gap-1 text-xs font-semibold text-emerald-600"><Check size={12} /> Order saved</div>{/if}
				{#each aboutOrder as key (key)}
					{@const sMeta = ABOUT_SECTIONS.find((s) => s.key === key)}
					<div
						ondragover={(e) => { if (orderDragging) { e.preventDefault(); orderDragOverFn(key); } }}
						ondrop={async (e) => { e.preventDefault(); await orderDrop(aboutOrder, key, aboutOrderForm); }}
						ondragend={orderDragEnd}
						class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-opacity {orderDragging === key ? 'opacity-40' : ''} {orderDragOver === key && orderDragging !== key ? 'ring-2 ring-rose-400' : ''}"
					>
						<div class="flex items-center gap-2 border-b border-zinc-100 pb-2">
							<span
								draggable="true"
								role="button"
								tabindex="0"
								ondragstart={(e) => { e.dataTransfer?.setData('text/plain', key); e.dataTransfer && (e.dataTransfer.effectAllowed = 'move'); orderDragStart(key); }}
								ondragend={orderDragEnd}
								class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing"
								title="Drag to reorder"
							>
								<GripVertical size={14} />
							</span>
							<p class="text-sm font-semibold text-zinc-800">{sMeta?.label ?? key}</p>
						</div>

						{#if key === 'hero'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={ap.eyebrow ?? ''} oninput={(e) => (ap.eyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Overlay</span>
									<select class={inp} value={ap.heroOverlay ?? 'medium'} onchange={(e) => (ap.heroOverlay = e.currentTarget.value)}>
										{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
									</select>
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Heading</span>
								<input class={inp} value={ap.heading ?? ''} oninput={(e) => (ap.heading = e.currentTarget.value)} />
							</label>
							<div>
								<p class="mb-2 {lbl}">Background Images</p>
								<div class="space-y-2">
									{#each ap.heroBgImages as img, i (i)}
										<div class="flex items-center gap-2">
											{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
											<input class={inp} value={img} oninput={(e) => (ap.heroBgImages[i] = e.currentTarget.value)} placeholder="/uploads/hero.jpg" />
											<button type="button" class={browseCls} onclick={() => pick((url) => (ap.heroBgImages[i] = url))}><ImagePlus size={13} /></button>
											<button type="button" onclick={() => ap.heroBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
										</div>
									{/each}
								</div>
								<div class="mt-2 flex gap-2">
									<button type="button" onclick={() => ap.heroBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
									<button type="button" onclick={() => pick((url) => ap.heroBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick</button>
								</div>
							</div>

						{:else if key === 'whoWeAre'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Who Title</span>
									<input class={inp} value={ap.whoTitle ?? ''} oninput={(e) => (ap.whoTitle = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Vision Title</span>
									<input class={inp} value={ap.visionTitle ?? ''} oninput={(e) => (ap.visionTitle = e.currentTarget.value)} />
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Who Body</span>
								<textarea class={ta} rows="4" oninput={(e) => (ap.whoBody = e.currentTarget.value)}>{ap.whoBody ?? ''}</textarea>
							</label>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Vision Text</span>
								<textarea class={ta} rows="3" oninput={(e) => (ap.visionText = e.currentTarget.value)}>{ap.visionText ?? ''}</textarea>
							</label>

						{:else if key === 'purpose'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={ap.purposeEyebrow ?? ''} oninput={(e) => (ap.purposeEyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Title</span>
									<input class={inp} value={ap.purposeTitle ?? ''} oninput={(e) => (ap.purposeTitle = e.currentTarget.value)} />
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Subtitle</span>
								<textarea class={ta} rows="2" oninput={(e) => (ap.purposeSubtitle = e.currentTarget.value)}>{ap.purposeSubtitle ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Purpose Items <span class="font-normal text-zinc-400">(title + description pairs)</span></p>
								<div class="space-y-2">
									{#each ap.purpose as item, i (i)}
										<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
											<div class="flex items-start gap-2">
												<input class={inp} value={item.title} oninput={(e) => (item.title = e.currentTarget.value)} placeholder="Purpose title" />
												<button type="button" onclick={() => ap.purpose.splice(i, 1)} class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
											</div>
											<textarea class={ta} rows="2" oninput={(e) => (item.desc = e.currentTarget.value)} placeholder="Description">{item.desc}</textarea>
										</div>
									{/each}
								</div>
								<button type="button" onclick={() => ap.purpose.push({ title: '', desc: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">
									<Plus size={14} /> Add item
								</button>
							</div>

						{:else if key === 'collabStats'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={ap.collabEyebrow ?? ''} oninput={(e) => (ap.collabEyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Title</span>
									<input class={inp} value={ap.collabTitle ?? ''} oninput={(e) => (ap.collabTitle = e.currentTarget.value)} />
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Subtitle</span>
								<textarea class={ta} rows="2" oninput={(e) => (ap.collabSubtitle = e.currentTarget.value)}>{ap.collabSubtitle ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Stats</p>
								<div class="space-y-2">
									{#each ap.stats as stat, i (i)}
										<div class="flex items-center gap-2">
											<input class={inp} value={stat.value} oninput={(e) => (stat.value = e.currentTarget.value)} placeholder="5,000+" />
											<input class={inp} value={stat.label} oninput={(e) => (stat.label = e.currentTarget.value)} placeholder="Students helped" />
											<button type="button" onclick={() => ap.stats.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
										</div>
									{/each}
								</div>
								<button type="button" onclick={() => ap.stats.push({ value: '', label: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">
									<Plus size={14} /> Add stat
								</button>
							</div>

						{:else if key === 'testimonial'}
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Quote</span>
								<textarea class={ta} rows="3" oninput={(e) => (ap.testimonial = e.currentTarget.value)}>{ap.testimonial ?? ''}</textarea>
							</label>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Author</span>
								<input class={inp} value={ap.testimonialAuthor ?? ''} oninput={(e) => (ap.testimonialAuthor = e.currentTarget.value)} placeholder="Name, Role" />
							</label>

						{:else if key === 'cta'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Heading</span>
									<input class={inp} value={ap.ctaHeading ?? ''} oninput={(e) => (ap.ctaHeading = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Overlay</span>
									<select class={inp} value={ap.ctaOverlay ?? 'medium'} onchange={(e) => (ap.ctaOverlay = e.currentTarget.value)}>
										{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
									</select>
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Body Text</span>
								<textarea class={ta} rows="2" oninput={(e) => (ap.ctaText = e.currentTarget.value)}>{ap.ctaText ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Background Images</p>
								<div class="space-y-2">
									{#each ap.ctaBgImages as img, i (i)}
										<div class="flex items-center gap-2">
											{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
											<input class={inp} value={img} oninput={(e) => (ap.ctaBgImages[i] = e.currentTarget.value)} placeholder="/uploads/cta.jpg" />
											<button type="button" class={browseCls} onclick={() => pick((url) => (ap.ctaBgImages[i] = url))}><ImagePlus size={13} /></button>
											<button type="button" onclick={() => ap.ctaBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
										</div>
									{/each}
								</div>
								<div class="mt-2 flex gap-2">
									<button type="button" onclick={() => ap.ctaBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
									<button type="button" onclick={() => pick((url) => ap.ctaBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick</button>
								</div>
							</div>
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Button Label</span>
									<input class={inp} value={ap.ctaLabel ?? ''} oninput={(e) => (ap.ctaLabel = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Button Link</span>
									<input class={inp} value={ap.ctaHref ?? ''} oninput={(e) => (ap.ctaHref = e.currentTarget.value)} placeholder="/contact" />
								</label>
							</div>

						{:else if key === 'customSections'}
							<CustomSectionsEditor bind:sections={aboutCustom} formAction="?/customSections" pageKey="about" />
						{/if}
					</div>
				{/each}
			</div>

		<!-- ── setemPage ──────────────────────────────────────────── -->
		{:else if section === 'setemPage'}
			{@const sp = s as {
				eyebrow: string; heading: string; subtext: string;
				heroBgImages: string[]; heroOverlay: string;
				ctaBgImages: string[]; ctaOverlay: string;
				gapEyebrow: string; gapTitle: string; gapSubtitle: string;
				gapStats: Array<{ value: string; label: string }>;
				whatEyebrow: string; whatTitle: string; whatBody: string;
				expectTitle: string; expect: string[];
				audienceEyebrow: string; audienceTitle: string;
				audience: Array<{ title: string; desc: string }>;
				processEyebrow: string; processTitle: string;
				steps: Array<{ title: string; desc: string }>;
				ctaHeading: string; ctaText: string; ctaLabel: string; ctaHref: string;
			}}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="space-y-4" ondragover={(e) => { if (orderDragging) e.preventDefault(); }} ondrop={(e) => { if (orderDragging) e.preventDefault(); }}>
				{#each setemOrder as key (key)}
					{@const sMeta = SETEM_SECTIONS.find((s) => s.key === key)}
					<div
						ondragover={(e) => { if (orderDragging) { e.preventDefault(); orderDragOverFn(key); } }}
						ondrop={async (e) => { e.preventDefault(); await orderDrop(setemOrder, key, setemOrderForm); }}
						ondragend={orderDragEnd}
						class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-opacity {orderDragging === key ? 'opacity-40' : ''} {orderDragOver === key && orderDragging !== key ? 'ring-2 ring-rose-400' : ''}"
					>
						<div class="flex items-center gap-2 border-b border-zinc-100 pb-2">
							<span
								draggable="true"
								role="button"
								tabindex="0"
								ondragstart={(e) => { e.dataTransfer?.setData('text/plain', key); e.dataTransfer && (e.dataTransfer.effectAllowed = 'move'); orderDragStart(key); }}
								ondragend={orderDragEnd}
								class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing"
								title="Drag to reorder"
							>
								<GripVertical size={14} />
							</span>
							<p class="text-sm font-semibold text-zinc-800">{sMeta?.label ?? key}</p>
						</div>

						{#if key === 'hero'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={sp.eyebrow ?? ''} oninput={(e) => (sp.eyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Overlay</span>
									<select class={inp} value={sp.heroOverlay ?? 'medium'} onchange={(e) => (sp.heroOverlay = e.currentTarget.value)}>
										{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
									</select>
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Heading</span>
								<input class={inp} value={sp.heading ?? ''} oninput={(e) => (sp.heading = e.currentTarget.value)} />
							</label>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Subtext</span>
								<textarea class={ta} rows="2" oninput={(e) => (sp.subtext = e.currentTarget.value)}>{sp.subtext ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Background Images</p>
								<div class="space-y-2">
									{#each sp.heroBgImages as img, i (i)}
										<div class="flex items-center gap-2">
											{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
											<input class={inp} value={img} oninput={(e) => (sp.heroBgImages[i] = e.currentTarget.value)} placeholder="/uploads/hero.jpg" />
											<button type="button" class={browseCls} onclick={() => pick((url) => (sp.heroBgImages[i] = url))}><ImagePlus size={13} /></button>
											<button type="button" onclick={() => sp.heroBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
										</div>
									{/each}
								</div>
								<div class="mt-2 flex gap-2">
									<button type="button" onclick={() => sp.heroBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
									<button type="button" onclick={() => pick((url) => sp.heroBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick</button>
								</div>
							</div>

						{:else if key === 'gap'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={sp.gapEyebrow ?? ''} oninput={(e) => (sp.gapEyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Title</span>
									<input class={inp} value={sp.gapTitle ?? ''} oninput={(e) => (sp.gapTitle = e.currentTarget.value)} />
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Subtitle</span>
								<textarea class={ta} rows="2" oninput={(e) => (sp.gapSubtitle = e.currentTarget.value)}>{sp.gapSubtitle ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Gap Stats</p>
								<div class="space-y-2">
									{#each sp.gapStats as stat, i (i)}
										<div class="flex items-center gap-2">
											<input class={inp} value={stat.value} oninput={(e) => (stat.value = e.currentTarget.value)} placeholder="1 in 5" />
											<input class={inp} value={stat.label} oninput={(e) => (stat.label = e.currentTarget.value)} placeholder="children struggle with maths" />
											<button type="button" onclick={() => sp.gapStats.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
										</div>
									{/each}
								</div>
								<button type="button" onclick={() => sp.gapStats.push({ value: '', label: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">
									<Plus size={14} /> Add stat
								</button>
							</div>

						{:else if key === 'whatIsSetem'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={sp.whatEyebrow ?? ''} oninput={(e) => (sp.whatEyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Title</span>
									<input class={inp} value={sp.whatTitle ?? ''} oninput={(e) => (sp.whatTitle = e.currentTarget.value)} />
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Body</span>
								<textarea class={ta} rows="4" oninput={(e) => (sp.whatBody = e.currentTarget.value)}>{sp.whatBody ?? ''}</textarea>
							</label>

						{:else if key === 'whatToExpect'}
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Section Title</span>
								<input class={inp} value={sp.expectTitle ?? ''} oninput={(e) => (sp.expectTitle = e.currentTarget.value)} />
							</label>
							<div>
								<p class="mb-2 {lbl}">Expectations <span class="font-normal text-zinc-400">(one per item)</span></p>
								<div class="space-y-2">
									{#each sp.expect as item, i (i)}
										<div class="flex items-center gap-2">
											<input class={inp} value={item} oninput={(e) => (sp.expect[i] = e.currentTarget.value)} placeholder="Expectation…" />
											<button type="button" onclick={() => sp.expect.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
										</div>
									{/each}
								</div>
								<button type="button" onclick={() => sp.expect.push('')} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">
									<Plus size={14} /> Add item
								</button>
							</div>

						{:else if key === 'whoIsItFor'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={sp.audienceEyebrow ?? ''} oninput={(e) => (sp.audienceEyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Title</span>
									<input class={inp} value={sp.audienceTitle ?? ''} oninput={(e) => (sp.audienceTitle = e.currentTarget.value)} />
								</label>
							</div>
							<div>
								<p class="mb-2 {lbl}">Audience Groups</p>
								<div class="space-y-2">
									{#each sp.audience as item, i (i)}
										<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
											<div class="flex items-start gap-2">
												<input class={inp} value={item.title} oninput={(e) => (item.title = e.currentTarget.value)} placeholder="Group name" />
												<button type="button" onclick={() => sp.audience.splice(i, 1)} class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
											</div>
											<textarea class={ta} rows="2" oninput={(e) => (item.desc = e.currentTarget.value)} placeholder="Description">{item.desc}</textarea>
										</div>
									{/each}
								</div>
								<button type="button" onclick={() => sp.audience.push({ title: '', desc: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">
									<Plus size={14} /> Add group
								</button>
							</div>

						{:else if key === 'ourProcess'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={sp.processEyebrow ?? ''} oninput={(e) => (sp.processEyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Title</span>
									<input class={inp} value={sp.processTitle ?? ''} oninput={(e) => (sp.processTitle = e.currentTarget.value)} />
								</label>
							</div>
							<div>
								<p class="mb-2 {lbl}">Steps</p>
								<div class="space-y-2">
									{#each sp.steps as step, i (i)}
										<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
											<div class="flex items-start gap-2">
												<input class={inp} value={step.title} oninput={(e) => (step.title = e.currentTarget.value)} placeholder="Step name" />
												<button type="button" onclick={() => sp.steps.splice(i, 1)} class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
											</div>
											<textarea class={ta} rows="2" oninput={(e) => (step.desc = e.currentTarget.value)} placeholder="Description">{step.desc}</textarea>
										</div>
									{/each}
								</div>
								<button type="button" onclick={() => sp.steps.push({ title: '', desc: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">
									<Plus size={14} /> Add step
								</button>
							</div>

						{:else if key === 'cta'}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Heading</span>
									<input class={inp} value={sp.ctaHeading ?? ''} oninput={(e) => (sp.ctaHeading = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Overlay</span>
									<select class={inp} value={sp.ctaOverlay ?? 'medium'} onchange={(e) => (sp.ctaOverlay = e.currentTarget.value)}>
										{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
									</select>
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Body Text</span>
								<textarea class={ta} rows="2" oninput={(e) => (sp.ctaText = e.currentTarget.value)}>{sp.ctaText ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Background Images</p>
								<div class="space-y-2">
									{#each sp.ctaBgImages as img, i (i)}
										<div class="flex items-center gap-2">
											{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
											<input class={inp} value={img} oninput={(e) => (sp.ctaBgImages[i] = e.currentTarget.value)} placeholder="/uploads/cta.jpg" />
											<button type="button" class={browseCls} onclick={() => pick((url) => (sp.ctaBgImages[i] = url))}><ImagePlus size={13} /></button>
											<button type="button" onclick={() => sp.ctaBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
										</div>
									{/each}
								</div>
								<div class="mt-2 flex gap-2">
									<button type="button" onclick={() => sp.ctaBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
									<button type="button" onclick={() => pick((url) => sp.ctaBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick</button>
								</div>
							</div>
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Button Label</span>
									<input class={inp} value={sp.ctaLabel ?? ''} oninput={(e) => (sp.ctaLabel = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Button Link</span>
									<input class={inp} value={sp.ctaHref ?? ''} oninput={(e) => (sp.ctaHref = e.currentTarget.value)} placeholder="/contact" />
								</label>
							</div>

						{:else if key === 'customSections'}
							<CustomSectionsEditor bind:sections={setemCustom} formAction="?/customSections" pageKey="setem" />
						{/if}
					</div>
				{/each}
			</div>

		<!-- ── csrPage ────────────────────────────────────────────── -->
		{:else if section === 'csrPage'}
			{@const cp = s as {
				eyebrow: string; heading: string; subtext: string;
				heroBgImages: string[]; heroOverlay: string;
				ctaBgImages: string[]; ctaOverlay: string;
				stories: Array<{ title: string; date: string; category: string; excerpt: string; cover?: string; images?: string[] }>;
				ctaHeading: string; ctaText: string; ctaLabel: string; ctaHref: string;
			}}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="space-y-4" ondragover={(e) => { if (orderDragging) e.preventDefault(); }} ondrop={(e) => { if (orderDragging) e.preventDefault(); }}>
				{#each csrOrder as key (key)}
					{@const sMeta = CSR_SECTIONS.find((s) => s.key === key)}
					<div
						ondragover={(e) => { if (orderDragging) { e.preventDefault(); orderDragOverFn(key); } }}
						ondrop={async (e) => { e.preventDefault(); await orderDrop(csrOrder, key, csrOrderForm); }}
						ondragend={orderDragEnd}
						class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-opacity {orderDragging === key ? 'opacity-40' : ''} {orderDragOver === key && orderDragging !== key ? 'ring-2 ring-rose-400' : ''}"
					>
						<div class="flex items-center gap-2 border-b border-zinc-100 pb-2">
							<span
								draggable="true"
								role="button"
								tabindex="0"
								ondragstart={(e) => { e.dataTransfer?.setData('text/plain', key); e.dataTransfer && (e.dataTransfer.effectAllowed = 'move'); orderDragStart(key); }}
								ondragend={orderDragEnd}
								class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing"
								title="Drag to reorder"
							>
								<GripVertical size={14} />
							</span>
							<p class="text-sm font-semibold text-zinc-800">{sMeta?.label ?? key}</p>
						</div>

					{#if key === 'hero'}
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Eyebrow</span>
								<input class={inp} value={cp.eyebrow ?? ''} oninput={(e) => (cp.eyebrow = e.currentTarget.value)} />
							</label>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Overlay</span>
								<select class={inp} value={cp.heroOverlay ?? 'medium'} onchange={(e) => (cp.heroOverlay = e.currentTarget.value)}>
									{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
								</select>
							</label>
						</div>
						<label class="flex flex-col gap-1.5">
							<span class={lbl}>Heading</span>
							<input class={inp} value={cp.heading ?? ''} oninput={(e) => (cp.heading = e.currentTarget.value)} />
						</label>
						<label class="flex flex-col gap-1.5">
							<span class={lbl}>Subtext</span>
							<textarea class={ta} rows="2" oninput={(e) => (cp.subtext = e.currentTarget.value)}>{cp.subtext ?? ''}</textarea>
						</label>
						<div>
							<p class="mb-2 {lbl}">Background Images</p>
							<div class="space-y-2">
								{#each cp.heroBgImages as img, i (i)}
									<div class="flex items-center gap-2">
										{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
										<input class={inp} value={img} oninput={(e) => (cp.heroBgImages[i] = e.currentTarget.value)} placeholder="/uploads/hero.jpg" />
										<button type="button" class={browseCls} onclick={() => pick((url) => (cp.heroBgImages[i] = url))}><ImagePlus size={13} /></button>
										<button type="button" onclick={() => cp.heroBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
									</div>
								{/each}
							</div>
							<div class="mt-2 flex gap-2">
								<button type="button" onclick={() => cp.heroBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
								<button type="button" onclick={() => pick((url) => cp.heroBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick</button>
							</div>
						</div>

					{:else if key === 'stories'}
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<p class="text-sm font-semibold text-zinc-800">CSR Stories <span class="ml-1 text-zinc-400 font-normal">({cp.stories.length})</span></p>
								<button
									type="button"
									onclick={() => { cp.stories.push({ title: '', date: '', category: '', excerpt: '', cover: '', images: [] }); csrEditIdx = cp.stories.length - 1; }}
									class="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700"
								>
									<Plus size={14} /> Add story
								</button>
							</div>
							{#each cp.stories as story, i (i)}
								<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
									<div class="flex items-center justify-between bg-zinc-50 border-b border-zinc-100 px-5 py-3">
										<div class="flex items-center gap-3">
											{#if isImg(story.cover ?? '')}
												<img src={story.cover} alt="" class="h-8 w-8 rounded-lg border border-zinc-200 object-cover" />
											{/if}
											<div>
												<p class="font-medium text-zinc-900">{story.title || '(untitled)'}</p>
												<p class="text-xs text-zinc-400">{story.date || 'No date'} · {story.category || 'No category'}</p>
											</div>
										</div>
										<div class="flex items-center gap-2">
											<button
												type="button"
												onclick={() => (csrEditIdx = csrEditIdx === i ? null : i)}
												class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50"
											>
												<Pencil size={12} /> {csrEditIdx === i ? 'Close' : 'Edit'}
											</button>
											<button
												type="button"
												onclick={() => { if (confirm('Delete this story?')) { cp.stories.splice(i, 1); if (csrEditIdx === i) csrEditIdx = null; } }}
												class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
											>
												<Trash2 size={12} /> Delete
											</button>
										</div>
									</div>
									{#if csrEditIdx === i}
										<div class="space-y-4 p-5">
											<div class="grid gap-4 sm:grid-cols-2">
												<label class="flex flex-col gap-1.5">
													<span class={lbl}>Title</span>
													<input class={inp} value={story.title} oninput={(e) => (story.title = e.currentTarget.value)} placeholder="Story title" />
												</label>
												<label class="flex flex-col gap-1.5">
													<span class={lbl}>Category</span>
													<input class={inp} value={story.category} oninput={(e) => (story.category = e.currentTarget.value)} placeholder="e.g. Education, Community" />
												</label>
											</div>
											<div class="grid gap-4 sm:grid-cols-2">
												<label class="flex flex-col gap-1.5">
													<span class={lbl}>Date</span>
													<input class={inp} type="date" value={story.date} oninput={(e) => (story.date = e.currentTarget.value)} />
												</label>
												<div class="flex flex-col gap-1.5">
													<span class={lbl}>Cover Image</span>
													<div class="flex items-center gap-2">
														{#if isImg(story.cover ?? '')}<img src={story.cover} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
														<input class={inp} value={story.cover ?? ''} oninput={(e) => (story.cover = e.currentTarget.value)} placeholder="/uploads/story-cover.jpg" />
														<button type="button" class={browseCls} onclick={() => pick((url) => (story.cover = url))}><ImagePlus size={13} /></button>
													</div>
												</div>
											</div>
											<label class="flex flex-col gap-1.5">
												<span class={lbl}>Excerpt</span>
												<textarea class={ta} rows="3" oninput={(e) => (story.excerpt = e.currentTarget.value)} placeholder="Short summary shown on the card…">{story.excerpt}</textarea>
											</label>
											<div>
												<p class="mb-2 {lbl}">Gallery Images <span class="font-normal text-zinc-400">(shown when the story is opened)</span></p>
												<div class="space-y-2">
													{#each (story.images ?? []) as gImg, gi (gi)}
														<div class="flex items-center gap-2">
															{#if isImg(gImg)}<img src={gImg} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
															<input class={inp} value={gImg} oninput={(e) => { if (!story.images) story.images = []; story.images[gi] = e.currentTarget.value; }} placeholder="/uploads/gallery.jpg" />
															<button type="button" class={browseCls} onclick={() => pick((url) => { if (!story.images) story.images = []; story.images[gi] = url; })}><ImagePlus size={13} /></button>
															<button type="button" onclick={() => story.images?.splice(gi, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
														</div>
													{/each}
												</div>
												<div class="mt-2 flex gap-2">
													<button type="button" onclick={() => { if (!story.images) story.images = []; story.images.push(''); }} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
													<button type="button" onclick={() => pick((url) => { if (!story.images) story.images = []; story.images.push(url); })} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick</button>
												</div>
											</div>
										</div>
									{/if}
								</div>
							{/each}
							{#if cp.stories.length === 0}
								<div class="rounded-2xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-400">
									No stories yet — add the first one above.
								</div>
							{/if}
						</div>

					{:else if key === 'cta'}
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Heading</span>
								<input class={inp} value={cp.ctaHeading ?? ''} oninput={(e) => (cp.ctaHeading = e.currentTarget.value)} />
							</label>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Overlay</span>
								<select class={inp} value={cp.ctaOverlay ?? 'medium'} onchange={(e) => (cp.ctaOverlay = e.currentTarget.value)}>
									{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
								</select>
							</label>
						</div>
						<label class="flex flex-col gap-1.5">
							<span class={lbl}>Body Text</span>
							<textarea class={ta} rows="2" oninput={(e) => (cp.ctaText = e.currentTarget.value)}>{cp.ctaText ?? ''}</textarea>
						</label>
						<div>
							<p class="mb-2 {lbl}">Background Images</p>
							<div class="space-y-2">
								{#each cp.ctaBgImages as img, i (i)}
									<div class="flex items-center gap-2">
										{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
										<input class={inp} value={img} oninput={(e) => (cp.ctaBgImages[i] = e.currentTarget.value)} placeholder="/uploads/cta.jpg" />
										<button type="button" class={browseCls} onclick={() => pick((url) => (cp.ctaBgImages[i] = url))}><ImagePlus size={13} /></button>
										<button type="button" onclick={() => cp.ctaBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
									</div>
								{/each}
							</div>
							<div class="mt-2 flex gap-2">
								<button type="button" onclick={() => cp.ctaBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={14} /> Add URL</button>
								<button type="button" onclick={() => pick((url) => cp.ctaBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={14} /> Pick</button>
							</div>
						</div>
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Button Label</span>
								<input class={inp} value={cp.ctaLabel ?? ''} oninput={(e) => (cp.ctaLabel = e.currentTarget.value)} />
							</label>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Button Link</span>
								<input class={inp} value={cp.ctaHref ?? ''} oninput={(e) => (cp.ctaHref = e.currentTarget.value)} placeholder="/contact" />
							</label>
						</div>

					{:else if key === 'customSections'}
						<CustomSectionsEditor bind:sections={csrCustom} formAction="?/customSections" pageKey="csr" />
					{/if}
					</div>
				{/each}
			</div>

		<!-- ── fallback: raw JSON editor ──────────────────────── -->
		{:else}
			<div class="rounded-2xl border border-zinc-200 bg-white p-6">
				<label class="flex flex-col gap-1.5">
					<span class="text-sm font-medium text-zinc-700">JSON Content</span>
					<textarea
						rows="24"
						class="w-full resize-y rounded-xl border border-zinc-300 px-4 py-3 font-mono text-xs text-zinc-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
						oninput={(e) => { try { s = JSON.parse(e.currentTarget.value); } catch {} }}
					>{JSON.stringify(s, null, 2)}</textarea>
				</label>
			</div>
		{/if}

		<!-- Submit -->
		<div class="flex justify-end gap-3 pt-4">
			<a href="/hub/admin/site" class="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</a>
			<button type="submit" class="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Save changes</button>
		</div>
	</form>
</div>
{/if}

<!-- Shared media picker dialog -->
<MediaPicker bind:open={pickerOpen} onselect={onPickerSelect} onclose={() => (pickerFn = null)} />
