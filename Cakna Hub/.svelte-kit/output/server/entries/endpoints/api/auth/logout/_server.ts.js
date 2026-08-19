const POST = async ({ cookies }) => {
  cookies.delete("cakna_session", { path: "/" });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
};
export {
  POST
};
