import type { HubUser, FundingApplication, EventRecord, FundingInput, EventInput, ReviewStatus, ReviewStage, ReviewEntry } from '$lib/types';
import { hubGet, hubPost, hubPut, hubDelete } from './hub-api';

// ─── Raw types from Rust API (snake_case, flat) ───────────────────────────────

type RawFunding = {
	id: string; reference: string; created_at: string;
	submitted_by_id: string | null; submitted_by_name: string | null;
	submitted_by_role: string | null; submitted_by_branch: string | null;
	status: string; reviewed_by_id: string | null; reviewed_by_name: string | null;
	reviewed_at: string | null; review_note: string;
	cawangan: string; nama_francaisi: string; ajk: string; kluster: string;
	nama_program: string; tarikh: string; lokasi: string; penerangan: string;
	jumlah_peserta: string; kategori_penerima: string; nama_komuniti: string;
	jumlah_perbelanjaan: number; sumber_dana: string; pautan_gambar: string;
	impak: string; cadangan: string;
};

type RawLog = {
	id: string; application_id: string; stage: string; decision: string;
	by_name: string; by_role: string; at: string; note: string;
};

type RawEvent = {
	id: string; created_at: string;
	submitted_by_id: string | null; submitted_by_name: string | null;
	submitted_by_role: string | null; submitted_by_branch: string | null;
	title: string; kluster: string; tarikh: string; lokasi: string;
	anjuran: string; jumlah_peserta: string; penerangan: string; images: string[];
};

// ─── Adapters ─────────────────────────────────────────────────────────────────

function toApp(row: RawFunding, logs: RawLog[]): FundingApplication {
	const appLogs = logs.filter((l) => l.application_id === row.id);
	return {
		id: row.id,
		reference: row.reference,
		createdAt: row.created_at,
		submittedBy: row.submitted_by_id
			? { id: row.submitted_by_id, name: row.submitted_by_name ?? '', role: row.submitted_by_role ?? '', branch: row.submitted_by_branch ?? '' }
			: undefined,
		status: row.status as ReviewStatus,
		reviewedBy: row.reviewed_by_id ? { id: row.reviewed_by_id, name: row.reviewed_by_name ?? '' } : undefined,
		reviewedAt: row.reviewed_at ?? undefined,
		reviewNote: row.review_note || undefined,
		reviewLog: appLogs.map((l) => ({ stage: l.stage as ReviewStage | 'submit', decision: l.decision as ReviewEntry['decision'], by: l.by_name, byRole: l.by_role, at: l.at, note: l.note })),
		cawangan: row.cawangan, namaFrancaisi: row.nama_francaisi, ajk: row.ajk, kluster: row.kluster,
		namaProgram: row.nama_program, tarikh: row.tarikh, lokasi: row.lokasi, penerangan: row.penerangan,
		jumlahPeserta: row.jumlah_peserta, kategoriPenerima: row.kategori_penerima, namaKomuniti: row.nama_komuniti,
		jumlahPerbelanjaan: row.jumlah_perbelanjaan, sumberDana: row.sumber_dana, pautanGambar: row.pautan_gambar,
		impak: row.impak, cadangan: row.cadangan
	};
}

function toEvent(row: RawEvent): EventRecord {
	return {
		id: row.id, createdAt: row.created_at,
		submittedBy: row.submitted_by_id
			? { id: row.submitted_by_id, name: row.submitted_by_name ?? '', role: row.submitted_by_role ?? '', branch: row.submitted_by_branch ?? '' }
			: undefined,
		title: row.title, kluster: row.kluster, tarikh: row.tarikh, lokasi: row.lokasi,
		anjuran: row.anjuran, jumlahPeserta: row.jumlah_peserta, penerangan: row.penerangan, images: row.images
	};
}

// ─── Funding ─────────────────────────────────────────────────────────────────

export async function getFundingApplications(actor: HubUser): Promise<FundingApplication[]> {
	const { apps, logs } = await hubGet<{ apps: RawFunding[]; logs: RawLog[] }>(actor, '/funding');
	return apps.map((a) => toApp(a, logs));
}

export async function getFundingApplicationById(actor: HubUser, id: string): Promise<FundingApplication | null> {
	try {
		const { app, logs } = await hubGet<{ app: RawFunding; logs: RawLog[] }>(actor, `/funding/${id}`);
		return toApp(app, logs);
	} catch {
		return null;
	}
}

export async function addFundingApplication(actor: HubUser, input: FundingInput): Promise<FundingApplication> {
	const { app } = await hubPost<{ app: RawFunding }>(actor, '/funding', {
		cawangan: input.cawangan, nama_francaisi: input.namaFrancaisi, ajk: input.ajk,
		kluster: input.kluster, nama_program: input.namaProgram, tarikh: input.tarikh,
		lokasi: input.lokasi, penerangan: input.penerangan, jumlah_peserta: input.jumlahPeserta,
		kategori_penerima: input.kategoriPenerima, nama_komuniti: input.namaKomuniti,
		jumlah_perbelanjaan: input.jumlahPerbelanjaan, sumber_dana: input.sumberDana,
		pautan_gambar: input.pautanGambar, impak: input.impak, cadangan: input.cadangan
	});
	return toApp(app, []);
}

export async function updateFundingApplication(
	actor: HubUser,
	id: string,
	input: FundingInput
): Promise<{ ok: boolean; error?: string }> {
	try {
		await hubPut<{ app: RawFunding }>(actor, `/funding/${id}`, {
			cawangan: input.cawangan, nama_francaisi: input.namaFrancaisi, ajk: input.ajk,
			kluster: input.kluster, nama_program: input.namaProgram, tarikh: input.tarikh,
			lokasi: input.lokasi, penerangan: input.penerangan, jumlah_peserta: input.jumlahPeserta,
			kategori_penerima: input.kategoriPenerima, nama_komuniti: input.namaKomuniti,
			jumlah_perbelanjaan: input.jumlahPerbelanjaan, sumber_dana: input.sumberDana,
			pautan_gambar: input.pautanGambar, impak: input.impak, cadangan: input.cadangan
		});
		return { ok: true };
	} catch (e) {
		console.error('[hub] updateFundingApplication failed:', e);
		return { ok: false, error: String(e) };
	}
}

export async function deleteFundingApplication(
	actor: HubUser,
	id: string
): Promise<{ ok: boolean; error?: string }> {
	try {
		await hubDelete<{ ok: boolean }>(actor, `/funding/${id}`);
		return { ok: true };
	} catch (e) {
		console.error('[hub] deleteFundingApplication failed:', e);
		return { ok: false, error: String(e) };
	}
}

export async function reviewFundingApplication(
	actor: HubUser,
	id: string,
	review: { decision: 'approved' | 'needs_revision'; note: string }
): Promise<{ ok: boolean; status: string } | 'not_found' | 'not_reviewable' | 'not_allowed'> {
	try {
		return await hubPost<{ ok: boolean; status: string }>(actor, `/funding/${id}/review`, review);
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : '';
		if (msg.includes('404')) return 'not_found';
		if (msg.includes('not reviewable')) return 'not_reviewable';
		if (msg.includes('403')) return 'not_allowed';
		throw e;
	}
}

export async function resubmitFundingApplication(
	actor: HubUser,
	id: string
): Promise<{ ok: boolean } | 'not_found' | 'not_allowed'> {
	try {
		return await hubPost<{ ok: boolean }>(actor, `/funding/${id}/resubmit`);
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : '';
		if (msg.includes('404')) return 'not_found';
		if (msg.includes('403') || msg.includes('not in needs_revision')) return 'not_allowed';
		throw e;
	}
}

export async function getApprovedFundingApplications(actor: HubUser): Promise<FundingApplication[]> {
	return (await getFundingApplications(actor)).filter((a) => a.status === 'approved');
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents(actor: HubUser): Promise<EventRecord[]> {
	const rows = await hubGet<RawEvent[]>(actor, '/events');
	return rows.map(toEvent);
}

export async function getEventById(actor: HubUser, id: string): Promise<EventRecord | null> {
	try {
		return toEvent(await hubGet<RawEvent>(actor, `/events/${id}`));
	} catch {
		return null;
	}
}

export async function addEvent(actor: HubUser, input: EventInput): Promise<EventRecord> {
	return toEvent(await hubPost<RawEvent>(actor, '/events', {
		title: input.title, kluster: input.kluster, tarikh: input.tarikh, lokasi: input.lokasi,
		anjuran: input.anjuran, jumlah_peserta: input.jumlahPeserta, penerangan: input.penerangan,
		images: input.images ?? []
	}));
}
