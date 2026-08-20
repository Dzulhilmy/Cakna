<script lang="ts">
	import { tick } from 'svelte';
	import { ArrowLeft, Plus, Trash2, ImagePlus, Check, GripVertical, RefreshCw } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import MediaPicker from '$lib/components/admin/MediaPicker.svelte';
	import CustomSectionsEditor from '$lib/components/admin/CustomSectionsEditor.svelte';
	import { HOME_SECTIONS, DEFAULT_HOME_ORDER, type HomeSectionKey } from '$lib/site';

	let { data, form } = $props();
	const c = data.content;

	// ── per-section reactive state ──────────────────────────────────────────
	let b = $state(structuredClone(c.brand ?? { name: '', accentWord: '', logoImage: '' }));
	const brandJson = $derived(JSON.stringify(b));

	let nav = $state<Array<{ label: string; href: string }>>(structuredClone(c.nav ?? []));
	const navJson = $derived(JSON.stringify(nav));

	const _hero = c.hero ?? {};
	let h = $state(structuredClone({
		..._hero,
		bgImages: _hero.bgImages ?? [],
		primaryCta: _hero.primaryCta ?? { label: '', href: '' },
		secondaryCta: _hero.secondaryCta ?? { label: '', href: '' }
	}));
	const heroJson = $derived(JSON.stringify(h));

	const _about = c.about ?? {};
	let a = $state(structuredClone({ ..._about, quoteBgImages: _about.quoteBgImages ?? [] }));
	const aboutJson = $derived(JSON.stringify(a));

	let prog = $state(structuredClone(c.programs ?? {}));
	const programsJson = $derived(JSON.stringify(prog));

	const _impact = c.impact ?? {};
	let im = $state(structuredClone({ ..._impact, stats: _impact.stats ?? [] }));
	const impactJson = $derived(JSON.stringify(im));

	const _cta = c.cta ?? {};
	let ct = $state(structuredClone({
		..._cta,
		bgImages: _cta.bgImages ?? [],
		primaryCta: _cta.primaryCta ?? { label: '', href: '' },
		secondaryCta: _cta.secondaryCta ?? { label: '', href: '' }
	}));
	const ctaJson = $derived(JSON.stringify(ct));

	const _gallery = c.homeGallery ?? {};
	let g = $state(structuredClone({ ..._gallery, images: _gallery.images ?? [] }));
	const galleryJson = $derived(JSON.stringify(g));

	const _partners = c.partners ?? {};
	let pt = $state(structuredClone({ ..._partners, logos: _partners.logos ?? [] }));
	const partnersJson = $derived(JSON.stringify(pt));

	const _homeCustom = ((c as unknown as Record<string, unknown>).customSections as Record<string, import('$lib/site').CustomSection[]> ?? {}).home ?? [];
	let homeCustom = $state<import('$lib/site').CustomSection[]>(structuredClone(_homeCustom));

	// ── section order ───────────────────────────────────────────────────────
	let homeOrder = $state<HomeSectionKey[]>(structuredClone(c.sectionOrder?.home ?? DEFAULT_HOME_ORDER));
	let orderDragging = $state<string | null>(null);
	let orderDragOver = $state<string | null>(null);
	let orderSaved = $state(false);
	let orderForm: HTMLFormElement | undefined = $state();
	const orderJson = $derived(JSON.stringify(homeOrder));

	const sectionSaveKey: Partial<Record<HomeSectionKey, string>> = { gallery: 'homeGallery' };

	function flashOrderSaved() {
		orderSaved = true;
		setTimeout(() => { orderSaved = false; }, 2500);
	}
	function orderDragStart(key: string) { orderDragging = key; }
	function orderDragOverFn(key: string) { orderDragOver = key; }
	async function orderDrop(key: string) {
		if (!orderDragging || orderDragging === key) return;
		const from = homeOrder.indexOf(orderDragging as HomeSectionKey);
		const to = homeOrder.indexOf(key as HomeSectionKey);
		if (from === -1 || to === -1) return;
		const copy = [...homeOrder];
		copy.splice(to, 0, copy.splice(from, 1)[0]);
		homeOrder = copy;
		orderDragging = null;
		orderDragOver = null;
		await tick();
		orderForm?.requestSubmit();
	}
	function orderDragEnd() { orderDragging = null; orderDragOver = null; }

	// ── active section ──────────────────────────────────────────────────────
	let activeSection = $state<string>('brand');

	// ── save flash ──────────────────────────────────────────────────────────
	let savedSection = $state<string | null>(null);
	function flashSaved(s: string) {
		savedSection = s;
		setTimeout(() => { if (savedSection === s) savedSection = null; }, 2500);
	}

	function makeEnhance(sectionKey: string) {
		return () => async ({ update, result }: { update: () => Promise<void>; result: { type: string } }) => {
			await update();
			if (result.type === 'success') flashSaved(sectionKey);
		};
	}

	// ── preview iframe ──────────────────────────────────────────────────────
	let previewIframe: HTMLIFrameElement | undefined = $state();
	function refreshPreview() {
		if (previewIframe) previewIframe.src = previewIframe.src;
	}

	// ── media picker ────────────────────────────────────────────────────────
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

	// ── shared style constants ───────────────────────────────────────────────
	const inp = 'rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white';
	const ta = inp + ' resize-y';
	const lbl = 'text-sm font-medium text-zinc-700';
	const overlayOptions = ['light', 'medium', 'dark'] as const;
	const isImg = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
	const thumbCls = 'h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-cover bg-zinc-50';
	const emptyThumbCls = 'h-9 w-9 shrink-0 rounded-lg border border-zinc-200 bg-zinc-100';
	const browseCls = 'shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 hover:border-rose-300 hover:text-rose-600';

	function saveBtn(sectionKey: string, label: string) {
		return savedSection === sectionKey ? '✓ Saved' : label;
	}

	// All sections including brand/nav for nav display
	const navSections = [
		{ key: 'brand', label: 'Brand & Nav', fixed: true },
		...HOME_SECTIONS.map(s => ({ ...s, fixed: false }))
	];
	function navLabel(key: string) {
		return navSections.find(s => s.key === key)?.label ?? key;
	}
</script>

<svelte:head><title>Home Page · Website · Cakna Hub Admin</title></svelte:head>

{#if pickerOpen}
	<MediaPicker bind:open={pickerOpen} onselect={onPickerSelect} onclose={() => (pickerFn = null)} />
{/if}

<!-- Hidden order-save form -->
<form method="POST" action="?/sectionOrder" class="hidden" bind:this={orderForm}
	use:enhance={() => async ({ update, result }: { update: (opts?: { reset?: boolean }) => Promise<void>; result: { type: string } }) => {
		await update({ reset: false });
		if (result.type === 'success') flashOrderSaved();
	}}>
	<input type="hidden" name="json" value={orderJson} />
</form>

<!-- Full-bleed split layout — break out of AdminShell padding -->
<div class="-mx-6 -my-8 md:-my-10 flex divide-x divide-zinc-200 overflow-hidden" style="height: 100vh;">

	<!-- ── Left panel ─────────────────────────────────────────────────────── -->
	<div class="flex w-[380px] shrink-0 flex-col bg-white">

		<!-- Header -->
		<div class="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3">
			<div class="flex items-center gap-1.5 text-sm">
				<a href="/hub/admin/site" class="flex items-center gap-1 text-zinc-500 hover:text-zinc-900">
					<ArrowLeft size={13} /> Website
				</a>
				<span class="text-zinc-300">/</span>
				<span class="font-medium text-zinc-900">Home Page</span>
			</div>
			{#if orderSaved}
				<span class="flex items-center gap-1 text-xs font-semibold text-rose-600">
					<Check size={11} /> Order saved
				</span>
			{/if}
		</div>

		<!-- Section navigation (draggable) -->
		<div class="shrink-0 border-b border-zinc-100 p-2">
			<!-- Brand & Nav — fixed, not reorderable -->
			<button
				type="button"
				onclick={() => (activeSection = 'brand')}
				class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors
				       {activeSection === 'brand' ? 'bg-rose-50 text-rose-700 font-medium' : 'text-zinc-600 hover:bg-zinc-50'}"
			>
				<span class="w-4 shrink-0"></span>
				Brand & Nav
			</button>

			<!-- Reorderable sections -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				ondragover={(e) => { if (orderDragging) e.preventDefault(); }}
				ondrop={(e) => { if (orderDragging) e.preventDefault(); }}
			>
				{#each homeOrder as key (key)}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						ondragover={(e) => { if (orderDragging) { e.preventDefault(); orderDragOverFn(key); } }}
						ondrop={async (e) => { e.preventDefault(); await orderDrop(key); }}
						ondragend={orderDragEnd}
						class="flex items-center gap-1 transition-opacity
						       {orderDragging === key ? 'opacity-30' : ''}
						       {orderDragOver === key && orderDragging !== key ? 'rounded-lg outline outline-2 outline-rose-400 outline-offset-[-2px]' : ''}"
					>
						<span
							draggable="true"
							role="button"
							tabindex="0"
							ondragstart={(e) => { e.dataTransfer?.setData('text/plain', key); e.dataTransfer && (e.dataTransfer.effectAllowed = 'move'); orderDragStart(key); }}
							ondragend={orderDragEnd}
							class="shrink-0 cursor-grab p-1 text-zinc-300 hover:text-zinc-500 active:cursor-grabbing"
							aria-label="Drag to reorder {navLabel(key)}"
						>
							<GripVertical size={14} />
						</span>
						<button
							type="button"
							onclick={() => (activeSection = key)}
							class="flex flex-1 items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition-colors
							       {activeSection === key ? 'bg-rose-50 text-rose-700 font-medium' : 'text-zinc-600 hover:bg-zinc-50'}"
						>
							{navLabel(key)}
							{#if savedSection === (sectionSaveKey[key as HomeSectionKey] ?? key)}
								<Check size={12} class="text-rose-500" />
							{/if}
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Active section form (scrollable) -->
		<div class="flex-1 overflow-y-auto">

			{#if activeSection === 'brand'}
				<!-- ── Brand ──────────────────────────────────────────────── -->
				<div class="space-y-6 p-4">
					<form method="POST" action="?/brand" use:enhance={makeEnhance('brand')}>
						<input type="hidden" name="json" value={brandJson} />
						<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Brand</p>
						<div class="space-y-3">
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Brand Name</span>
								<input class={inp} value={b.name ?? ''} oninput={(e) => (b.name = e.currentTarget.value)} placeholder="HOME CAKNA" />
							</label>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Accent Word <span class="font-normal text-zinc-400">(rose highlight)</span></span>
								<input class={inp} value={b.accentWord ?? ''} oninput={(e) => (b.accentWord = e.currentTarget.value)} placeholder="CAKNA" />
							</label>
							<div class="flex flex-col gap-1.5">
								<span class={lbl}>Logo Image</span>
								<div class="flex items-center gap-2">
									{#if isImg(b.logoImage ?? '')}<img src={b.logoImage} alt="logo" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
									<input class={inp} value={b.logoImage ?? ''} oninput={(e) => (b.logoImage = e.currentTarget.value)} placeholder="/uploads/logo.png" />
									<button type="button" class={browseCls} onclick={() => pick((url) => (b.logoImage = url))}><ImagePlus size={13} /></button>
								</div>
							</div>
						</div>
						<div class="mt-4 flex justify-end">
							<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedSection === 'brand' ? '!bg-rose-700' : ''}">
								{saveBtn('brand', 'Save brand')}
							</button>
						</div>
					</form>

					<div class="border-t border-zinc-100 pt-6">
						<form method="POST" action="?/nav" use:enhance={makeEnhance('nav')}>
							<input type="hidden" name="json" value={navJson} />
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Navigation Links</p>
							<p class="mb-3 text-xs text-zinc-500">Links in the public website navigation bar.</p>
							<div class="space-y-2">
								{#each nav as link, i (i)}
									<div class="flex items-center gap-2">
										<input class={inp} value={link.label} oninput={(e) => (link.label = e.currentTarget.value)} placeholder="About Us" />
										<input class={inp} value={link.href} oninput={(e) => (link.href = e.currentTarget.value)} placeholder="/about" />
										<button type="button" onclick={() => nav.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
									</div>
								{/each}
							</div>
							<button type="button" onclick={() => nav.push({ label: '', href: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">
								<Plus size={13} /> Add link
							</button>
							<div class="mt-4 flex justify-end">
								<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedSection === 'nav' ? '!bg-rose-700' : ''}">
									{saveBtn('nav', 'Save navigation')}
								</button>
							</div>
						</form>
					</div>
				</div>

			{:else if activeSection === 'hero'}
				<!-- ── Hero ───────────────────────────────────────────────── -->
				<div class="p-4">
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Hero Section</p>
					<form method="POST" action="?/hero" use:enhance={makeEnhance('hero')}>
						<input type="hidden" name="json" value={heroJson} />
						<div class="space-y-4">
							<div class="grid grid-cols-2 gap-3">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={h.eyebrow ?? ''} oninput={(e) => (h.eyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Overlay</span>
									<select class={inp} value={h.overlay ?? 'medium'} onchange={(e) => (h.overlay = e.currentTarget.value as typeof h.overlay)}>
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
								<textarea class={ta} rows={3} oninput={(e) => (h.subtext = e.currentTarget.value)}>{h.subtext ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Background Images <span class="font-normal text-zinc-400">(slideshow)</span></p>
								<div class="space-y-2">
									{#each h.bgImages as img, i (i)}
										<div class="flex items-center gap-2">
											{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
											<input class={inp} value={img} oninput={(e) => (h.bgImages[i] = e.currentTarget.value)} placeholder="/uploads/hero-bg.jpg" />
											<button type="button" class={browseCls} onclick={() => pick((url) => (h.bgImages[i] = url))}><ImagePlus size={13} /></button>
											<button type="button" onclick={() => h.bgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
										</div>
									{/each}
								</div>
								<div class="mt-2 flex gap-2">
									<button type="button" onclick={() => h.bgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
									<button type="button" onclick={() => pick((url) => h.bgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div class="space-y-2">
									<p class="{lbl}">Primary CTA</p>
									<input class={inp} value={h.primaryCta?.label ?? ''} oninput={(e) => (h.primaryCta.label = e.currentTarget.value)} placeholder="Label" />
									<input class={inp} value={h.primaryCta?.href ?? ''} oninput={(e) => (h.primaryCta.href = e.currentTarget.value)} placeholder="/register" />
								</div>
								<div class="space-y-2">
									<p class="{lbl}">Secondary CTA</p>
									<input class={inp} value={h.secondaryCta?.label ?? ''} oninput={(e) => (h.secondaryCta.label = e.currentTarget.value)} placeholder="Label" />
									<input class={inp} value={h.secondaryCta?.href ?? ''} oninput={(e) => (h.secondaryCta.href = e.currentTarget.value)} placeholder="#programs" />
								</div>
							</div>
						</div>
						<div class="mt-4 flex justify-end">
							<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedSection === 'hero' ? '!bg-rose-700' : ''}">
								{saveBtn('hero', 'Save hero')}
							</button>
						</div>
					</form>
				</div>

			{:else if activeSection === 'about'}
				<!-- ── About ──────────────────────────────────────────────── -->
				<div class="p-4">
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">About Section</p>
					<form method="POST" action="?/about" use:enhance={makeEnhance('about')}>
						<input type="hidden" name="json" value={aboutJson} />
						<div class="space-y-4">
							<div class="grid grid-cols-2 gap-3">
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
								<textarea class={ta} rows={4} oninput={(e) => (a.body = e.currentTarget.value)}>{a.body ?? ''}</textarea>
							</label>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Pull Quote</span>
								<textarea class={ta} rows={2} oninput={(e) => (a.quote = e.currentTarget.value)}>{a.quote ?? ''}</textarea>
							</label>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Quote Subtitle</span>
								<input class={inp} value={a.quoteSub ?? ''} oninput={(e) => (a.quoteSub = e.currentTarget.value)} />
							</label>
							<div>
								<p class="mb-2 {lbl}">Quote Background Images</p>
								<div class="space-y-2">
									{#each a.quoteBgImages as img, i (i)}
										<div class="flex items-center gap-2">
											{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
											<input class={inp} value={img} oninput={(e) => (a.quoteBgImages[i] = e.currentTarget.value)} placeholder="/uploads/quote-bg.jpg" />
											<button type="button" class={browseCls} onclick={() => pick((url) => (a.quoteBgImages[i] = url))}><ImagePlus size={13} /></button>
											<button type="button" onclick={() => a.quoteBgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
										</div>
									{/each}
								</div>
								<div class="mt-2 flex gap-2">
									<button type="button" onclick={() => a.quoteBgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
									<button type="button" onclick={() => pick((url) => a.quoteBgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
								</div>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Quote Overlay</span>
								<select class={inp} value={a.quoteOverlay ?? 'medium'} onchange={(e) => (a.quoteOverlay = e.currentTarget.value as typeof a.quoteOverlay)}>
									{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
								</select>
							</label>
						</div>
						<div class="mt-4 flex justify-end">
							<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedSection === 'about' ? '!bg-rose-700' : ''}">
								{saveBtn('about', 'Save about')}
							</button>
						</div>
					</form>
				</div>

			{:else if activeSection === 'programs'}
				<!-- ── Programs ───────────────────────────────────────────── -->
				<div class="p-4">
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Programs Section</p>
					<form method="POST" action="?/programs" use:enhance={makeEnhance('programs')}>
						<input type="hidden" name="json" value={programsJson} />
						<div class="space-y-4">
							<div class="grid grid-cols-2 gap-3">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Eyebrow</span>
									<input class={inp} value={prog.eyebrow ?? ''} oninput={(e) => (prog.eyebrow = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Title</span>
									<input class={inp} value={prog.title ?? ''} oninput={(e) => (prog.title = e.currentTarget.value)} />
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Subtitle</span>
								<textarea class={ta} rows={2} oninput={(e) => (prog.subtitle = e.currentTarget.value)}>{prog.subtitle ?? ''}</textarea>
							</label>
							<div class="grid grid-cols-2 gap-3">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>CTA Label</span>
									<input class={inp} value={prog.ctaLabel ?? ''} oninput={(e) => (prog.ctaLabel = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>CTA Link</span>
									<input class={inp} value={prog.ctaHref ?? ''} oninput={(e) => (prog.ctaHref = e.currentTarget.value)} placeholder="/core" />
								</label>
							</div>
						</div>
						<div class="mt-4 flex justify-end">
							<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedSection === 'programs' ? '!bg-rose-700' : ''}">
								{saveBtn('programs', 'Save programs')}
							</button>
						</div>
					</form>
				</div>

			{:else if activeSection === 'impact'}
				<!-- ── Impact ─────────────────────────────────────────────── -->
				<div class="p-4">
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Impact & Stats</p>
					<form method="POST" action="?/impact" use:enhance={makeEnhance('impact')}>
						<input type="hidden" name="json" value={impactJson} />
						<div class="space-y-4">
							<div class="grid grid-cols-2 gap-3">
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
								<textarea class={ta} rows={2} oninput={(e) => (im.subtitle = e.currentTarget.value)}>{im.subtitle ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Stats</p>
								<div class="space-y-2">
									{#each im.stats as stat, i (i)}
										<div class="flex items-center gap-2">
											<input class={inp} value={stat.value} oninput={(e) => (stat.value = e.currentTarget.value)} placeholder="5,000+" />
											<input class={inp} value={stat.label} oninput={(e) => (stat.label = e.currentTarget.value)} placeholder="Students helped" />
											<button type="button" onclick={() => im.stats.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
										</div>
									{/each}
								</div>
								<button type="button" onclick={() => im.stats.push({ value: '', label: '' })} class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">
									<Plus size={13} /> Add stat
								</button>
							</div>
						</div>
						<div class="mt-4 flex justify-end">
							<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedSection === 'impact' ? '!bg-rose-700' : ''}">
								{saveBtn('impact', 'Save impact')}
							</button>
						</div>
					</form>
				</div>

			{:else if activeSection === 'cta'}
				<!-- ── CTA ────────────────────────────────────────────────── -->
				<div class="p-4">
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">CTA Section</p>
					<form method="POST" action="?/cta" use:enhance={makeEnhance('cta')}>
						<input type="hidden" name="json" value={ctaJson} />
						<div class="space-y-4">
							<div class="grid grid-cols-2 gap-3">
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Heading</span>
									<input class={inp} value={ct.heading ?? ''} oninput={(e) => (ct.heading = e.currentTarget.value)} />
								</label>
								<label class="flex flex-col gap-1.5">
									<span class={lbl}>Overlay</span>
									<select class={inp} value={ct.overlay ?? 'medium'} onchange={(e) => (ct.overlay = e.currentTarget.value as typeof ct.overlay)}>
										{#each overlayOptions as o}<option value={o}>{o}</option>{/each}
									</select>
								</label>
							</div>
							<label class="flex flex-col gap-1.5">
								<span class={lbl}>Body</span>
								<textarea class={ta} rows={3} oninput={(e) => (ct.body = e.currentTarget.value)}>{ct.body ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Background Images</p>
								<div class="space-y-2">
									{#each ct.bgImages as img, i (i)}
										<div class="flex items-center gap-2">
											{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
											<input class={inp} value={img} oninput={(e) => (ct.bgImages[i] = e.currentTarget.value)} placeholder="/uploads/cta-bg.jpg" />
											<button type="button" class={browseCls} onclick={() => pick((url) => (ct.bgImages[i] = url))}><ImagePlus size={13} /></button>
											<button type="button" onclick={() => ct.bgImages.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
										</div>
									{/each}
								</div>
								<div class="mt-2 flex gap-2">
									<button type="button" onclick={() => ct.bgImages.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
									<button type="button" onclick={() => pick((url) => ct.bgImages.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div class="space-y-2">
									<p class="{lbl}">Primary CTA</p>
									<input class={inp} value={ct.primaryCta?.label ?? ''} oninput={(e) => (ct.primaryCta.label = e.currentTarget.value)} placeholder="Label" />
									<input class={inp} value={ct.primaryCta?.href ?? ''} oninput={(e) => (ct.primaryCta.href = e.currentTarget.value)} placeholder="/register" />
								</div>
								<div class="space-y-2">
									<p class="{lbl}">Secondary CTA</p>
									<input class={inp} value={ct.secondaryCta?.label ?? ''} oninput={(e) => (ct.secondaryCta.label = e.currentTarget.value)} placeholder="Label" />
									<input class={inp} value={ct.secondaryCta?.href ?? ''} oninput={(e) => (ct.secondaryCta.href = e.currentTarget.value)} placeholder="/auth/login" />
								</div>
							</div>
						</div>
						<div class="mt-4 flex justify-end">
							<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedSection === 'cta' ? '!bg-rose-700' : ''}">
								{saveBtn('cta', 'Save CTA')}
							</button>
						</div>
					</form>
				</div>

			{:else if activeSection === 'gallery'}
				<!-- ── Gallery ────────────────────────────────────────────── -->
				<div class="p-4">
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Gallery</p>
					<form method="POST" action="?/homeGallery" use:enhance={makeEnhance('homeGallery')}>
						<input type="hidden" name="json" value={galleryJson} />
						<div class="space-y-4">
							<div class="grid grid-cols-2 gap-3">
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
								<textarea class={ta} rows={2} oninput={(e) => (g.subtitle = e.currentTarget.value)}>{g.subtitle ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Gallery Images</p>
								<div class="space-y-2">
									{#each g.images as img, i (i)}
										<div class="flex items-center gap-2">
											{#if isImg(img)}<img src={img} alt="" class={thumbCls} />{:else}<div class={emptyThumbCls}></div>{/if}
											<input class={inp} value={img} oninput={(e) => (g.images[i] = e.currentTarget.value)} placeholder="/uploads/gallery-1.jpg" />
											<button type="button" class={browseCls} onclick={() => pick((url) => (g.images[i] = url))}><ImagePlus size={13} /></button>
											<button type="button" onclick={() => g.images.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
										</div>
									{/each}
								</div>
								<div class="mt-2 flex gap-2">
									<button type="button" onclick={() => g.images.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
									<button type="button" onclick={() => pick((url) => g.images.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
								</div>
							</div>
						</div>
						<div class="mt-4 flex justify-end">
							<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedSection === 'homeGallery' ? '!bg-rose-700' : ''}">
								{saveBtn('homeGallery', 'Save gallery')}
							</button>
						</div>
					</form>
				</div>

			{:else if activeSection === 'partners'}
				<!-- ── Partners ───────────────────────────────────────────── -->
				<div class="p-4">
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Partners</p>
					<form method="POST" action="?/partners" use:enhance={makeEnhance('partners')}>
						<input type="hidden" name="json" value={partnersJson} />
						<div class="space-y-4">
							<div class="grid grid-cols-2 gap-3">
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
								<textarea class={ta} rows={2} oninput={(e) => (pt.subtitle = e.currentTarget.value)}>{pt.subtitle ?? ''}</textarea>
							</label>
							<div>
								<p class="mb-2 {lbl}">Partner Logos</p>
								<div class="space-y-2">
									{#each pt.logos as logo, i (i)}
										<div class="flex items-center gap-2">
											{#if isImg(logo)}<img src={logo} alt="" class="{thumbCls} object-contain" />{:else}<div class={emptyThumbCls}></div>{/if}
											<input class={inp} value={logo} oninput={(e) => (pt.logos[i] = e.currentTarget.value)} placeholder="/uploads/partner.png" />
											<button type="button" class={browseCls} onclick={() => pick((url) => (pt.logos[i] = url))}><ImagePlus size={13} /></button>
											<button type="button" onclick={() => pt.logos.splice(i, 1)} class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
										</div>
									{/each}
								</div>
								<div class="mt-2 flex gap-2">
									<button type="button" onclick={() => pt.logos.push('')} class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"><Plus size={13} /> Add URL</button>
									<button type="button" onclick={() => pick((url) => pt.logos.push(url))} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600"><ImagePlus size={13} /> Pick</button>
								</div>
							</div>
						</div>
						<div class="mt-4 flex justify-end">
							<button type="submit" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 {savedSection === 'partners' ? '!bg-rose-700' : ''}">
								{saveBtn('partners', 'Save partners')}
							</button>
						</div>
					</form>
				</div>

			{:else if activeSection === 'customSections'}
				<!-- ── Custom Sections ────────────────────────────────────── -->
				<div class="p-4">
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Custom Sections</p>
					<CustomSectionsEditor bind:sections={homeCustom} formAction="?/customSections" pageKey="home" />
				</div>
			{/if}

		</div>
	</div>

	<!-- ── Right panel: live preview ─────────────────────────────────────── -->
	<div class="relative flex flex-1 flex-col overflow-hidden bg-zinc-100">
		<!-- Preview toolbar -->
		<div class="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
			<span class="text-xs font-medium text-zinc-500">Live Preview</span>
			<button
				type="button"
				onclick={refreshPreview}
				class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
			>
				<RefreshCw size={12} /> Refresh
			</button>
		</div>
		<!-- Scaled iframe preview -->
		<div class="relative flex-1 overflow-hidden">
			<iframe
				bind:this={previewIframe}
				src="/"
				title="Public site preview"
				class="absolute left-0 top-0 origin-top-left border-0"
				style="width: 1280px; height: calc(100% / 0.6); transform: scale(0.6);"
				loading="lazy"
			></iframe>
		</div>
	</div>

</div>
