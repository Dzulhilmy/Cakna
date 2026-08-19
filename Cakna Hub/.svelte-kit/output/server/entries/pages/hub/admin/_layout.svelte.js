import "clsx";
import { A as AdminShell } from "../../../../chunks/AdminShell.js";
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
export {
  _layout as default
};
