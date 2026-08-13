<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import AyahActionsDrawer from '$lib/components/mushaf/AyahActionsDrawer.svelte';
	import MushafPage from '$lib/components/mushaf/MushafPage.svelte';
	import SettingsPanel from '$lib/components/mushaf/SettingsPanel.svelte';
	import TajweedLegend from '$lib/components/mushaf/TajweedLegend.svelte';
	import TranslationBar from '$lib/components/mushaf/TranslationBar.svelte';
	import { prefetchPage } from '$lib/api/content';
	import { pageOf, pageRange } from '$lib/quran/meta';
	import { t } from '$lib/state/i18n.svelte';
	import { player } from '$lib/state/player.svelte';
	import { bookmarks, khatamToasted, read, settings, trackRead } from '$lib/state/stores.svelte';
	import {
		ArrowLeft,
		Bookmark,
		ChevronLeft,
		ChevronRight,
		Palette,
		Play,
		Search,
		Settings2,
		Square
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const p = $derived(data.bundle.page);
	let actG = $state<number | null>(null);
	let legendOpen = $state(false);
	let settingsOpen = $state(false);
	let focusMode = $state(false);
	let focusHintShown = false;
	let prevPage = -1;

	// per-page bookkeeping: track read, persist last page, stop user-turn audio
	$effect(() => {
		const page = data.bundle.page;
		if (page === prevPage) return;
		const wasUserTurn = prevPage !== -1 && !player.navigating;
		prevPage = page;
		if (wasUserTurn && player.playingG >= 1 && pageOf(player.playingG) !== page) {
			player.stop();
		}
		settings.value.page = page;
		trackRead(page);
		if (read.value.length === 604 && !khatamToasted.value) {
			toast(t('t_khatam'));
			khatamToasted.value = true;
		}
		prefetchPage(page + 1);
		prefetchPage(page - 1);
	});

	const isBookmarked = $derived(bookmarks.value.includes(p));
	function toggleBookmark() {
		if (isBookmarked) {
			bookmarks.value = bookmarks.value.filter((x) => x !== p);
			toast(t('t_bm_del'));
		} else {
			bookmarks.value = [...bookmarks.value, p].sort((a, b) => a - b);
			toast(t('t_bm_add', { n: p }));
		}
	}

	function go(page: number) {
		if (page >= 1 && page <= 604) goto(`/read/${page}`);
	}

	// swipe: left = next page, like the sample
	let touchX = 0;
	let touchY = 0;
	function onTouchStart(e: TouchEvent) {
		touchX = e.touches[0].clientX;
		touchY = e.touches[0].clientY;
	}
	function onTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchX;
		const dy = e.changedTouches[0].clientY - touchY;
		if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
			go(dx < 0 ? p + 1 : p - 1);
		}
	}

	function onKeydown(e: KeyboardEvent) {
		const tag = (e.target as HTMLElement).tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
		if (e.key === 'ArrowRight') go(p + 1);
		else if (e.key === 'ArrowLeft') go(p - 1);
		else if (e.key === ' ') {
			e.preventDefault();
			togglePagePlay();
		}
	}

	function togglePagePlay() {
		const [first, last] = pageRange(p);
		if (player.playingG >= first && player.playingG <= last) player.stop();
		else player.playPage(p);
	}
	const pagePlaying = $derived.by(() => {
		const [first, last] = pageRange(p);
		return player.playingG >= first && player.playingG <= last;
	});

	function onReaderClick(e: MouseEvent) {
		const el = e.target as HTMLElement;
		// only empty space toggles focus mode
		if (el.closest('.ay, button, a, input, .mushaf, [role="dialog"]')) return;
		focusMode = !focusMode;
		if (focusMode && !focusHintShown) {
			focusHintShown = true;
			toast(t('t_focus'));
		}
	}

	const title = $derived([...new Set(data.bundle.surahs.map((s) => s.name_translit))].join(' · '));

	let jumpValue = $state('');
	function jump(e: Event) {
		e.preventDefault();
		const n = Math.floor(+jumpValue);
		if (n >= 1 && n <= 604) {
			go(n);
			jumpValue = '';
		} else toast.error(t('t_jump_err'));
	}
</script>

<svelte:window onkeydown={onKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
	class="min-h-dvh"
	ontouchstart={onTouchStart}
	ontouchend={onTouchEnd}
	onclick={onReaderClick}
>
	{#if !focusMode}
		<header class="fixed inset-x-0 top-0 z-30 border-b bg-card">
			<div class="mx-auto flex h-14 max-w-[680px] items-center gap-1 px-2">
				<a href="/" class="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground">
					<ArrowLeft size={20} />
				</a>
				<div class="min-w-0 flex-1 text-center">
					<h1 class="truncate font-display text-[15px]">{title}</h1>
					<p class="text-[11px] tracking-wide text-muted-foreground">
						{t('page')}
						{p} / 604 · {t('juz')}
						{data.bundle.juz}
					</p>
				</div>
				<a href="/search" class="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground">
					<Search size={19} />
				</a>
				<button
					class="grid h-10 w-10 place-items-center rounded-xl {isBookmarked ? 'text-gold' : 'text-muted-foreground'}"
					onclick={toggleBookmark}
					aria-label="bookmark"
				>
					<Bookmark size={19} fill={isBookmarked ? 'currentColor' : 'none'} />
				</button>
			</div>
			<div class="h-0.5 bg-gold transition-all" style="width: {(p / 604) * 100}%"></div>
		</header>
	{/if}

	<main class="px-4 pt-[70px]" style="padding-bottom: calc(96px + var(--safe-b));">
		<MushafPage bundle={data.bundle} flashG={data.flashG} onactions={(g) => (actG = g)} />
	</main>

	{#if !focusMode}
		<TranslationBar bundle={data.bundle} />
		<nav class="fixed inset-x-0 bottom-0 z-40 border-t bg-card" style="padding-bottom: var(--safe-b);">
			<div class="mx-auto flex h-16 max-w-[680px] items-center justify-between gap-1 px-3">
				<Button variant="ghost" size="icon" class="h-11 w-11" disabled={p <= 1} onclick={() => go(p - 1)}>
					<ChevronLeft size={22} />
				</Button>
				<Button variant="ghost" size="icon" class="h-11 w-11" onclick={() => (legendOpen = true)}>
					<Palette size={19} />
				</Button>
				<Button size="icon" class="h-12 w-12 rounded-2xl" onclick={togglePagePlay}>
					{#if pagePlaying}<Square size={18} fill="currentColor" />{:else}<Play size={20} />{/if}
				</Button>
				<Button variant="ghost" size="icon" class="h-11 w-11" onclick={() => (settingsOpen = true)}>
					<Settings2 class="size-5" />
				</Button>
				<Button variant="ghost" size="icon" class="h-11 w-11" disabled={p >= 604} onclick={() => go(p + 1)}>
					<ChevronRight size={22} />
				</Button>
			</div>
			<form class="mx-auto flex max-w-[680px] items-center gap-2 px-4 pb-2" onsubmit={jump}>
				<input
					type="number"
					min="1"
					max="604"
					placeholder={t('lbl_jump')}
					bind:value={jumpValue}
					class="h-8 flex-1 rounded-lg border bg-background px-3 text-center text-sm outline-none"
				/>
				<Button type="submit" variant="secondary" size="sm" class="h-8">{t('go')}</Button>
			</form>
		</nav>
	{/if}
</div>

<AyahActionsDrawer g={actG} bundle={data.bundle} onclose={() => (actG = null)} />
<TajweedLegend open={legendOpen} onclose={() => (legendOpen = false)} />
<Drawer.Root bind:open={settingsOpen}>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title class="font-display">{t('settings')}</Drawer.Title>
		</Drawer.Header>
		<div class="max-h-[70dvh] overflow-y-auto px-4 pb-6">
			<SettingsPanel />
		</div>
	</Drawer.Content>
</Drawer.Root>
