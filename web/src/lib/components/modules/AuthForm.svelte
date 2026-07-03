<script lang="ts">
	import { goto } from '$app/navigation';
	import { ApiError } from '$lib/api/client';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { auth } from '$lib/state/auth.svelte';
	import { t } from '$lib/state/i18n.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { pullAndMerge } from '$lib/state/sync.svelte';
	import { LoaderCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		mode: 'login' | 'register';
	}
	let { mode }: Props = $props();

	const ms = $derived(settings.value.uiLang === 'ms');
	const cta = $derived(
		mode === 'login' ? (ms ? 'Log masuk' : 'Sign in') : ms ? 'Daftar' : 'Register'
	);

	let email = $state('');
	let password = $state('');
	let confirm = $state('');
	let loading = $state(false);

	function errMsg(err: unknown): string {
		if (err instanceof ApiError) {
			if (err.status === 401)
				return ms ? 'E-mel atau kata laluan salah' : 'Wrong email or password';
			if (err.status === 409) return ms ? 'E-mel sudah didaftarkan' : 'Email already registered';
			if (err.message) return err.message;
		}
		return ms ? 'Ralat berlaku — sila cuba lagi' : 'Something went wrong — please try again';
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (loading) return;
		if (mode === 'register') {
			if (password.length < 8) {
				toast.error(
					ms
						? 'Kata laluan mestilah sekurang-kurangnya 8 aksara'
						: 'Password must be at least 8 characters'
				);
				return;
			}
			if (password !== confirm) {
				toast.error(ms ? 'Kata laluan tidak sepadan' : 'Passwords do not match');
				return;
			}
		}
		loading = true;
		try {
			if (mode === 'login') await auth.login(email.trim(), password);
			else await auth.register(email.trim(), password);
			try {
				await pullAndMerge();
			} catch {
				/* sync failure is non-fatal on login */
			}
			if (navigator.vibrate) navigator.vibrate(15);
			toast(ms ? 'Selamat datang!' : 'Welcome!');
			goto('/');
		} catch (err) {
			toast.error(errMsg(err));
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto mt-10 max-w-sm px-4">
	<div class="text-center">
		<div class="font-display text-3xl tracking-wide text-primary">Cakna</div>
		<p class="mt-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{t('sub')}</p>
	</div>

	<Card.Root class="mt-6 rounded-2xl">
		<Card.Header>
			<Card.Title class="font-display text-lg">{cta}</Card.Title>
		</Card.Header>
		<Card.Content>
			<form class="grid gap-4" onsubmit={submit}>
				<div class="grid gap-1.5">
					<Label for="auth-email">{ms ? 'E-mel' : 'Email'}</Label>
					<Input
						id="auth-email"
						type="email"
						required
						autocomplete="email"
						bind:value={email}
						placeholder={ms ? 'nama@emel.com' : 'name@email.com'}
					/>
				</div>
				<div class="grid gap-1.5">
					<Label for="auth-pw">{ms ? 'Kata laluan' : 'Password'}</Label>
					<Input
						id="auth-pw"
						type="password"
						required
						autocomplete={mode === 'login' ? 'current-password' : 'new-password'}
						bind:value={password}
					/>
				</div>
				{#if mode === 'register'}
					<div class="grid gap-1.5">
						<Label for="auth-pw2">{ms ? 'Sahkan kata laluan' : 'Confirm password'}</Label>
						<Input
							id="auth-pw2"
							type="password"
							required
							autocomplete="new-password"
							bind:value={confirm}
						/>
					</div>
				{/if}
				<Button type="submit" class="mt-1 w-full rounded-xl" disabled={loading}>
					{#if loading}<LoaderCircle size={16} class="animate-spin" />{/if}
					{cta}
				</Button>
			</form>

			<p class="mt-4 text-center text-sm">
				{#if mode === 'login'}
					<a href="/auth/register" class="text-primary underline-offset-4 hover:underline">
						{ms ? 'Belum ada akaun? Daftar' : 'No account? Register'}
					</a>
				{:else}
					<a href="/auth/login" class="text-primary underline-offset-4 hover:underline">
						{ms ? 'Sudah ada akaun? Log masuk' : 'Already have an account? Sign in'}
					</a>
				{/if}
			</p>
		</Card.Content>
	</Card.Root>
</div>
