import * as server from '../entries/pages/hub/admin/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/hub/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/hub/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.ckZH7kK6.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/C3SDPPCV.js","_app/immutable/chunks/CBzXLWCh.js","_app/immutable/chunks/63cSm35d.js","_app/immutable/chunks/B79LgCJy.js","_app/immutable/chunks/BRKI2wrc.js","_app/immutable/chunks/BXo5XWtk.js","_app/immutable/chunks/CQGCE9A3.js","_app/immutable/chunks/CoD1IjkS.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/SOZ6BI7K.js","_app/immutable/chunks/XinJswjL.js","_app/immutable/chunks/lo6irq3n.js","_app/immutable/chunks/BCUGb_Dw.js","_app/immutable/chunks/C7SCDjR0.js","_app/immutable/chunks/BZ1Q6KqF.js","_app/immutable/chunks/ygQXn_w2.js","_app/immutable/chunks/SY33BDpT.js","_app/immutable/chunks/B-lqDap7.js","_app/immutable/chunks/cZY8ag3w.js"];
export const stylesheets = [];
export const fonts = [];
