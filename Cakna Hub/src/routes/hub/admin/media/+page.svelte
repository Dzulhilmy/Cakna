<script lang="ts">
	import { Trash2, Upload, Copy, Check } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const { files } = $derived(data);

	let uploading = $state(false);
	let copied = $state('');

	// files from listMedia are full paths like /uploads/site-xxx.jpg
	function displayName(path: string) {
		return path.replace(/^\/uploads\//, '');
	}

	function copyUrl(path: string) {
		navigator.clipboard.writeText(path);
		copied = path;
		setTimeout(() => { copied = ''; }, 2000);
	}

	function isImage(path: string) {
		return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path);
	}
</script>

<svelte:head><title>Media · Cakna Hub Admin</title></svelte:head>

<div class="space-y-8">
	<header>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Media Library</h1>
		<p class="mt-1.5 text-zinc-500">
			{files.length} file{files.length !== 1 ? 's' : ''} in /public/uploads/.
		</p>
	</header>

	{#if form?.error}
		<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</div>
	{/if}

	<!-- Upload form -->
	<form
		method="POST"
		action="?/upload"
		enctype="multipart/form-data"
		class="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-6 transition-colors hover:border-rose-200"
		use:enhance={() => {
			uploading = true;
			return async ({ update }) => { await update(); uploading = false; };
		}}
	>
		<div class="flex flex-wrap items-center gap-4">
			<label class="flex cursor-pointer items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700">
				<Upload size={16} />
				{uploading ? 'Uploading…' : 'Upload file'}
				<input
					type="file"
					name="file"
					class="sr-only"
					accept="image/*,.pdf,.doc,.docx"
					disabled={uploading}
					onchange={(e) => e.currentTarget.form?.requestSubmit()}
				/>
			</label>
			<p class="text-sm text-zinc-400">Images, PDFs, documents — max 10 MB</p>
		</div>
	</form>

	{#if files.length === 0}
		<div class="rounded-2xl border border-zinc-200 bg-white py-16 text-center text-sm text-zinc-400">
			No files uploaded yet.
		</div>
	{:else}
		<div class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
			{#each files as path (path)}
				<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
					{#if isImage(path)}
						<img src={path} alt={displayName(path)} class="aspect-square w-full object-cover" />
					{:else}
						<div class="aspect-square flex items-center justify-center bg-zinc-50 text-4xl">📄</div>
					{/if}
					<div class="p-3 flex items-center justify-between gap-2 border-t border-zinc-100">
						<p class="truncate text-xs text-zinc-600" title={path}>{displayName(path)}</p>
						<div class="flex shrink-0 items-center gap-1">
							<button
								type="button"
								onclick={() => copyUrl(path)}
								title="Copy URL"
								class="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
							>
								{#if copied === path}
									<Check size={13} class="text-emerald-500" />
								{:else}
									<Copy size={13} />
								{/if}
							</button>
							<form method="POST" action="?/delete" use:enhance class="inline-flex">
								<input type="hidden" name="name" value={displayName(path)} />
								<button
									type="submit"
									onclick={(e) => { if (!confirm('Delete this file?')) e.preventDefault(); }}
									class="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-600"
								>
									<Trash2 size={13} />
								</button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
