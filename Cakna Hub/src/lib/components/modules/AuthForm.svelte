<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { ApiError } from '$lib/api/client';
	import { auth } from '$lib/state/auth.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { pullAndMerge } from '$lib/state/sync.svelte';

	interface Props {
		mode: 'login' | 'register';
	}
	let { mode }: Props = $props();

	const ms = $derived(settings.value.uiLang === 'ms');
	const isLogin = $derived(mode === 'login');

	let email = $state('');
	let password = $state('');
	let confirm = $state('');
	let loading = $state(false);
	let showPw = $state(false);
	let error = $state('');
	let errSeq = $state(0); // bump to re-trigger the shake on repeated errors

	// Preserve a same-origin ?next= return path (legacy behaviour), forwarded to
	// the SSO button too. Reject protocol-relative (//evil) and absolute URLs.
	const next = $derived.by(() => {
		const n = page.url.searchParams.get('next');
		return n && n.startsWith('/') && !n.startsWith('//') ? n : null;
	});
	const ssoHref = $derived(next ? `/auth/sso/start?next=${encodeURIComponent(next)}` : '/auth/sso/start');

	function fail(msg: string) {
		error = msg;
		errSeq += 1;
	}
	function errMsg(err: unknown): string {
		if (err instanceof ApiError) {
			if (err.status === 401) return ms ? 'E-mel atau kata laluan salah' : 'Wrong email or password';
			if (err.status === 409) return ms ? 'E-mel sudah didaftarkan' : 'Email already registered';
			if (err.message) return err.message;
		}
		return ms ? 'Ralat sambungan. Sila cuba lagi.' : 'Connection error. Please try again.';
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (loading) return;
		error = '';
		const mail = email.trim();
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
			fail(ms ? 'Sila masukkan alamat emel yang sah.' : 'Please enter a valid email address.');
			return;
		}
		if (!password) {
			fail(ms ? 'Sila masukkan kata laluan anda.' : 'Please enter your password.');
			return;
		}
		if (!isLogin) {
			if (password.length < 8) {
				fail(ms ? 'Kata laluan mestilah sekurang-kurangnya 8 aksara.' : 'Password must be at least 8 characters.');
				return;
			}
			if (password !== confirm) {
				fail(ms ? 'Kata laluan tidak sepadan.' : 'Passwords do not match.');
				return;
			}
		}
		loading = true;
		try {
			if (isLogin) await auth.login(mail, password);
			else await auth.register(mail, password);
			try {
				await pullAndMerge();
			} catch {
				/* sync failure is non-fatal on login */
			}
			if (navigator.vibrate) navigator.vibrate(15);
			goto(next ?? '/');
		} catch (err) {
			fail(errMsg(err));
		} finally {
			loading = false;
		}
	}
</script>

<main class="stage">
	<section class="card" aria-labelledby="pageTitle">
		<!-- Brand -->
		<header class="brand">
			<div class="mark" aria-hidden="true">
				<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">
					<path d="M22 2 l5.9 8.2 9.6 2.4 -6.2 7.7 .7 9.9 -10 -3.7 -10 3.7 .7 -9.9 -6.2 -7.7 9.6 -2.4 Z" />
					<circle cx="22" cy="18" r="5.5" />
					<path d="M13 36 h18 M16 41 h12" stroke-linecap="round" />
				</svg>
			</div>
			<div class="wordmark">Cakna</div>
			<div class="tagline">Mushaf Digital</div>
			<div class="brand-rule" aria-hidden="true"></div>
		</header>

		<!-- Heading -->
		<div class="head">
			<h1 id="pageTitle">
				{#if isLogin}{ms ? 'Selamat datang' : 'Welcome'}{:else}{ms ? 'Cipta akaun' : 'Create account'}{/if}
			</h1>
			<p>
				{#if isLogin}{ms ? 'Log masuk untuk meneruskan bacaan anda.' : 'Sign in to continue your reading.'}
				{:else}{ms ? 'Daftar untuk menyimpan kemajuan anda.' : 'Register to save your progress.'}{/if}
			</p>
		</div>

		<!-- Primary: QCXIS SSO -->
		<a class="sso" href={ssoHref}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M12 3 4.5 6v5.5c0 4.3 3.2 7.5 7.5 8.5 4.3-1 7.5-4.2 7.5-8.5V6L12 3Z" />
				<circle cx="12" cy="10.4" r="2" />
				<path d="M12 12.4v3.1" />
			</svg>
			<span>{ms ? 'Teruskan dengan QCXIS' : 'Continue with QCXIS'}</span>
		</a>
		<p class="sso-sub">{ms ? 'Log masuk dengan akaun QCXIS anda' : 'Sign in with your QCXIS account'}</p>

		<!-- Divider -->
		<div class="divider"><span>{ms ? 'atau' : 'or'}</span></div>

		<!-- Secondary: email + password -->
		<form onsubmit={submit} novalidate>
			<div class="field">
				<label for="auth-email">{ms ? 'Emel' : 'Email'}</label>
				<div class="control">
					<input
						id="auth-email"
						type="email"
						inputmode="email"
						autocomplete="username"
						autocapitalize="none"
						spellcheck="false"
						placeholder={ms ? 'nama@contoh.com' : 'name@example.com'}
						aria-invalid={error && !email ? 'true' : undefined}
						bind:value={email}
						required
					/>
				</div>
			</div>

			<div class="field">
				<label for="auth-pw">{ms ? 'Kata laluan' : 'Password'}</label>
				<div class="control">
					<input
						id="auth-pw"
						type={showPw ? 'text' : 'password'}
						autocomplete={isLogin ? 'current-password' : 'new-password'}
						placeholder={ms ? 'Kata laluan anda' : 'Your password'}
						bind:value={password}
						required
					/>
					<button
						type="button"
						class="pw-toggle"
						data-visible={showPw}
						aria-label={showPw
							? ms ? 'Sembunyikan kata laluan' : 'Hide password'
							: ms ? 'Tunjuk kata laluan' : 'Show password'}
						onclick={() => (showPw = !showPw)}
					>
						{#if showPw}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M3 3l18 18" />
								<path d="M10.6 6.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a15.9 15.9 0 0 1-3.4 4.3M6.5 6.6C3.7 8.3 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 4-.9" />
								<path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
							</svg>
						{:else}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
						{/if}
					</button>
				</div>
			</div>

			{#if !isLogin}
				<div class="field">
					<label for="auth-pw2">{ms ? 'Sahkan kata laluan' : 'Confirm password'}</label>
					<div class="control">
						<input
							id="auth-pw2"
							type={showPw ? 'text' : 'password'}
							autocomplete="new-password"
							bind:value={confirm}
							required
						/>
					</div>
				</div>
			{/if}

			{#if error}
				{#key errSeq}
					<p class="error show" role="alert" aria-live="assertive">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16h.01" />
						</svg>
						<span>{error}</span>
					</p>
				{/key}
			{/if}

			<button type="submit" class="login-btn" aria-busy={loading} disabled={loading}>
				{#if isLogin}{ms ? 'Log masuk' : 'Sign in'}{:else}{ms ? 'Daftar' : 'Register'}{/if}
			</button>
		</form>

		<!-- Register / sign-in switch -->
		<p class="register">
			{#if isLogin}
				{ms ? 'Belum ada akaun?' : 'No account yet?'}
				<a href="/auth/register">{ms ? 'Daftar' : 'Register'}</a>
			{:else}
				{ms ? 'Sudah ada akaun?' : 'Already have an account?'}
				<a href="/auth/login">{ms ? 'Log masuk' : 'Sign in'}</a>
			{/if}
		</p>

		<div class="secure" aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
				<rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
			</svg>
			<span>{ms ? 'Sambungan disulitkan & selamat' : 'Encrypted & secure connection'}</span>
		</div>
	</section>
</main>

<style>
	.stage {
		--emerald-deep: #3a1520;
		--emerald: #6e2942;
		--emerald-soft: #8e3557;
		--gold: #c7a24b;
		--gold-soft: #e3cd96;
		--cream: #fdf2f7;
		--surface: #fffbfd;
		--text: #221228;
		--muted: #6b3a53;
		--border: #f0dce8;
		--danger: #b4432e;
		--danger-bg: #fbede8;
		--radius-card: 24px;
		--radius-ctrl: 13px;
		--ring: 0 0 0 3px rgba(110, 41, 66, 0.2);
		--ring-gold: 0 0 0 3px rgba(199, 162, 75, 0.4);
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 28px 18px calc(28px + env(safe-area-inset-bottom));
		overflow: hidden;
		isolation: isolate;
		color: var(--text);
		font-family: 'Figtree', system-ui, -apple-system, sans-serif;
		-webkit-font-smoothing: antialiased;
	}
	.stage::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -2;
		background:
			radial-gradient(130% 70% at 50% -12%, rgba(58, 21, 32, 0.14), rgba(58, 21, 32, 0) 58%),
			radial-gradient(90% 55% at 88% 108%, rgba(199, 162, 75, 0.14), rgba(199, 162, 75, 0) 60%),
			var(--cream);
	}
	.stage::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background-image: radial-gradient(rgba(58, 21, 32, 0.04) 1px, transparent 1px);
		background-size: 22px 22px;
		-webkit-mask-image: radial-gradient(120% 80% at 50% 40%, #000 20%, transparent 75%);
		mask-image: radial-gradient(120% 80% at 50% 40%, #000 20%, transparent 75%);
		opacity: 0.5;
		pointer-events: none;
	}

	.card {
		position: relative;
		width: 100%;
		max-width: 420px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		box-shadow:
			0 28px 60px -30px rgba(58, 21, 32, 0.38),
			0 4px 14px -8px rgba(58, 21, 32, 0.12);
		padding: 34px 30px 28px;
		animation: rise 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	.card::before {
		content: '';
		position: absolute;
		left: 26px;
		right: 26px;
		top: 0;
		height: 2px;
		border-radius: 0 0 3px 3px;
		background: linear-gradient(90deg, transparent, var(--gold-soft), var(--gold), var(--gold-soft), transparent);
		opacity: 0.85;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.985);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.brand {
		text-align: center;
		margin-bottom: 22px;
	}
	.mark {
		color: var(--gold);
		width: 52px;
		height: 52px;
		margin: 0 auto 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		filter: drop-shadow(0 4px 10px rgba(199, 162, 75, 0.3));
	}
	.mark svg {
		width: 52px;
		height: 52px;
	}
	.wordmark {
		font-family: 'Marcellus', serif;
		font-size: 34px;
		line-height: 1;
		letter-spacing: 0.5px;
		color: var(--emerald-deep);
	}
	.tagline {
		margin-top: 8px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--gold);
	}
	.brand-rule {
		width: 44px;
		height: 1px;
		margin: 16px auto 0;
		background: linear-gradient(90deg, transparent, var(--border), transparent);
	}

	.head {
		text-align: center;
		margin: 20px 0 22px;
	}
	.head h1 {
		font-family: 'Marcellus', serif;
		font-weight: 400;
		font-size: 23px;
		margin: 0 0 6px;
		color: var(--emerald-deep);
		letter-spacing: 0.2px;
	}
	.head p {
		margin: 0;
		font-size: 14.5px;
		color: var(--muted);
		line-height: 1.5;
	}

	.sso {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 11px;
		width: 100%;
		min-height: 56px;
		padding: 15px 18px;
		border: 0;
		border-radius: var(--radius-ctrl);
		background: linear-gradient(180deg, var(--emerald-soft), var(--emerald) 45%, var(--emerald-deep));
		color: #fff;
		font-family: inherit;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 0.2px;
		text-decoration: none;
		cursor: pointer;
		box-shadow:
			0 14px 26px -14px rgba(58, 21, 32, 0.5),
			inset 0 1px 0 rgba(255, 255, 255, 0.14);
		transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
	}
	.sso:hover {
		transform: translateY(-1px);
		filter: saturate(1.04);
	}
	.sso:active {
		transform: translateY(0);
	}
	.sso:focus-visible {
		outline: none;
		box-shadow: var(--ring-gold), 0 14px 26px -14px rgba(58, 21, 32, 0.5);
	}
	.sso svg {
		width: 21px;
		height: 21px;
		flex: none;
	}
	.sso-sub {
		text-align: center;
		margin: 10px 0 0;
		font-size: 12.5px;
		color: var(--muted);
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 14px;
		margin: 22px 0;
		color: var(--muted);
	}
	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--border) 45%, var(--border) 55%, transparent);
	}
	.divider span {
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 2.5px;
		text-transform: uppercase;
	}

	form {
		margin: 0;
	}
	.field {
		margin-bottom: 15px;
	}
	.field label {
		display: block;
		margin-bottom: 7px;
		font-size: 13px;
		font-weight: 600;
		color: var(--text);
		letter-spacing: 0.2px;
	}
	.control {
		position: relative;
	}
	.control input {
		width: 100%;
		padding: 13px 14px;
		font-family: inherit;
		font-size: 15px;
		color: var(--text);
		background: var(--cream);
		border: 1px solid var(--border);
		border-radius: var(--radius-ctrl);
		transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
		-webkit-appearance: none;
		appearance: none;
	}
	.control:has(.pw-toggle) input {
		padding-right: 46px;
	}
	.control input::placeholder {
		color: #b09ab0;
	}
	.control input:focus {
		outline: none;
		border-color: var(--emerald);
		background: var(--surface);
		box-shadow: var(--ring);
	}
	.control input[aria-invalid='true'] {
		border-color: var(--danger);
		box-shadow: 0 0 0 3px rgba(180, 67, 46, 0.14);
	}

	.pw-toggle {
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		padding: 0;
		border: 0;
		border-radius: 9px;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		transition: color 0.16s ease, background 0.16s ease;
	}
	.pw-toggle:hover {
		color: var(--emerald);
		background: rgba(110, 41, 66, 0.06);
	}
	.pw-toggle:focus-visible {
		outline: none;
		box-shadow: var(--ring);
		color: var(--emerald);
	}
	.pw-toggle svg {
		width: 19px;
		height: 19px;
	}

	.error {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 2px 0 4px;
		padding: 10px 12px;
		font-size: 13px;
		line-height: 1.4;
		color: var(--danger);
		background: var(--danger-bg);
		border: 1px solid rgba(180, 67, 46, 0.22);
		border-radius: 10px;
	}
	.error.show {
		animation: shake 0.32s ease;
	}
	.error svg {
		width: 16px;
		height: 16px;
		flex: none;
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-4px);
		}
		40% {
			transform: translateX(4px);
		}
		60% {
			transform: translateX(-3px);
		}
		80% {
			transform: translateX(3px);
		}
	}

	.login-btn {
		position: relative;
		width: 100%;
		min-height: 52px;
		margin-top: 6px;
		padding: 14px 18px;
		font-family: inherit;
		font-size: 15.5px;
		font-weight: 600;
		letter-spacing: 0.2px;
		color: var(--emerald-deep);
		background: rgba(110, 41, 66, 0.05);
		border: 1.5px solid var(--emerald);
		border-radius: var(--radius-ctrl);
		cursor: pointer;
		transition: background 0.16s ease, color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;
	}
	.login-btn:hover {
		background: var(--emerald);
		color: #fff;
	}
	.login-btn:active {
		transform: translateY(1px);
	}
	.login-btn:focus-visible {
		outline: none;
		box-shadow: var(--ring);
	}
	.login-btn[aria-busy='true'] {
		color: transparent;
		cursor: progress;
		background: rgba(110, 41, 66, 0.05);
	}
	.login-btn[aria-busy='true']::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 19px;
		height: 19px;
		margin: -9.5px 0 0 -9.5px;
		border: 2.5px solid rgba(110, 41, 66, 0.25);
		border-top-color: var(--emerald);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.register {
		text-align: center;
		margin: 20px 0 4px;
		font-size: 14px;
		color: var(--muted);
	}
	.register a {
		color: var(--emerald);
		font-weight: 600;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.16s ease;
	}
	.register a:hover {
		border-bottom-color: var(--emerald);
	}

	.secure {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		margin-top: 22px;
		font-size: 11.5px;
		color: var(--muted);
		opacity: 0.85;
	}
	.secure svg {
		width: 13px;
		height: 13px;
	}

	@media (max-width: 400px) {
		.card {
			padding: 28px 22px 24px;
			border-radius: 20px;
		}
		.wordmark {
			font-size: 30px;
		}
		.head h1 {
			font-size: 21px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card,
		.error.show {
			animation-duration: 0.001ms;
		}
	}
</style>
