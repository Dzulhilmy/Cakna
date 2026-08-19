import * as server from '../entries/pages/admin/funding/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/funding/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/funding/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.DceIlGpe.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/SOZ6BI7K.js","_app/immutable/chunks/CBzXLWCh.js","_app/immutable/chunks/SY33BDpT.js","_app/immutable/chunks/CkocTwQy.js","_app/immutable/chunks/XinJswjL.js","_app/immutable/chunks/B79LgCJy.js","_app/immutable/chunks/BRKI2wrc.js","_app/immutable/chunks/lo6irq3n.js","_app/immutable/chunks/CnFzxymN.js","_app/immutable/chunks/ygQXn_w2.js","_app/immutable/chunks/CJEQ4M7B.js"];
export const stylesheets = [];
export const fonts = [];
