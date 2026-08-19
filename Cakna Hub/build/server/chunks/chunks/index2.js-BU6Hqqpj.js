import './state.svelte.js-KfFw5RnB.js';
import '@sveltejs/kit/internal';
import './exports.js-8HOoaa4e.js';
import './utils2.js-BQzn9ikS.js';
import { w as writable } from './index3.js-DoZqothz.js';
import '@sveltejs/kit/internal/server';
import './root.js-D9zcjZWK.js';
import { a4 as getContext } from './index.js-6hyNTq_g.js';

function create_updated_store() {
  const { set, subscribe } = writable(false);
  {
    return {
      subscribe,
      // eslint-disable-next-line @typescript-eslint/require-await
      check: async () => false
    };
  }
}
const stores = {
  updated: /* @__PURE__ */ create_updated_store()
};
({
  check: stores.updated.check
});
function context() {
  return getContext("__request__");
}
const page$1 = {
  get error() {
    return context().page.error;
  },
  get status() {
    return context().page.status;
  },
  get url() {
    return context().page.url;
  }
};
const page = page$1;

export { page as p };
//# sourceMappingURL=index2.js-BU6Hqqpj.js.map
