<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	const next = $derived(data.next ?? '/admin/dashboard');
	let showPassword = $state(false);
	let loading = $state(false);
	let ssoLoading = $state(false);
	const error = $derived(form?.error ?? data.error);
</script>

<svelte:head><title>Log masuk · Cakna Hub</title></svelte:head>

<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f0ede6;padding:1.5rem;">
	<div style="width:100%;max-width:400px;background:#fff;border-radius:24px;padding:2.5rem 2rem 2rem;box-shadow:0 4px 32px rgba(0,0,0,0.08);">

		<!-- Logo -->
		<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;margin-bottom:1.75rem;">
			<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="M32 4L38.5 20.5L56 22L43.5 34L47 52L32 43.5L17 52L20.5 34L8 22L25.5 20.5Z" fill="#c8a84b" opacity="0.15"/>
				<path d="M32 6L38 21.5L55 23.5L42.5 35.5L46 52L32 44L18 52L21.5 35.5L9 23.5L26 21.5Z" stroke="#c8a84b" stroke-width="1.5" fill="none"/>
				<circle cx="32" cy="30" r="10" fill="#f0ede6"/>
				<circle cx="32" cy="28" r="5" fill="none" stroke="#1a4a3a" stroke-width="1.5"/>
				<line x1="32" y1="33" x2="32" y2="38" stroke="#1a4a3a" stroke-width="1.5" stroke-linecap="round"/>
				<line x1="27" y1="38" x2="37" y2="38" stroke="#1a4a3a" stroke-width="1.5" stroke-linecap="round"/>
			</svg>
			<div style="text-align:center;">
				<p style="font-size:1.5rem;font-weight:600;color:#1a4a3a;letter-spacing:-0.01em;margin:0;font-family:Georgia,serif;">Cakna</p>
				<p style="font-size:0.65rem;letter-spacing:0.18em;color:#c8a84b;margin:2px 0 0;font-weight:600;text-transform:uppercase;">Mushaf Digital</p>
				<div style="width:40px;height:1px;background:#c8a84b;margin:6px auto 0;opacity:0.6;"></div>
			</div>
		</div>

		<!-- Heading -->
		<div style="text-align:center;margin-bottom:1.5rem;">
			<h1 style="font-size:1.4rem;font-weight:600;color:#1a4a3a;margin:0 0 4px;font-family:Georgia,serif;">Selamat datang</h1>
			<p style="font-size:0.85rem;color:#6b7280;margin:0;">Log masuk untuk mengakses Cakna Hub.</p>
		</div>

		<!-- QCXIS SSO -->
		<form method="POST" action="?/sso" use:enhance={() => { ssoLoading = true; return async ({ update }) => { await update(); ssoLoading = false; }; }}>
			<button
				type="submit"
				disabled={ssoLoading || loading}
				style="width:100%;display:flex;align-items:center;justify-content:center;gap:0.6rem;background:#1a4a3a;color:#fff;border:none;border-radius:999px;padding:0.8rem 1.5rem;font-size:0.9rem;font-weight:600;cursor:pointer;margin-bottom:0.5rem;opacity:{ssoLoading ? 0.7 : 1};"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
				</svg>
				{ssoLoading ? 'Mengalihkan…' : 'Teruskan dengan QCXIS'}
			</button>
			<p style="text-align:center;font-size:0.78rem;color:#9ca3af;margin:0 0 1.25rem;">Log masuk dengan akaun QCXIS anda</p>
		</form>

		<!-- Divider -->
		<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;">
			<div style="flex:1;height:1px;background:#e5e7eb;"></div>
			<span style="font-size:0.72rem;letter-spacing:0.1em;color:#9ca3af;font-weight:600;">ATAU</span>
			<div style="flex:1;height:1px;background:#e5e7eb;"></div>
		</div>

		<!-- Error -->
		{#if error}
			<div style="background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:10px;padding:0.65rem 0.9rem;font-size:0.82rem;margin-bottom:1rem;">{error}</div>
		{/if}

		<!-- Email/password form -->
		<form
			method="POST"
			action="?/login&next={encodeURIComponent(next)}"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => { await update(); loading = false; };
			}}
			style="display:flex;flex-direction:column;gap:1rem;"
		>
			<label style="display:flex;flex-direction:column;gap:0.35rem;">
				<span style="font-size:0.82rem;font-weight:600;color:#374151;">Emel</span>
				<input
					type="email"
					name="email"
					autocomplete="email"
					placeholder="nama@contoh.com"
					required
					class="cakna-input"
				/>
			</label>

			<label style="display:flex;flex-direction:column;gap:0.35rem;">
				<span style="font-size:0.82rem;font-weight:600;color:#374151;">Kata laluan</span>
				<div style="position:relative;">
					<input
						type={showPassword ? 'text' : 'password'}
						name="password"
						autocomplete="current-password"
						placeholder="Kata laluan anda"
						required
						class="cakna-input"
						style="padding-right:2.8rem;"
					/>
					<button
						type="button"
						onclick={() => (showPassword = !showPassword)}
						style="position:absolute;right:0.9rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#9ca3af;cursor:pointer;padding:0;display:flex;"
						aria-label={showPassword ? 'Sembunyikan kata laluan' : 'Tunjukkan kata laluan'}
					>
						{#if showPassword}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
								<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
								<line x1="1" y1="1" x2="23" y2="23"/>
							</svg>
						{:else}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
								<circle cx="12" cy="12" r="3"/>
							</svg>
						{/if}
					</button>
				</div>
			</label>

			<button
				type="submit"
				disabled={loading || ssoLoading}
				style="width:100%;border:1.5px solid #1a4a3a;background:#fff;color:#1a4a3a;border-radius:999px;padding:0.75rem;font-size:0.9rem;font-weight:700;cursor:pointer;margin-top:0.25rem;opacity:{loading ? 0.7 : 1};"
			>
				{loading ? 'Sedang log masuk…' : 'Log masuk'}
			</button>
		</form>

		<!-- Register link -->
		<p style="text-align:center;font-size:0.82rem;color:#6b7280;margin:1.25rem 0 0;">
			Belum ada akaun? <a href="https://cakna.org/auth/register" style="color:#1a4a3a;font-weight:600;text-decoration:none;">Daftar</a>
		</p>

		<!-- Security note -->
		<p style="display:flex;align-items:center;justify-content:center;gap:0.35rem;text-align:center;font-size:0.75rem;color:#9ca3af;margin:1rem 0 0;">
			<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
				<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
			</svg>
			Sambungan disulitkan & selamat
		</p>
	</div>
</div>

<style>
	:global(body) { background: #f0ede6; }
	.cakna-input {
		border: 1.5px solid #e5e7eb;
		border-radius: 999px;
		padding: 0.7rem 1.1rem;
		font-size: 0.88rem;
		background: #f9f6f0;
		color: #111827;
		outline: none;
		width: 100%;
		box-sizing: border-box;
		transition: border-color 0.15s;
	}
	.cakna-input:focus {
		border-color: #1a4a3a;
	}
</style>
