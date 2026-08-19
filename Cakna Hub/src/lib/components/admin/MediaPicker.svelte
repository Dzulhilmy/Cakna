<script lang="ts">
	import { Upload, X, Image } from 'lucide-svelte';

	interface Props {
		open: boolean;
		onselect: (url: string) => void;
		onclose?: () => void;
	}

	let { open = $bindable(false), onselect, onclose }: Props = $props();

	let files: string[] = $state([]);
	let loading = $state(false);
	let uploading = $state(false);
	let tab: 'library' | 'upload' = $state('library');

	$effect(() => {
		if (open) {
			tab = 'library';
			loadFiles();
		}
	});

	function close() {
		open = false;
		onclose?.();
	}

	function select(url: string) {
		onselect(url);
		close();
	}

	async function loadFiles() {
		loading = true;
		try {
			const res = await fetch('/hub/admin/api/media');
			if (res.ok) files = await res.json();
		} catch {
			files = [];
		} finally {
			loading = false;
		}
	}

	async function handleUpload(e: Event & { currentTarget: HTMLInputElement }) {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		uploading = true;
		try {
			const form = new FormData();
			form.append('file', file);
			const res = await fetch('/hub/admin/api/media', { method: 'POST', body: form });
			if (res.ok) {
				const data = await res.json();
				if (data.url) {
					await loadFiles();
					select(data.url);
					return;
				}
			}
		} catch {
			// ignore
		} finally {
			uploading = false;
			e.currentTarget.value = '';
		}
	}

	function handleBackdrop(e: MouseEvent & { currentTarget: HTMLDivElement }) {
		if (e.target === e.currentTarget) close();
	}

	const isImg = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
		role="presentation"
		onclick={handleBackdrop}
	>
		<!-- Dialog panel -->
		<div
			class="flex w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
			style="max-height: min(85vh, 680px)"
		>
			<!-- Header -->
			<div class="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4">
				<h2 class="text-base font-semibold text-zinc-900">Media Library</h2>
				<button
					type="button"
					onclick={close}
					class="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
				>
					<X size={16} />
				</button>
			</div>

			<!-- Tabs -->
			<div class="flex shrink-0 gap-1 border-b border-zinc-100 px-5">
				{#each [['library', 'Library'], ['upload', 'Upload new']] as [key, label] (key)}
					<button
						type="button"
						onclick={() => (tab = key as 'library' | 'upload')}
						class="relative py-3 text-sm font-medium transition-colors {tab === key
							? 'text-rose-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-rose-500'
							: 'text-zinc-500 hover:text-zinc-800'}"
					>
						{label}
					</button>
				{/each}
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto p-5">
				{#if tab === 'library'}
					{#if loading}
						<div class="py-16 text-center text-sm text-zinc-400">Loading…</div>
					{:else if files.filter(isImg).length === 0}
						<div class="flex flex-col items-center gap-3 py-16 text-center">
							<Image size={32} class="text-zinc-300" />
							<p class="text-sm text-zinc-400">No images yet. Switch to the Upload tab to add one.</p>
						</div>
					{:else}
						<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
							{#each files.filter(isImg) as url (url)}
								<button
									type="button"
									onclick={() => select(url)}
									title={url}
									class="group relative aspect-square overflow-hidden rounded-xl border-2 border-transparent transition-all hover:border-rose-400 focus:border-rose-500 focus:outline-none"
								>
									<img src={url} alt="" class="h-full w-full object-cover" loading="lazy" />
									<div
										class="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<span class="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-rose-600"
											>Select</span
										>
									</div>
								</button>
							{/each}
						</div>
					{/if}
				{:else}
					<!-- Upload tab -->
					<label
						class="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 px-6 py-12 text-center transition-colors hover:border-rose-300 {uploading
							? 'cursor-wait opacity-60'
							: 'cursor-pointer'}"
					>
						<div
							class="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500"
						>
							<Upload size={24} />
						</div>
						<div>
							<p class="text-sm font-medium text-zinc-700">
								{uploading ? 'Uploading…' : 'Click to choose an image'}
							</p>
							<p class="mt-1 text-xs text-zinc-400">JPG, PNG, GIF, WebP, SVG · max 10 MB</p>
						</div>
						<input
							type="file"
							accept="image/*"
							class="sr-only"
							disabled={uploading}
							onchange={handleUpload}
						/>
					</label>
				{/if}
			</div>
		</div>
	</div>
{/if}
