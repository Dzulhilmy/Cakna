import { ak as head, Q as derived, a5 as escape_html, ab as ensure_array_like, ag as attr_class, ah as attr } from '../../../chunks/index.js-6hyNTq_g.js';
import { P as PublicShell } from '../../../chunks/PublicShell.js-13lfGUX_.js';
import { S as SectionBg, C as CustomSections, h as hasBg } from '../../../chunks/CustomSections.js-CkEA1hrv.js';
import { a as DEFAULT_SETEM_ORDER } from '../../../chunks/site.js-C3FcLbLW.js';
import { C as Check } from '../../../chunks/check.js-CCXqwNNi.js';
import '../../../chunks/utils.js-DClsVo7x.js';
import '../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';
import '../../../chunks/Icon.js-VGojmkFT.js';
import '../../../chunks/book-open.js-BCkYmqdR.js';
import '../../../chunks/phone.js-D1mT-eqs.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const content = derived(() => data.content);
    const p = derived(() => content().setemPage);
    const hasHero = derived(() => hasBg(p().heroBgImages));
    const hasCta = derived(() => hasBg(p().ctaBgImages));
    const whatParas = derived(() => p().whatBody.split(/\n\s*\n/).filter((s) => s.trim()));
    const setemOrder = derived(() => content().sectionOrder?.setemPage ?? DEFAULT_SETEM_ORDER);
    head("1ygyp09", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>SETEM · ${escape_html(content().brand.name)}</title>`);
      });
    });
    PublicShell($$renderer2, {
      content: content(),
      children: ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(setemOrder());
        for (let $$index_5 = 0, $$length = each_array.length; $$index_5 < $$length; $$index_5++) {
          let key = each_array[$$index_5];
          if (key === "hero") {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<section${attr_class(`relative overflow-hidden ${hasHero() ? "text-white" : "bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200"}`)}>`);
            if (hasHero()) {
              $$renderer3.push("<!--[0-->");
              SectionBg($$renderer3, { images: p().heroBgImages, overlay: p().heroOverlay });
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<div aria-hidden="true" class="pointer-events-none absolute inset-0"><div class="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-rose-300/40 blur-3xl"></div> <div class="absolute -right-16 top-10 h-80 w-80 rounded-full bg-rose-400/30 blur-3xl"></div></div>`);
            }
            $$renderer3.push(`<!--]--> <div class="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32"><p${attr_class(`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ring-1 ${hasHero() ? "bg-white/10 text-rose-100 ring-white/20" : "bg-white/60 text-rose-700 ring-rose-200 backdrop-blur"}`)}><span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span> ${escape_html(p().eyebrow)}</p> <h1${attr_class(`mt-4 text-4xl font-bold tracking-tight sm:text-5xl ${hasHero() ? "text-white" : "text-zinc-900"}`)}>${escape_html(p().heading)}</h1> `);
            if (p().subtext) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p${attr_class(`mx-auto mt-5 max-w-2xl text-lg ${hasHero() ? "text-rose-100" : "text-zinc-600"}`)}>${escape_html(p().subtext)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div></section>`);
          } else if (key === "gap") {
            $$renderer3.push("<!--[1-->");
            $$renderer3.push(`<section class="bg-white py-20"><div class="mx-auto max-w-6xl px-6"><div class="mx-auto max-w-2xl text-center">`);
            if (p().gapEyebrow) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">${escape_html(p().gapEyebrow)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> <h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">${escape_html(p().gapTitle)}</h2> `);
            if (p().gapSubtitle) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="mt-4 leading-relaxed text-zinc-500">${escape_html(p().gapSubtitle)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div> `);
            if (p().gapStats.length > 0) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="mt-12 grid gap-6 sm:grid-cols-3"><!--[-->`);
              const each_array_1 = ensure_array_like(p().gapStats);
              for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                let stat = each_array_1[$$index];
                $$renderer3.push(`<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center"><p class="text-3xl font-bold text-rose-600">${escape_html(stat.value)}</p> <p class="mt-2 text-sm leading-relaxed text-zinc-500">${escape_html(stat.label)}</p></div>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div></section>`);
          } else if (key === "whatIsSetem") {
            $$renderer3.push("<!--[2-->");
            $$renderer3.push(`<section class="bg-zinc-50 py-20"><div class="mx-auto max-w-6xl px-6"><div>`);
            if (p().whatEyebrow) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">${escape_html(p().whatEyebrow)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> <h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">${escape_html(p().whatTitle)}</h2> <!--[-->`);
            const each_array_2 = ensure_array_like(whatParas());
            for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
              let para = each_array_2[$$index_1];
              $$renderer3.push(`<p class="mt-4 leading-relaxed text-zinc-600">${escape_html(para)}</p>`);
            }
            $$renderer3.push(`<!--]--></div></div></section>`);
          } else if (key === "whatToExpect") {
            $$renderer3.push("<!--[3-->");
            if (p().expect.length > 0) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<section class="bg-white py-20"><div class="mx-auto max-w-6xl px-6"><div class="rounded-2xl border border-zinc-200 bg-white p-8"><h3 class="text-base font-semibold text-zinc-900">${escape_html(p().expectTitle)}</h3> <ul class="mt-4 space-y-3"><!--[-->`);
              const each_array_3 = ensure_array_like(p().expect);
              for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
                let item = each_array_3[$$index_2];
                $$renderer3.push(`<li class="flex items-center gap-3 text-sm text-zinc-700"><span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">`);
                Check($$renderer3, { size: 12 });
                $$renderer3.push(`<!----></span> ${escape_html(item)}</li>`);
              }
              $$renderer3.push(`<!--]--></ul></div></div></section>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else if (key === "whoIsItFor") {
            $$renderer3.push("<!--[4-->");
            if (p().audience.length > 0) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<section class="bg-zinc-50 py-20"><div class="mx-auto max-w-6xl px-6"><div class="mx-auto max-w-2xl text-center">`);
              if (p().audienceEyebrow) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">${escape_html(p().audienceEyebrow)}</p>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> <h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">${escape_html(p().audienceTitle)}</h2></div> <div class="mt-10 grid gap-6 sm:grid-cols-3"><!--[-->`);
              const each_array_4 = ensure_array_like(p().audience);
              for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
                let item = each_array_4[$$index_3];
                $$renderer3.push(`<div class="rounded-2xl border border-zinc-200 bg-white p-6"><h3 class="text-base font-semibold text-zinc-900">${escape_html(item.title)}</h3> <p class="mt-2 text-sm leading-relaxed text-zinc-500">${escape_html(item.desc)}</p></div>`);
              }
              $$renderer3.push(`<!--]--></div></div></section>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else if (key === "ourProcess") {
            $$renderer3.push("<!--[5-->");
            if (p().steps.length > 0) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<section class="bg-white py-20"><div class="mx-auto max-w-4xl px-6"><div class="text-center">`);
              if (p().processEyebrow) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">${escape_html(p().processEyebrow)}</p>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> <h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">${escape_html(p().processTitle)}</h2></div> <ol class="mt-10 space-y-4"><!--[-->`);
              const each_array_5 = ensure_array_like(p().steps);
              for (let i = 0, $$length2 = each_array_5.length; i < $$length2; i++) {
                let step = each_array_5[i];
                $$renderer3.push(`<li class="flex items-start gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-sm font-bold text-rose-600">${escape_html(i + 1)}</span> <div><p class="font-semibold text-zinc-900">${escape_html(step.title)}</p> <p class="mt-1 text-sm leading-relaxed text-zinc-500">${escape_html(step.desc)}</p></div></li>`);
              }
              $$renderer3.push(`<!--]--></ol></div></section>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else if (key === "customSections") {
            $$renderer3.push("<!--[6-->");
            CustomSections($$renderer3, { sections: content().customSections?.setem });
          } else if (key === "cta") {
            $$renderer3.push("<!--[7-->");
            if (p().ctaHeading) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<section${attr_class(`relative overflow-hidden ${hasCta() ? "text-white" : "bg-rose-600 text-white"}`)}>`);
              if (hasCta()) {
                $$renderer3.push("<!--[0-->");
                SectionBg($$renderer3, { images: p().ctaBgImages, overlay: p().ctaOverlay });
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> <div class="relative mx-auto max-w-3xl px-6 py-20 text-center"><h2 class="text-3xl font-bold tracking-tight">${escape_html(p().ctaHeading)}</h2> `);
              if (p().ctaText) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<p class="mt-4 text-lg text-rose-100">${escape_html(p().ctaText)}</p>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> `);
              if (p().ctaLabel) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<a${attr("href", p().ctaHref || "#")} class="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-rose-700 shadow-lg transition-colors hover:bg-rose-50">${escape_html(p().ctaLabel)}</a>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div></section>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-B6Ex5lB6.js.map
