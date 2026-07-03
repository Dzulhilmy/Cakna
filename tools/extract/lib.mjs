import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";
import * as acorn from "acorn";

export const SOURCE = new URL("../../sample/pwa/index.html", import.meta.url).pathname;

export function sha256(s) {
  return createHash("sha256").update(s).digest("hex");
}

export function loadSource(path = SOURCE) {
  const html = readFileSync(path, "utf8");

  // --- data script: <script id="quran-data"> ... </script> ---
  const dataOpen = html.indexOf('<script id="quran-data">');
  if (dataOpen < 0) throw new Error("quran-data script not found");
  const dataStart = html.indexOf(">", dataOpen) + 1;
  const dataEnd = html.indexOf("</script>", dataStart);
  const dataSrc = html.slice(dataStart, dataEnd);

  const data = vm.runInNewContext(
    dataSrc + ";({QURAN,PAGE_STARTS,JUZ_STARTS,TAJ,TRANS_EXTRA,TAJ_DUA,TRANSLIT})",
    {},
    { timeout: 60_000 }
  );

  // --- logic script: the <script> after the data one ---
  const logicOpen = html.indexOf("<script>", dataEnd);
  const logicStart = html.indexOf(">", logicOpen) + 1;
  const logicEnd = html.indexOf("</script>", logicStart);
  const logicSrc = html.slice(logicStart, logicEnd);

  // Walk top-level const/let declarations; evaluate pure-literal initializers in isolation.
  const ast = acorn.parse(logicSrc, { ecmaVersion: "latest" });
  const consts = {};
  for (const node of ast.body) {
    if (node.type !== "VariableDeclaration") continue;
    for (const decl of node.declarations) {
      if (decl.id.type !== "Identifier" || !decl.init) continue;
      const slice = logicSrc.slice(decl.init.start, decl.init.end);
      try {
        const v = vm.runInNewContext("(" + slice + ")", {}, { timeout: 10_000 });
        if (Object.prototype.toString.call(v) === "[object Set]") consts[decl.id.name] = [...v];
        else if (
          Array.isArray(v) ||
          (v !== null && typeof v === "object") ||
          typeof v === "number" ||
          typeof v === "string"
        )
          consts[decl.id.name] = v;
      } catch {
        // initializer references runtime state (DOM, functions) — not data, skip
      }
    }
  }

  return { html, data, consts, logicSrc };
}
