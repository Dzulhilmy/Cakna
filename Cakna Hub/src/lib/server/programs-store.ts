import type { HubUser, Program, Core } from '$lib/types';
import { getCore, cores } from '$lib/cores';
import { hubGetPublic, hubGet, hubPost, hubPut, hubDelete } from './hub-api';

export type ProgramInput = { coreId: string; name: string; description?: string; image?: string };

type RawProgram = {
	id: string; core_id: string; name: string; slug: string;
	description: string; image: string; created_at: string; updated_at: string;
};

function toProgram(r: RawProgram): Program {
	return { id: r.id, coreId: r.core_id, name: r.name, slug: r.slug, description: r.description, image: r.image, createdAt: r.created_at, updatedAt: r.updated_at };
}

async function ensureSeeded(actor: HubUser): Promise<void> {
	await hubPost<unknown>(actor, '/programs/seed');
}

export async function getPrograms(actor?: HubUser): Promise<Program[]> {
	const rows = actor
		? await hubGet<RawProgram[]>(actor, '/programs')
		: await hubGetPublic<RawProgram[]>('/programs');
	if (rows.length === 0 && actor) {
		await ensureSeeded(actor);
		return (await hubGet<RawProgram[]>(actor, '/programs')).map(toProgram);
	}
	return rows.map(toProgram);
}

export async function getProgramsByCore(actor?: HubUser): Promise<Record<string, Program[]>> {
	const all = await getPrograms(actor);
	const map: Record<string, Program[]> = {};
	for (const core of cores) map[core.id] = [];
	for (const p of all) (map[p.coreId] ??= []).push(p);
	return map;
}

export async function getProgramsForCore(actor: HubUser | undefined, coreId: string): Promise<Program[]> {
	return (await getPrograms(actor)).filter((p) => p.coreId === coreId);
}

export async function resolveProgram(
	actor: HubUser | undefined,
	coreId: string,
	slug: string
): Promise<{ core: Core; program: Program } | null> {
	const core = getCore(coreId);
	if (!core) return null;
	const program = (await getProgramsForCore(actor, coreId)).find((p) => p.slug === slug);
	return program ? { core, program } : null;
}

export async function createProgram(actor: HubUser, input: ProgramInput): Promise<Program> {
	return toProgram(await hubPost<RawProgram>(actor, '/programs', {
		core_id: input.coreId, name: input.name, description: input.description ?? '', image: input.image ?? ''
	}));
}

export async function updateProgram(actor: HubUser, id: string, input: ProgramInput): Promise<Program> {
	return toProgram(await hubPut<RawProgram>(actor, `/programs/${encodeURIComponent(id)}`, {
		core_id: input.coreId, name: input.name, description: input.description ?? '', image: input.image ?? ''
	}));
}

export async function deleteProgram(actor: HubUser, id: string): Promise<boolean> {
	try {
		await hubDelete<unknown>(actor, `/programs/${encodeURIComponent(id)}`);
		return true;
	} catch {
		return false;
	}
}
