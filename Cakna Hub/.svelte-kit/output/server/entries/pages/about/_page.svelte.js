import { i as head, h as derived, e as escape_html, d as ensure_array_like, f as attr_class, g as attr } from "../../../chunks/index.js";
import { P as PublicShell } from "../../../chunks/PublicShell.js";
import { S as SectionBg, C as CustomSections, h as hasBg } from "../../../chunks/CustomSections.js";
import { a as DEFAULT_ABOUT_ORDER } from "../../../chunks/site.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const content = derived(() => data.content);
    const p = derived(() => content().aboutPage);
    const hasHero = derived(() => hasBg(p().heroBgImages));
    const hasCta = derived(() => hasBg(p().ctaBgImages));
    const whoParas = derived(() => p().whoBody.split(/\n\s*\n/).filter((s) => s.trim()));
    const aboutOrder = derived(() => content().sectionOrder?.aboutPage ?? DEFAULT_ABOUT_ORDER);
    head("cwls5q", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>About Us · ${escape_html(content().brand.name)}</title>`);
      });
    });
    PublicShell($$renderer2, {
      content: content(),
      children: ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(aboutOrder());
        for (let $$index_3 = 0, $$length = each_array.length; $$index_3 < $$length; $$index_3++) {
          let key = each_array[$$index_3];
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
            $$renderer3.push(`<!--]--> <div class="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32"><p${attr_class(`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ring-1 ${hasHero() ? "bg-white/10 text-rose-100 ring-white/20" : "bg-white/60 text-rose-700 ring-rose-200 backdrop-blur"}`)}><span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span> ${escape_html(p().eyebrow)}</p> <h1${attr_class(`mt-4 text-4xl font-bold tracking-tight sm:text-5xl ${hasHero() ? "text-white" : "text-zinc-900"}`)}>${escape_html(p().heading)}</h1></div></section>`);
          } else if (key === "whoWeAre") {
            $$renderer3.push("<!--[1-->");
            $$renderer3.push(`<section class="bg-white py-20"><div class="mx-auto max-w-4xl px-6"><div class="grid gap-12 lg:grid-cols-2"><div><h2 class="text-2xl font-bold tracking-tight text-zinc-900">${escape_html(p().whoTitle)}</h2> <!--[-->`);
            const each_array_1 = ensure_array_like(whoParas());
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let para = each_array_1[$$index];
              $$renderer3.push(`<p class="mt-4 leading-relaxed text-zinc-600">${escape_html(para)}</p>`);
            }
            $$renderer3.push(`<!--]--></div> <div class="rounded-2xl border border-rose-100 bg-rose-50 p-8"><h3 class="text-base font-semibold uppercase tracking-wide text-rose-600">${escape_html(p().visionTitle)}</h3> <p class="mt-3 leading-relaxed text-zinc-700">${escape_html(p().visionText)}</p></div></div></div></section>`);
          } else if (key === "purpose") {
            $$renderer3.push("<!--[2-->");
            $$renderer3.push(`<section class="bg-zinc-50 py-20"><div class="mx-auto max-w-6xl px-6"><div class="mx-auto max-w-2xl text-center">`);
            if (p().purposeEyebrow) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">${escape_html(p().purposeEyebrow)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> <h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">${escape_html(p().purposeTitle)}</h2> `);
            if (p().purposeSubtitle) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="mt-4 text-zinc-500">${escape_html(p().purposeSubtitle)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div> `);
            if (p().purpose.length > 0) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
              const each_array_2 = ensure_array_like(p().purpose);
              for (let i = 0, $$length2 = each_array_2.length; i < $$length2; i++) {
                let item = each_array_2[i];
                $$renderer3.push(`<div class="rounded-2xl border border-zinc-200 bg-white p-6"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 text-sm font-bold">${escape_html(i + 1)}</div> <h3 class="mt-4 text-base font-semibold text-zinc-900">${escape_html(item.title)}</h3> <p class="mt-2 text-sm leading-relaxed text-zinc-500">${escape_html(item.desc)}</p></div>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div></section>`);
          } else if (key === "collabStats") {
            $$renderer3.push("<!--[3-->");
            $$renderer3.push(`<section class="bg-white py-20"><div class="mx-auto max-w-6xl px-6"><div class="mx-auto max-w-2xl text-center">`);
            if (p().collabEyebrow) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">${escape_html(p().collabEyebrow)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> <h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">${escape_html(p().collabTitle)}</h2> `);
            if (p().collabSubtitle) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="mt-4 leading-relaxed text-zinc-500">${escape_html(p().collabSubtitle)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div> `);
            if (p().stats.length > 0) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="mt-12 grid gap-6 sm:grid-cols-3"><!--[-->`);
              const each_array_3 = ensure_array_like(p().stats);
              for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
                let stat = each_array_3[$$index_2];
                $$renderer3.push(`<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center"><p class="text-4xl font-bold text-rose-600">${escape_html(stat.value)}</p> <p class="mt-2 text-sm text-zinc-500">${escape_html(stat.label)}</p></div>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div></section>`);
          } else if (key === "testimonial") {
            $$renderer3.push("<!--[4-->");
            if (p().testimonial) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<section class="bg-zinc-50 py-16"><div class="mx-auto max-w-3xl px-6 text-center"><blockquote class="text-xl font-medium leading-relaxed text-zinc-800">"${escape_html(p().testimonial)}"</blockquote> `);
              if (p().testimonialAuthor) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<p class="mt-4 text-sm text-zinc-500">— ${escape_html(p().testimonialAuthor)}</p>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div></section>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else if (key === "customSections") {
            $$renderer3.push("<!--[5-->");
            CustomSections($$renderer3, { sections: content().customSections?.about });
          } else if (key === "cta") {
            $$renderer3.push("<!--[6-->");
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
export {
  _page as default
};
