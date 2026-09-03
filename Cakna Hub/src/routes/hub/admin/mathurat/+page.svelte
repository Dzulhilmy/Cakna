<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
	const { overview, userAdmin, error } = $derived(data);

	const DOW = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];

	function fmtLast(v: number | string | null | undefined): string {
		if (!v) return 'Belum aktif';
		const d =
			typeof v === 'number'
				? new Date(v * 1000)
				: new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v) + 'T00:00:00' : String(v));
		if (isNaN(d.getTime())) return 'Belum aktif';
		const days = Math.floor((Date.now() - d.getTime()) / 86400000);
		if (days <= 0) return 'Hari ini';
		if (days === 1) return 'Semalam';
		if (days < 30) return days + ' hari lalu';
		return d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
	}

	function fmtGen(unix: number | null | undefined): string {
		if (!unix) return '';
		const d = new Date(unix * 1000);
		return (
			'Dikemas kini ' +
			d.toLocaleString('ms-MY', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
		);
	}

	const adminMap = $derived.by(() => {
		const m: Record<string, { effective_admin: boolean; allowlisted: boolean; is_admin: boolean }> = {};
		(userAdmin?.users ?? []).forEach((u) => (m[u.id] = u));
		return m;
	});

	const weeklyMax = $derived(
		Math.max(1, ...(overview?.weekly ?? []).map((d) => Math.max(d.pagi, d.petang)))
	);

	const loginTotal = $derived(
		(overview?.login_split.qcxis ?? 0) + (overview?.login_split.email ?? 0) || 1
	);
</script>

<svelte:head><title>Mathurat Dashboard · Cakna Hub Admin</title></svelte:head>

<div class="space-y-6">
	<header class="flex flex-wrap items-start justify-between gap-3">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Mathurat Dashboard</h1>
			<p class="mt-1 text-sm text-zinc-500">
				{#if overview}
					{fmtGen(overview.generated_at)}
				{:else}
					Kemajuan Al-Ma'thurat dan peranan setiap ahli.
				{/if}
			</p>
		</div>
		<a
			href="https://cakna.org/admin"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700"
		>
			<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
			</svg>
			Buka asal
		</a>
	</header>

	{#if error}
		<div class="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
			<p class="font-semibold">Gagal memuatkan data</p>
			<p class="mt-1 text-red-600">{error}</p>
			<p class="mt-2 text-red-500">Pastikan akaun ini adalah admin Cakna.</p>
		</div>
	{:else if overview && userAdmin}
		<!-- KPI cards -->
		<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
				<p class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Jumlah ahli</p>
				<p class="mt-2 font-serif text-4xl text-zinc-900">{overview.kpis.total_users}</p>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
				<p class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Aktif hari ini</p>
				<p class="mt-2 font-serif text-4xl text-zinc-900">{overview.kpis.active_today}</p>
				<p class="mt-1.5 text-xs text-zinc-400">log masuk 24 jam</p>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
				<p class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Purata siap</p>
				<p class="mt-2 font-serif text-4xl text-zinc-900">{overview.kpis.avg_completion}%</p>
				<p class="mt-1.5 text-xs text-zinc-400">wirid semasa</p>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
				<p class="text-xs font-semibold uppercase tracking-wide text-zinc-400">Sesi minggu ini</p>
				<p class="mt-2 font-serif text-4xl text-zinc-900">{overview.kpis.sessions_week}</p>
				<p class="mt-1.5 text-xs text-zinc-400">pagi + petang</p>
			</div>
		</section>

		<!-- Weekly chart + Login split / Streak leaders -->
		<div class="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
			<!-- Weekly bar chart -->
			<div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
				<h2 class="text-base font-semibold text-zinc-900">Kemajuan 7 hari</h2>
				<p class="mt-0.5 text-xs text-zinc-400">Bilangan ahli yang menyiapkan wirid pagi / petang setiap hari.</p>
				<div class="mt-5 flex h-36 items-end justify-between gap-2">
					{#each overview.weekly as day (day.date)}
						{@const ph = Math.round((day.pagi / weeklyMax) * 100)}
						{@const th = Math.round((day.petang / weeklyMax) * 100)}
						<div class="flex flex-1 flex-col items-center gap-1.5">
							<div class="flex w-full items-end justify-center gap-0.5" style="height:112px" title="{day.date}: pagi {day.pagi}, petang {day.petang}">
								<div class="w-2.5 rounded-t-sm bg-emerald-600 transition-all" style="height:{ph}%;min-height:{day.pagi > 0 ? '3px' : '0'}"></div>
								<div class="w-2.5 rounded-t-sm bg-amber-400 transition-all" style="height:{th}%;min-height:{day.petang > 0 ? '3px' : '0'}"></div>
							</div>
							<span class="text-[10px] font-semibold text-zinc-400">{DOW[day.dow] ?? ''}</span>
						</div>
					{/each}
				</div>
				<div class="mt-4 flex gap-4 text-xs text-zinc-400">
					<span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-emerald-600"></span>Pagi</span>
					<span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-amber-400"></span>Petang</span>
				</div>
			</div>

			<!-- Login split + Streak leaders -->
			<div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
				<div>
					<h2 class="text-base font-semibold text-zinc-900">Kaedah log masuk</h2>
					<p class="mt-0.5 text-xs text-zinc-400">Bagaimana ahli mengesahkan identiti.</p>
					<div class="mt-4 space-y-3">
						<div class="flex items-center gap-3">
							<span class="w-20 shrink-0 text-sm text-zinc-600">QCXIS SSO</span>
							<div class="flex-1 h-2.5 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
								<div class="h-full bg-emerald-600 rounded-full" style="width:{Math.round((overview.login_split.qcxis / loginTotal) * 100)}%"></div>
							</div>
							<span class="w-6 shrink-0 text-right text-sm font-bold text-zinc-800">{overview.login_split.qcxis}</span>
						</div>
						<div class="flex items-center gap-3">
							<span class="w-20 shrink-0 text-sm text-zinc-600">Emel</span>
							<div class="flex-1 h-2.5 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
								<div class="h-full bg-amber-400 rounded-full" style="width:{Math.round((overview.login_split.email / loginTotal) * 100)}%"></div>
							</div>
							<span class="w-6 shrink-0 text-right text-sm font-bold text-zinc-800">{overview.login_split.email}</span>
						</div>
					</div>
				</div>

				<div>
					<h2 class="text-base font-semibold text-zinc-900">Peneraju streak</h2>
					<p class="mt-0.5 text-xs text-zinc-400">Ahli dengan streak terpanjang.</p>
					{#if overview.streak_leaders.length > 0}
						<ul class="mt-4 space-y-3">
							{#each overview.streak_leaders as leader (leader.email)}
								<li class="flex items-center gap-3">
									<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xs font-bold text-white">
										{leader.initials || '??'}
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium text-zinc-800">{leader.name || '(tanpa nama)'}</p>
										<p class="truncate text-xs text-zinc-400">{leader.email}</p>
									</div>
									<span class="shrink-0 text-sm font-bold text-amber-500">🔥 {leader.streak}</span>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="mt-4 text-sm text-zinc-400">Tiada streak aktif lagi.</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Members table -->
		<div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
			<h2 class="text-base font-semibold text-zinc-900">Semua ahli</h2>
			<p class="mt-0.5 mb-5 text-xs text-zinc-400">Kemajuan Al-Ma'thurat dan peranan setiap ahli.</p>

			{#if overview.users.length === 0}
				<p class="py-10 text-center text-sm text-zinc-400">Tiada ahli lagi.</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-zinc-200">
								<th class="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Ahli</th>
								<th class="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Kaedah</th>
								<th class="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Versi</th>
								<th class="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Hari ini</th>
								<th class="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Streak</th>
								<th class="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Sesi (bulan)</th>
								<th class="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Terakhir aktif</th>
								<th class="pb-3 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Admin</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-zinc-100">
							{#each overview.users as u (u.id)}
								{@const a = adminMap[u.id] ?? { effective_admin: false, allowlisted: false, is_admin: false }}
								{@const locked = u.id === userAdmin.me || !!a.allowlisted}
								{@const pct = Math.max(0, Math.min(100, u.headline_pct || 0))}
								<tr class="group">
									<td class="py-3 pr-4">
										<div class="flex items-center gap-2.5">
											<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xs font-bold text-white">
												{u.initials || '??'}
											</div>
											<div class="min-w-0">
												<p class="truncate font-medium text-zinc-800">{u.name || '(tanpa nama)'}</p>
												<p class="truncate text-xs text-zinc-400">{u.email}</p>
											</div>
										</div>
									</td>
									<td class="py-3 pr-4">
										{#if u.login_method === 'qcxis'}
											<span class="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">QCXIS</span>
										{:else}
											<span class="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Emel</span>
										{/if}
									</td>
									<td class="py-3 pr-4 text-xs text-zinc-500">
										{u.version === 'kubra' ? 'Kubra' : u.version ? 'Sughra' : '—'}
									</td>
									<td class="py-3 pr-4">
										<div class="flex items-center gap-2 min-w-[100px]">
											<div class="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
												<div class="h-full bg-emerald-600 rounded-full" style="width:{pct}%"></div>
											</div>
											<span class="w-8 shrink-0 text-right text-xs text-zinc-400">{pct}%</span>
										</div>
									</td>
									<td class="py-3 pr-4">
										<span class="text-sm font-bold text-amber-500">🔥 {u.streak || 0}</span>
									</td>
									<td class="py-3 pr-4 text-sm text-zinc-600">{u.sessions_month || 0}</td>
									<td class="py-3 pr-4 text-xs text-zinc-500">{fmtLast(u.last_active_iso)}</td>
									<td class="py-3">
										<form method="POST" action="?/setRole" use:enhance>
											<input type="hidden" name="user_id" value={u.id} />
											<input type="hidden" name="make_admin" value={a.effective_admin ? 'false' : 'true'} />
											<label class="flex items-center gap-2 cursor-pointer">
												<div class="relative">
													<input
														type="checkbox"
														class="peer sr-only"
														checked={a.effective_admin}
														disabled={locked}
														onchange={(e) => {
															const form = e.currentTarget.closest('form') as HTMLFormElement;
															const hidden = form.querySelector('input[name="make_admin"]') as HTMLInputElement;
															hidden.value = e.currentTarget.checked ? 'true' : 'false';
															form.requestSubmit();
														}}
													/>
													<div class="h-5 w-9 rounded-full bg-zinc-200 transition-colors peer-checked:bg-emerald-600 peer-disabled:opacity-50"></div>
													<div class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4 peer-disabled:opacity-50"></div>
												</div>
												{#if a.allowlisted}
													<span class="text-[10px] text-zinc-400">env</span>
												{:else if u.id === userAdmin.me}
													<span class="text-[10px] text-zinc-400">anda</span>
												{/if}
											</label>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{:else}
		<div class="py-16 text-center text-sm text-zinc-400">Memuatkan…</div>
	{/if}
</div>
