import * as server from '../entries/pages/society/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/society/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/society/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.BFq_JGtr.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/C3SDPPCV.js","_app/immutable/chunks/CBzXLWCh.js"];
export const stylesheets = [];
export const fonts = [];
