import { fail, redirect } from '@sveltejs/kit';
import { b as addFundingApplication } from '../../../../../chunks/society-store.js-BP7iPMbM.js';
import { d as notifySubmitted } from '../../../../../chunks/notices-store.js-asFpnGzq.js';

const load = async () => ({});
const actions = {
  default: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const get = (k) => form.get(k) ?? "";
    const namaProgram = get("namaProgram");
    const cawangan = get("cawangan");
    const tarikh = get("tarikh");
    const kluster = get("kluster");
    if (!namaProgram || !cawangan || !tarikh || !kluster) {
      return fail(400, { error: "Sila lengkapkan semua medan wajib." });
    }
    const app = await addFundingApplication(actor, {
      namaProgram,
      cawangan,
      tarikh,
      kluster,
      jumlahPerbelanjaan: parseFloat(get("jumlahPerbelanjaan")) || 0,
      namaFrancaisi: get("namaFrancaisi"),
      ajk: get("ajk"),
      lokasi: get("lokasi"),
      penerangan: get("penerangan"),
      jumlahPeserta: get("jumlahPeserta"),
      kategoriPenerima: get("kategoriPenerima"),
      namaKomuniti: get("namaKomuniti"),
      sumberDana: get("sumberDana"),
      pautanGambar: get("pautanGambar"),
      impak: get("impak"),
      cadangan: get("cadangan"),
      submittedBy: { id: actor.id, name: actor.name, role: actor.role, branch: actor.branch }
    });
    try {
      await notifySubmitted(actor, app);
    } catch {
    }
    redirect(302, `/society/funding/${app.id}`);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-Dgv3EW63.js.map
