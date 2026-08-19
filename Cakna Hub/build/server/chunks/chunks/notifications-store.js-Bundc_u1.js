import { d as hubPost, h as hubDelete, b as hubGet } from './hub-api.js-BLc0YvhW.js';

async function getNotifications(actor) {
  return hubGet(actor, "/notifications");
}
async function addNotification(actor, input) {
  return hubPost(actor, "/notifications", input);
}
async function deleteNotification(actor, id) {
  try {
    await hubDelete(actor, `/notifications/${id}`);
    return true;
  } catch {
    return false;
  }
}

export { addNotification as a, deleteNotification as d, getNotifications as g };
//# sourceMappingURL=notifications-store.js-Bundc_u1.js.map
