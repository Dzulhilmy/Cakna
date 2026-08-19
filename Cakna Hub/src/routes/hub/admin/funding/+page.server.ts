import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import {
	getFundingApplications,
	addFundingApplication,
	updateFundingApplication,
	deleteFundingApplication
} from '$lib/server/society-store';
import type { FundingInput } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => ({
	applications: await getFundingApplications(locals.user!)
});

function parseInput(form: FormData): FundingInput {
	return {
		cawangan: (form.get('cawangan') as string) ?? '',
		namaFrancaisi: (form.get('namaFrancaisi') as string) ?? '',
		ajk: (form.get('ajk') as string) ?? '',
		kluster: (form.get('kluster') as string) ?? '',
		namaProgram: (form.get('namaProgram') as string) ?? '',
		tarikh: (form.get('tarikh') as string) ?? '',
		lokasi: (form.get('lokasi') as string) ?? '',
		penerangan: (form.get('penerangan') as string) ?? '',
		jumlahPeserta: (form.get('jumlahPeserta') as string) ?? '',
		kategoriPenerima: (form.get('kategoriPenerima') as string) ?? '',
		namaKomuniti: (form.get('namaKomuniti') as string) ?? '',
		jumlahPerbelanjaan: parseFloat(form.get('jumlahPerbelanjaan') as string) || 0,
		sumberDana: (form.get('sumberDana') as string) ?? '',
		pautanGambar: (form.get('pautanGambar') as string) ?? '',
		impak: (form.get('impak') as string) ?? '',
		cadangan: (form.get('cadangan') as string) ?? ''
	};
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const input = parseInput(form);
		if (!input.namaProgram.trim() || !input.cawangan.trim()) {
			return fail(400, { error: 'Program name and cawangan are required.' });
		}
		try {
			await addFundingApplication(actor, input);
			return { ok: true };
		} catch (e) {
			return fail(500, { error: String(e) });
		}
	},

	update: async ({ request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'Missing application ID.' });
		const input = parseInput(form);
		const res = await updateFundingApplication(actor, id, input);
		if (!res.ok) return fail(500, { error: res.error ?? 'Failed to update.' });
		return { ok: true };
	},

	delete: async ({ request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'Missing application ID.' });
		const res = await deleteFundingApplication(actor, id);
		if (!res.ok) return fail(500, { error: res.error ?? 'Failed to delete.' });
		return { ok: true };
	}
};
