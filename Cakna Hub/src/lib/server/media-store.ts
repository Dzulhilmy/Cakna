import type { HubUser } from '$lib/types';
import { hubGet, hubDelete, hubUpload } from './hub-api';

export async function listMedia(actor: HubUser): Promise<string[]> {
	try {
		return await hubGet<string[]>(actor, '/media');
	} catch {
		return [];
	}
}

export async function saveMedia(actor: HubUser, filename: string, buffer: Buffer): Promise<string> {
	const form = new FormData();
	const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
	form.append('file', new Blob([ab]), filename);
	const { urls } = await hubUpload(actor, form);
	return urls[0] ?? '';
}

export async function deleteMedia(actor: HubUser, filename: string): Promise<boolean> {
	try {
		await hubDelete<unknown>(actor, `/media?filename=${encodeURIComponent(filename)}`);
		return true;
	} catch {
		return false;
	}
}
