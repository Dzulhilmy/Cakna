function formatRM(n) {
  return "RM " + Math.round(n).toLocaleString("en-US");
}
function formatCompactRM(n) {
  const abs = Math.abs(n);
  if (abs >= 1e6) return "RM " + (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1e3) return "RM " + Math.round(n / 1e3) + "K";
  return "RM " + Math.round(n);
}
export {
  formatCompactRM as a,
  formatRM as f
};
