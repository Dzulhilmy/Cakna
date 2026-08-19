import { ab as ensure_array_like, aj as attr_style, ai as stringify, ag as attr_class, aa as clsx, a5 as escape_html, ah as attr, Q as derived } from './index.js-6hyNTq_g.js';

function SectionBg($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { images = [], overlay = "medium" } = $$props;
    let currentIndex = 0;
    const alpha = derived(() => overlay === "light" ? 0.15 : overlay === "dark" ? 0.5 : 0.3);
    if (images.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="pointer-events-none absolute inset-0 bg-zinc-900" aria-hidden="true"><!--[-->`);
      const each_array = ensure_array_like(images);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let img = each_array[i];
        $$renderer2.push(`<div class="absolute inset-0 transition-opacity duration-1000"${attr_style(`background-image:url(${stringify(img)});background-size:cover;background-position:center;opacity:${stringify(i === currentIndex ? 1 : 0)};`)}></div>`);
      }
      $$renderer2.push(`<!--]--> <div class="absolute inset-0 z-10"${attr_style(`background:rgba(0,0,0,${stringify(alpha())});`)}></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function hasBg(images) {
  return Array.isArray(images) && images.some((img) => !!img?.trim());
}
function CustomSections($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { sections } = $$props;
    if (sections && sections.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(sections);
      for (let $$index_4 = 0, $$length = each_array.length; $$index_4 < $$length; $$index_4++) {
        let s = each_array[$$index_4];
        const bg = s.background === "tint" ? "bg-rose-50/60" : "bg-white";
        $$renderer2.push(`<section${attr_class(clsx(bg))}><div class="mx-auto max-w-6xl px-6 py-16 sm:py-20">`);
        if (s.eyebrow || s.title) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="mx-auto max-w-3xl text-center mb-10">`);
          if (s.eyebrow) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">${escape_html(s.eyebrow)}</p>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (s.title) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">${escape_html(s.title)}</h2>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="mx-auto max-w-3xl space-y-6"><!--[-->`);
        const each_array_1 = ensure_array_like(s.blocks);
        for (let $$index_3 = 0, $$length2 = each_array_1.length; $$index_3 < $$length2; $$index_3++) {
          let block = each_array_1[$$index_3];
          if (block.type === "paragraph") {
            $$renderer2.push("<!--[0-->");
            if (block.content?.trim()) {
              $$renderer2.push("<!--[0-->");
              const alignClass = block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : block.align === "justify" ? "text-justify" : "text-left";
              $$renderer2.push(`<p${attr_class(`leading-relaxed text-zinc-600 ${alignClass}`)}>${escape_html(block.content)}</p>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          } else if (block.type === "text") {
            $$renderer2.push("<!--[1-->");
            if (block.content?.trim()) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<p class="text-base font-semibold text-zinc-800">${escape_html(block.content)}</p>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          } else if (block.type === "image") {
            $$renderer2.push("<!--[2-->");
            const imgs = block.images ?? [];
            const style = block.imageStyle ?? "gallery";
            if (imgs.length > 0) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<div class="w-full">`);
              if (style === "background" || style === "both") {
                $$renderer2.push("<!--[0-->");
                $$renderer2.push(`<div class="relative overflow-hidden rounded-2xl aspect-video">`);
                SectionBg($$renderer2, { images: [imgs[0]], overlay: "medium" });
                $$renderer2.push(`<!----> `);
                if (block.caption) {
                  $$renderer2.push("<!--[0-->");
                  $$renderer2.push(`<p class="absolute bottom-0 inset-x-0 bg-black/40 px-4 py-2 text-xs text-white text-center">${escape_html(block.caption)}</p>`);
                } else {
                  $$renderer2.push("<!--[-1-->");
                }
                $$renderer2.push(`<!--]--></div> `);
                if (style === "both" && imgs.length > 1) {
                  $$renderer2.push("<!--[0-->");
                  $$renderer2.push(`<div${attr_class(`mt-4 grid gap-4 ${imgs.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`)}><!--[-->`);
                  const each_array_2 = ensure_array_like(imgs.slice(1));
                  for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
                    let src = each_array_2[$$index];
                    $$renderer2.push(`<img${attr("src", src)} alt="" class="aspect-[4/3] w-full rounded-xl border border-zinc-200 object-cover"/>`);
                  }
                  $$renderer2.push(`<!--]--></div>`);
                } else {
                  $$renderer2.push("<!--[-1-->");
                }
                $$renderer2.push(`<!--]-->`);
              } else {
                $$renderer2.push("<!--[-1-->");
                $$renderer2.push(`<div${attr_class(`grid gap-4 ${imgs.length === 1 ? "grid-cols-1" : imgs.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`)}><!--[-->`);
                const each_array_3 = ensure_array_like(imgs);
                for (let $$index_1 = 0, $$length3 = each_array_3.length; $$index_1 < $$length3; $$index_1++) {
                  let src = each_array_3[$$index_1];
                  $$renderer2.push(`<img${attr("src", src)} alt="" class="aspect-[4/3] w-full rounded-xl border border-zinc-200 object-cover"/>`);
                }
                $$renderer2.push(`<!--]--></div> `);
                if (block.caption) {
                  $$renderer2.push("<!--[0-->");
                  $$renderer2.push(`<p class="mt-2 text-xs text-center text-zinc-400">${escape_html(block.caption)}</p>`);
                } else {
                  $$renderer2.push("<!--[-1-->");
                }
                $$renderer2.push(`<!--]-->`);
              }
              $$renderer2.push(`<!--]--></div>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          } else if (block.type === "bulletList") {
            $$renderer2.push("<!--[3-->");
            const items = (block.items ?? []).filter((i) => i.trim());
            if (items.length > 0) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<ul class="space-y-2"><!--[-->`);
              const each_array_4 = ensure_array_like(items);
              for (let $$index_2 = 0, $$length3 = each_array_4.length; $$index_2 < $$length3; $$index_2++) {
                let item = each_array_4[$$index_2];
                $$renderer2.push(`<li class="flex items-start gap-2.5"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500"></span> <span class="leading-relaxed text-zinc-600">${escape_html(item)}</span></li>`);
              }
              $$renderer2.push(`<!--]--></ul>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div> `);
        if (s.ctaLabel?.trim()) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="mt-10 text-center"><a${attr("href", s.ctaHref?.trim() || "#")} class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition-colors hover:bg-rose-700">${escape_html(s.ctaLabel)}</a></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></section>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { CustomSections as C, SectionBg as S, hasBg as h };
//# sourceMappingURL=CustomSections.js-CkEA1hrv.js.map
