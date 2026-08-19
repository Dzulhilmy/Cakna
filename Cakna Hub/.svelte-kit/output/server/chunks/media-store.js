import { h as hubDelete, b as hubGet, e as hubUpload } from "./hub-api.js";
async function listMedia(actor) {
  try {
    return await hubGet(actor, "/media");
  } catch {
    return [];
  }
}
async function saveMedia(actor, filename, buffer) {
  const form = new FormData();
  const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  form.append("file", new Blob([ab]), filename);
  const { urls } = await hubUpload(actor, form);
  return urls[0] ?? "";
}
async function deleteMedia(actor, filename) {
  try {
    await hubDelete(actor, `/media?filename=${encodeURIComponent(filename)}`);
    return true;
  } catch {
    return false;
  }
}
export {
  deleteMedia as d,
  listMedia as l,
  saveMedia as s
};
