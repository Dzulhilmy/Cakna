export class ApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
	}
}

type Fetch = typeof fetch;

async function request<T>(
	fetchFn: Fetch,
	method: string,
	path: string,
	body?: unknown
): Promise<T> {
	const crossOrigin = path.startsWith('http') && !path.startsWith(location?.origin ?? '');
	const res = await fetchFn(path, {
		method,
		credentials: crossOrigin ? 'omit' : 'same-origin',
		headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
		body: body !== undefined ? JSON.stringify(body) : undefined
	});
	if (!res.ok) {
		let msg = res.statusText;
		try {
			const data = await res.json();
			if (data?.error) msg = data.error;
		} catch {
			/* not json */
		}
		throw new ApiError(res.status, msg);
	}
	return res.json() as Promise<T>;
}

export const api = {
	get: <T>(path: string, fetchFn: Fetch = fetch) => request<T>(fetchFn, 'GET', path),
	post: <T>(path: string, body?: unknown, fetchFn: Fetch = fetch) =>
		request<T>(fetchFn, 'POST', path, body),
	put: <T>(path: string, body?: unknown, fetchFn: Fetch = fetch) =>
		request<T>(fetchFn, 'PUT', path, body)
};
