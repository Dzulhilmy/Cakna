// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
export const load = async () => redirect(302, '/society/funding');
;null as any as PageServerLoad;