<script lang="ts">
	import type { MengajiDoc } from '$lib/api/types';
	import { Button } from '$lib/components/ui/button';
	import { t } from '$lib/state/i18n.svelte';
	import { mgquiz } from '$lib/state/stores.svelte';

	interface Props {
		doc: MengajiDoc;
	}
	let { doc }: Props = $props();

	interface Q {
		letter: string;
		correct: string;
		opts: string[];
		ask: string;
	}

	let mode = $state<'idle' | 'play' | 'done'>('idle');
	let i = $state(0);
	let score = $state(0);
	let q = $state<Q | null>(null);
	let answered = $state<string | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	// clear the pending next-question timer if the component unmounts mid-quiz
	$effect(() => () => clearTimeout(timer));

	function nextQ() {
		answered = null;
		if (i >= 10) {
			if (score > mgquiz.value.best) mgquiz.value = { best: score };
			mode = 'done';
			return;
		}
		i++;
		const hija = doc.hija;
		const typeB = Math.random() < 0.5;
		let letter: string, correct: string, opts: string[], ask: string;
		if (typeB) {
			// sound quiz: letter index 1..28, excluding 27 (Hamzah)
			let li: number;
			do {
				li = 1 + Math.floor(Math.random() * (hija.length - 1));
			} while (li === 27);
			const hk = doc.hrk3[Math.floor(Math.random() * 3)];
			letter = hija[li][0] + hk[0];
			correct = doc.mg_sound[li] + hk[1];
			const others = doc.hrk3.filter((x) => x[1] !== hk[1]).map((x) => doc.mg_sound[li] + x[1]);
			let li2: number;
			do {
				li2 = 1 + Math.floor(Math.random() * (hija.length - 1));
			} while (li2 === li || li2 === 27);
			opts = [correct, ...others, doc.mg_sound[li2] + hk[1]].slice(0, 4);
			ask = t('quiz_qbunyi');
		} else {
			// name quiz: any of the 29 letters
			const li = Math.floor(Math.random() * hija.length);
			letter = hija[li][0];
			correct = hija[li][1];
			const pool = hija.map((x) => x[1]).filter((n) => n !== correct);
			opts = [correct];
			while (opts.length < 4) {
				const p = pool[Math.floor(Math.random() * pool.length)];
				if (!opts.includes(p)) opts.push(p);
			}
			ask = t('quiz_qhuruf');
		}
		opts.sort(() => Math.random() - 0.5);
		q = { letter, correct, opts, ask };
	}

	function start() {
		i = 0;
		score = 0;
		mode = 'play';
		nextQ();
	}

	function answer(o: string) {
		if (answered !== null || !q) return;
		answered = o;
		const right = o === q.correct;
		if (right) score++;
		if (navigator.vibrate) navigator.vibrate(right ? 15 : [60, 40, 60]);
		timer = setTimeout(nextQ, 850);
	}

	const right = $derived(q !== null && answered === q.correct);
</script>

<div class="rounded-2xl border bg-card p-4">
	{#if mode === 'idle'}
		{#if mgquiz.value.best}
			<div class="mb-1 text-[13px] text-muted-foreground">
				{t('quiz_best')}: {mgquiz.value.best} / 10
			</div>
		{/if}
		<Button class="w-full rounded-full font-bold" onclick={start}>{t('quiz_start')}</Button>
	{:else if mode === 'play' && q}
		<div class="mb-2 flex items-center justify-between text-[12.5px] text-muted-foreground">
			<span>{i} / 10</span>
			<b class="text-primary">{t('quiz_score')}: {score}</b>
		</div>
		<div class="text-center text-[13.5px] font-bold">{q.ask}</div>
		<div class="pt-1.5 pb-1 text-center">
			<div class="font-arabic text-[64px] leading-[1.3] text-primary">{q.letter}</div>
		</div>
		<div class="grid grid-cols-2 gap-2">
			{#each q.opts as o, oi (oi)}
				<button
					class="rounded-xl border py-3 text-sm font-bold transition-colors
						{answered !== null && o === q.correct
						? 'border-rose-600 bg-rose-600/15 text-rose-700 dark:text-rose-400'
						: answered === o
							? 'border-red-600 bg-red-600/15 text-red-700 dark:text-red-400'
							: 'bg-background'}"
					onclick={() => answer(o)}
				>
					{o}
				</button>
			{/each}
		</div>
		<div
			class="mt-2.5 min-h-[22px] text-center text-[13px] font-bold
				{right ? 'text-primary' : 'text-[#C0392B]'}"
		>
			{#if answered !== null}
				{right ? t('quiz_right') : `${t('quiz_wrong')}: ${q.correct}`}
			{/if}
		</div>
	{:else if mode === 'done'}
		<div class="text-center text-[13.5px] font-bold">{t('quiz_done')}</div>
		<div class="pt-1.5 pb-2 text-center">
			<div class="font-display text-[52px] leading-[1.3] text-primary">{score} / 10</div>
		</div>
		<Button class="w-full rounded-full font-bold" onclick={start}>{t('quiz_retry')}</Button>
		<div class="mt-2.5 text-center text-[13px] font-bold text-muted-foreground">
			{t('quiz_best')}: {mgquiz.value.best} / 10
		</div>
	{/if}
</div>
