const POST = async ({ cookies }) => {
  cookies.delete("cakna_session", { path: "/" });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
};

export { POST };
//# sourceMappingURL=_server.ts.js-DJ9umr-A.js.map
