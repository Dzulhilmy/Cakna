import { ak as head, ah as attr, ai as stringify, a5 as escape_html, Q as derived } from '../../../../../chunks/index.js-6hyNTq_g.js';
import { A as Arrow_left } from '../../../../../chunks/arrow-left.js-CvnazgZ6.js';
import '../../../../../chunks/utils.js-DClsVo7x.js';
import '../../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';
import '../../../../../chunks/Icon.js-VGojmkFT.js';

function _page($$renderer, $$props) {
  let { data } = $$props;
  const core = derived(() => data.core), program = derived(() => data.program);
  head("19gewy4", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>${escape_html(program().name)} · ${escape_html(core().name)} · Cakna Hub</title>`);
    });
  });
  $$renderer.push(`<main class="mx-auto max-w-3xl px-6 py-12"><a${attr("href", `/core/${stringify(core().id)}`)} class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
  Arrow_left($$renderer, { size: 16 });
  $$renderer.push(`<!----> ${escape_html(core().name)}</a> <h1 class="mt-6 text-2xl font-bold tracking-tight text-zinc-900">${escape_html(program().name)}</h1> `);
  if (program().description) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<p class="mt-4 text-zinc-600 leading-relaxed">${escape_html(program().description)}</p>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--> `);
  if (program().image) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<img${attr("src", program().image)}${attr("alt", program().name)} class="mt-8 w-full rounded-2xl border border-zinc-200 object-cover aspect-video"/>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></main>`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-a_UYrRBj.js.map
