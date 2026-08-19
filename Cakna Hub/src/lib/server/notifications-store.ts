import type { HubUser, CaknaNotification, NotificationInput } from '$lib/types';
import { hubGet, hubPost, hubDelete } from './hub-api';

export async function getNotifications(actor: HubUser): Promise<CaknaNotification[]> {
	return hubGet<CaknaNotification[]>(actor, '/notifications');
}

export async function addNotification(actor: HubUser, input: NotificationInput): Promise<CaknaNotification> {
	return hubPost<CaknaNotification>(actor, '/notifications', input);
}

export async function deleteNotification(actor: HubUser, id: string): Promise<boolean> {
	try {
		await hubDelete<unknown>(actor, `/notifications/${id}`);
		return true;
	} catch {
		return false;
	}
}
