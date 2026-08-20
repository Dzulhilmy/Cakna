<script>
	import { onMount } from 'svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { settings, mgquiz } from '$lib/state/stores.svelte';

	let loading = $state(true);
	let fetchError = $state('');
	let mengajiDoc = $state(null);
	let activeTab = $state('huruf');

	const uiLang = $derived(settings.value.uiLang ?? 'ms');

	const TABS = [
		{ id: 'huruf',   label: 'Huruf' },
		{ id: 'baris',   label: 'Baris' },
		{ id: 'latihan', label: 'Latihan' },
		{ id: 'kuiz',    label: 'Kuiz' }
	];

	// ── Latihan tab ─────────────────────────────────────────────────
	const DRILL_ITEMS = [
		{ char: 'بَ', sound: 'ba', hint: 'Ba + Fathah' },
		{ char: 'بِ', sound: 'bi', hint: 'Ba + Kasrah' },
		{ char: 'بُ', sound: 'bu', hint: 'Ba + Dammah' },
		{ char: 'بْ', sound: 'b',  hint: 'Ba + Sukun (berhenti)' },
		{ char: 'بَّ', sound: 'bba', hint: 'Ba + Tasydid + Fathah' }
	];
	let drillSelected = $state(-1);

	// ── Quiz tab ─────────────────────────────────────────────────────
	// qPhase: 'idle' | 'question' | 'answered' | 'done'
	let qPhase = $state('idle');
	let qNum = $state(0);       // current question 1-10
	let qScore = $state(0);
	let qLetterIdx = $state(0);
	let qOptions = $state([]);  // [{sound, isCorrect}]
	let qSelected = $state(-1); // index of selected option

	function shuffle(arr) {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function buildQuestion() {
		if (!mengajiDoc?.hija?.length || !mengajiDoc?.mg_sound?.length) return;
		const n = mengajiDoc.hija.length;
		const sounds = mengajiDoc.mg_sound;
		// Pick random letter
		const idx = Math.floor(Math.random() * n);
		qLetterIdx = idx;
		const correct = sounds[idx] ?? mengajiDoc.hija[idx]?.[1] ?? '?';
		// Pick 3 unique wrong sounds
		const pool = sounds
			.map((s, i) => ({ s, i }))
			.filter(x => x.i !== idx && x.s !== correct);
		const wrongSounds = shuffle(pool).slice(0, 3).map(x => x.s);
		// Combine and shuffle
		const opts = shuffle([
			{ sound: correct, isCorrect: true },
			...wrongSounds.map(s => ({ sound: s, isCorrect: false }))
		]);
		qOptions = opts;
		qSelected = -1;
	}

	function startQuiz() {
		qNum = 1;
		qScore = 0;
		qPhase = 'question';
		buildQuestion();
	}

	function selectOption(idx) {
		if (qPhase !== 'question') return;
		qSelected = idx;
		if (qOptions[idx]?.isCorrect) qScore++;
		qPhase = 'answered';
	}

	function nextQuestion() {
		if (qNum >= 10) {
			// Done — update best score if improved
			if (qScore > mgquiz.value.best) {
				mgquiz.value = { best: qScore };
			}
			qPhase = 'done';
		} else {
			qNum++;
			buildQuestion();
			qPhase = 'question';
		}
	}

	onMount(async () => {
		try {
			const r = await fetch('/proxy/api/modules/mengaji');
			if (!r.ok) throw new Error(`HTTP ${r.status}`);
			mengajiDoc = await r.json();
		} catch (e) {
			fetchError = e instanceof Error ? e.message : 'Ralat tidak diketahui';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head><title>Asas Mengaji — Cakna</title></svelte:head>

<div class="mg-root">
	<!-- Header -->
	<header class="mg-header">
		<a href="https://cakna.org/hub" class="hdr-btn">
			<ChevronLeft size={20} />
		</a>
		<div class="hdr-center">
			<span class="hdr-title">Asas Mengaji</span>
			<span class="hdr-sub">{TABS.find(t => t.id === activeTab)?.label ?? ''}</span>
		</div>
		<div style="width:36px;"></div>
	</header>

	<!-- Tabs -->
	<div class="tabs-row">
		{#each TABS as tab}
			<button
				class="tab"
				class:tab-active={activeTab === tab.id}
				onclick={() => (activeTab = tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<main class="mg-main">
		{#if loading}
			<div class="loading-wrap">
				<div class="spinner" aria-label="Memuatkan…"></div>
				<p class="loading-text">Memuatkan modul mengaji…</p>
			</div>
		{:else if fetchError}
			<div class="error-wrap">
				<p class="error-text">Ralat: {fetchError}</p>
			</div>
		{:else if !mengajiDoc}
			<div class="error-wrap"><p class="error-text">Tiada data.</p></div>
		{:else}

			<!-- ═══ HURUF TAB ═══ -->
			{#if activeTab === 'huruf'}
				<div class="section-intro">
					<p class="intro-text">
						{#if uiLang === 'en'}
							The Arabic alphabet (Hijaiyah) consists of 28 letters. Each letter has a unique form and pronunciation.
						{:else}
							Huruf hijaiyah terdiri daripada 28 huruf. Setiap huruf mempunyai bentuk dan sebutan yang unik.
						{/if}
					</p>
				</div>
				<div class="huruf-grid">
					{#each (mengajiDoc.hija ?? []) as [letter, name], i (i)}
						<div class="huruf-cell">
							<span class="huruf-ar">{letter}</span>
							<span class="huruf-name">{name}</span>
						</div>
					{/each}
				</div>

			<!-- ═══ BARIS TAB ═══ -->
			{:else if activeTab === 'baris'}
				<div class="section-intro">
					<p class="intro-text">
						{#if uiLang === 'en'}
							Vowel marks (harakat) determine how each letter is pronounced.
						{:else}
							Baris (harakat) menentukan cara sebutan setiap huruf.
						{/if}
					</p>
				</div>
				<div class="baris-list">
					{#each (mengajiDoc.harakat ?? []) as [mark, name, descMs, descEn], i (i)}
						<div class="baris-row">
							<div class="baris-mark-wrap">
								<span class="baris-mark">ب{mark}</span>
							</div>
							<div class="baris-info">
								<span class="baris-name">{name}</span>
								<span class="baris-desc">
									{uiLang === 'en' ? (descEn ?? descMs ?? '') : (descMs ?? descEn ?? '')}
								</span>
							</div>
						</div>
					{/each}
				</div>

			<!-- ═══ LATIHAN TAB ═══ -->
			{:else if activeTab === 'latihan'}
				<div class="section-intro">
					<p class="intro-text">
						{#if uiLang === 'en'}
							Practice common syllables. Tap each card to see a larger view and the pronunciation hint.
						{:else}
							Latih suku kata biasa dalam Al-Quran. Ketuk setiap kad untuk lihat lebih besar dan hint sebutan.
						{/if}
					</p>
				</div>

				<!-- Enlarged display when selected -->
				{#if drillSelected >= 0}
					{@const item = DRILL_ITEMS[drillSelected]}
					<div class="drill-display">
						<div class="drill-big-char">{item.char}</div>
						<div class="drill-sound">"{item.sound}"</div>
						<div class="drill-hint">{item.hint}</div>
					</div>
				{/if}

				<div class="drill-grid">
					{#each DRILL_ITEMS as item, i}
						<button
							class="drill-cell"
							class:drill-active={drillSelected === i}
							onclick={() => (drillSelected = drillSelected === i ? -1 : i)}
							aria-label="{item.hint}: {item.char}"
						>
							<span class="drill-char">{item.char}</span>
							<span class="drill-cell-sound">{item.sound}</span>
						</button>
					{/each}
				</div>
				<p class="drill-tip">
					{uiLang === 'en'
						? 'Tip: Repeat each syllable 10 times aloud for muscle memory.'
						: 'Tip: Ulang setiap suku kata 10 kali dengan kuat untuk hafalkan sebutan.'}
				</p>

			<!-- ═══ KUIZ TAB ═══ -->
			{:else if activeTab === 'kuiz'}
				<div class="quiz-wrap">
					<!-- Score bar -->
					<div class="quiz-score-bar">
						<div class="score-item">
							<span class="score-label">{uiLang === 'en' ? 'Score' : 'Markah'}</span>
							<span class="score-val">{qScore}</span>
						</div>
						<div class="score-divider"></div>
						<div class="score-item">
							<span class="score-label">{uiLang === 'en' ? 'Best' : 'Terbaik'}</span>
							<span class="score-val score-best">{mgquiz.value.best}</span>
						</div>
						{#if qPhase !== 'idle'}
							<div class="score-divider"></div>
							<div class="score-item">
								<span class="score-label">{uiLang === 'en' ? 'Question' : 'Soalan'}</span>
								<span class="score-val">{qPhase === 'done' ? 10 : qNum}/10</span>
							</div>
						{/if}
					</div>

					<!-- Idle — start screen -->
					{#if qPhase === 'idle'}
						<div class="quiz-start">
							<div class="quiz-start-icon">٣٦</div>
							<h2 class="quiz-start-title">
								{uiLang === 'en' ? 'Hijaiyah Quiz' : 'Kuiz Huruf Hijaiyah'}
							</h2>
							<p class="quiz-start-desc">
								{uiLang === 'en'
									? '10 questions — identify the romanized sound of each Arabic letter.'
									: '10 soalan — kenal pasti bunyi Rumi bagi setiap huruf Arab.'}
							</p>
							{#if mgquiz.value.best > 0}
								<p class="quiz-prev-best">
									{uiLang === 'en' ? 'Your best:' : 'Terbaik anda:'} {mgquiz.value.best}/10
								</p>
							{/if}
							<button class="quiz-start-btn" onclick={startQuiz}>
								{uiLang === 'en' ? 'Start Quiz' : 'Mulakan Kuiz'}
							</button>
						</div>

					<!-- Question -->
					{:else if qPhase === 'question' || qPhase === 'answered'}
						<div class="quiz-question">
							<p class="quiz-q-label">
								{uiLang === 'en' ? 'What sound is this letter?' : 'Apakah bunyi huruf ini?'}
							</p>
							<div class="quiz-letter-display">
								{mengajiDoc.hija?.[qLetterIdx]?.[0] ?? '؟'}
							</div>
							<div class="quiz-options">
								{#each qOptions as opt, i}
									<button
										class="quiz-opt"
										class:opt-correct={qPhase === 'answered' && opt.isCorrect}
										class:opt-wrong={qPhase === 'answered' && qSelected === i && !opt.isCorrect}
										class:opt-selected={qSelected === i}
										class:opt-disabled={qPhase === 'answered'}
										onclick={() => selectOption(i)}
										disabled={qPhase === 'answered'}
									>
										{opt.sound}
									</button>
								{/each}
							</div>

							{#if qPhase === 'answered'}
								<div class="quiz-feedback" class:feedback-correct={qOptions[qSelected]?.isCorrect} class:feedback-wrong={!qOptions[qSelected]?.isCorrect}>
									{#if qOptions[qSelected]?.isCorrect}
										{uiLang === 'en' ? '✓ Correct!' : '✓ Betul!'}
									{:else}
										{uiLang === 'en'
											? `✗ Wrong. Answer: ${qOptions.find(o => o.isCorrect)?.sound}`
											: `✗ Salah. Jawapan: ${qOptions.find(o => o.isCorrect)?.sound}`}
									{/if}
								</div>
								<button class="quiz-next-btn" onclick={nextQuestion}>
									{qNum >= 10
										? (uiLang === 'en' ? 'See Results' : 'Lihat Keputusan')
										: (uiLang === 'en' ? 'Next Question →' : 'Soalan Seterusnya →')}
								</button>
							{/if}
						</div>

					<!-- Done -->
					{:else if qPhase === 'done'}
						<div class="quiz-done">
							<div class="done-score-ring">
								<span class="done-score-num">{qScore}</span>
								<span class="done-score-denom">/10</span>
							</div>
							<h2 class="done-title">
								{#if qScore >= 9}
									{uiLang === 'en' ? 'Excellent!' : 'Cemerlang!'}
								{:else if qScore >= 7}
									{uiLang === 'en' ? 'Well done!' : 'Bagus!'}
								{:else if qScore >= 5}
									{uiLang === 'en' ? 'Keep practicing!' : 'Teruskan latihan!'}
								{:else}
									{uiLang === 'en' ? 'Keep going!' : 'Jangan berputus asa!'}
								{/if}
							</h2>
							{#if qScore >= mgquiz.value.best}
								<p class="done-new-best">
									{uiLang === 'en' ? '🏆 New best score!' : '🏆 Rekod terbaru!'}
								</p>
							{:else}
								<p class="done-best">
									{uiLang === 'en' ? `Best: ${mgquiz.value.best}/10` : `Terbaik: ${mgquiz.value.best}/10`}
								</p>
							{/if}
							<button class="quiz-start-btn" onclick={startQuiz}>
								{uiLang === 'en' ? 'Play Again' : 'Cuba Lagi'}
							</button>
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</main>
</div>

<SideNav active="mengaji" />

<style>
	.mg-root {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--pg-bg);
		color: var(--pg-fg);
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* ── Header ── */
	.mg-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--pg-hdr);
		border-bottom: 1px solid rgba(34, 197, 94, 0.1);
		backdrop-filter: blur(8px);
	}

	.hdr-btn {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-btn-border);
		color: var(--pg-btn-color);
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.hdr-btn:hover { background: var(--pg-btn-hover); }

	.hdr-center {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.hdr-title {
		font-size: 13px;
		font-weight: 600;
		color: var(--pg-text-75);
	}
	.hdr-sub {
		font-size: 11px;
		color: rgba(34, 197, 94, 0.6);
	}

	/* ── Tabs ── */
	.tabs-row {
		display: flex;
		gap: 4px;
		padding: 10px 16px;
		background: rgba(255, 255, 255, 0.02);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.tab {
		flex: 1;
		padding: 7px 8px;
		border-radius: 10px;
		font-size: 13px;
		color: var(--pg-muted);
		cursor: pointer;
		border: none;
		background: transparent;
		transition: all 0.15s;
		white-space: nowrap;
	}
	.tab-active {
		background: rgba(34, 197, 94, 0.15);
		color: rgba(74, 222, 128, 0.95);
		font-weight: 600;
	}

	/* ── Main ── */
	.mg-main {
		flex: 1;
		padding: 16px 16px 60px;
	}

	/* ── Loading / Error ── */
	.loading-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: 80px 20px;
	}
	.spinner {
		width: 36px;
		height: 36px;
		border: 3px solid rgba(34, 197, 94, 0.15);
		border-top-color: rgba(34, 197, 94, 0.7);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.loading-text {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.35);
		margin: 0;
	}
	.error-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
	}
	.error-text {
		color: rgba(248, 113, 113, 0.8);
		font-size: 14px;
		margin: 0;
	}

	/* ── Section intro ── */
	.section-intro {
		margin-bottom: 16px;
	}
	.intro-text {
		font-size: 13px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.35);
		margin: 0;
	}

	/* ── Huruf grid ── */
	.huruf-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
		gap: 10px;
	}

	.huruf-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 16px 8px 12px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		border-radius: 12px;
		transition: background 0.15s, border-color 0.15s;
	}
	.huruf-cell:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(34, 197, 94, 0.15);
	}

	.huruf-ar {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 28px;
		color: var(--pg-fg);
		line-height: 1.4;
	}
	.huruf-name {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.35);
		text-align: center;
	}

	/* ── Baris list ── */
	.baris-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.baris-row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px 16px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		border-radius: 12px;
	}

	.baris-mark-wrap {
		flex-shrink: 0;
		width: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.baris-mark {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 26px;
		color: #c7a24b;
		direction: rtl;
	}
	.baris-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}
	.baris-name {
		font-size: 14px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.7);
	}
	.baris-desc {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.35);
		line-height: 1.5;
	}

	/* ── Latihan (Drill) ── */
	.drill-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		margin-bottom: 20px;
		padding: 24px;
		background: rgba(199, 162, 75, 0.07);
		border: 1px solid rgba(199, 162, 75, 0.2);
		border-radius: 16px;
		animation: pop-in 0.2s ease;
	}
	@keyframes pop-in {
		from { transform: scale(0.92); opacity: 0; }
		to   { transform: scale(1);    opacity: 1; }
	}

	.drill-big-char {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 72px;
		color: var(--pg-fg);
		line-height: 1.5;
		direction: rtl;
	}
	.drill-sound {
		font-size: 22px;
		font-weight: 700;
		color: #c7a24b;
		letter-spacing: 0.05em;
	}
	.drill-hint {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.4);
	}

	.drill-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 8px;
		margin-bottom: 16px;
	}

	.drill-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 16px 8px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-btn-border);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.15s;
	}
	.drill-cell:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(34, 197, 94, 0.2);
	}
	.drill-active {
		background: rgba(199, 162, 75, 0.1);
		border-color: rgba(199, 162, 75, 0.35);
	}

	.drill-char {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 24px;
		color: var(--pg-fg);
		direction: rtl;
	}
	.drill-cell-sound {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.35);
	}
	.drill-active .drill-cell-sound {
		color: #c7a24b;
	}

	.drill-tip {
		font-size: 12px;
		color: var(--pg-subtle);
		margin: 0;
		padding: 12px;
		text-align: center;
	}

	/* ── Quiz ── */
	.quiz-wrap {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 440px;
	}

	.quiz-score-bar {
		display: flex;
		align-items: center;
		gap: 0;
		background: var(--pg-surface);
		border: 1px solid var(--pg-btn-border);
		border-radius: 14px;
		overflow: hidden;
	}
	.score-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px 8px;
		gap: 2px;
	}
	.score-label {
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: rgba(255, 255, 255, 0.3);
	}
	.score-val {
		font-size: 20px;
		font-weight: 700;
		color: var(--pg-text-75);
	}
	.score-best { color: #c7a24b; }
	.score-divider {
		width: 1px;
		height: 32px;
		background: rgba(255, 255, 255, 0.07);
		flex-shrink: 0;
	}

	/* Start screen */
	.quiz-start {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 32px 20px;
	}
	.quiz-start-icon {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 48px;
		color: #c7a24b;
		opacity: 0.7;
	}
	.quiz-start-title {
		font-size: 20px;
		font-weight: 700;
		color: var(--pg-text-85);
		margin: 0;
	}
	.quiz-start-desc {
		font-size: 14px;
		color: var(--pg-muted);
		margin: 0;
		text-align: center;
		line-height: 1.6;
	}
	.quiz-prev-best {
		font-size: 13px;
		color: rgba(199, 162, 75, 0.7);
		margin: 0;
	}
	.quiz-start-btn {
		margin-top: 8px;
		padding: 12px 32px;
		border-radius: 14px;
		background: rgba(34, 197, 94, 0.2);
		border: 1px solid rgba(34, 197, 94, 0.35);
		color: rgba(74, 222, 128, 0.95);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.quiz-start-btn:hover { background: rgba(34, 197, 94, 0.3); }

	/* Question */
	.quiz-question {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}
	.quiz-q-label {
		font-size: 13px;
		color: var(--pg-muted);
		margin: 0;
	}
	.quiz-letter-display {
		font-family: 'Amiri Quran', 'Scheherazade New', serif;
		font-size: 80px;
		color: var(--pg-fg);
		line-height: 1.5;
		direction: rtl;
		padding: 16px 32px;
		background: var(--pg-surface);
		border: 1px solid var(--pg-surface-b);
		border-radius: 20px;
		min-width: 120px;
		text-align: center;
	}

	.quiz-options {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		width: 100%;
	}
	.quiz-opt {
		padding: 14px 8px;
		border-radius: 14px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-text-75);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
	}
	.quiz-opt:hover:not(.opt-disabled) {
		background: var(--pg-btn-hover);
		border-color: rgba(34, 197, 94, 0.2);
	}
	.opt-disabled { cursor: not-allowed; }
	.opt-correct {
		background: rgba(34, 197, 94, 0.18) !important;
		border-color: rgba(34, 197, 94, 0.45) !important;
		color: rgba(74, 222, 128, 0.95) !important;
	}
	.opt-wrong {
		background: rgba(248, 113, 113, 0.12) !important;
		border-color: rgba(248, 113, 113, 0.3) !important;
		color: rgba(248, 113, 113, 0.8) !important;
	}

	.quiz-feedback {
		font-size: 14px;
		font-weight: 600;
		padding: 10px 20px;
		border-radius: 10px;
		text-align: center;
	}
	.feedback-correct {
		background: rgba(34, 197, 94, 0.1);
		color: rgba(74, 222, 128, 0.9);
	}
	.feedback-wrong {
		background: rgba(248, 113, 113, 0.08);
		color: rgba(248, 113, 113, 0.8);
	}

	.quiz-next-btn {
		padding: 11px 24px;
		border-radius: 12px;
		background: rgba(199, 162, 75, 0.12);
		border: 1px solid rgba(199, 162, 75, 0.25);
		color: #c7a24b;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.quiz-next-btn:hover { background: rgba(199, 162, 75, 0.2); }

	/* Done */
	.quiz-done {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 24px 0;
	}
	.done-score-ring {
		display: flex;
		align-items: baseline;
		gap: 4px;
		padding: 20px 28px;
		background: rgba(199, 162, 75, 0.08);
		border: 2px solid rgba(199, 162, 75, 0.3);
		border-radius: 50%;
		aspect-ratio: 1;
		justify-content: center;
	}
	.done-score-num {
		font-size: 48px;
		font-weight: 800;
		color: #c7a24b;
		line-height: 1;
	}
	.done-score-denom {
		font-size: 18px;
		color: rgba(199, 162, 75, 0.5);
	}
	.done-title {
		font-size: 20px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
	}
	.done-new-best {
		font-size: 14px;
		color: #c7a24b;
		margin: 0;
	}
	.done-best {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.3);
		margin: 0;
	}
</style>
