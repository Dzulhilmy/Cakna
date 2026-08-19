import * as server from '../entries/pages/admin/analytics/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/analytics/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/analytics/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.B8pV9OdP.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/SY33BDpT.js","_app/immutable/chunks/CkocTwQy.js","_app/immutable/chunks/lo6irq3n.js","_app/immutable/chunks/B79LgCJy.js","_app/immutable/chunks/CJEQ4M7B.js"];
export const stylesheets = [];
export const fonts = [];
