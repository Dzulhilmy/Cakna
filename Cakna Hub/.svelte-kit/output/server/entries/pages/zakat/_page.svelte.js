import { i as head, e as escape_html, d as ensure_array_like, f as attr_class, g as attr, h as derived } from "../../../chunks/index.js";
import { S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
const NISAB_GRAMS = 85;
const DEFAULT_GOLD_PRICE = 480;
function fmtRM(n) {
  return "RM " + n.toLocaleString("ms-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab = "pendapatan";
    let goldPrice = DEFAULT_GOLD_PRICE;
    let monthlyIncome = "";
    const incomeResult = derived(() => null);
    const nisabValue = derived(() => NISAB_GRAMS * goldPrice);
    const TABS = [
      { id: "pendapatan", label: "Pendapatan" },
      { id: "simpanan", label: "Simpanan" },
      { id: "emas", label: "Emas" }
    ];
    head("1u5l8fc", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Kalkulator Zakat — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="zk-root svelte-1u5l8fc"><header class="zk-header svelte-1u5l8fc"><a href="https://cakna.org/hub" class="hdr-btn svelte-1u5l8fc">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-1u5l8fc"><span class="hdr-title svelte-1u5l8fc">Kalkulator Zakat</span> <span class="hdr-sub svelte-1u5l8fc">Nisab: ${escape_html(fmtRM(nisabValue()))}</span></div> <div style="width:36px;"></div></header> <div class="tabs-row svelte-1u5l8fc"><!--[-->`);
    const each_array = ensure_array_like(TABS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button${attr_class("tab svelte-1u5l8fc", void 0, { "tab-active": activeTab === tab.id })}>${escape_html(tab.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <main class="zk-main svelte-1u5l8fc"><div class="field-group svelte-1u5l8fc"><label class="field-label svelte-1u5l8fc" for="gold-price">Harga Emas (RM/gram)</label> <div class="input-wrap svelte-1u5l8fc"><span class="input-prefix svelte-1u5l8fc">RM</span> <input id="gold-price" class="field-input svelte-1u5l8fc" type="number" min="1" step="1"${attr("value", goldPrice)}${attr("placeholder", String(DEFAULT_GOLD_PRICE))}/></div> <p class="field-hint svelte-1u5l8fc">Paras nisab semasa: ${escape_html(fmtRM(nisabValue()))} (${escape_html(NISAB_GRAMS)}g × RM${escape_html(goldPrice)}/g)</p></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="field-group svelte-1u5l8fc"><label class="field-label svelte-1u5l8fc" for="monthly-income">Pendapatan Bulanan (RM)</label> <div class="input-wrap svelte-1u5l8fc"><span class="input-prefix svelte-1u5l8fc">RM</span> <input id="monthly-income" class="field-input svelte-1u5l8fc" type="number" min="0" step="100"${attr("value", monthlyIncome)} placeholder="cth: 5000"/></div> <p class="field-hint svelte-1u5l8fc">Zakat dikira atas pendapatan setahun (× 12)</p></div> `);
      if (incomeResult()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class("result-card svelte-1u5l8fc", void 0, {
          "result-wajib": incomeResult().due !== null,
          "result-tidak": incomeResult().due === null
        })}>`);
        if (incomeResult().due !== null) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="result-label svelte-1u5l8fc">Wajib zakat</p> <p class="result-amount svelte-1u5l8fc">${escape_html(fmtRM(incomeResult().due))}</p> <p class="result-sub svelte-1u5l8fc">setahun · ${escape_html(fmtRM(incomeResult().monthly ?? 0))} sebulan</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="result-label svelte-1u5l8fc">Tidak wajib zakat</p> <p class="result-sub svelte-1u5l8fc">Pendapatan tahunan di bawah nisab ${escape_html(fmtRM(incomeResult().nisab))}</p>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> <div class="info-box svelte-1u5l8fc"><p class="info-text svelte-1u5l8fc">Kadar zakat: 2.5% · Nisab: ${escape_html(NISAB_GRAMS)}g emas (85 miskal)</p></div></main></div> `);
    SideNav($$renderer2, { active: "zakat" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
