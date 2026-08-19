// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { addFundingApplication } from '$lib/server/society-store';
import { notifySubmitted } from '$lib/server/notices-store';

export const load = async () => ({});

export const actions = {
	default: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		const form = await request.formData();
		const get = (k: string) => (form.get(k) as string | null) ?? '';
		const namaProgram = get('namaProgram');
		const cawangan = get('cawangan');
		const tarikh = get('tarikh');
		const kluster = get('kluster');

		if (!namaProgram || !cawangan || !tarikh || !kluster) {
			return fail(400, { error: 'Sila lengkapkan semua medan wajib.' });
		}

		const app = await addFundingApplication(actor, {
			namaProgram, cawangan, tarikh, kluster,
			jumlahPerbelanjaan: parseFloat(get('jumlahPerbelanjaan')) || 0,
			namaFrancaisi: get('namaFrancaisi'),
			ajk: get('ajk'),
			lokasi: get('lokasi'),
			penerangan: get('penerangan'),
			jumlahPeserta: get('jumlahPeserta'),
			kategoriPenerima: get('kategoriPenerima'),
			namaKomuniti: get('namaKomuniti'),
			sumberDana: get('sumberDana'),
			pautanGambar: get('pautanGambar'),
			impak: get('impak'),
			cadangan: get('cadangan'),
			submittedBy: { id: actor.id, name: actor.name, role: actor.role, branch: actor.branch }
		});

		try { await notifySubmitted(actor, app); } catch {}
		redirect(302, `/society/funding/${app.id}`);
	}
};
;null as any as PageServerLoad;;null as any as Actions;