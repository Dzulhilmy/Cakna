import { a5 as escape_html } from '../../chunks/index.js-6hyNTq_g.js';
import { p as page } from '../../chunks/index2.js-BU6Hqqpj.js';
import '../../chunks/utils.js-DClsVo7x.js';
import '../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';
import '../../chunks/state.svelte.js-KfFw5RnB.js';
import '../../chunks/exports.js-8HOoaa4e.js';
import '../../chunks/root.js-D9zcjZWK.js';
import '../../chunks/index3.js-DoZqothz.js';

function Error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
  });
}

export { Error as default };
//# sourceMappingURL=error.svelte.js-DX6IkMyE.js.map
