import { ak as head, a5 as escape_html, ab as ensure_array_like, ah as attr, ai as stringify, Q as derived } from '../../../../chunks/index.js-6hyNTq_g.js';
import { A as Arrow_left } from '../../../../chunks/arrow-left.js-CvnazgZ6.js';
import '../../../../chunks/utils.js-DClsVo7x.js';
import '../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';
import '../../../../chunks/Icon.js-VGojmkFT.js';

function _page($$renderer, $$props) {
  let { data } = $$props;
  const core = derived(() => data.core), programs = derived(() => data.programs);
  head("m4aryd", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>${escape_html(core().name)} Core · Cakna Hub</title>`);
    });
  });
  $$renderer.push(`<main class="mx-auto max-w-4xl px-6 py-12"><a href="/core" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
  Arrow_left($$renderer, { size: 16 });
  $$renderer.push(`<!----> 7 Core</a> <div class="mt-6"><p class="text-sm font-semibold uppercase tracking-wide text-rose-600">${escape_html(core().tagline)}</p> <h1 class="mt-1 text-3xl font-bold tracking-tight text-zinc-900">${escape_html(core().name)}</h1> <p class="mt-3 text-zinc-600">${escape_html(core().tagline)}</p></div> <div class="mt-10"><h2 class="text-base font-semibold text-zinc-800">Programs</h2> `);
  if (programs().length === 0) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<p class="mt-3 text-sm text-zinc-400">No programs listed yet.</p>`);
  } else {
    $$renderer.push("<!--[-1-->");
    $$renderer.push(`<ul class="mt-4 grid gap-3 sm:grid-cols-2"><!--[-->`);
    const each_array = ensure_array_like(programs());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let p = each_array[$$index];
      $$renderer.push(`<li><a${attr("href", `/core/${stringify(core().id)}/${stringify(p.slug)}`)} class="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50"><p class="font-medium text-zinc-900">${escape_html(p.name)}</p> `);
      if (p.description) {
        $$renderer.push("<!--[0-->");
        $$renderer.push(`<p class="mt-1 text-sm text-zinc-500 line-clamp-2">${escape_html(p.description)}</p>`);
      } else {
        $$renderer.push("<!--[-1-->");
      }
      $$renderer.push(`<!--]--></a></li>`);
    }
    $$renderer.push(`<!--]--></ul>`);
  }
  $$renderer.push(`<!--]--></div></main>`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BdEtP2bo.js.map
