<script lang="ts">
	import { ArrowLeft, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-svelte';
	import type { SetemPage } from '$lib/site';

	let { data, form: formResult } = $props();

	let p = $state<SetemPage>(JSON.parse(JSON.stringify(data.content.setemPage)));

	let open = $state<Record<string, boolean>>({
		hero: true,
		gap: false,
		whatIsSetem: false,
		whatToExpect: false,
		whoIsItFor: false,
		ourProcess: false,
		cta: false,
	});

	function toggle(key: string) { open[key] = !open[key]; }

	const json = $derived(JSON.stringify(p));

	function addStat() { p.gapStats = [...p.gapStats, { value: '', label: '' }]; }
	function removeStat(i: number) { p.gapStats = p.gapStats.filter((_, idx) => idx !== i); }
	function addExpect() { p.expect = [...p.expect, '']; }
	function removeExpect(i: number) { p.expect = p.expect.filter((_, idx) => idx !== i); }
	function addAudience() { p.audience = [...p.audience, { title: '', desc: '' }]; }
	function removeAudience(i: number) { p.audience = p.audience.filter((_, idx) => idx !== i); }
	function addStep() { p.steps = [...p.steps, { title: '', desc: '' }]; }
	function removeStep(i: number) { p.steps = p.steps.filter((_, idx) => idx !== i); }

	const overlayOpts = ['light', 'medium', 'dark'] as const;
</script>

<svelte:head><title>SeTem Page · Site Content · Cakna Hub Admin</title></svelte:head>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a href="/admin/site" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">
			<ArrowLeft size={16} /> Site
		</a>
		<span class="text-zinc-300">/</span>
		<h1 class="text-xl font-bold text-zinc-900">SeTem Page</h1>
	</div>

	{#if formResult?.error}
		<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formResult.error}</div>
	{/if}

	<form method="POST" class="space-y-3">
		<input type="hidden" name="json" value={json} />

		<!-- ── Hero ──────────────────────────────────────────────────────────────── -->
		<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
			<button type="button" onclick={() => toggle('hero')}
				class="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
				Hero Section
				{#if open.hero}<ChevronUp size={18} class="text-zinc-400" />{:else}<ChevronDown size={18} class="text-zinc-400" />{/if}
			</button>
			{#if open.hero}
				<div class="border-t border-zinc-100 px-5 py-5 space-y-4">
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Eyebrow</span>
						<input class="field" bind:value={p.eyebrow} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Heading</span>
						<input class="field" bind:value={p.heading} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Subtext</span>
						<textarea class="field" rows="3" bind:value={p.subtext}></textarea>
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Overlay Strength</span>
						<select class="field" bind:value={p.heroOverlay}>
							{#each overlayOpts as o}<option value={o}>{o}</option>{/each}
						</select>
					</label>
				</div>
			{/if}
		</div>

		<!-- ── The Gap ───────────────────────────────────────────────────────────── -->
		<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
			<button type="button" onclick={() => toggle('gap')}
				class="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
				The Gap
				{#if open.gap}<ChevronUp size={18} class="text-zinc-400" />{:else}<ChevronDown size={18} class="text-zinc-400" />{/if}
			</button>
			{#if open.gap}
				<div class="border-t border-zinc-100 px-5 py-5 space-y-4">
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Eyebrow</span>
						<input class="field" bind:value={p.gapEyebrow} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Title</span>
						<input class="field" bind:value={p.gapTitle} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Subtitle</span>
						<textarea class="field" rows="2" bind:value={p.gapSubtitle}></textarea>
					</label>
					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm font-medium text-zinc-700">Stats</span>
							<button type="button" onclick={addStat} class="add-btn"><Plus size={13} /> Add</button>
						</div>
						<div class="space-y-2">
							{#each p.gapStats as stat, i}
								<div class="flex gap-2 items-start">
									<div class="flex-1 space-y-1.5">
										<input class="field" bind:value={stat.value} placeholder="Value (e.g. 40%)" />
										<input class="field" bind:value={stat.label} placeholder="Label" />
									</div>
									<button type="button" onclick={() => removeStat(i)} class="del-btn mt-1"><Trash2 size={15} /></button>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- ── What Is SETEM ─────────────────────────────────────────────────────── -->
		<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
			<button type="button" onclick={() => toggle('whatIsSetem')}
				class="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
				What Is SETEM
				{#if open.whatIsSetem}<ChevronUp size={18} class="text-zinc-400" />{:else}<ChevronDown size={18} class="text-zinc-400" />{/if}
			</button>
			{#if open.whatIsSetem}
				<div class="border-t border-zinc-100 px-5 py-5 space-y-4">
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Eyebrow</span>
						<input class="field" bind:value={p.whatEyebrow} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Title</span>
						<input class="field" bind:value={p.whatTitle} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Body</span>
						<textarea class="field" rows="5" bind:value={p.whatBody}></textarea>
					</label>
				</div>
			{/if}
		</div>

		<!-- ── What to Expect ─────────────────────────────────────────────────────── -->
		<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
			<button type="button" onclick={() => toggle('whatToExpect')}
				class="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
				What to Expect
				{#if open.whatToExpect}<ChevronUp size={18} class="text-zinc-400" />{:else}<ChevronDown size={18} class="text-zinc-400" />{/if}
			</button>
			{#if open.whatToExpect}
				<div class="border-t border-zinc-100 px-5 py-5 space-y-4">
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Section Title</span>
						<input class="field" bind:value={p.expectTitle} />
					</label>
					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm font-medium text-zinc-700">Items</span>
							<button type="button" onclick={addExpect} class="add-btn"><Plus size={13} /> Add</button>
						</div>
						<div class="space-y-2">
							{#each p.expect as _, i}
								<div class="flex gap-2 items-center">
									<input class="field flex-1" bind:value={p.expect[i]} placeholder="e.g. Interactive Workshops" />
									<button type="button" onclick={() => removeExpect(i)} class="del-btn"><Trash2 size={15} /></button>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- ── Who Is It For ─────────────────────────────────────────────────────── -->
		<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
			<button type="button" onclick={() => toggle('whoIsItFor')}
				class="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
				Who Is It For
				{#if open.whoIsItFor}<ChevronUp size={18} class="text-zinc-400" />{:else}<ChevronDown size={18} class="text-zinc-400" />{/if}
			</button>
			{#if open.whoIsItFor}
				<div class="border-t border-zinc-100 px-5 py-5 space-y-4">
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Eyebrow</span>
						<input class="field" bind:value={p.audienceEyebrow} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Title</span>
						<input class="field" bind:value={p.audienceTitle} />
					</label>
					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm font-medium text-zinc-700">Audience Cards</span>
							<button type="button" onclick={addAudience} class="add-btn"><Plus size={13} /> Add</button>
						</div>
						<div class="space-y-3">
							{#each p.audience as item, i}
								<div class="rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-2">
									<div class="flex items-center justify-between">
										<span class="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Card {i + 1}</span>
										<button type="button" onclick={() => removeAudience(i)} class="del-btn"><Trash2 size={14} /></button>
									</div>
									<input class="field" bind:value={item.title} placeholder="Title" />
									<textarea class="field" rows="2" bind:value={item.desc} placeholder="Description"></textarea>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- ── Our Process ────────────────────────────────────────────────────────── -->
		<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
			<button type="button" onclick={() => toggle('ourProcess')}
				class="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
				Our Process
				{#if open.ourProcess}<ChevronUp size={18} class="text-zinc-400" />{:else}<ChevronDown size={18} class="text-zinc-400" />{/if}
			</button>
			{#if open.ourProcess}
				<div class="border-t border-zinc-100 px-5 py-5 space-y-4">
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Eyebrow</span>
						<input class="field" bind:value={p.processEyebrow} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Title</span>
						<input class="field" bind:value={p.processTitle} />
					</label>
					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm font-medium text-zinc-700">Steps</span>
							<button type="button" onclick={addStep} class="add-btn"><Plus size={13} /> Add</button>
						</div>
						<div class="space-y-3">
							{#each p.steps as step, i}
								<div class="rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-2">
									<div class="flex items-center justify-between">
										<span class="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Step {i + 1}</span>
										<button type="button" onclick={() => removeStep(i)} class="del-btn"><Trash2 size={14} /></button>
									</div>
									<input class="field" bind:value={step.title} placeholder="Title" />
									<textarea class="field" rows="2" bind:value={step.desc} placeholder="Description"></textarea>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- ── CTA ───────────────────────────────────────────────────────────────── -->
		<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
			<button type="button" onclick={() => toggle('cta')}
				class="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
				Call to Action
				{#if open.cta}<ChevronUp size={18} class="text-zinc-400" />{:else}<ChevronDown size={18} class="text-zinc-400" />{/if}
			</button>
			{#if open.cta}
				<div class="border-t border-zinc-100 px-5 py-5 space-y-4">
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Heading</span>
						<input class="field" bind:value={p.ctaHeading} />
					</label>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Text</span>
						<textarea class="field" rows="2" bind:value={p.ctaText}></textarea>
					</label>
					<div class="grid gap-4 sm:grid-cols-2">
						<label class="flex flex-col gap-1.5">
							<span class="text-sm font-medium text-zinc-700">Button Label</span>
							<input class="field" bind:value={p.ctaLabel} />
						</label>
						<label class="flex flex-col gap-1.5">
							<span class="text-sm font-medium text-zinc-700">Button Link</span>
							<input class="field" bind:value={p.ctaHref} />
						</label>
					</div>
					<label class="flex flex-col gap-1.5">
						<span class="text-sm font-medium text-zinc-700">Overlay Strength</span>
						<select class="field" bind:value={p.ctaOverlay}>
							{#each overlayOpts as o}<option value={o}>{o}</option>{/each}
						</select>
					</label>
				</div>
			{/if}
		</div>

		<div class="flex justify-end gap-3 pt-2">
			<a href="/admin/site" class="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</a>
			<button type="submit" class="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Save Changes</button>
		</div>
	</form>
</div>

<style>
	:global(.field) {
		width: 100%;
		border-radius: 0.75rem;
		border: 1px solid #d4d4d8;
		padding: 0.625rem 0.75rem;
		font-size: 0.875rem;
		color: #27272a;
		resize: vertical;
	}
	:global(.field:focus) {
		outline: none;
		border-color: #fb7185;
		box-shadow: 0 0 0 3px rgb(251 113 133 / 0.15);
	}
	:global(.add-btn) {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		border-radius: 0.5rem;
		border: 1px solid #d4d4d8;
		padding: 0.25rem 0.625rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #52525b;
	}
	:global(.add-btn:hover) { background: #f4f4f5; }
	:global(.del-btn) {
		border-radius: 0.5rem;
		padding: 0.375rem;
		color: #a1a1aa;
	}
	:global(.del-btn:hover) { color: #ef4444; background: #fef2f2; }
</style>
