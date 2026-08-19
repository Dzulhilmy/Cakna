import * as server from '../entries/pages/hub/admin/analytics/_page.server.ts.js';

export const index = 31;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/hub/admin/analytics/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/hub/admin/analytics/+page.server.ts";
export const imports = ["_app/immutable/nodes/31.Y3MyGj4w.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/SY33BDpT.js","_app/immutable/chunks/CkocTwQy.js","_app/immutable/chunks/lo6irq3n.js","_app/immutable/chunks/B79LgCJy.js","_app/immutable/chunks/CJEQ4M7B.js"];
export const stylesheets = [];
export const fonts = [];
