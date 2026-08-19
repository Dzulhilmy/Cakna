<script lang="ts">
	import type { NotificationType } from '$lib/types';
	import { enhance } from '$app/forms';
	import { ArrowLeft, Wand2, Send } from 'lucide-svelte';

	let { form } = $props();

	// ── Template definitions ───────────────────────────────────────────────

	type FieldDef = {
		name: string;
		label: string;
		placeholder?: string;
		type: 'text' | 'date' | 'textarea';
	};

	const TYPES: Array<{ key: NotificationType; label: string; desc: string }> = [
		{ key: 'kemalangan', label: 'Accident', desc: 'Announcement of an MT accident or injury.' },
		{ key: 'takziah', label: 'Condolences', desc: 'Condolence message for the passing of an MT family member.' },
		{ key: 'kesihatan', label: 'Health Announcement', desc: 'Health warning / precautionary measures.' },
		{ key: 'umum', label: 'General Announcement', desc: 'General announcement — free-form title & content.' },
	];

	const FIELDS: Record<NotificationType, FieldDef[]> = {
		kemalangan: [
			{ name: 'mtName', label: 'MT Name', placeholder: 'e.g. MT Syakirah Adilah', type: 'text' },
			{ name: 'date', label: 'Date of incident', placeholder: 'dd/mm/yyyy', type: 'date' },
			{ name: 'onWayTo', label: 'On the way to', placeholder: 'e.g. attend FAST in Jenjarom', type: 'text' },
			{ name: 'injuryDetails', label: 'Injury details', placeholder: 'e.g. MT suffered a broken arm (requiring surgery) and lacerations that were stitched.', type: 'textarea' },
			{ name: 'referredTo', label: 'Referred to', placeholder: 'e.g. Hospital Temerloh', type: 'text' },
		],
		takziah: [
			{ name: 'allahyarhamName', label: 'Name of deceased', placeholder: 'e.g. Allahyarham Hj. Ahmad', type: 'text' },
			{ name: 'relation', label: 'Relation to MT', placeholder: 'e.g. father of MT Syakirah', type: 'text' },
			{ name: 'mtName', label: 'MT Name', placeholder: 'e.g. MT Syakirah Adilah', type: 'text' },
			{ name: 'date', label: 'Date of passing', placeholder: 'dd/mm/yyyy', type: 'date' },
		],
		kesihatan: [
			{ name: 'topic', label: 'Health topic', placeholder: 'e.g. Dengue outbreak in Rawang', type: 'text' },
			{ name: 'keyMessage', label: 'Key message', placeholder: 'e.g. Take precautions, avoid stagnant water.', type: 'textarea' },
			{ name: 'action', label: 'Action required', placeholder: 'e.g. Seek medical attention if symptoms appear.', type: 'text' },
		],
		umum: [],
	};

	type Generated = { title: string; content: string; callout: string };

	const GENERATE: Record<NotificationType, (f: Record<string, string>) => Generated> = {
		kemalangan: (f) => ({
			title: `Accident — ${f.mtName || 'MT'}`,
			content: [
				'Assalamualaikum dan salam sejahtera.',
				`Dimaklumkan ${f.mtName || 'MT'} telah mengalami kemalangan pada ${f.date || '(tarikh)'}${f.onWayTo ? ` semasa dalam perjalanan ke ${f.onWayTo}` : ''}.`,
				f.injuryDetails || 'Alhamdulillah, tiada kecederaan yang mengancam nyawa.',
				f.referredTo ? `Beliau telah dirujuk ke ${f.referredTo} untuk rawatan lanjut.` : '',
				'👋 Marilah kita doakan kesembuhan dan kekuatan buat MT.',
			].filter(Boolean).join('\n\n'),
			callout:
				'Buat semua Franchaisi — jom kongsikan cakna ini kepada MT dan klien di bawah seliaan kita.\n\nBuat MT dan klien — mari sama-sama doakan MT, dan hulurkan cakna kepada orang sekeliling kita.\n\nSemoga Allah permudahkan segala urusan rawatan dan pemulihan. Aamiin. 🤍',
		}),
		takziah: (f) => ({
			title: `Takziah — ${f.mtName || 'MT'}`,
			content: [
				'Assalamualaikum dan salam sejahtera.',
				`Dengan rasa dukacita, kami ingin memaklumkan pemergian ${f.allahyarhamName || '(nama allahyarham)'}${f.relation ? `, ${f.relation}` : ''}${f.mtName ? ` ${f.mtName}` : ''} pada ${f.date || '(tarikh)'}.`,
				'Semoga Allah mencucuri rahmat ke atas roh beliau dan ditempatkan dalam golongan orang-orang yang beriman. Aamiin.',
				`🤍 Marilah kita sama-sama mengirimkan Al-Fatihah dan mendoakan ketenangan buat keluarga${f.mtName ? ` ${f.mtName}` : ''}.`,
			].join('\n\n'),
			callout: `Buat semua Franchaisi — jom sampaikan ucapan takziah dan doakan keluarga ${f.mtName || 'MT'}.\n\nSemoga Allah memberikan kesabaran dan kekuatan kepada keluarga. Aamiin. 🤍`,
		}),
		kesihatan: (f) => ({
			title: ['Health Announcement', f.topic].filter(Boolean).join(' — '),
			content: [
				'Assalamualaikum dan salam sejahtera.',
				`Perhatian kepada semua ahli Cakna mengenai: ${f.topic || '(topik kesihatan)'}.`,
				f.keyMessage || '',
				f.action ? `⚠️ ${f.action}` : '',
				'Mari kita jaga kesihatan bersama-sama. Semoga kita semua sentiasa dalam keadaan sihat dan sejahtera.',
			].filter(Boolean).join('\n\n'),
			callout:
				'Buat semua Franchaisi — sila sebarkan maklumat penting ini kepada MT dan klien.\n\nMari kita jaga kesihatan bersama. 💚',
		}),
		umum: () => ({
			title: '',
			content: '',
			callout:
				'Buat semua Franchaisi — sila kongsikan pengumuman ini kepada MT dan klien di bawah seliaan kita.',
		}),
	};

	const AUDIENCE = [
		{ value: 'all', label: 'All Franchisees, MTs & clients' },
		{ value: 'franchisee', label: 'Franchisees only' },
		{ value: 'admin', label: 'Admins & PICs only' },
	];

	// ── State ──────────────────────────────────────────────────────────────

	let selectedType = $state<NotificationType>('kemalangan');
	let fieldValues = $state<Record<string, string>>({});
	let title = $state('');
	let content = $state('');
	let callout = $state('');
	let audience = $state('all');

	function selectType(t: NotificationType) {
		if (t === selectedType) return;
		selectedType = t;
		fieldValues = {};
		title = '';
		content = '';
		callout = '';
	}

	function setField(name: string, value: string) {
		fieldValues = { ...fieldValues, [name]: value };
	}

	function generate() {
		const g = GENERATE[selectedType](fieldValues);
		title = g.title;
		content = g.content;
		callout = g.callout;
	}

	// ── Derived ────────────────────────────────────────────────────────────

	const currentFields = $derived(FIELDS[selectedType]);
	const hasFields = $derived(currentFields.length > 0);
	const previewAudienceLabel = $derived(AUDIENCE.find((a) => a.value === audience)?.label ?? audience);
	const previewParagraphs = $derived(content.split('\n\n').filter(Boolean));
	const previewCalloutLines = $derived(callout.split('\n\n').filter(Boolean));

	const inputCls =
		'w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400';
</script>

<svelte:head><title>Send Announcement · Cakna Hub Admin</title></svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div>
		<a
			href="/hub/admin/notifications"
			class="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
		>
			<ArrowLeft size={14} />
			Announcements
		</a>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Send Announcement</h1>
		<p class="mt-1.5 text-sm text-zinc-500">
			Choose a template, fill in the details, review the preview, and send to the HOME CAKNA family.
		</p>
	</div>

	{#if form?.error}
		<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<!-- Two-column layout -->
	<div class="grid gap-8 lg:grid-cols-[1fr_380px]">
		<!-- ── Left: Form ─────────────────────────────────────────────────── -->
		<div>
			<form
				method="POST"
				use:enhance
				class="space-y-6"
			>
				<!-- Hidden type field -->
				<input type="hidden" name="type" value={selectedType} />

				<!-- 1. Announcement type -->
				<section class="space-y-3">
					<h2 class="text-sm font-semibold text-zinc-700">Announcement type</h2>
					<div class="grid gap-3 sm:grid-cols-2">
						{#each TYPES as t (t.key)}
							<button
								type="button"
								onclick={() => selectType(t.key)}
								class="rounded-xl border p-4 text-left transition-all {selectedType === t.key
									? 'border-rose-400 bg-rose-50 shadow-sm'
									: 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'}"
							>
								<p
									class="text-sm font-semibold {selectedType === t.key
										? 'text-rose-700'
										: 'text-zinc-900'}"
								>
									{t.label}
								</p>
								<p class="mt-0.5 text-xs leading-relaxed text-zinc-500">{t.desc}</p>
							</button>
						{/each}
					</div>
				</section>

				<!-- 2. Type-specific detail fields -->
				{#if hasFields}
					{#key selectedType}
						<section class="space-y-3">
							<h2 class="text-sm font-semibold text-zinc-700">Details</h2>
							<div class="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
								{#each currentFields as field (field.name)}
									<label class="block space-y-1">
										<span class="text-xs font-medium text-zinc-600">
											{field.label}
											<span class="text-rose-400">*</span>
										</span>
										{#if field.type === 'textarea'}
											<textarea
												rows="3"
												placeholder={field.placeholder}
												value={fieldValues[field.name] ?? ''}
												oninput={(e) =>
													setField(
														field.name,
														(e.currentTarget as HTMLTextAreaElement).value
													)}
												class="{inputCls} resize-none"
											></textarea>
										{:else}
											<input
												type={field.type}
												placeholder={field.placeholder}
												value={fieldValues[field.name] ?? ''}
												oninput={(e) =>
													setField(
														field.name,
														(e.currentTarget as HTMLInputElement).value
													)}
												class={inputCls}
											/>
										{/if}
									</label>
								{/each}

								<button
									type="button"
									onclick={generate}
									class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
								>
									<Wand2 size={13} />
									Generate content
								</button>
							</div>
						</section>
					{/key}
				{/if}

				<!-- 3. Title -->
				<label class="block space-y-1.5">
					<span class="text-sm font-medium text-zinc-700">
						Title (internal reference)
					</span>
					<input
						name="title"
						bind:value={title}
						required
						placeholder="e.g. Accident — MT Syakirah"
						class={inputCls}
					/>
				</label>

				<!-- 4. Content -->
				<div class="space-y-1.5">
					<label for="content-field" class="text-sm font-medium text-zinc-700">Content</label>
					<textarea
						id="content-field"
						name="content"
						bind:value={content}
						rows="7"
						required
						class="{inputCls} resize-none"
					></textarea>
					<p class="text-xs text-zinc-400">
						Separate paragraphs with a blank line. Start a line with &gt; for a quote.
					</p>
				</div>

				<!-- 5. "Together With CAKNA" callout -->
				<div class="space-y-1.5">
					<label for="callout-field" class="text-sm font-medium text-zinc-700">
						Note "Together With CAKNA"
					</label>
					<textarea
						id="callout-field"
						name="callout"
						bind:value={callout}
						rows="4"
						class="{inputCls} resize-none"
					></textarea>
				</div>

				<!-- 6. Audience -->
				<label class="block space-y-1.5">
					<span class="text-sm font-medium text-zinc-700">Audience</span>
					<select name="audience" bind:value={audience} class="{inputCls} bg-white">
						{#each AUDIENCE as a (a.value)}
							<option value={a.value}>{a.label}</option>
						{/each}
					</select>
				</label>

				<!-- Submit -->
				<div class="flex items-center gap-3 pt-1">
					<button
						type="submit"
						class="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-800"
					>
						<Send size={15} />
						Send announcement
					</button>
					<a
						href="/hub/admin/notifications"
						class="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
					>
						Cancel
					</a>
				</div>
			</form>
		</div>

		<!-- ── Right: Preview ─────────────────────────────────────────────── -->
		<div class="lg:sticky lg:top-6 h-fit">
			<p class="mb-3 text-xs font-medium text-zinc-500">
				Preview · sent to
				<span class="font-semibold text-zinc-700">{previewAudienceLabel}</span>
			</p>

			<div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
				<!-- CAKNA header banner -->
				<div
					class="flex flex-col items-center px-6 py-7 text-center"
					style="background: linear-gradient(135deg, #881337 0%, #9f1239 60%, #be123c 100%);"
				>
					<div
						class="mb-3 flex h-11 w-11 items-center justify-center rounded-full"
						style="background: rgba(255,255,255,0.2);"
					>
						<svg viewBox="0 0 24 24" fill="white" class="h-5 w-5">
							<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
						</svg>
					</div>
					<p class="text-[10px] font-bold uppercase tracking-widest text-white">
						CAKNA UNTUK KELUARGA HOME
					</p>
					<p class="mt-0.5 text-[10px] italic text-white/75">Satu Sentuhan, Sejuta Makna</p>
				</div>

				<!-- Body -->
				<div class="space-y-3 px-5 py-5">
					{#if previewParagraphs.length === 0}
						<p class="text-sm italic text-zinc-300">Content will appear here…</p>
					{:else}
						{#each previewParagraphs as para, i (i)}
							<p class="text-sm leading-relaxed text-zinc-700">{para}</p>
						{/each}
					{/if}

					<!-- Callout -->
					{#if callout}
						<div class="mt-3 space-y-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
							<p class="text-xs font-semibold text-rose-700">💗 Bersama Kita CAKNA</p>
							{#each previewCalloutLines as line, i (i)}
								<p class="text-xs leading-relaxed text-rose-800">{line}</p>
							{/each}
						</div>
					{/if}

					<p class="pt-1 text-center text-xs text-zinc-400">Daripada, HQ CAKNA</p>
				</div>
			</div>
		</div>
	</div>
</div>
