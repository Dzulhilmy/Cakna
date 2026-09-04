import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { PageLoad } from './$types';

// SEMENTARA (2026-07-10): halaman utama dihala terus ke modul Al-Ma'thurat
// atas permintaan — padam fail ini untuk memulihkan laman utama asal.
export const load: PageLoad = () => {
	redirect(307, `${base}/mathurat`);
};
