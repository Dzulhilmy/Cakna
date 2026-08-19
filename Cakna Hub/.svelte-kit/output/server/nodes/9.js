import * as server from '../entries/pages/admin/calendar/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/calendar/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/calendar/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.hFz-0Vni.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/SY33BDpT.js","_app/immutable/chunks/CkocTwQy.js","_app/immutable/chunks/BRKI2wrc.js","_app/immutable/chunks/B79LgCJy.js"];
export const stylesheets = [];
export const fonts = [];
