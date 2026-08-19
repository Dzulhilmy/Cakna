import * as server from '../entries/pages/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DRubhTkO.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/CkocTwQy.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/SOZ6BI7K.js","_app/immutable/chunks/CBzXLWCh.js","_app/immutable/chunks/SY33BDpT.js","_app/immutable/chunks/XinJswjL.js","_app/immutable/chunks/B79LgCJy.js","_app/immutable/chunks/BRKI2wrc.js","_app/immutable/chunks/lo6irq3n.js","_app/immutable/chunks/Bvy01twr.js","_app/immutable/chunks/C3SDPPCV.js","_app/immutable/chunks/BUmRteYu.js","_app/immutable/chunks/cZY8ag3w.js","_app/immutable/chunks/BXo5XWtk.js","_app/immutable/chunks/CQGCE9A3.js","_app/immutable/chunks/CoD1IjkS.js","_app/immutable/chunks/XvdwOUZy.js","_app/immutable/chunks/CMQhAiMC.js","_app/immutable/chunks/DzpxtgCg.js","_app/immutable/chunks/BKWMUsQB.js","_app/immutable/chunks/BdWphIy7.js","_app/immutable/chunks/24kT6Mz-.js","_app/immutable/chunks/DN2VyI4e.js","_app/immutable/chunks/CXbLINTn.js","_app/immutable/chunks/Dt0onre4.js","_app/immutable/chunks/BZ1Q6KqF.js","_app/immutable/chunks/AzQHwjch.js","_app/immutable/chunks/X8TWxRmA.js","_app/immutable/chunks/C9b55VYn.js","_app/immutable/chunks/B7MmilBK.js"];
export const stylesheets = [];
export const fonts = [];
