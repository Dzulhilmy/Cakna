import * as server from '../entries/pages/hub/admin/calendar/_page.server.ts.js';

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/hub/admin/calendar/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/hub/admin/calendar/+page.server.ts";
export const imports = ["_app/immutable/nodes/32.6X2ZmlW2.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/SY33BDpT.js","_app/immutable/chunks/CkocTwQy.js","_app/immutable/chunks/BRKI2wrc.js","_app/immutable/chunks/B79LgCJy.js"];
export const stylesheets = [];
export const fonts = [];
