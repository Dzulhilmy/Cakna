// HTTP client for the Rust hub-server API.
// SvelteKit server-side code uses this to read/write Hub data.
// The Rust API validates X-Hub-Secret + X-Hub-User-* headers before serving any request.
import { env } from '$env/dynamic/private';
import type { HubUser } from '$lib/types';

function hubBase(): string {
	return (env.HUB_API_URL ?? 'http://localhost:3002').replace(/\/$/, '');
}

function secret(): string {
	return env.HUB_INTERNAL_SECRET ?? '';
}

function userHeaders(user: HubUser): Record<string, string> {
	return {
		'x-hub-secret': secret(),
		'x-hub-user-id': user.id,
		'x-hub-user-email': user.email,
		'x-hub-user-name': user.name,
		'x-hub-user-role': user.role,
		'x-hub-user-branch': user.branch,
		'x-hub-user-status': user.status
	};
}

async function ok(res: Response, context: string): Promise<Response> {
	if (!res.ok) {
		const body = await res.text().catch(() => '');
		throw new Error(`hub-api ${context}: ${res.status} ${body}`);
	}
	return res;
}

// Resolve (upsert) a Hub user from a Cakna identity. No HubUser needed — only the secret.
export async function resolveUser(email: string, name: string): Promise<HubUser> {
	const res = await fetch(`${hubBase()}/api/users/resolve`, {
		method: 'POST',
		headers: { 'content-type': 'application/json', 'x-hub-secret': secret() },
		body: JSON.stringify({ email, name }),
		signal: AbortSignal.timeout(5000)
	});
	await ok(res, 'users/resolve');
	return res.json();
}

// Public GET — only sends secret, no user headers (for unauthenticated pages)
export async function hubGetPublic<T>(path: string): Promise<T> {
	const res = await fetch(`${hubBase()}/api${path}`, {
		headers: { 'x-hub-secret': secret() },
		signal: AbortSignal.timeout(5000)
	});
	await ok(res, path);
	return res.json();
}

// Generic GET
export async function hubGet<T>(user: HubUser, path: string): Promise<T> {
	const res = await fetch(`${hubBase()}/api${path}`, {
		headers: userHeaders(user),
		signal: AbortSignal.timeout(5000)
	});
	await ok(res, path);
	return res.json();
}

// Generic POST
export async function hubPost<T>(user: HubUser, path: string, body?: unknown): Promise<T> {
	const res = await fetch(`${hubBase()}/api${path}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json', ...userHeaders(user) },
		body: body !== undefined ? JSON.stringify(body) : undefined,
		signal: AbortSignal.timeout(5000)
	});
	await ok(res, path);
	return res.json();
}

// Generic PUT
export async function hubPut<T>(user: HubUser, path: string, body: unknown): Promise<T> {
	const res = await fetch(`${hubBase()}/api${path}`, {
		method: 'PUT',
		headers: { 'content-type': 'application/json', ...userHeaders(user) },
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(5000)
	});
	await ok(res, path);
	return res.json();
}

// Generic DELETE
export async function hubDelete<T>(user: HubUser, path: string): Promise<T> {
	const res = await fetch(`${hubBase()}/api${path}`, {
		method: 'DELETE',
		headers: userHeaders(user),
		signal: AbortSignal.timeout(5000)
	});
	await ok(res, path);
	return res.json();
}

// Multipart upload — passes the FormData directly
export async function hubUpload(user: HubUser, formData: FormData): Promise<{ urls: string[] }> {
	const res = await fetch(`${hubBase()}/api/media`, {
		method: 'POST',
		headers: userHeaders(user), // no content-type — browser sets multipart boundary
		body: formData,
		signal: AbortSignal.timeout(30000)
	});
	await ok(res, 'media upload');
	return res.json();
}
