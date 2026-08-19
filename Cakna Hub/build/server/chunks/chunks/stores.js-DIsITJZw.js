import { a4 as getContext } from './index.js-6hyNTq_g.js';
import '@sveltejs/kit/internal';
import './exports.js-8HOoaa4e.js';
import './utils2.js-BQzn9ikS.js';
import '@sveltejs/kit/internal/server';
import './root.js-D9zcjZWK.js';
import './state.svelte.js-KfFw5RnB.js';

const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};

export { page as p };
//# sourceMappingURL=stores.js-DIsITJZw.js.map
