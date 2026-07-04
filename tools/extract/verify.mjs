// Drift detector: re-runs extraction into a temp dir and diffs manifests.
import { readFileSync, existsSync, mkdtempSync, cpSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const repo = new URL("../..", import.meta.url).pathname;
const committed = JSON.parse(readFileSync(join(repo, "data/extracted/manifest.json"), "utf8"));

const tmp = mkdtempSync(join(tmpdir(), "cakna-verify-"));
cpSync(join(repo, "tools/extract"), join(tmp, "tools/extract"), { recursive: true });
cpSync(join(repo, "sample/pwa/index.html"), join(tmp, "sample/pwa/index.html"), { recursive: true });
execFileSync("node", [join(tmp, "tools/extract/extract.mjs")], { stdio: "pipe" });

// Words come from the Tilawah APK's quran.db, which is gitignored. Regenerate
// words.json only when that db is present (local); skip its drift check in CI.
const tilawahDb = join(
  repo,
  "Tilawah/extracted/assets/flutter_assets/assets/data/quran.db"
);
let checkedWords = false;
if (existsSync(tilawahDb)) {
  mkdirSync(join(tmp, "tilawah"), { recursive: true });
  cpSync(tilawahDb, join(tmp, "tilawah/quran.db"));
  execFileSync(
    "node",
    [join(tmp, "tools/extract/extract-words.mjs"), join(tmp, "tilawah/quran.db")],
    { stdio: "pipe" }
  );
  checkedWords = true;
}

const fresh = JSON.parse(readFileSync(join(tmp, "data/extracted/manifest.json"), "utf8"));
rmSync(tmp, { recursive: true, force: true });

let bad = 0;
if (fresh.source_sha256 !== committed.source_sha256) {
  console.error("source html sha mismatch");
  bad++;
}
for (const [name, meta] of Object.entries(committed.artifacts)) {
  if (name === "words.json" && !checkedWords) continue; // APK absent — cannot verify
  const f = fresh.artifacts[name];
  if (!f || f.sha256 !== meta.sha256) {
    console.error("drift:", name);
    bad++;
  }
}
if (bad) process.exit(1);
console.log(`verify OK — no drift${checkedWords ? " (incl. words)" : " (words skipped: APK absent)"}`);
