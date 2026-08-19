import { i as head, e as escape_html, j as attr_style, k as stringify, d as ensure_array_like, f as attr_class, g as attr, h as derived } from "../../../chunks/index.js";
import { m as mathuratState, L as LISTS, V as VERSI_LABEL, J as JENIS_LABEL, S as SideNav, p as pickText, T as TOTALS, B as BASMALAH } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
import { S as Settings } from "../../../chunks/settings.js";
import { R as Rotate_ccw } from "../../../chunks/rotate-ccw.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const DEFAULT_TETAPAN = {
      arSaiz: 26,
      bmSaiz: 14,
      paparBm: true,
      paparRumi: false,
      jajarAr: "kanan",
      jajarBm: "kiri",
      bahasa: "bm",
      getar: true,
      autoMaju: false,
      skrinTerang: false,
      autoWaktu: true
    };
    function initState() {
      const hour = (/* @__PURE__ */ new Date()).getHours();
      const mode = hour >= 4 && hour < 13 ? "pagi" : "petang";
      return {
        v2: true,
        version: "sughra",
        mode,
        idx: { sughra: 0, kubra: 0 },
        counts: {
          sughra: LISTS.sughra.map(() => 0),
          kubra: LISTS.kubra.map(() => 0)
        },
        tetapan: { ...DEFAULT_TETAPAN }
      };
    }
    if (!mathuratState.value || !mathuratState.value.v2) {
      mathuratState.value = initState();
    } else {
      const s = mathuratState.value;
      if (!s.counts) s.counts = {
        sughra: LISTS.sughra.map(() => 0),
        kubra: LISTS.kubra.map(() => 0)
      };
      if (!s.tetapan) s.tetapan = { ...DEFAULT_TETAPAN };
    }
    const ms = derived(() => mathuratState.value);
    let advancePending = false;
    const list = derived(() => LISTS[ms().version]);
    const idx = derived(() => ms().idx[ms().version]);
    const item = derived(() => list()[idx()] ?? null);
    const counts = derived(() => ms().counts[ms().version]);
    const count = derived(() => counts()[idx()] ?? 0);
    const progress = derived(() => list().slice(0, idx()).reduce((s, it) => s + it.reps, 0) + Math.min(count(), item()?.reps ?? 0));
    const total = derived(() => TOTALS[ms().version]);
    const progressPct = derived(() => total() > 0 ? Math.round(progress() / total() * 100) : 0);
    const repsLeft = derived(() => item() ? Math.max(0, item().reps - count()) : 0);
    const isDone = derived(() => repsLeft() === 0 && !!item());
    const R = 52;
    const CIRC = 2 * Math.PI * R;
    const ringProgress = derived(() => item() ? Math.min(count() / item().reps, 1) : 0);
    const dashOffset = derived(() => CIRC * (1 - ringProgress()));
    function arText() {
      return item() ? pickText(item(), ms().version, ms().mode, "ar") : "";
    }
    function bmText() {
      if (!item()) return "";
      return pickText(item(), ms().version, ms().mode, ms().tetapan.bahasa === "bm" ? "bm" : "bi");
    }
    function rumiText() {
      return item() ? pickText(item(), ms().version, ms().mode, "rumi") : "";
    }
    head("kioec5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Al-Ma'thurat — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="root svelte-kioec5"><header class="hdr svelte-kioec5"><a href="https://cakna.org/hub" class="hdr-btn svelte-kioec5">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-kioec5"><span class="hdr-title svelte-kioec5">Al-Ma'thurat</span> <span class="hdr-sub svelte-kioec5">${escape_html(VERSI_LABEL[ms().version].penuh)} · ${escape_html(ms().mode === "pagi" ? "Pagi" : "Petang")}</span></div> <button class="hdr-btn svelte-kioec5" aria-label="Tetapan">`);
    Settings($$renderer2, { size: 18 });
    $$renderer2.push(`<!----></button></header> <div class="prog-wrap svelte-kioec5"><div class="prog-bar svelte-kioec5"${attr_style(`width: ${stringify(progressPct())}%;`)}></div> <span class="prog-label svelte-kioec5">${escape_html(progress())} / ${escape_html(total())} (${escape_html(progressPct())}%)</span></div> <div class="tabs-row svelte-kioec5"><div class="tab-group svelte-kioec5"><!--[-->`);
    const each_array = ensure_array_like(["sughra", "kubra"]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let v = each_array[$$index];
      $$renderer2.push(`<button${attr_class("tab svelte-kioec5", void 0, { "tab-on": ms().version === v })}>${escape_html(VERSI_LABEL[v].nama)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="tab-group svelte-kioec5"><!--[-->`);
    const each_array_1 = ensure_array_like(["pagi", "petang"]);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let m = each_array_1[$$index_1];
      $$renderer2.push(`<button${attr_class("tab svelte-kioec5", void 0, { "tab-on": ms().mode === m })}>${escape_html(m === "pagi" ? "Pagi" : "Petang")}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (item()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<main class="content svelte-kioec5"><div class="item-meta svelte-kioec5"><span class="item-num svelte-kioec5">${escape_html(idx() + 1)} / ${escape_html(list().length)}</span> <span class="item-jenis svelte-kioec5">${escape_html(JENIS_LABEL[item().jenis])}</span></div> <h2 class="item-tajuk svelte-kioec5">${escape_html(item().tajuk)}</h2> `);
      if (item().info) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="item-info svelte-kioec5">${escape_html(item().info)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (item().basmalah) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="ar-basmalah svelte-kioec5" dir="rtl">${escape_html(BASMALAH)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <p class="ar-text svelte-kioec5" dir="rtl"${attr_style(`font-size: ${stringify(ms().tetapan.arSaiz)}px; text-align: ${ms().tetapan.jajarAr === "kanan" ? "right" : ms().tetapan.jajarAr === "kiri" ? "left" : "center"};`)}>${escape_html(arText())}</p> `);
      if (ms().tetapan.paparRumi) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="rumi-text svelte-kioec5">${escape_html(rumiText())}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (ms().tetapan.paparBm) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="bm-text svelte-kioec5"${attr_style(`font-size: ${stringify(ms().tetapan.bmSaiz)}px; text-align: ${ms().tetapan.jajarBm === "kiri" ? "left" : ms().tetapan.jajarBm === "kanan" ? "right" : "center"};`)}>${escape_html(bmText())}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></main>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="complete svelte-kioec5"><div class="complete-icon svelte-kioec5">✓</div> <h2 class="svelte-kioec5">Wirid Selesai</h2> <p class="svelte-kioec5">Tahniah! Anda telah melengkapkan ${escape_html(VERSI_LABEL[ms().version].penuh)}.</p> <button class="reset-btn svelte-kioec5">`);
      Rotate_ccw($$renderer2, { size: 16 });
      $$renderer2.push(`<!----> <span>Mula Semula</span></button></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (item()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fab-wrap svelte-kioec5"><button${attr_class("fab svelte-kioec5", void 0, { "fab-done": isDone() || advancePending })}${attr("disabled", advancePending, true)} aria-label="Tap untuk zikir"><svg class="fab-ring svelte-kioec5" viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg svelte-kioec5" cx="60" cy="60"${attr("r", R)}></circle><circle class="ring-fill svelte-kioec5" cx="60" cy="60"${attr("r", R)}${attr("stroke-dasharray", CIRC)}${attr("stroke-dashoffset", dashOffset())} transform="rotate(-90 60 60)"></circle></svg> <div class="fab-inner svelte-kioec5">`);
      if (isDone() && repsLeft() === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="fab-check svelte-kioec5">✓</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span class="fab-num svelte-kioec5">${escape_html(repsLeft())}</span> <span class="fab-sub svelte-kioec5">lagi</span>`);
      }
      $$renderer2.push(`<!--]--></div></button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (item()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<footer class="nav-foot svelte-kioec5"><button class="foot-btn svelte-kioec5"${attr("disabled", idx() <= 0, true)}>`);
      Chevron_left($$renderer2, { size: 16 });
      $$renderer2.push(`<!----> <span>Sebelum</span></button> <button class="foot-reset svelte-kioec5" title="Reset semua">`);
      Rotate_ccw($$renderer2, { size: 15 });
      $$renderer2.push(`<!----></button> <button class="foot-btn foot-skip svelte-kioec5"><span>Langkau</span> `);
      Chevron_left($$renderer2, { size: 16, style: "transform: rotate(180deg)" });
      $$renderer2.push(`<!----></button></footer>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    SideNav($$renderer2, { active: "mathurat" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
