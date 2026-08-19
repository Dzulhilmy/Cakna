<script lang="ts">
	import { goto } from '$app/navigation';
	import { mathuratState } from '$lib/state/stores.svelte';
	import type { MathuratTetapan } from '$lib/state/stores.svelte';
	import { LISTS, VERSI_LABEL } from '$lib/data/mathurat';
	import type { Versi, Waktu } from '$lib/data/mathurat';
	import { Sun, Moon, ArrowRight, RotateCcw } from 'lucide-svelte';

	let { onclose }: { onclose: () => void } = $props();

	const DEFAULT_TETAPAN: MathuratTetapan = {
		arSaiz: 26, bmSaiz: 14, paparBm: true, paparRumi: false,
		jajarAr: 'kanan', jajarBm: 'kiri', bahasa: 'bm',
		getar: true, autoMaju: false, skrinTerang: false, autoWaktu: true
	};

	const autoWaktu: Waktu = new Date().getHours() >= 4 && new Date().getHours() < 13 ? 'pagi' : 'petang';

	let version = $state<Versi>(mathuratState.value?.v2 ? mathuratState.value.version : 'sughra');
	let waktu = $state<Waktu>(mathuratState.value?.v2 ? mathuratState.value.mode : autoWaktu);

	function progFor(v: Versi) {
		const s = mathuratState.value;
		if (!s?.v2) return { idx: 0, total: LISTS[v].length, done: false };
		const idx = s.idx[v] ?? 0;
		const total = LISTS[v].length;
		return { idx, total, done: idx >= total };
	}

	const prog = $derived(progFor(version));
	const ctaLabel = $derived(
		prog.done ? 'Mulakan Semula' : prog.idx > 0 ? 'Teruskan Wirid' : 'Mulakan Wirid'
	);

	function start() {
		const s = mathuratState.value;
		if (!s?.v2) {
			mathuratState.value = {
				v2: true, version, mode: waktu,
				idx: { sughra: 0, kubra: 0 },
				counts: { sughra: LISTS.sughra.map(() => 0), kubra: LISTS.kubra.map(() => 0) },
				tetapan: { ...DEFAULT_TETAPAN },
				rekod: {}
			};
		} else if (prog.done) {
			mathuratState.value = {
				...s, version, mode: waktu,
				idx: { ...s.idx, [version]: 0 },
				counts: { ...s.counts, [version]: LISTS[version].map(() => 0) }
			};
		} else {
			mathuratState.value = { ...s, version, mode: waktu };
		}
		onclose();
		goto('/mathurat');
	}
</script>

<div class="picker">
	<div class="picker-header">
		<span class="picker-title">Al-Ma'thurat</span>
	</div>

	<!-- Version -->
	<div class="section">
		<p class="section-label">Versi</p>
		<div class="toggle-row">
			{#each (['sughra', 'kubra'] as Versi[]) as v}
				{@const p = progFor(v)}
				<button
					class="toggle-btn"
					class:selected={version === v}
					onclick={() => (version = v)}
				>
					{#if p.done}
						<span class="badge-done">✓</span>
					{:else if p.idx > 0}
						<span class="badge-prog">{p.idx}/{p.total}</span>
					{/if}
					<span class="toggle-name">{VERSI_LABEL[v].nama}</span>
					<span class="toggle-sub">{VERSI_LABEL[v].n} item</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Time -->
	<div class="section">
		<p class="section-label">Waktu</p>
		<div class="toggle-row">
			<button class="toggle-btn" class:selected={waktu === 'pagi'} onclick={() => (waktu = 'pagi')}>
				<Sun size={14} />
				<span class="toggle-name">Pagi</span>
			</button>
			<button class="toggle-btn" class:selected={waktu === 'petang'} onclick={() => (waktu = 'petang')}>
				<Moon size={14} />
				<span class="toggle-name">Petang</span>
			</button>
		</div>
	</div>

	<!-- Progress -->
	{#if prog.idx > 0}
		<div class="section">
			<div class="prog-row">
				<span class="prog-text">
					{prog.done ? 'Selesai' : `Item ${prog.idx}`} / {prog.total}
				</span>
				<span class="prog-pct">{Math.round((prog.idx / prog.total) * 100)}%</span>
			</div>
			<div class="prog-track">
				<div
					class="prog-fill"
					style="width: {Math.min(100, (prog.idx / prog.total) * 100)}%"
				></div>
			</div>
		</div>
	{/if}

	<!-- CTA -->
	<button class="cta-btn" onclick={start}>
		{ctaLabel}
		{#if prog.done}
			<RotateCcw size={14} />
		{:else}
			<ArrowRight size={14} />
		{/if}
	</button>
</div>

<style>
	.picker {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.picker-header {
		padding-bottom: 0.625rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.picker-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		letter-spacing: 0.01em;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.section-label {
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 0.35);
		margin: 0;
	}

	.toggle-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.375rem;
	}

	.toggle-btn {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.125rem;
		padding: 0.5rem 0.5rem 0.45rem;
		border-radius: 0.625rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.45);
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
	}

	.toggle-btn:hover {
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.7);
	}

	.toggle-btn.selected {
		background: rgba(45, 120, 80, 0.45);
		border-color: rgba(80, 200, 120, 0.25);
		color: rgba(255, 255, 255, 0.95);
	}

	.toggle-name {
		font-size: 0.8rem;
		font-weight: 600;
	}

	.toggle-sub {
		font-size: 0.625rem;
		color: rgba(255, 255, 255, 0.3);
	}

	.toggle-btn.selected .toggle-sub {
		color: rgba(255, 255, 255, 0.5);
	}

	.badge-done,
	.badge-prog {
		position: absolute;
		top: 0.3rem;
		right: 0.35rem;
		font-size: 0.575rem;
		font-weight: 700;
		border-radius: 999px;
		padding: 0 0.3rem;
		line-height: 1.5;
	}

	.badge-done {
		background: rgba(80, 200, 120, 0.25);
		color: rgb(100, 220, 140);
	}

	.badge-prog {
		background: rgba(255, 200, 80, 0.15);
		color: rgb(255, 200, 80);
	}

	.prog-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.prog-text {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.45);
	}

	.prog-pct {
		font-size: 0.625rem;
		color: rgba(255, 255, 255, 0.3);
	}

	.prog-track {
		height: 3px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		overflow: hidden;
	}

	.prog-fill {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, rgb(45, 150, 85), rgb(70, 200, 120));
		transition: width 0.3s ease;
	}

	.cta-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		width: 100%;
		padding: 0.575rem;
		border-radius: 0.625rem;
		background: rgba(45, 120, 80, 0.55);
		border: 1px solid rgba(80, 200, 120, 0.2);
		color: rgba(255, 255, 255, 0.92);
		font-size: 0.775rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
	}

	.cta-btn:hover {
		background: rgba(45, 120, 80, 0.75);
		border-color: rgba(80, 200, 120, 0.35);
	}
</style>
