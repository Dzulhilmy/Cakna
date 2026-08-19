import { l as listMedia, s as saveMedia } from "../../../../../../chunks/media-store.js";
import { error, json } from "@sveltejs/kit";
const GET = async ({ locals }) => {
  if (!locals.user) throw error(401);
  const files = await listMedia(locals.user);
  return json(files);
};
const POST = async ({ request, locals }) => {
  if (!locals.user) throw error(401);
  const form = await request.formData();
  const file = form.get("file");
  if (!file || !file.size) return json({ error: "No file selected" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const url = await saveMedia(locals.user, file.name, buffer);
    return json({ url });
  } catch (e) {
    return json({ error: String(e) }, { status: 500 });
  }
};
export {
  GET,
  POST
};
