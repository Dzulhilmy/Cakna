import { redirect } from "@sveltejs/kit";
import { b as private_env } from "../../../chunks/shared-server.js";
const actions = {
  default: async ({ fetch, cookies }) => {
    const apiBase = (private_env.CAKNA_API_URL ?? "https://cakna.org").replace(/\/$/, "");
    try {
      await fetch(`${apiBase}/api/auth/logout`, {
        method: "POST",
        signal: AbortSignal.timeout(5e3)
      });
    } catch {
    }
    cookies.delete("cakna_session", { path: "/" });
    redirect(303, "/");
  }
};
export {
  actions
};
