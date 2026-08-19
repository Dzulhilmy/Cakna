<script>
	import { ChevronLeft, Moon, Star, X, Check, RotateCcw } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { puasa, todayKey } from '$lib/state/stores.svelte';
	import { hijriParts } from '$lib/utils/hijri';

	const TYPE_LABELS = {
		r: 'Ramadan',
		q: 'Qada',
		s: 'Sunat',
		u: 'Tidak Puasa'
	};

	const TYPE_EMOJI = { r: '🌙', q: '✅', s: '⭐', u: '❌' };

	const today = todayKey();
	const hijri = hijriParts(new Date());

	const todayRecord = $derived(puasa.value.recs.find(r => r.d === today) ?? null);

	const stats = $derived.by(() => {
		const recs = puasa.value.recs;
		return {
			r: recs.filter(r => r.t === 'r').length,
			q: recs.filter(r => r.t === 'q').length,
			s: recs.filter(r => r.t === 's').length,
			u: recs.filter(r => r.t === 'u').length
		};
	});

	const recentRecs = $derived(
		[...puasa.value.recs]
			.sort((a, b) => b.d.localeCompare(a.d))
			.slice(0, 30)
	);

	function recordToday(type) {
		const k = todayKey();
		puasa.value.recs = puasa.value.recs.filter(r => r.d !== k);
		puasa.value.recs.push({ d: k, t: type });
	}

	function removeRecord(d) {
		puasa.value.recs = puasa.value.recs.filter(r => r.d !== d);
	}

	function fmtDate(d) {
		const dt = new Date(d + 'T00:00:00');
		return dt.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	const RECORD_BUTTONS = [
		{ type: 'r', label: 'Ramadan', emoji: '🌙' },
		{ type: 'q', label: 'Qada', emoji: '✅' },
		{ type: 's', label: 'Sunat', emoji: '⭐' },
		{ type: 'u', label: 'Tidak Puasa', emoji: '❌' }
	];
</script>

<svelte:head><title>Rekod Puasa — Cakna</title></svelte:head>

<div class="puasa-root">
	<header class="puasa-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Rekod Puasa</span>
			<span class="hdr-date">{fmtDate(today)}</span>
		</div>
		<div class="hdr-spacer"></div>
	</header>

	<main class="puasa-main">
		<!-- Stats Row -->
		<div class="stats-row">
			<div class="stat-card">
				<span class="stat-icon">🌙</span>
				<span class="stat-val">{stats.r}</span>
				<span class="stat-lbl">Ramadan</span>
			</div>
			<div class="stat-card">
				<span class="stat-icon">✅</span>
				<span class="stat-val">{stats.q}</span>
				<span class="stat-lbl">Qada</span>
			</div>
			<div class="stat-card">
				<span class="stat-icon">⭐</span>
				<span class="stat-val">{stats.s}</span>
				<span class="stat-lbl">Sunat</span>
			</div>
			<div class="stat-card stat-missed">
				<span class="stat-icon">❌</span>
				<span class="stat-val">{stats.u}</span>
				<span class="stat-lbl">Tidak Puasa</span>
			</div>
		</div>

		<!-- Today Card -->
		<section class="today-card">
			<div class="today-header">
				<span class="today-label">HARI INI</span>
				{#if hijri}
					<span class="today-hijri">{hijri.str}</span>
				{/if}
			</div>

			{#if todayRecord}
				<div class="today-recorded">
					<span class="recorded-emoji">{TYPE_EMOJI[todayRecord.t]}</span>
					<div class="recorded-info">
						<span class="recorded-type">{TYPE_LABELS[todayRecord.t]}</span>
						<span class="recorded-note">Sudah direkod hari ini</span>
					</div>
					<button class="undo-btn" onclick={() => removeRecord(today)}>
						<RotateCcw size={14} />
						Undo
					</button>
				</div>
			{:else}
				<p class="today-prompt">Rekod puasa anda hari ini:</p>
				<div class="record-btns">
					{#each RECORD_BUTTONS as btn (btn.type)}
						<button
							class="record-btn"
							class:record-btn-r={btn.type === 'r'}
							class:record-btn-q={btn.type === 'q'}
							class:record-btn-s={btn.type === 's'}
							class:record-btn-u={btn.type === 'u'}
							onclick={() => recordToday(btn.type)}
						>
							<span class="rbtn-emoji">{btn.emoji}</span>
							<span class="rbtn-label">{btn.label}</span>
						</button>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Records List -->
		{#if recentRecs.length > 0}
			<section class="recs-section">
				<h2 class="section-label">30 Rekod Terkini</h2>
				<div class="recs-list">
					{#each recentRecs as rec (rec.d)}
						<div class="rec-row">
							<span class="rec-emoji">{TYPE_EMOJI[rec.t]}</span>
							<div class="rec-info">
								<span class="rec-type">{TYPE_LABELS[rec.t]}</span>
								<span class="rec-date">{fmtDate(rec.d)}</span>
							</div>
							<button class="rec-undo" onclick={() => removeRecord(rec.d)} aria-label="Padam">
								<X size={14} />
							</button>
						</div>
					{/each}
				</div>
			</section>
		{:else}
			<div class="empty-state">
				<Moon size={36} strokeWidth={1.2} />
				<p>Tiada rekod puasa lagi.</p>
				<p class="empty-sub">Mula rekod hari ini di atas.</p>
			</div>
		{/if}
	</main>
</div>

<SideNav active="puasa" />

<style>
	.puasa-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: #070e14;
		color: #e2e8f0;
		padding-left: 76px;
	}

	.puasa-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: rgba(7, 14, 20, 0.96);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
	}

	.hdr-btn {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.hdr-btn:hover { background: rgba(255, 255, 255, 0.08); }

	.hdr-center {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.hdr-title {
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.75);
	}
	.hdr-date {
		font-size: 11px;
		color: rgba(199, 162, 75, 0.7);
		margin-top: 1px;
	}
	.hdr-spacer { width: 36px; flex-shrink: 0; }

	.puasa-main {
		padding: 20px 16px 48px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* Stats row */
	.stats-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
	}
	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 14px 8px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 14px;
	}
	.stat-missed { border-color: rgba(248, 113, 113, 0.12); background: rgba(248, 113, 113, 0.04); }
	.stat-icon { font-size: 18px; }
	.stat-val { font-size: 20px; font-weight: 700; color: #e2e8f0; }
	.stat-lbl { font-size: 10px; color: rgba(255, 255, 255, 0.35); text-align: center; }

	/* Today card */
	.today-card {
		background: linear-gradient(135deg, rgba(199, 162, 75, 0.1), rgba(199, 162, 75, 0.04));
		border: 1px solid rgba(199, 162, 75, 0.2);
		border-radius: 20px;
		padding: 18px;
	}
	.today-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 14px;
	}
	.today-label {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: rgba(199, 162, 75, 0.7);
	}
	.today-hijri {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.4);
	}
	.today-prompt {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 12px;
	}

	.record-btns {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}
	.record-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 14px 8px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		transition: all 0.15s;
	}
	.record-btn:hover { background: rgba(255, 255, 255, 0.08); }
	.record-btn-r { border-color: rgba(199, 162, 75, 0.25); background: rgba(199, 162, 75, 0.08); }
	.record-btn-r:hover { background: rgba(199, 162, 75, 0.14); }
	.record-btn-q { border-color: rgba(34, 197, 94, 0.25); background: rgba(34, 197, 94, 0.07); }
	.record-btn-q:hover { background: rgba(34, 197, 94, 0.12); }
	.record-btn-s { border-color: rgba(251, 191, 36, 0.25); background: rgba(251, 191, 36, 0.07); }
	.record-btn-s:hover { background: rgba(251, 191, 36, 0.12); }
	.record-btn-u { border-color: rgba(248, 113, 113, 0.2); background: rgba(248, 113, 113, 0.05); }
	.record-btn-u:hover { background: rgba(248, 113, 113, 0.1); }
	.rbtn-emoji { font-size: 22px; }
	.rbtn-label { font-size: 12px; font-weight: 500; }

	/* Today recorded state */
	.today-recorded {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.recorded-emoji { font-size: 32px; }
	.recorded-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
	.recorded-type { font-size: 16px; font-weight: 600; color: #e2e8f0; }
	.recorded-note { font-size: 11px; color: rgba(255, 255, 255, 0.35); }
	.undo-btn {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 6px 12px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.4);
		font-size: 12px;
		cursor: pointer;
		transition: all 0.15s;
	}
	.undo-btn:hover { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); }

	/* Records list */
	.section-label {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.25);
		margin-bottom: 10px;
	}
	.recs-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.rec-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 11px 12px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.04);
		border-radius: 12px;
	}
	.rec-emoji { font-size: 18px; width: 24px; text-align: center; }
	.rec-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
	.rec-type { font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.8); }
	.rec-date { font-size: 11px; color: rgba(255, 255, 255, 0.3); }
	.rec-undo {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.25);
		cursor: pointer;
		transition: all 0.15s;
	}
	.rec-undo:hover { background: rgba(248, 113, 113, 0.12); color: #f87171; }

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 48px 20px;
		color: rgba(255, 255, 255, 0.2);
	}
	.empty-state p { font-size: 14px; }
	.empty-sub { font-size: 12px; color: rgba(255, 255, 255, 0.15); }
</style>
