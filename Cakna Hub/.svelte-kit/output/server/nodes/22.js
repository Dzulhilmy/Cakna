import * as server from '../entries/pages/core/_page.server.ts.js';

export const index = 22;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/core/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/core/+page.server.ts";
export const imports = ["_app/immutable/nodes/22.VtV84LC0.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/SY33BDpT.js","_app/immutable/chunks/BKWMUsQB.js","_app/immutable/chunks/CBzXLWCh.js","_app/immutable/chunks/CkocTwQy.js","_app/immutable/chunks/XinJswjL.js","_app/immutable/chunks/B79LgCJy.js","_app/immutable/chunks/BRKI2wrc.js","_app/immutable/chunks/lo6irq3n.js","_app/immutable/chunks/D1ifcO2F.js","_app/immutable/chunks/cZY8ag3w.js","_app/immutable/chunks/BXo5XWtk.js","_app/immutable/chunks/CQGCE9A3.js","_app/immutable/chunks/CoD1IjkS.js","_app/immutable/chunks/CHe2aQsv.js","_app/immutable/chunks/DN2VyI4e.js","_app/immutable/chunks/CXbLINTn.js"];
export const stylesheets = [];
export const fonts = [];
