import { i as head, e as escape_html, g as attr, j as attr_style, d as ensure_array_like, k as stringify, f as attr_class, h as derived } from "../../../chunks/index.js";
import { d as city, S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
import { N as Navigation } from "../../../chunks/navigation.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const CITIES = [
      { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869 },
      { name: "Putrajaya", lat: 2.9264, lng: 101.6964 },
      { name: "Shah Alam", lat: 3.0738, lng: 101.5183 },
      { name: "Ipoh", lat: 4.5975, lng: 101.0901 },
      { name: "Kuala Kangsar", lat: 4.7681, lng: 100.9389 },
      { name: "George Town", lat: 5.4141, lng: 100.3288 },
      { name: "Alor Setar", lat: 6.1248, lng: 100.3673 },
      { name: "Kangar", lat: 6.4414, lng: 100.1986 },
      { name: "Kota Bharu", lat: 6.1254, lng: 102.2386 },
      { name: "Kuala Terengganu", lat: 5.3302, lng: 103.1408 },
      { name: "Kuantan", lat: 3.8077, lng: 103.326 },
      { name: "Seremban", lat: 2.7297, lng: 101.9381 },
      { name: "Melaka", lat: 2.1896, lng: 102.2501 },
      { name: "Johor Bahru", lat: 1.4927, lng: 103.7414 },
      { name: "Kuching", lat: 1.5533, lng: 110.3592 },
      { name: "Sibu", lat: 2.3063, lng: 111.8179 },
      { name: "Miri", lat: 4.3995, lng: 113.9914 },
      { name: "Kota Kinabalu", lat: 5.9804, lng: 116.0735 },
      { name: "Sandakan", lat: 5.8402, lng: 118.1179 },
      { name: "Tawau", lat: 4.2456, lng: 117.8912 },
      { name: "Labuan", lat: 5.2831, lng: 115.2308 }
    ];
    let bearing = 0;
    let gpsLoading = false;
    const cityIdx = derived(() => typeof city.value === "number" ? city.value : 0);
    const loc = derived(() => typeof city.value === "object" && "g" in city.value ? { name: "GPS", lat: city.value.g[0], lng: city.value.g[1] } : CITIES[cityIdx()] ?? CITIES[0]);
    const arrowRotation = derived(() => bearing);
    const bearingDisplay = derived(() => bearing.toFixed(1));
    const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
    const cardinals = [
      { deg: 0, label: "U" },
      { deg: 90, label: "T" },
      { deg: 180, label: "S" },
      { deg: 270, label: "B" }
    ];
    head("31glgk", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Kiblat — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="qibla-root svelte-31glgk"><header class="qibla-header svelte-31glgk"><a href="https://cakna.org/hub" class="hdr-btn svelte-31glgk" aria-label="Kembali">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-31glgk"><span class="hdr-title svelte-31glgk">Kiblat</span> `);
    if (loc().name !== "GPS") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="hdr-sub svelte-31glgk">${escape_html(loc().name)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <button class="hdr-btn svelte-31glgk"${attr("disabled", gpsLoading, true)} aria-label="Guna GPS">`);
    Navigation($$renderer2, { size: 18 });
    $$renderer2.push(`<!----></button></header> <main class="qibla-main svelte-31glgk">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="compass-wrap svelte-31glgk"><svg class="compass-svg svelte-31glgk" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-label="Kompas kiblat"><circle cx="120" cy="120" r="110" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" stroke-width="1"></circle><g${attr_style(`transform-origin: 120px 120px; transform: rotate(${stringify(-0)}deg)`)}><!--[-->`);
    const each_array = ensure_array_like(ticks);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let deg = each_array[$$index];
      const rad = (deg - 90) * Math.PI / 180;
      const inner = deg % 30 === 0 ? 86 : 92;
      const outer = 100;
      $$renderer2.push(`<line${attr("x1", 120 + inner * Math.cos(rad))}${attr("y1", 120 + inner * Math.sin(rad))}${attr("x2", 120 + outer * Math.cos(rad))}${attr("y2", 120 + outer * Math.sin(rad))}${attr("stroke", deg % 90 === 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)")}${attr("stroke-width", deg % 90 === 0 ? 1.5 : 0.8)}></line>`);
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    const each_array_1 = ensure_array_like(cardinals);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let c = each_array_1[$$index_1];
      const rad = (c.deg - 90) * Math.PI / 180;
      const r2 = 74;
      $$renderer2.push(`<text${attr("x", 120 + r2 * Math.cos(rad))}${attr("y", 120 + r2 * Math.sin(rad) + 4)} text-anchor="middle" font-size="12" font-weight="700"${attr("fill", c.deg === 0 ? "rgba(248,113,113,0.9)" : "rgba(255,255,255,0.55)")}>${escape_html(c.label)}</text>`);
    }
    $$renderer2.push(`<!--]--></g><g${attr_style(`transform-origin: 120px 120px; transform: rotate(${stringify(arrowRotation())}deg)`)}><line x1="120" y1="120" x2="120" y2="42" stroke="rgba(199,162,75,0.9)" stroke-width="2.5" stroke-linecap="round"></line><polygon points="120,28 113,48 127,48" fill="rgba(199,162,75,0.95)"></polygon><text x="120" y="22" text-anchor="middle" font-size="14">🕋</text><circle cx="120" cy="120" r="5" fill="rgba(199,162,75,0.8)"></circle><line x1="120" y1="120" x2="120" y2="175" stroke="rgba(199,162,75,0.25)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 3"></line></g><circle cx="120" cy="120" r="3" fill="rgba(255,255,255,0.3)"></circle></svg> `);
    {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<p class="compass-hint svelte-31glgk">Memuat kompas…</p>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="bearing-card svelte-31glgk"><p class="bearing-label svelte-31glgk">Kiblat dari lokasi anda</p> <p class="bearing-value svelte-31glgk">${escape_html(bearingDisplay())}°</p> <p class="bearing-city svelte-31glgk">${escape_html(loc().name)}</p></div> <section class="city-section svelte-31glgk"><h2 class="section-label svelte-31glgk">Pilih Bandar</h2> <div class="city-grid svelte-31glgk"><!--[-->`);
    const each_array_2 = ensure_array_like(CITIES);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let c = each_array_2[i];
      $$renderer2.push(`<button${attr_class("city-btn svelte-31glgk", void 0, {
        "city-active": typeof city.value === "number" && city.value === i
      })}>${escape_html(c.name)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></section></main></div> `);
    SideNav($$renderer2, { active: "qibla" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
