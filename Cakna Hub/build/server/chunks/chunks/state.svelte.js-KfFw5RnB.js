import { n as noop } from './index.js-6hyNTq_g.js';
import './exports.js-8HOoaa4e.js';
import '@sveltejs/kit/internal/server';
import './root.js-D9zcjZWK.js';

const is_legacy = noop.toString().includes("$$") || /function \w+\(\) \{\}/.test(noop.toString());
const placeholder_url = "a:";
if (is_legacy) {
  ({
    url: new URL(placeholder_url)
  });
}
//# sourceMappingURL=state.svelte.js-KfFw5RnB.js.map
