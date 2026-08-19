import { i as head, e as escape_html, d as ensure_array_like, f as attr_class, h as derived } from "../../../chunks/index.js";
import { t as todayKey, S as SideNav, c as puasa } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
import { R as Rotate_ccw } from "../../../chunks/rotate-ccw.js";
import { X } from "../../../chunks/x.js";
import { M as Moon } from "../../../chunks/moon.js";
function hijriParts(dt, uiLang = "ms") {
  try {
    const locale = uiLang === "en" ? "en-GB-u-ca-islamic-umalqura" : "ms-MY-u-ca-islamic-umalqura";
    const f = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" });
    const parts = f.formatToParts(dt);
    const g = (k) => parts.find((x) => x.type === k)?.value ?? "";
    const d = parseInt(g("day"), 10);
    if (!d) return null;
    return { d, m: g("month"), y: g("year"), str: `${d} ${g("month")} ${g("year")}H` };
  } catch {
    return null;
  }
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const TYPE_LABELS = { r: "Ramadan", q: "Qada", s: "Sunat", u: "Tidak Puasa" };
    const TYPE_EMOJI = { r: "🌙", q: "✅", s: "⭐", u: "❌" };
    const today = todayKey();
    const hijri = hijriParts(/* @__PURE__ */ new Date());
    const todayRecord = derived(() => puasa.value.recs.find((r) => r.d === today) ?? null);
    const stats = derived(() => {
      const recs = puasa.value.recs;
      return {
        r: recs.filter((r) => r.t === "r").length,
        q: recs.filter((r) => r.t === "q").length,
        s: recs.filter((r) => r.t === "s").length,
        u: recs.filter((r) => r.t === "u").length
      };
    });
    const recentRecs = derived(() => [...puasa.value.recs].sort((a, b) => b.d.localeCompare(a.d)).slice(0, 30));
    function fmtDate(d) {
      const dt = /* @__PURE__ */ new Date(d + "T00:00:00");
      return dt.toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" });
    }
    const RECORD_BUTTONS = [
      { type: "r", label: "Ramadan", emoji: "🌙" },
      { type: "q", label: "Qada", emoji: "✅" },
      { type: "s", label: "Sunat", emoji: "⭐" },
      { type: "u", label: "Tidak Puasa", emoji: "❌" }
    ];
    head("1bgqenh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Rekod Puasa — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="puasa-root svelte-1bgqenh"><header class="puasa-header svelte-1bgqenh"><a href="https://cakna.org/hub" class="hdr-btn svelte-1bgqenh">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-1bgqenh"><span class="hdr-title svelte-1bgqenh">Rekod Puasa</span> <span class="hdr-date svelte-1bgqenh">${escape_html(fmtDate(today))}</span></div> <div class="hdr-spacer svelte-1bgqenh"></div></header> <main class="puasa-main svelte-1bgqenh"><div class="stats-row svelte-1bgqenh"><div class="stat-card svelte-1bgqenh"><span class="stat-icon svelte-1bgqenh">🌙</span> <span class="stat-val svelte-1bgqenh">${escape_html(stats().r)}</span> <span class="stat-lbl svelte-1bgqenh">Ramadan</span></div> <div class="stat-card svelte-1bgqenh"><span class="stat-icon svelte-1bgqenh">✅</span> <span class="stat-val svelte-1bgqenh">${escape_html(stats().q)}</span> <span class="stat-lbl svelte-1bgqenh">Qada</span></div> <div class="stat-card svelte-1bgqenh"><span class="stat-icon svelte-1bgqenh">⭐</span> <span class="stat-val svelte-1bgqenh">${escape_html(stats().s)}</span> <span class="stat-lbl svelte-1bgqenh">Sunat</span></div> <div class="stat-card stat-missed svelte-1bgqenh"><span class="stat-icon svelte-1bgqenh">❌</span> <span class="stat-val svelte-1bgqenh">${escape_html(stats().u)}</span> <span class="stat-lbl svelte-1bgqenh">Tidak Puasa</span></div></div> <section class="today-card svelte-1bgqenh"><div class="today-header svelte-1bgqenh"><span class="today-label svelte-1bgqenh">HARI INI</span> `);
    if (hijri) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="today-hijri svelte-1bgqenh">${escape_html(hijri.str)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (todayRecord()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="today-recorded svelte-1bgqenh"><span class="recorded-emoji svelte-1bgqenh">${escape_html(TYPE_EMOJI[todayRecord().t])}</span> <div class="recorded-info svelte-1bgqenh"><span class="recorded-type svelte-1bgqenh">${escape_html(TYPE_LABELS[todayRecord().t])}</span> <span class="recorded-note svelte-1bgqenh">Sudah direkod hari ini</span></div> <button class="undo-btn svelte-1bgqenh">`);
      Rotate_ccw($$renderer2, { size: 14 });
      $$renderer2.push(`<!----> Undo</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="today-prompt svelte-1bgqenh">Rekod puasa anda hari ini:</p> <div class="record-btns svelte-1bgqenh"><!--[-->`);
      const each_array = ensure_array_like(RECORD_BUTTONS);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let btn = each_array[$$index];
        $$renderer2.push(`<button${attr_class("record-btn svelte-1bgqenh", void 0, {
          "record-btn-r": btn.type === "r",
          "record-btn-q": btn.type === "q",
          "record-btn-s": btn.type === "s",
          "record-btn-u": btn.type === "u"
        })}><span class="rbtn-emoji svelte-1bgqenh">${escape_html(btn.emoji)}</span> <span class="rbtn-label svelte-1bgqenh">${escape_html(btn.label)}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section> `);
    if (recentRecs().length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="recs-section"><h2 class="section-label svelte-1bgqenh">30 Rekod Terkini</h2> <div class="recs-list svelte-1bgqenh"><!--[-->`);
      const each_array_1 = ensure_array_like(recentRecs());
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let rec = each_array_1[$$index_1];
        $$renderer2.push(`<div class="rec-row svelte-1bgqenh"><span class="rec-emoji svelte-1bgqenh">${escape_html(TYPE_EMOJI[rec.t])}</span> <div class="rec-info svelte-1bgqenh"><span class="rec-type svelte-1bgqenh">${escape_html(TYPE_LABELS[rec.t])}</span> <span class="rec-date svelte-1bgqenh">${escape_html(fmtDate(rec.d))}</span></div> <button class="rec-undo svelte-1bgqenh" aria-label="Padam">`);
        X($$renderer2, { size: 14 });
        $$renderer2.push(`<!----></button></div>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="empty-state svelte-1bgqenh">`);
      Moon($$renderer2, { size: 36, strokeWidth: 1.2 });
      $$renderer2.push(`<!----> <p class="svelte-1bgqenh">Tiada rekod puasa lagi.</p> <p class="empty-sub svelte-1bgqenh">Mula rekod hari ini di atas.</p></div>`);
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "puasa" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
