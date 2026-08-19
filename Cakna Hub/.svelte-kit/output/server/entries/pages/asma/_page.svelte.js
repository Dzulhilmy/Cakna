import { i as head, d as ensure_array_like } from "../../../chunks/index.js";
import { S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("8lqcxz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Asmaul Husna — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="asma-root svelte-8lqcxz"><header class="asma-header svelte-8lqcxz"><a href="https://cakna.org/hub" class="hdr-btn svelte-8lqcxz" aria-label="Kembali">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-8lqcxz"><span class="hdr-title svelte-8lqcxz">Asmaul Husna</span></div> <span class="total-badge svelte-8lqcxz">99</span></header> <main class="asma-main svelte-8lqcxz">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="skeleton-grid svelte-8lqcxz"><!--[-->`);
      const each_array = ensure_array_like({ length: 6 });
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        each_array[i];
        $$renderer2.push(`<div class="skeleton-card svelte-8lqcxz"><div class="skel-circle svelte-8lqcxz"></div> <div class="skel-lines svelte-8lqcxz"><div class="skel-line skel-arabic svelte-8lqcxz"></div> <div class="skel-line skel-translit svelte-8lqcxz"></div> <div class="skel-line skel-meaning svelte-8lqcxz"></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "asma" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
