import { i as head, e as escape_html, g as attr, f as attr_class, d as ensure_array_like, h as derived } from "../../../chunks/index.js";
import { e as tasbih, S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
import { R as Rotate_ccw } from "../../../chunks/rotate-ccw.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const RADIUS = 90;
    const CIRC = 2 * Math.PI * RADIUS;
    const progress = derived(() => tasbih.value.t > 0 ? Math.min(tasbih.value.c / tasbih.value.t, 1) : 0);
    const dashOffset = derived(() => CIRC * (1 - progress()));
    let dhikrTab = "phrase";
    head("1xpksly", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Zikir &amp; Tasbih — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="zikir-root svelte-1xpksly"><header class="zikir-header svelte-1xpksly"><a href="https://cakna.org/hub" class="hdr-btn svelte-1xpksly">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-1xpksly"><span class="hdr-title svelte-1xpksly">Zikir &amp; Tasbih</span></div> <div class="hdr-spacer svelte-1xpksly"></div></header> <main class="zikir-main svelte-1xpksly"><section class="tasbih-section svelte-1xpksly"><div class="label-row svelte-1xpksly">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="tasbih-label svelte-1xpksly">${escape_html(tasbih.value.label)}</p>`);
    }
    $$renderer2.push(`<!--]--></div>  <div class="ring-wrap svelte-1xpksly" role="button" tabindex="0" aria-label="Klik untuk tambah zikir"><svg class="counter-ring svelte-1xpksly" viewBox="0 0 220 220" width="220" height="220"><circle cx="110" cy="110"${attr("r", RADIUS)} stroke="rgba(255,255,255,0.06)" stroke-width="12" fill="none" class="svelte-1xpksly"></circle>`);
    if (tasbih.value.t > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<circle cx="110" cy="110"${attr("r", RADIUS)} stroke="rgba(34,197,94,0.85)" stroke-width="12" fill="none" stroke-linecap="round"${attr("stroke-dasharray", CIRC)}${attr("stroke-dashoffset", dashOffset())} transform="rotate(-90 110 110)" style="transition: stroke-dashoffset 0.2s ease" class="svelte-1xpksly"></circle>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--><circle cx="110" cy="110"${attr("r", RADIUS)} stroke="rgba(34,197,94,0.08)" stroke-width="24" fill="rgba(10,20,30,0.9)" class="svelte-1xpksly"></circle></svg> <div class="counter-center svelte-1xpksly"><span class="counter-num svelte-1xpksly">${escape_html(tasbih.value.c)}</span> `);
    if (tasbih.value.t > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="counter-target svelte-1xpksly">/ ${escape_html(tasbih.value.t)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="counter-target svelte-1xpksly">∞</span>`);
    }
    $$renderer2.push(`<!--]--> <span class="counter-hint svelte-1xpksly">ketuk untuk zikir</span></div></div> <div class="controls-row svelte-1xpksly"><button class="ctrl-btn svelte-1xpksly"><span class="ctrl-lbl svelte-1xpksly">Sasaran</span> <span class="ctrl-val svelte-1xpksly">${escape_html(tasbih.value.t === 0 ? "∞" : tasbih.value.t)}</span></button> <button class="ctrl-btn ctrl-reset svelte-1xpksly" aria-label="Reset kiraan">`);
    Rotate_ccw($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> <span class="ctrl-lbl svelte-1xpksly">Reset</span></button></div></section> <section class="dhikr-section svelte-1xpksly"><div class="dhikr-tabs svelte-1xpksly"><button${attr_class("dhikr-tab svelte-1xpksly", void 0, { "dhikr-tab-active": dhikrTab === "phrase" })}>Zikir Harian</button> <button${attr_class("dhikr-tab svelte-1xpksly", void 0, { "dhikr-tab-active": dhikrTab === "quran" })}>Perlindungan</button></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="dhikr-list svelte-1xpksly"><!--[-->`);
      const each_array_1 = ensure_array_like([1, 2, 3, 4]);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        each_array_1[$$index_1];
        $$renderer2.push(`<div class="skeleton-card svelte-1xpksly"><div class="sk-arabic svelte-1xpksly"></div> <div class="sk-label svelte-1xpksly"></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section></main></div> `);
    SideNav($$renderer2, { active: "zikir" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
