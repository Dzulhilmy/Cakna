<script lang="ts">
	import { Trash2 } from 'lucide-svelte';
	let { data } = $props();
	const { files } = $derived(data);

	// files are full paths like /uploads/site-xxx.jpg
	const displayName = (path: string) => path.replace(/^\/uploads\//, '');
	const isImage = (path: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path);
</script>
<svelte:head><title>Media · Cakna Hub Admin</title></svelte:head>
<div class="space-y-8">
	<header>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Media Library</h1>
		<p class="mt-1.5 text-zinc-500">{files.length} file{files.length !== 1 ? 's' : ''} in /public/uploads/.</p>
	</header>
	{#if files.length === 0}
		<div class="rounded-2xl border border-zinc-200 bg-white py-16 text-center text-sm text-zinc-400">No files uploaded yet.</div>
	{:else}
		<div class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
			{#each files as path (path)}
				<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
					{#if isImage(path)}
						<img src={path} alt={displayName(path)} class="aspect-square w-full object-cover" />
					{:else}
						<div class="aspect-square flex items-center justify-center bg-zinc-50 text-4xl">📄</div>
					{/if}
					<div class="p-3 flex items-center justify-between gap-2">
						<p class="truncate text-xs text-zinc-600" title={path}>{displayName(path)}</p>
						<form method="POST" action="?/delete">
							<input type="hidden" name="name" value={displayName(path)} />
							<button
								type="submit"
								onclick={(e) => { if (!confirm('Delete this file?')) e.preventDefault(); }}
								class="text-red-500 hover:text-red-700"
							>
								<Trash2 size={14} />
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
