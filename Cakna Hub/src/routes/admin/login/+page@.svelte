<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
	let showPassword = $state(false);
	let loading = $state(false);
	let ssoLoading = $state(false);
	const error = $derived(form?.error);
</script>

<svelte:head><title>Log in · Cakna Hub Admin</title></svelte:head>

<div class="page">
	<a href="https://cakna.org/menu" class="back-link">
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
		Back to website
	</a>

	<div class="heading">
		<h1>Cakna <span>Hub</span></h1>
		<p>Log in to continue.</p>
	</div>

	<div class="card">
		{#if error}
			<div class="error">{error}</div>
		{/if}

		<!-- QCXIS SSO -->
		<form method="POST" action="?/sso" use:enhance={() => { ssoLoading = true; return async ({ update }) => { await update(); ssoLoading = false; }; }}>
			<button type="submit" disabled={ssoLoading || loading} class="btn-primary">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
				</svg>
				{ssoLoading ? 'Redirecting…' : 'Continue with QCXIS'}
			</button>
			<p class="sso-hint">Log in with your QCXIS account</p>
		</form>

		<div class="divider"><span>OR</span></div>

		<!-- Email / password -->
		<form
			method="POST"
			action="?/login"
			use:enhance={() => { loading = true; return async ({ update }) => { await update(); loading = false; }; }}
			class="fields"
		>
			<label>
				<span>Email</span>
				<input type="email" name="email" autocomplete="email" placeholder="nama@cakna.com" required />
			</label>

			<label>
				<span>Password</span>
				<div class="pw-wrap">
					<input
						type={showPassword ? 'text' : 'password'}
						name="password"
						autocomplete="current-password"
						placeholder="Your password"
						required
					/>
					<button
						type="button"
						class="eye"
						onclick={() => (showPassword = !showPassword)}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{#if showPassword}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
						{:else}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
						{/if}
					</button>
				</div>
			</label>

			<button type="submit" disabled={loading || ssoLoading} class="btn-primary" style="margin-top:0.25rem;">
				{loading ? 'Logging in…' : 'Log in'}
			</button>
		</form>

		<p class="register">
			Don't have an account yet? <a href="https://cakna.org/auth/register">Register here</a>
		</p>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #f4f4f5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.25rem;
		position: relative;
	}

	.back-link {
		position: absolute;
		top: 1.5rem;
		left: 1.5rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: #52525b;
		text-decoration: none;
		font-weight: 500;
	}
	.back-link:hover { color: #18181b; }

	.heading {
		text-align: center;
		margin-bottom: 1.75rem;
	}
	.heading h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: #18181b;
		margin: 0 0 0.3rem;
		letter-spacing: -0.02em;
	}
	.heading h1 span { color: #b34a6e; }
	.heading p {
		font-size: 0.9rem;
		color: #71717a;
		margin: 0;
	}

	.card {
		width: 100%;
		max-width: 420px;
		background: #fff;
		border-radius: 16px;
		padding: 2rem;
		border: 0.5px solid #e4e4e7;
		box-shadow: 0 2px 16px rgba(0,0,0,0.06);
	}

	.error {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #b91c1c;
		border-radius: 8px;
		padding: 0.6rem 0.85rem;
		font-size: 0.83rem;
		margin-bottom: 1rem;
	}

	.btn-primary {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: #b34a6e;
		color: #fff;
		border: none;
		border-radius: 999px;
		padding: 0.8rem 1.5rem;
		font-size: 0.92rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn-primary:hover:not(:disabled) { background: #9d3d5f; }
	.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

	.sso-hint {
		text-align: center;
		font-size: 0.78rem;
		color: #a1a1aa;
		margin: 0.5rem 0 0;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 1.25rem 0;
	}
	.divider::before, .divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: #e4e4e7;
	}
	.divider span {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		color: #a1a1aa;
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.fields label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.fields label span {
		font-size: 0.85rem;
		font-weight: 600;
		color: #3f3f46;
	}
	.fields input {
		border: 1.5px solid #e4e4e7;
		border-radius: 10px;
		padding: 0.7rem 0.9rem;
		font-size: 0.88rem;
		color: #18181b;
		background: #fff;
		outline: none;
		width: 100%;
		box-sizing: border-box;
		transition: border-color 0.15s;
	}
	.fields input:focus { border-color: #b34a6e; }

	.pw-wrap {
		position: relative;
	}
	.pw-wrap input { padding-right: 2.6rem; }
	.eye {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: #a1a1aa;
		cursor: pointer;
		padding: 0;
		display: flex;
	}
	.eye:hover { color: #52525b; }

	.register {
		text-align: center;
		font-size: 0.83rem;
		color: #71717a;
		margin: 1.25rem 0 0;
	}
	.register a {
		color: #b34a6e;
		font-weight: 600;
		text-decoration: none;
	}
	.register a:hover { text-decoration: underline; }
</style>
