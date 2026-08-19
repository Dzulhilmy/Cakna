import { b as hubGet, h as hubDelete, a as hubPut, d as hubPost } from "./hub-api.js";
function toApp(row, logs) {
  const appLogs = logs.filter((l) => l.application_id === row.id);
  return {
    id: row.id,
    reference: row.reference,
    createdAt: row.created_at,
    submittedBy: row.submitted_by_id ? { id: row.submitted_by_id, name: row.submitted_by_name ?? "", role: row.submitted_by_role ?? "", branch: row.submitted_by_branch ?? "" } : void 0,
    status: row.status,
    reviewedBy: row.reviewed_by_id ? { id: row.reviewed_by_id, name: row.reviewed_by_name ?? "" } : void 0,
    reviewedAt: row.reviewed_at ?? void 0,
    reviewNote: row.review_note || void 0,
    reviewLog: appLogs.map((l) => ({ stage: l.stage, decision: l.decision, by: l.by_name, byRole: l.by_role, at: l.at, note: l.note })),
    cawangan: row.cawangan,
    namaFrancaisi: row.nama_francaisi,
    ajk: row.ajk,
    kluster: row.kluster,
    namaProgram: row.nama_program,
    tarikh: row.tarikh,
    lokasi: row.lokasi,
    penerangan: row.penerangan,
    jumlahPeserta: row.jumlah_peserta,
    kategoriPenerima: row.kategori_penerima,
    namaKomuniti: row.nama_komuniti,
    jumlahPerbelanjaan: row.jumlah_perbelanjaan,
    sumberDana: row.sumber_dana,
    pautanGambar: row.pautan_gambar,
    impak: row.impak,
    cadangan: row.cadangan
  };
}
function toEvent(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    submittedBy: row.submitted_by_id ? { id: row.submitted_by_id, name: row.submitted_by_name ?? "", role: row.submitted_by_role ?? "", branch: row.submitted_by_branch ?? "" } : void 0,
    title: row.title,
    kluster: row.kluster,
    tarikh: row.tarikh,
    lokasi: row.lokasi,
    anjuran: row.anjuran,
    jumlahPeserta: row.jumlah_peserta,
    penerangan: row.penerangan,
    images: row.images
  };
}
async function getFundingApplications(actor) {
  const { apps, logs } = await hubGet(actor, "/funding");
  return apps.map((a) => toApp(a, logs));
}
async function getFundingApplicationById(actor, id) {
  try {
    const { app, logs } = await hubGet(actor, `/funding/${id}`);
    return toApp(app, logs);
  } catch {
    return null;
  }
}
async function addFundingApplication(actor, input) {
  const { app } = await hubPost(actor, "/funding", {
    cawangan: input.cawangan,
    nama_francaisi: input.namaFrancaisi,
    ajk: input.ajk,
    kluster: input.kluster,
    nama_program: input.namaProgram,
    tarikh: input.tarikh,
    lokasi: input.lokasi,
    penerangan: input.penerangan,
    jumlah_peserta: input.jumlahPeserta,
    kategori_penerima: input.kategoriPenerima,
    nama_komuniti: input.namaKomuniti,
    jumlah_perbelanjaan: input.jumlahPerbelanjaan,
    sumber_dana: input.sumberDana,
    pautan_gambar: input.pautanGambar,
    impak: input.impak,
    cadangan: input.cadangan
  });
  return toApp(app, []);
}
async function updateFundingApplication(actor, id, input) {
  try {
    await hubPut(actor, `/funding/${id}`, {
      cawangan: input.cawangan,
      nama_francaisi: input.namaFrancaisi,
      ajk: input.ajk,
      kluster: input.kluster,
      nama_program: input.namaProgram,
      tarikh: input.tarikh,
      lokasi: input.lokasi,
      penerangan: input.penerangan,
      jumlah_peserta: input.jumlahPeserta,
      kategori_penerima: input.kategoriPenerima,
      nama_komuniti: input.namaKomuniti,
      jumlah_perbelanjaan: input.jumlahPerbelanjaan,
      sumber_dana: input.sumberDana,
      pautan_gambar: input.pautanGambar,
      impak: input.impak,
      cadangan: input.cadangan
    });
    return { ok: true };
  } catch (e) {
    console.error("[hub] updateFundingApplication failed:", e);
    return { ok: false, error: String(e) };
  }
}
async function deleteFundingApplication(actor, id) {
  try {
    await hubDelete(actor, `/funding/${id}`);
    return { ok: true };
  } catch (e) {
    console.error("[hub] deleteFundingApplication failed:", e);
    return { ok: false, error: String(e) };
  }
}
async function reviewFundingApplication(actor, id, review) {
  try {
    return await hubPost(actor, `/funding/${id}/review`, review);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("404")) return "not_found";
    if (msg.includes("not reviewable")) return "not_reviewable";
    if (msg.includes("403")) return "not_allowed";
    throw e;
  }
}
async function resubmitFundingApplication(actor, id) {
  try {
    return await hubPost(actor, `/funding/${id}/resubmit`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("404")) return "not_found";
    if (msg.includes("403") || msg.includes("not in needs_revision")) return "not_allowed";
    throw e;
  }
}
async function getEvents(actor) {
  const rows = await hubGet(actor, "/events");
  return rows.map(toEvent);
}
async function getEventById(actor, id) {
  try {
    return toEvent(await hubGet(actor, `/events/${id}`));
  } catch {
    return null;
  }
}
async function addEvent(actor, input) {
  return toEvent(await hubPost(actor, "/events", {
    title: input.title,
    kluster: input.kluster,
    tarikh: input.tarikh,
    lokasi: input.lokasi,
    anjuran: input.anjuran,
    jumlah_peserta: input.jumlahPeserta,
    penerangan: input.penerangan,
    images: input.images ?? []
  }));
}
export {
  getEvents as a,
  addFundingApplication as b,
  getEventById as c,
  deleteFundingApplication as d,
  addEvent as e,
  getFundingApplicationById as f,
  getFundingApplications as g,
  reviewFundingApplication as h,
  resubmitFundingApplication as r,
  updateFundingApplication as u
};
