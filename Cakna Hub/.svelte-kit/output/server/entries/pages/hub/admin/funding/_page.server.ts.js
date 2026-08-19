import { fail } from "@sveltejs/kit";
import { d as deleteFundingApplication, u as updateFundingApplication, b as addFundingApplication, g as getFundingApplications } from "../../../../../chunks/society-store.js";
const load = async ({ locals }) => ({
  applications: await getFundingApplications(locals.user)
});
function parseInput(form) {
  return {
    cawangan: form.get("cawangan") ?? "",
    namaFrancaisi: form.get("namaFrancaisi") ?? "",
    ajk: form.get("ajk") ?? "",
    kluster: form.get("kluster") ?? "",
    namaProgram: form.get("namaProgram") ?? "",
    tarikh: form.get("tarikh") ?? "",
    lokasi: form.get("lokasi") ?? "",
    penerangan: form.get("penerangan") ?? "",
    jumlahPeserta: form.get("jumlahPeserta") ?? "",
    kategoriPenerima: form.get("kategoriPenerima") ?? "",
    namaKomuniti: form.get("namaKomuniti") ?? "",
    jumlahPerbelanjaan: parseFloat(form.get("jumlahPerbelanjaan")) || 0,
    sumberDana: form.get("sumberDana") ?? "",
    pautanGambar: form.get("pautanGambar") ?? "",
    impak: form.get("impak") ?? "",
    cadangan: form.get("cadangan") ?? ""
  };
}
const actions = {
  create: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const input = parseInput(form);
    if (!input.namaProgram.trim() || !input.cawangan.trim()) {
      return fail(400, { error: "Program name and cawangan are required." });
    }
    try {
      await addFundingApplication(actor, input);
      return { ok: true };
    } catch (e) {
      return fail(500, { error: String(e) });
    }
  },
  update: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const id = form.get("id");
    if (!id) return fail(400, { error: "Missing application ID." });
    const input = parseInput(form);
    const res = await updateFundingApplication(actor, id, input);
    if (!res.ok) return fail(500, { error: res.error ?? "Failed to update." });
    return { ok: true };
  },
  delete: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const id = form.get("id");
    if (!id) return fail(400, { error: "Missing application ID." });
    const res = await deleteFundingApplication(actor, id);
    if (!res.ok) return fail(500, { error: res.error ?? "Failed to delete." });
    return { ok: true };
  }
};
export {
  actions,
  load
};
