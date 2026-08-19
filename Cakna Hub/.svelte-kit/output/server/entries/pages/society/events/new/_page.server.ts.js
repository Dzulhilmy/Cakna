import { fail, redirect } from "@sveltejs/kit";
import { e as addEvent } from "../../../../../chunks/society-store.js";
const load = async () => ({});
const actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const get = (k) => form.get(k) ?? "";
    const title = get("title");
    const tarikh = get("tarikh");
    const lokasi = get("lokasi");
    const kluster = get("kluster");
    const anjuran = get("anjuran");
    const jumlahPeserta = get("jumlahPeserta");
    const penerangan = get("penerangan");
    if (!title || !tarikh || !kluster) return fail(400, { error: "Sila lengkapkan semua medan wajib." });
    const actor = locals.user;
    const event = await addEvent(actor, {
      title,
      tarikh,
      lokasi,
      kluster,
      anjuran,
      jumlahPeserta,
      penerangan,
      images: [],
      submittedBy: { id: actor.id, name: actor.name, role: actor.role, branch: actor.branch }
    });
    redirect(302, `/society/events/${event.id}`);
  }
};
export {
  actions,
  load
};
