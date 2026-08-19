import { A as AdminShell } from '../../../chunks/AdminShell.js-DRxmFCdx.js';
import '../../../chunks/index.js-6hyNTq_g.js';
import '../../../chunks/utils.js-DClsVo7x.js';
import '../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';
import '../../../chunks/index2.js-BU6Hqqpj.js';
import '../../../chunks/state.svelte.js-KfFw5RnB.js';
import '../../../chunks/exports.js-8HOoaa4e.js';
import '../../../chunks/root.js-D9zcjZWK.js';
import '../../../chunks/index3.js-DoZqothz.js';
import '../../../chunks/types.js-D6PGEaQi.js';
import '../../../chunks/external-link.js-BwqAnHMH.js';
import '../../../chunks/Icon.js-VGojmkFT.js';

function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, children } = $$props;
    AdminShell($$renderer2, {
      user: data.user,
      children: ($$renderer3) => {
        children($$renderer3);
        $$renderer3.push(`<!---->`);
      }
    });
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte.js-Mu1vyzkD.js.map
