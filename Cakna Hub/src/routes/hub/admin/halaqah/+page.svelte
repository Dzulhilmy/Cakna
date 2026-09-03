<script lang="ts">
	import { enhance } from '$app/forms';
	import { Radio, Plus, X, ExternalLink, Clock, Users } from 'lucide-svelte';

	let { data, form } = $props();

	let creating = $state(false);
	let newTitle = $state('');
	let closingSlug = $state<string | null>(null);

	function fmtAge(iso: string) {
		const ms = Date.now() - new Date(iso).getTime();
		const m = Math.floor(ms / 60000);
		if (m < 1) return 'Baru sahaja';
		if (m < 60) return `${m} min`;
		return `${Math.floor(m / 60)} jam ${m % 60} min`;
	}
</script>

<svelte:head><title>Halaqah — Admin</title></svelte:head>

<div class="space-y-8">
	<!-- Page header -->
	<div class="flex items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-zinc-900">Halaqah</h1>
			<p class="mt-1 text-sm text-zinc-500">Urus sesi halaqah langsung untuk ahli.</p>
		</div>
		<div class="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
			<Radio size={13} />
			{data.rooms.length} sesi aktif
		</div>
	</div>

	<!-- Create room -->
	<div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">Buat Sesi Baru</h2>
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				creating = true;
				return async ({ update }) => {
					await update();
					creating = false;
					if (form?.created) newTitle = '';
				};
			}}
			class="flex gap-3"
		>
			<input
				name="title"
				bind:value={newTitle}
				placeholder="Tajuk sesi (cth: Halaqah Pagi Isnin)"
				required
				class="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100"
			/>
			<button
				type="submit"
				disabled={creating || !newTitle.trim()}
				class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
			>
				<Plus size={15} />
				{creating ? 'Mencipta…' : 'Cipta'}
			</button>
		</form>

		{#if form?.error}
			<p class="mt-3 text-sm text-red-600">{form.error}</p>
		{/if}
		{#if form?.created && form?.slug}
			<div class="mt-3 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
				<Radio size={15} class="shrink-0 text-green-600" />
				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium text-green-800">Sesi berjaya dicipta!</p>
					<p class="text-xs text-green-600">Kod: <strong>{form.slug}</strong></p>
				</div>
				<a
					href="/halaqah/{form.slug}"
					class="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
				>
					<ExternalLink size={12} />
					Masuk Sesi
				</a>
			</div>
		{/if}
	</div>

	<!-- Active rooms -->
	<div class="rounded-2xl border border-zinc-200 bg-white shadow-sm">
		<div class="border-b border-zinc-100 px-6 py-4">
			<h2 class="text-sm font-semibold text-zinc-800">Sesi Sedang Berlangsung</h2>
		</div>

		{#if data.rooms.length === 0}
			<div class="flex flex-col items-center gap-3 px-6 py-16 text-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
					<Radio size={22} />
				</div>
				<p class="text-sm text-zinc-400">Tiada sesi halaqah aktif pada masa ini.</p>
			</div>
		{:else}
			<div class="divide-y divide-zinc-100">
				{#each data.rooms as room (room.id)}
					<div class="flex items-center gap-4 px-6 py-4">
						<!-- Live indicator + info -->
						<div class="flex min-w-0 flex-1 items-center gap-3">
							<span class="relative flex h-2.5 w-2.5 shrink-0">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
								<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
							</span>
							<div class="min-w-0">
								<p class="truncate font-semibold text-zinc-900">{room.title}</p>
								<div class="mt-0.5 flex items-center gap-3 text-xs text-zinc-400">
									<span class="flex items-center gap-1">
										<Clock size={10} />
										{fmtAge(room.created_at)}
									</span>
									{#if room.host_name}
										<span class="flex items-center gap-1">
											<Users size={10} />
											Hos: {room.host_name}
										</span>
									{/if}
									{#if room.member_count != null}
										<span>{room.member_count} ahli</span>
									{/if}
								</div>
							</div>
						</div>

						<!-- Slug badge -->
						<code class="hidden rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-500 sm:block">{room.slug}</code>

						<!-- Actions -->
						<div class="flex shrink-0 items-center gap-2">
							<a
								href="/halaqah/{room.slug}"
								class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
							>
								<ExternalLink size={12} />
								Masuk
							</a>
							<form
								method="POST"
								action="?/close"
								use:enhance={() => {
									closingSlug = room.slug;
									return async ({ update }) => {
										await update();
										closingSlug = null;
									};
								}}
							>
								<input type="hidden" name="slug" value={room.slug} />
								<button
									type="submit"
									disabled={closingSlug === room.slug}
									class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
								>
									<X size={12} />
									{closingSlug === room.slug ? 'Menutup…' : 'Tutup'}
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
