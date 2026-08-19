import type { HubUser } from '$lib/types';

declare global {
	namespace App {
		interface Locals {
			user: HubUser | null;
		}
	}
}

export {};
