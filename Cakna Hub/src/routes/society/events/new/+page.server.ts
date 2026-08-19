import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { addEvent } from '$lib/server/society-store';
export const load: PageServerLoad = async () => ({});
export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const get = (k: string) => (form.get(k) as string) ?? '';
		const title = get('title');
		const tarikh = get('tarikh');
		const lokasi = get('lokasi');
		const kluster = get('kluster');
		const anjuran = get('anjuran');
		const jumlahPeserta = get('jumlahPeserta');
		const penerangan = get('penerangan');
		if (!title || !tarikh || !kluster) return fail(400, { error: 'Sila lengkapkan semua medan wajib.' });
		const actor = locals.user!;
		const event = await addEvent(actor, {
			title, tarikh, lokasi, kluster, anjuran, jumlahPeserta, penerangan, images: [],
			submittedBy: { id: actor.id, name: actor.name, role: actor.role, branch: actor.branch }
		});
		redirect(302, `/society/events/${event.id}`);
	}
};
