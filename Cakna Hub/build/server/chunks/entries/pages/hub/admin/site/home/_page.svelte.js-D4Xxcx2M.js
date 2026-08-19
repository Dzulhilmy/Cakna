import { ak as head, ah as attr, ag as attr_class, ab as ensure_array_like, ai as stringify, a5 as escape_html, aa as clsx, Q as derived } from '../../../../../../chunks/index.js-6hyNTq_g.js';
import '@sveltejs/kit/internal';
import '../../../../../../chunks/exports.js-8HOoaa4e.js';
import '../../../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit/internal/server';
import '../../../../../../chunks/root.js-D9zcjZWK.js';
import '../../../../../../chunks/state.svelte.js-KfFw5RnB.js';
import { c as DEFAULT_HOME_ORDER, H as HOME_SECTIONS } from '../../../../../../chunks/site.js-C3FcLbLW.js';
import { A as Arrow_left } from '../../../../../../chunks/arrow-left.js-CvnazgZ6.js';
import { G as Grip_vertical, R as Refresh_cw } from '../../../../../../chunks/refresh-cw.js-BrlMMB09.js';
import { C as Check } from '../../../../../../chunks/check.js-CCXqwNNi.js';
import { I as Image_plus } from '../../../../../../chunks/image-plus.js-C4aiwSDV.js';
import { T as Trash_2 } from '../../../../../../chunks/trash-2.js-7NoUOT_P.js';
import { P as Plus } from '../../../../../../chunks/plus.js-C9jfm_AR.js';
import '../../../../../../chunks/utils.js-DClsVo7x.js';
import '@sveltejs/kit';
import '../../../../../../chunks/Icon.js-VGojmkFT.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const c = data.content;
    let b = structuredClone(c.brand ?? { name: "", accentWord: "", logoImage: "" });
    const brandJson = derived(() => JSON.stringify(b));
    let nav = structuredClone(c.nav ?? []);
    const navJson = derived(() => JSON.stringify(nav));
    const _hero = c.hero ?? {};
    structuredClone({
      ..._hero,
      bgImages: _hero.bgImages ?? [],
      primaryCta: _hero.primaryCta ?? { label: "", href: "" },
      secondaryCta: _hero.secondaryCta ?? { label: "", href: "" }
    });
    const _about = c.about ?? {};
    structuredClone({ ..._about, quoteBgImages: _about.quoteBgImages ?? [] });
    structuredClone(c.programs ?? {});
    const _impact = c.impact ?? {};
    structuredClone({ ..._impact, stats: _impact.stats ?? [] });
    const _cta = c.cta ?? {};
    structuredClone({
      ..._cta,
      bgImages: _cta.bgImages ?? [],
      primaryCta: _cta.primaryCta ?? { label: "", href: "" },
      secondaryCta: _cta.secondaryCta ?? { label: "", href: "" }
    });
    const _gallery = c.homeGallery ?? {};
    structuredClone({ ..._gallery, images: _gallery.images ?? [] });
    const _partners = c.partners ?? {};
    structuredClone({ ..._partners, logos: _partners.logos ?? [] });
    const _homeCustom = (c.customSections ?? {}).home ?? [];
    structuredClone(_homeCustom);
    let homeOrder = structuredClone(c.sectionOrder?.home ?? DEFAULT_HOME_ORDER);
    let orderDragging = null;
    let orderDragOver = null;
    const orderJson = derived(() => JSON.stringify(homeOrder));
    const sectionSaveKey = { gallery: "homeGallery" };
    let activeSection = "brand";
    let savedSection = null;
    const inp = "rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white";
    const lbl = "text-sm font-medium text-zinc-700";
    const isImg = (url) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    const thumbCls = "h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-cover bg-zinc-50";
    const emptyThumbCls = "h-9 w-9 shrink-0 rounded-lg border border-zinc-200 bg-zinc-100";
    const browseCls = "shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 hover:border-rose-300 hover:text-rose-600";
    function saveBtn(sectionKey, label) {
      return savedSection === sectionKey ? "✓ Saved" : label;
    }
    const navSections = [
      { key: "brand", label: "Brand & Nav", fixed: true },
      ...HOME_SECTIONS.map((s) => ({ ...s, fixed: false }))
    ];
    function navLabel(key) {
      return navSections.find((s) => s.key === key)?.label ?? key;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1u5s5j0", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Home Page · Website · Cakna Hub Admin</title>`);
        });
      });
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <form method="POST" action="?/sectionOrder" class="hidden"><input type="hidden" name="json"${attr("value", orderJson())}/></form> <div class="-mx-6 -my-8 md:-my-10 flex divide-x divide-zinc-200 overflow-hidden" style="height: 100vh;"><div class="flex w-[380px] shrink-0 flex-col bg-white"><div class="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3"><div class="flex items-center gap-1.5 text-sm"><a href="/hub/admin/site" class="flex items-center gap-1 text-zinc-500 hover:text-zinc-900">`);
      Arrow_left($$renderer3, { size: 13 });
      $$renderer3.push(`<!----> Website</a> <span class="text-zinc-300">/</span> <span class="font-medium text-zinc-900">Home Page</span></div> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="shrink-0 border-b border-zinc-100 p-2"><button type="button"${attr_class(`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${"bg-rose-50 text-rose-700 font-medium"}`)}><span class="w-4 shrink-0"></span> Brand &amp; Nav</button>  <div><!--[-->`);
      const each_array = ensure_array_like(homeOrder);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let key = each_array[$$index];
        $$renderer3.push(`<div${attr_class(`flex items-center gap-1 transition-opacity ${orderDragging === key ? "opacity-30" : ""} ${orderDragOver === key && orderDragging !== key ? "rounded-lg outline outline-2 outline-rose-400 outline-offset-[-2px]" : ""}`)}><span draggable="true" role="button" tabindex="0" class="shrink-0 cursor-grab p-1 text-zinc-300 hover:text-zinc-500 active:cursor-grabbing"${attr("aria-label", `Drag to reorder ${stringify(navLabel(key))}`)}>`);
        Grip_vertical($$renderer3, { size: 14 });
        $$renderer3.push(`<!----></span> <button type="button"${attr_class(`flex flex-1 items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition-colors ${activeSection === key ? "bg-rose-50 text-rose-700 font-medium" : "text-zinc-600 hover:bg-zinc-50"}`)}>${escape_html(navLabel(key))} `);
        if (savedSection === (sectionSaveKey[key] ?? key)) {
          $$renderer3.push("<!--[0-->");
          Check($$renderer3, { size: 12, class: "text-emerald-500" });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></button></div>`);
      }
      $$renderer3.push(`<!--]--></div></div> <div class="flex-1 overflow-y-auto">`);
      {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="space-y-6 p-4"><form method="POST" action="?/brand"><input type="hidden" name="json"${attr("value", brandJson())}/> <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Brand</p> <div class="space-y-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Brand Name</span> <input${attr_class(clsx(inp))}${attr("value", b.name ?? "")} placeholder="HOME CAKNA"/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Accent Word <span class="font-normal text-zinc-400">(rose highlight)</span></span> <input${attr_class(clsx(inp))}${attr("value", b.accentWord ?? "")} placeholder="CAKNA"/></label> <div class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Logo Image</span> <div class="flex items-center gap-2">`);
        if (isImg(b.logoImage ?? "")) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<img${attr("src", b.logoImage)} alt="logo"${attr_class(clsx(thumbCls))}/>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
        }
        $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", b.logoImage ?? "")} placeholder="/uploads/logo.png"/> <button type="button"${attr_class(clsx(browseCls))}>`);
        Image_plus($$renderer3, { size: 13 });
        $$renderer3.push(`<!----></button></div></div></div> <div class="mt-4 flex justify-end"><button type="submit"${attr_class(`rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 ${""}`)}>${escape_html(saveBtn("brand", "Save brand"))}</button></div></form> <div class="border-t border-zinc-100 pt-6"><form method="POST" action="?/nav"><input type="hidden" name="json"${attr("value", navJson())}/> <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Navigation Links</p> <p class="mb-3 text-xs text-zinc-500">Links in the public website navigation bar.</p> <div class="space-y-2"><!--[-->`);
        const each_array_1 = ensure_array_like(nav);
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let link = each_array_1[i];
          $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", link.label)} placeholder="About Us"/> <input${attr_class(clsx(inp))}${attr("value", link.href)} placeholder="/about"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
          Trash_2($$renderer3, { size: 13 });
          $$renderer3.push(`<!----></button></div>`);
        }
        $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
        Plus($$renderer3, { size: 13 });
        $$renderer3.push(`<!----> Add link</button> <div class="mt-4 flex justify-end"><button type="submit"${attr_class(`rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 ${""}`)}>${escape_html(saveBtn("nav", "Save navigation"))}</button></div></form></div></div>`);
      }
      $$renderer3.push(`<!--]--></div></div> <div class="relative flex flex-1 flex-col overflow-hidden bg-zinc-100"><div class="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3"><span class="text-xs font-medium text-zinc-500">Live Preview</span> <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:text-zinc-700">`);
      Refresh_cw($$renderer3, { size: 12 });
      $$renderer3.push(`<!----> Refresh</button></div> <div class="relative flex-1 overflow-hidden"><iframe src="/" title="Public site preview" class="absolute left-0 top-0 origin-top-left border-0" style="width: 1280px; height: calc(100% / 0.6); transform: scale(0.6);" loading="lazy"></iframe></div></div></div>`);
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
//# sourceMappingURL=_page.svelte.js-D4Xxcx2M.js.map
