<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import { auth } from '$lib/state/auth.svelte';

	interface RoomRow {
		id: string;
		slug: string;
		title: string;
		host: string | null;
		speaker: string | null;
		created_at: number;
	}

	let rooms = $state<RoomRow[]>([]);
	let configured = $state(true);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let title = $state('');
	let creating = $state(false);

	const isAdmin = $derived(auth.user?.is_admin === true);

	async function load() {
		loading = true;
		try {
			const r = await fetch('/api/halaqah/rooms', { credentials: 'same-origin' });
			if (r.status === 401) {
				error = 'unauth';
				return;
			}
			const d = await r.json();
			rooms = d.rooms ?? [];
			configured = d.livekit_configured !== false;
			error = null;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function create(e: SubmitEvent) {
		e.preventDefault();
		if (!title.trim() || creating) return;
		creating = true;
		try {
			const r = await fetch('/api/halaqah/rooms', {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: title.trim() })
			});
			if (!r.ok) throw new Error((await r.json())?.error ?? `HTTP ${r.status}`);
			const room = await r.json();
			await goto(`/halaqah/${room.slug}`);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			creating = false;
		}
	}

	const ago = (t: number) => {
		const m = Math.floor((Date.now() / 1000 - t) / 60);
		if (m < 1) return 'baru sahaja';
		if (m < 60) return `${m} minit lalu`;
		const h = Math.floor(m / 60);
		return h < 24 ? `${h} jam lalu` : `${Math.floor(h / 24)} hari lalu`;
	};

	$effect(() => {
		void load();
	});
</script>

<PageHeader title="Halaqah" subtitle="Sesi suara berkumpulan" />

<div class="wrap">
	{#if error === 'unauth'}
		<div class="card note">
			<p>Log masuk untuk menyertai halaqah.</p>
			<a class="btn" href="/auth/login?next=/halaqah">Log masuk</a>
		</div>
	{:else}
		{#if !configured}
			<div class="card warn">
				Pelayan suara (LiveKit) belum dikonfigurasikan. Set <code>LIVEKIT_API_KEY</code> dan
				<code>LIVEKIT_API_SECRET</code> pada pelayan.
			</div>
		{/if}

		{#if isAdmin}
			<form class="card create" onsubmit={create}>
				<label for="ttl">Buka halaqah baharu</label>
				<div class="row">
					<input
						id="ttl"
						bind:value={title}
						maxlength="80"
						placeholder="cth. Tadarus Malam Khamis"
						disabled={creating || !configured}
					/>
					<button class="btn" type="submit" disabled={creating || !title.trim() || !configured}>
						{creating ? 'Membuka…' : 'Buka'}
					</button>
				</div>
				<p class="hint">Anda menjadi hos. Sesi ditutup secara automatik selepas 5 jam — atau lebih awal jika anda tutup sendiri.</p>
			</form>
		{/if}

		{#if loading}
			<div class="card muted">Memuatkan…</div>
		{:else if rooms.length === 0}
			<div class="card muted">
				Tiada halaqah aktif buat masa ini.
				{#if !isAdmin}<br />Hos akan membuka sesi apabila bersedia.{/if}
			</div>
		{:else}
			<ul class="list">
				{#each rooms as r (r.id)}
					<li>
						<a class="room" href="/halaqah/{r.slug}">
							<div>
								<div class="t">{r.title}</div>
								<div class="m">
									Hos: {r.host ?? '—'} · {ago(r.created_at)}
								</div>
							</div>
							<div class="right">
								{#if r.speaker}
									<span class="badge live">🎙 {r.speaker}</span>
								{:else}
									<span class="badge">Menunggu</span>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>

<style>
	.wrap {
		max-width: 560px;
		margin: 0 auto;
		padding: 16px 20px 96px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.card {
		background: var(--card, #fff);
		border: 1px solid var(--border, #e4dcc8);
		border-radius: 14px;
		padding: 16px;
	}
	.muted { color: var(--muted-foreground, #5c6b63); text-align: center; }
	.warn { background: #fbf1d6; border-color: #e9d9a8; color: #6b5518; font-size: 14px; }
	.note { text-align: center; display: grid; gap: 12px; justify-items: center; }
	.create label { font-size: 13px; font-weight: 600; display: block; margin-bottom: 8px; }
	.row { display: flex; gap: 8px; }
	.row input {
		flex: 1;
		height: 42px;
		padding: 0 12px;
		border-radius: 10px;
		border: 1px solid var(--border, #e4dcc8);
		background: var(--background, #fbf7ec);
		font-size: 15px;
	}
	.btn {
		height: 42px;
		padding: 0 18px;
		border: 0;
		border-radius: 10px;
		background: var(--primary, #155b44);
		color: #fff;
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
	}
	.btn:disabled { opacity: 0.5; cursor: default; }
	.hint { margin: 8px 0 0; font-size: 12px; color: var(--muted-foreground, #5c6b63); }
	.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
	.room {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 14px 16px;
		border: 1px solid var(--border, #e4dcc8);
		border-radius: 14px;
		background: var(--card, #fff);
		text-decoration: none;
		color: inherit;
	}
	.t { font-weight: 600; font-size: 15px; }
	.m { font-size: 12.5px; color: var(--muted-foreground, #5c6b63); margin-top: 3px; }
	.badge {
		font-size: 12px;
		padding: 5px 10px;
		border-radius: 999px;
		background: var(--muted, #f0ece1);
		color: var(--muted-foreground, #5c6b63);
		white-space: nowrap;
	}
	.badge.live { background: #dff3e8; color: #155b44; font-weight: 600; }
</style>
