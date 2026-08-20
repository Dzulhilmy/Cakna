<script lang="ts">
	import StatCard from '$lib/components/admin/StatCard.svelte';
	import FundingBars from '$lib/components/admin/FundingBars.svelte';
	import StatusBadge from '$lib/components/society/StatusBadge.svelte';
	import { formatRM } from '$lib/format';

	let { data } = $props();
	const { summary, states, disbursedPct, pendingCount, recentApplications } = $derived(data);
</script>

<svelte:head><title>Dashboard · Cakna Hub Admin</title></svelte:head>

<div class="space-y-8">
	<header>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
		<p class="mt-1.5 text-zinc-500">Funding collected and given across all reports and funding applications, categorized by state.</p>
	</header>

	<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatCard label="Total Collected" value={formatRM(summary.collected)} hint="{summary.reportCount} programme reports" dot="rose" />
		<StatCard label="Total Given" value={formatRM(summary.given)} hint="{disbursedPct}% of collected" dot="amber" />
		<StatCard label="Net Balance" value={formatRM(summary.net)} hint="Collected − Given" dot="zinc" />
		<StatCard label="Approved Funding" value={String(summary.applicationCount)} hint="{formatRM(summary.applicationTotal)} disbursed{pendingCount > 0 ? ` · ${pendingCount} pending` : ''}" />
	</section>

	<section class="rounded-2xl border border-zinc-200 bg-white p-6">
		<div class="mb-6 flex flex-wrap items-start justify-between gap-3">
			<div>
				<h2 class="text-base font-semibold text-zinc-900">Funding by state</h2>
				<p class="mt-0.5 text-sm text-zinc-500">
					Collected vs given, ranked by amount collected
					{#if summary.applicationCount > 0}
						— including {summary.applicationCount} approved funding application{summary.applicationCount !== 1 ? 's' : ''}
					{/if}.
				</p>
			</div>
			<div class="flex items-center gap-3 text-xs">
				<span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-rose-400/60"></span>Collected</span>
				<span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-amber-400/80"></span>Given</span>
			</div>
		</div>
		<FundingBars rows={states} />
	</section>

	{#if recentApplications.length > 0}
		<section class="rounded-2xl border border-zinc-200 bg-white p-6">
			<div class="mb-5 flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 class="text-base font-semibold text-zinc-900">Recent funding applications</h2>
					<p class="mt-0.5 text-sm text-zinc-500">Live from Society &amp; Others.</p>
				</div>
				<a href="/society/funding" class="inline-flex items-center gap-1 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700">
					View all →
				</a>
			</div>
			<ul class="divide-y divide-zinc-100">
				{#each recentApplications as a (a.id)}
					<li class="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
						<div class="min-w-0">
							<p class="truncate text-sm font-medium text-zinc-900">{a.namaProgram}</p>
							<p class="text-xs text-zinc-400">{a.reference} · {a.cawangan} ({a.state})</p>
						</div>
						<div class="flex shrink-0 items-center gap-3">
							<StatusBadge status={a.status} />
							<span class="text-sm font-medium tabular-nums text-zinc-800">{formatRM(a.jumlahPerbelanjaan)}</span>
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
