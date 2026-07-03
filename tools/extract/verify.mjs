// Drift detector: re-runs extraction into a temp dir and diffs manifests.
import { readFileSync, mkdtempSync, cpSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const repo = new URL("../..", import.meta.url).pathname;
const committed = JSON.parse(readFileSync(join(repo, "data/extracted/manifest.json"), "utf8"));

const tmp = mkdtempSync(join(tmpdir(), "cakna-verify-"));
cpSync(join(repo, "tools/extract"), join(tmp, "tools/extract"), { recursive: true });
cpSync(join(repo, "sample/pwa/index.html"), join(tmp, "sample/pwa/index.html"), { recursive: true });
execFileSync("node", [join(tmp, "tools/extract/extract.mjs")], { stdio: "pipe" });
const fresh = JSON.parse(readFileSync(join(tmp, "data/extracted/manifest.json"), "utf8"));
rmSync(tmp, { recursive: true, force: true });

let bad = 0;
if (fresh.source_sha256 !== committed.source_sha256) {
  console.error("source html sha mismatch");
  bad++;
}
for (const [name, meta] of Object.entries(committed.artifacts)) {
  const f = fresh.artifacts[name];
  if (!f || f.sha256 !== meta.sha256) {
    console.error("drift:", name);
    bad++;
  }
}
if (bad) process.exit(1);
console.log("verify OK — no drift");
