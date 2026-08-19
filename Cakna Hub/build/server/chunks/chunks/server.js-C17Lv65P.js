let base = "";
let assets = base;
const app_dir = "_hub";
const relative = true;
const initial = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
function reset() {
  base = initial.base;
  assets = initial.assets;
}

export { app_dir as a, base as b, assets as c, reset as d, override as o, relative as r };
//# sourceMappingURL=server.js-C17Lv65P.js.map
