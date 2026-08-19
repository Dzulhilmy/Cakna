import { ak as head, a5 as escape_html, ab as ensure_array_like, ah as attr, ai as stringify, ag as attr_class, aa as clsx, Q as derived } from '../../../../../chunks/index.js-6hyNTq_g.js';
import '@sveltejs/kit/internal';
import '../../../../../chunks/exports.js-8HOoaa4e.js';
import '../../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit/internal/server';
import '../../../../../chunks/root.js-D9zcjZWK.js';
import '../../../../../chunks/state.svelte.js-KfFw5RnB.js';
import { c as cores } from '../../../../../chunks/cores.js-m0JlC_eV.js';
import { P as Plus } from '../../../../../chunks/plus.js-C9jfm_AR.js';
import { L as Leaf, R as Rocket, S as Smartphone, H as Heart_pulse, B as Briefcase, a as Heart_handshake } from '../../../../../chunks/smartphone.js-CC88m51e.js';
import { G as Graduation_cap } from '../../../../../chunks/graduation-cap.js-OFNqqEnP.js';
import { I as Image, X } from '../../../../../chunks/x.js-BacAdOzU.js';
import { I as Image_plus } from '../../../../../chunks/image-plus.js-C4aiwSDV.js';
import { C as Check } from '../../../../../chunks/check.js-CCXqwNNi.js';
import { P as Pencil } from '../../../../../chunks/pencil.js-D3lfPRO0.js';
import { T as Trash_2 } from '../../../../../chunks/trash-2.js-7NoUOT_P.js';
import '../../../../../chunks/utils.js-DClsVo7x.js';
import '@sveltejs/kit';
import '../../../../../chunks/Icon.js-VGojmkFT.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const coreIcons = {
      assist: Heart_handshake,
      biz: Briefcase,
      circle: Heart_pulse,
      digital: Smartphone,
      edu: Graduation_cap,
      future: Rocket,
      green: Leaf
    };
    let { data, form } = $$props;
    const programs = derived(() => data.programs);
    const byCore = derived(() => {
      const map = {};
      for (const c of cores) map[c.id] = [];
      for (const p of programs()) {
        (map[p.coreId] ??= []).push(p);
      }
      return map;
    });
    const totalCount = derived(() => programs().length);
    let editId = null;
    let editName = "";
    let editCoreId = "";
    let editDesc = "";
    let editImage = "";
    let addingForCore = null;
    let newName = "";
    let newDesc = "";
    let newImage = "";
    cores[0]?.id ?? "";
    const isImg = (url) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    const inp = "rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white";
    const ta = inp + " resize-none";
    const lbl = "text-xs font-medium text-zinc-500";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1wvmrqa", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Programs · Cakna Hub Admin</title>`);
        });
      });
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="space-y-8"><header class="flex flex-wrap items-start justify-between gap-4"><div><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Programs</h1> <p class="mt-1.5 text-zinc-500">Manage the programs shown under each core — add, edit, or remove them and their details.</p></div> <button type="button" class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">`);
      Plus($$renderer3, { size: 16 });
      $$renderer3.push(`<!----> Add program</button></header> `);
      if (form?.error) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <p class="text-sm text-zinc-500">${escape_html(totalCount())} program${escape_html(totalCount() !== 1 ? "s" : "")} across 7 cores</p> <div class="space-y-8"><!--[-->`);
      const each_array_1 = ensure_array_like(cores);
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let core = each_array_1[$$index_2];
        const corePrograms = byCore()[core.id] ?? [];
        const CoreIcon = coreIcons[core.id];
        $$renderer3.push(`<section class="space-y-3"><div class="flex items-center justify-between"><div class="flex items-center gap-2.5"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">`);
        if (CoreIcon) {
          $$renderer3.push("<!--[-->");
          CoreIcon($$renderer3, { size: 16 });
          $$renderer3.push("<!--]-->");
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push("<!--]-->");
        }
        $$renderer3.push(`</div> <span class="font-semibold text-zinc-900">${escape_html(core.name)}</span> <span class="text-sm text-zinc-400">${escape_html(corePrograms.length)}</span></div> <button type="button" class="text-sm font-medium text-rose-600 hover:text-rose-700">+ Add</button></div> `);
        if (corePrograms.length > 0 || addingForCore === core.id) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
          const each_array_2 = ensure_array_like(corePrograms);
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let p = each_array_2[$$index_1];
            if (editId === p.id) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="rounded-2xl border border-rose-300 bg-rose-50/40 p-4"><form method="POST" action="?/update"${attr("id", `edit-${stringify(p.id)}`)} class="space-y-3"><input type="hidden" name="id"${attr("value", p.id)}/> <input type="hidden" name="coreId"${attr("value", editCoreId)}/> <label class="flex flex-col gap-1"><span${attr_class(clsx(lbl))}>Name</span> <input name="name"${attr("value", editName)} required=""${attr_class(clsx(inp))}/></label> <label class="flex flex-col gap-1"><span${attr_class(clsx(lbl))}>Description</span> <textarea name="description"${attr("rows", 2)} placeholder="Short description…"${attr_class(clsx(ta))}>`);
              const $$body_1 = escape_html(editDesc);
              if ($$body_1) {
                $$renderer3.push(`${$$body_1}`);
              }
              $$renderer3.push(`</textarea></label> <div class="flex flex-col gap-1"><span${attr_class(clsx(lbl))}>Image</span> <div class="flex items-center gap-2">`);
              if (isImg(editImage)) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<img${attr("src", editImage)} alt="" class="h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-cover"/>`);
              } else {
                $$renderer3.push("<!--[-1-->");
                $$renderer3.push(`<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-400">`);
                Image($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></div>`);
              }
              $$renderer3.push(`<!--]--> <input name="image"${attr("value", editImage)} placeholder="/uploads/image.jpg"${attr_class(clsx(inp))}/> <button type="button" class="shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 hover:border-rose-300 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----></button></div></div> <div class="flex items-center justify-end gap-2 pt-1"><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50">`);
              X($$renderer3, { size: 12 });
              $$renderer3.push(`<!----> Cancel</button> <button type="submit" class="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700">`);
              Check($$renderer3, { size: 12 });
              $$renderer3.push(`<!----> Save</button></div></form></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<div class="group relative rounded-2xl border border-zinc-200 bg-white p-4"><div class="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"><button type="button" class="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-rose-300 hover:text-rose-600" title="Edit">`);
              Pencil($$renderer3, { size: 12 });
              $$renderer3.push(`<!----></button> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", p.id)}/> <button type="submit" class="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-red-300 hover:text-red-600" title="Delete">`);
              Trash_2($$renderer3, { size: 12 });
              $$renderer3.push(`<!----></button></form></div> <div class="mb-3 h-28 w-full overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50">`);
              if (isImg(p.image ?? "")) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<img${attr("src", p.image)}${attr("alt", p.name)} class="h-full w-full object-cover"/>`);
              } else {
                $$renderer3.push("<!--[-1-->");
                $$renderer3.push(`<div class="flex h-full w-full items-center justify-center text-zinc-300">`);
                Image($$renderer3, { size: 28 });
                $$renderer3.push(`<!----></div>`);
              }
              $$renderer3.push(`<!--]--></div> <p class="font-semibold text-zinc-900">${escape_html(p.name)}</p> <p class="mt-0.5 line-clamp-2 text-sm text-zinc-400">${escape_html(p.description || "No description yet.")}</p></div>`);
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--> `);
          if (addingForCore === core.id) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="rounded-2xl border border-dashed border-rose-300 bg-rose-50/30 p-4"><form method="POST" action="?/create" class="space-y-3"><input type="hidden" name="coreId"${attr("value", core.id)}/> <label class="flex flex-col gap-1"><span${attr_class(clsx(lbl))}>Program Name</span> <input name="name"${attr("value", newName)} required="" placeholder="e.g. Edu Maths"${attr_class(clsx(inp))}/></label> <label class="flex flex-col gap-1"><span${attr_class(clsx(lbl))}>Description <span class="font-normal text-zinc-400">(optional)</span></span> <textarea name="description"${attr("rows", 2)} placeholder="Short description…"${attr_class(clsx(ta))}>`);
            const $$body_2 = escape_html(newDesc);
            if ($$body_2) {
              $$renderer3.push(`${$$body_2}`);
            }
            $$renderer3.push(`</textarea></label> <div class="flex flex-col gap-1"><span${attr_class(clsx(lbl))}>Image <span class="font-normal text-zinc-400">(optional)</span></span> <div class="flex items-center gap-2"><input name="image"${attr("value", newImage)} placeholder="/uploads/image.jpg"${attr_class(clsx(inp))}/> <button type="button" class="shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 hover:border-rose-300 hover:text-rose-600">`);
            Image_plus($$renderer3, { size: 13 });
            $$renderer3.push(`<!----></button></div></div> <div class="flex items-center justify-end gap-2 pt-1"><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50">`);
            X($$renderer3, { size: 12 });
            $$renderer3.push(`<!----> Cancel</button> <button type="submit" class="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700">`);
            Plus($$renderer3, { size: 12 });
            $$renderer3.push(`<!----> Add</button></div></form></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="flex items-center justify-between rounded-2xl border border-dashed border-zinc-200 px-5 py-4 text-sm text-zinc-400"><span>No programs yet</span></div>`);
        }
        $$renderer3.push(`<!--]--></section>`);
      }
      $$renderer3.push(`<!--]--></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-DyW2U7iu.js.map
