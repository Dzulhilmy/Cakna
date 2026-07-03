import { api } from '$lib/api/client';
import type { User } from '$lib/api/types';

class AuthState {
	user = $state<User | null>(null);
	ready = $state(false);

	async init() {
		try {
			this.user = await api.get<User>('/api/auth/me');
		} catch {
			this.user = null;
		}
		this.ready = true;
	}

	async register(email: string, password: string) {
		this.user = await api.post<User>('/api/auth/register', { email, password });
	}

	async login(email: string, password: string) {
		this.user = await api.post<User>('/api/auth/login', { email, password });
	}

	async logout() {
		await api.post('/api/auth/logout');
		this.user = null;
	}
}

export const auth = new AuthState();
