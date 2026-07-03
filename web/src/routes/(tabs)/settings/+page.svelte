<script lang="ts">
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import SettingsPanel from '$lib/components/mushaf/SettingsPanel.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { t } from '$lib/state/i18n.svelte';
	import { auth } from '$lib/state/auth.svelte';
	import { khatamToasted, read, settings } from '$lib/state/stores.svelte';
	import { downloadBackup, importData } from '$lib/utils/backup';
	import { Download, LogIn, LogOut, RotateCcw, Upload, UserPlus } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	const ms = $derived(settings.value.uiLang === 'ms');

	let fileInput = $state<HTMLInputElement | null>(null);
	let resetOpen = $state(false);
	let loggingOut = $state(false);

	function doExport() {
		try {
			downloadBackup();
			toast(t('t_exp'));
		} catch {
			toast(t('t_exp_err'));
		}
	}

	function onImportFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		const r = new FileReader();
		r.onload = () => {
			try {
				const n = importData(String(r.result));
				toast(ms ? `${n} kunci diimport — memuat semula…` : `${n} keys imported — reloading…`);
				setTimeout(() => {
					try {
						location.reload();
					} catch {
						/* ignore */
					}
				}, 900);
			} catch {
				toast(t('t_imp_err'));
			}
		};
		r.readAsText(f);
		input.value = '';
	}

	function resetKhatam() {
		read.value = [];
		khatamToasted.value = false;
		if (navigator.vibrate) navigator.vibrate(15);
		toast(t('t_reset'));
		resetOpen = false;
	}

	async function logout() {
		loggingOut = true;
		try {
			await auth.logout();
			toast(ms ? 'Anda telah log keluar' : 'You have been signed out');
		} catch {
			toast(ms ? 'Log keluar gagal — cuba lagi' : 'Sign out failed — please try again');
		} finally {
			loggingOut = false;
		}
	}
</script>

<PageHeader title={t('settings')} back="/menu" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<!-- Paparan & bacaan -->
	<Card.Root class="rounded-2xl">
		<Card.Content class="pt-5">
			<SettingsPanel />
		</Card.Content>
	</Card.Root>

	<!-- Akaun -->
	<Card.Root class="mt-4 rounded-2xl">
		<Card.Header>
			<Card.Title class="font-display text-base">{ms ? 'Akaun' : 'Account'}</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-3">
			{#if auth.user}
				<div class="flex items-center justify-between gap-3">
					<div class="min-w-0">
						<p class="truncate text-sm font-medium">{auth.user.email}</p>
						<p class="text-xs text-muted-foreground">
							{ms ? 'Data anda disegerak merentas peranti.' : 'Your data syncs across devices.'}
						</p>
					</div>
					<Button variant="outline" size="sm" onclick={logout} disabled={loggingOut}>
						<LogOut size={16} />
						{ms ? 'Log keluar' : 'Sign out'}
					</Button>
				</div>
			{:else}
				<div class="flex gap-2">
					<Button variant="outline" class="flex-1" href="/auth/login">
						<LogIn size={16} />
						{ms ? 'Log masuk' : 'Sign in'}
					</Button>
					<Button variant="outline" class="flex-1" href="/auth/register">
						<UserPlus size={16} />
						{ms ? 'Daftar' : 'Register'}
					</Button>
				</div>
				<p class="text-xs text-muted-foreground">
					{ms
						? 'Log masuk untuk menyegerak data anda merentas peranti.'
						: 'Sign in to sync your data across devices.'}
				</p>
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Data -->
	<Card.Root class="mt-4 rounded-2xl">
		<Card.Header>
			<Card.Title class="font-display text-base">Data</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-3">
			<div class="flex gap-2">
				<Button variant="outline" class="flex-1" onclick={doExport}>
					<Download size={16} />
					{t('lbl_exp')}
				</Button>
				<Button variant="outline" class="flex-1" onclick={() => fileInput?.click()}>
					<Upload size={16} />
					{t('lbl_imp')}
				</Button>
			</div>
			<input
				bind:this={fileInput}
				type="file"
				accept=".json,application/json"
				class="hidden"
				onchange={onImportFile}
			/>
			<p class="text-xs text-muted-foreground">
				{ms
					? 'Simpan fail eksport sebagai sandaran, atau pindahkan data ke peranti lain.'
					: 'Keep the export file as a backup, or move your data to another device.'}
			</p>
		</Card.Content>
	</Card.Root>

	<!-- Set semula rekod khatam -->
	<Card.Root class="mt-4 rounded-2xl">
		<Card.Content class="pt-5">
			<AlertDialog.Root bind:open={resetOpen}>
				<AlertDialog.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" class="w-full text-destructive" {...props}>
							<RotateCcw size={16} />
							{t('reset_read')}
						</Button>
					{/snippet}
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>{t('reset_read')}</AlertDialog.Title>
						<AlertDialog.Description>
							{ms
								? 'Rekod 604 halaman yang telah dibaca akan dipadam. Log bacaan harian anda dikekalkan.'
								: 'Your record of read pages (out of 604) will be cleared. Your daily reading log is kept.'}
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>{ms ? 'Batal' : 'Cancel'}</AlertDialog.Cancel>
						<AlertDialog.Action onclick={resetKhatam}>{t('reset')}</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</Card.Content>
	</Card.Root>

	<!-- Tentang -->
	<div class="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
		<p class="font-display text-sm text-foreground">Cakna</p>
		<p>
			{ms
				? 'Teks Al-Quran & terjemahan Basmeih — Tanzil.net'
				: 'Quran text & Basmeih translation — Tanzil.net'}
		</p>
		<p>
			{ms
				? 'Terjemahan English (Sahih International) & Indonesia (Kemenag)'
				: 'English (Sahih International) & Indonesian (Kemenag) translations'}
		</p>
		<p>Audio — cdn.islamic.network</p>
	</div>
</div>
