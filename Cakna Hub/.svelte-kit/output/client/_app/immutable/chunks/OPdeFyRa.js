import"./Bzak7iHL.js";import{I as R,s as Y}from"./cZY8ag3w.js";import{v as S,f as T,a as i,p as ce,k as G,O as de,j as fe,b as ve,m,d as o,s as U,r as t,t as B,g as s,c as _,u as X,i as pe,n as O}from"./CLcWUy81.js";import{l as Z,s as ee,p as me}from"./BXo5XWtk.js";import{d as ue,s as A,a as L}from"./DiA9xPaD.js";import{i as q}from"./SOZ6BI7K.js";import{e as E}from"./SY33BDpT.js";import{s as K}from"./XinJswjL.js";import{s as Q}from"./BRKI2wrc.js";import{X as be}from"./XvdwOUZy.js";import{U as xe}from"./BFQ8BK3I.js";function Ve(j,a){const u=Z(a,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.511.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const v=[["path",{d:"M16 5h6"}],["path",{d:"M19 2v6"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}],["circle",{cx:"9",cy:"9",r:"2"}]];R(j,ee({name:"image-plus"},()=>u,{get iconNode(){return v},children:(b,x)=>{var l=S(),g=T(l);Y(g,a,"default",{}),i(b,l)},$$slots:{default:!0}}))}function ge(j,a){const u=Z(a,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.511.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const v=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2"}],["circle",{cx:"9",cy:"9",r:"2"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}]];R(j,ee({name:"image"},()=>u,{get iconNode(){return v},children:(b,x)=>{var l=S(),g=T(l);Y(g,a,"default",{}),i(b,l)},$$slots:{default:!0}}))}var he=_('<button type="button"> </button>'),ye=_('<div class="py-16 text-center text-sm text-zinc-400">Loading…</div>'),_e=_('<div class="flex flex-col items-center gap-3 py-16 text-center"><!> <p class="text-sm text-zinc-400">No images yet. Switch to the Upload tab to add one.</p></div>'),we=_('<button type="button" class="group relative aspect-square overflow-hidden rounded-xl border-2 border-transparent transition-all hover:border-rose-400 focus:border-rose-500 focus:outline-none"><img alt="" class="h-full w-full object-cover" loading="lazy"/> <div class="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100"><span class="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-rose-600">Select</span></div></button>'),ze=_('<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"></div>'),ke=_('<label><div class="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500"><!></div> <div><p class="text-sm font-medium text-zinc-700"> </p> <p class="mt-1 text-xs text-zinc-400">JPG, PNG, GIF, WebP, SVG · max 10 MB</p></div> <input type="file" accept="image/*" class="sr-only"/></label>'),je=_('<div class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="presentation"><div class="flex w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" style="max-height: min(85vh, 680px)"><div class="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4"><h2 class="text-base font-semibold text-zinc-900">Media Library</h2> <button type="button" class="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"><!></button></div> <div class="flex shrink-0 gap-1 border-b border-zinc-100 px-5"></div> <div class="flex-1 overflow-y-auto p-5"><!></div></div></div>');function Be(j,a){ce(a,!0);let u=me(a,"open",15,!1),v=G(de([])),b=G(!1),x=G(!1),l=G("library");fe(()=>{u()&&(m(l,"library"),D())});function g(){var e;u(!1),(e=a.onclose)==null||e.call(a)}function C(e){a.onselect(e),g()}async function D(){m(b,!0);try{const e=await fetch("/hub/admin/api/media");e.ok&&m(v,await e.json(),!0)}catch{m(v,[],!0)}finally{m(b,!1)}}async function te(e){var I;const h=(I=e.currentTarget.files)==null?void 0:I[0];if(h){m(x,!0);try{const w=new FormData;w.append("file",h);const z=await fetch("/hub/admin/api/media",{method:"POST",body:w});if(z.ok){const $=await z.json();if($.url){await D(),C($.url);return}}}catch{}finally{m(x,!1),e.currentTarget.value=""}}}function ae(e){e.target===e.currentTarget&&g()}const H=e=>/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(e);var J=S(),re=T(J);{var oe=e=>{var h=je(),I=o(h),w=o(I),z=U(o(w),2),$=o(z);be($,{size:16}),t(z),t(w);var F=U(w,2);E(F,20,()=>[["library","Library"],["upload","Upload new"]],([n,c])=>n,(n,c)=>{var p=X(()=>pe(c,2));let k=()=>s(p)[0],y=()=>s(p)[1];var d=he(),M=o(d,!0);t(d),B(()=>{Q(d,1,`relative py-3 text-sm font-medium transition-colors ${s(l)===k()?"text-rose-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-rose-500":"text-zinc-500 hover:text-zinc-800"}`),A(M,y())}),L("click",d,()=>m(l,k(),!0)),i(n,d)}),t(F);var W=U(F,2),se=o(W);{var ie=n=>{var c=S(),p=T(c);{var k=r=>{var f=ye();i(r,f)},y=r=>{var f=_e(),P=o(f);ge(P,{size:32,class:"text-zinc-300"}),O(2),t(f),i(r,f)},d=X(()=>s(v).filter(H).length===0),M=r=>{var f=ze();E(f,20,()=>s(v).filter(H),P=>P,(P,V)=>{var N=we(),ne=o(N);O(2),t(N),B(()=>{K(N,"title",V),K(ne,"src",V)}),L("click",N,()=>C(V)),i(P,N)}),t(f),i(r,f)};q(p,r=>{s(b)?r(k):s(d)?r(y,1):r(M,-1)})}i(n,c)},le=n=>{var c=ke(),p=o(c),k=o(p);xe(k,{size:24}),t(p);var y=U(p,2),d=o(y),M=o(d,!0);t(d),O(2),t(y);var r=U(y,2);t(c),B(()=>{Q(c,1,`flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 px-6 py-12 text-center transition-colors hover:border-rose-300 ${s(x)?"cursor-wait opacity-60":"cursor-pointer"}`),A(M,s(x)?"Uploading…":"Click to choose an image"),r.disabled=s(x)}),L("change",r,te),i(n,c)};q(se,n=>{s(l)==="library"?n(ie):n(le,-1)})}t(W),t(I),t(h),L("click",h,ae),L("click",z,g),i(e,h)};q(re,e=>{u()&&e(oe)})}i(j,J),ve()}ue(["click","change"]);export{Ve as I,Be as M,ge as a};
