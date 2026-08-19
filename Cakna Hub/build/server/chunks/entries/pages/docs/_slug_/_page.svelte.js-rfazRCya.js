import { ak as head, Q as derived, a5 as escape_html, ab as ensure_array_like } from '../../../../chunks/index.js-6hyNTq_g.js';
import { P as PublicShell } from '../../../../chunks/PublicShell.js-13lfGUX_.js';
import { A as Arrow_left } from '../../../../chunks/arrow-left.js-CvnazgZ6.js';
import { B as Book_open } from '../../../../chunks/book-open.js-BCkYmqdR.js';
import '../../../../chunks/utils.js-DClsVo7x.js';
import '../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';
import '../../../../chunks/Icon.js-VGojmkFT.js';
import '../../../../chunks/phone.js-D1mT-eqs.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const slug = derived(() => data.slug), doc = derived(() => data.doc), content = derived(() => data.content);
    const slugLabels = {
      policy: "Polisi",
      sop: "SOP",
      guidelines: "Garis Panduan",
      manual: "Manual"
    };
    const label = slugLabels[slug()] ?? slug();
    head("11o795e", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(doc()?.title ?? label)} · ${escape_html(content().brand.name)}</title>`);
      });
    });
    PublicShell($$renderer2, {
      content: content(),
      children: ($$renderer3) => {
        $$renderer3.push(`<main class="mx-auto max-w-3xl px-6 py-16"><a href="/" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
        Arrow_left($$renderer3, { size: 16 });
        $$renderer3.push(`<!----> Laman Utama</a> `);
        if (doc()) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="mt-8 flex items-start gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">`);
          Book_open($$renderer3, { size: 20 });
          $$renderer3.push(`<!----></span> <div><h1 class="text-3xl font-bold tracking-tight text-zinc-900">${escape_html(doc().title)}</h1> `);
          if (doc().subtitle) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="mt-1.5 text-base text-zinc-500">${escape_html(doc().subtitle)}</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div></div> `);
          if (doc().content) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="mt-8 space-y-4"><!--[-->`);
            const each_array = ensure_array_like(doc().content.split(/\n\s*\n/).filter(Boolean));
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let p = each_array[$$index];
              $$renderer3.push(`<p class="leading-relaxed text-zinc-700">${escape_html(p)}</p>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<p class="mt-8 text-zinc-500">Kandungan dokumen ini sedang disediakan.</p>`);
          }
          $$renderer3.push(`<!--]--> `);
          if (doc().lastUpdated) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="mt-10 text-sm text-zinc-400">Dikemaskini: ${escape_html(doc().lastUpdated)}</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="mt-8 flex items-start gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">`);
          Book_open($$renderer3, { size: 20 });
          $$renderer3.push(`<!----></span> <div><h1 class="text-3xl font-bold tracking-tight text-zinc-900">${escape_html(label)}</h1> <p class="mt-1.5 text-zinc-500">Kandungan dokumen ini sedang disediakan oleh admin.</p></div></div>`);
        }
        $$renderer3.push(`<!--]--></main>`);
      }
    });
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-rfazRCya.js.map
