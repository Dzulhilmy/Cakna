import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  getQcxisUserInfo,
  mapQcxisRole,
} from "@/lib/qcxis-oauth";
import { upsertQcxisUser, startSession } from "@/lib/auth";

const STATE_COOKIE = "qcxis_state";
const NEXT_COOKIE = "qcxis_next";

function loginError(request: NextRequest, code: string) {
  const url = new URL(`/login?error=${code}`, request.url);
  const res = NextResponse.redirect(url);
  res.cookies.delete(STATE_COOKIE);
  res.cookies.delete(NEXT_COOKIE);
  return res;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  // QCXIS denied the request (user cancelled, etc.)
  if (errorParam) return loginError(request, `qcxis_denied`);
  if (!code || !state) return loginError(request, "qcxis_invalid");

  // CSRF: verify state matches what we set in the begin route
  const storedState = request.cookies.get(STATE_COOKIE)?.value;
  if (!storedState || storedState !== state) {
    return loginError(request, "qcxis_state");
  }

  // Where to send the user after login
  const next = request.cookies.get(NEXT_COOKIE)?.value ?? "";

  try {
    const accessToken = await exchangeCodeForToken(code);
    const userInfo = await getQcxisUserInfo(accessToken);

    if (!userInfo.email) {
      return loginError(request, "qcxis_no_email");
    }

    const role = mapQcxisRole(userInfo);
    const user = await upsertQcxisUser({
      qcxisId: userInfo.sub ?? userInfo.email,
      email: userInfo.email,
      name:
        (userInfo.name as string | undefined) ??
        (userInfo.display_name as string | undefined) ??
        userInfo.email,
      role,
    });

    await startSession(user.id);

    // Redirect: honour ?next if provided, otherwise role-based default
    const destination =
      next ||
      (user.role === "franchisee" ? "/society" : "/admin");

    const res = NextResponse.redirect(new URL(destination, request.url));
    res.cookies.delete(STATE_COOKIE);
    res.cookies.delete(NEXT_COOKIE);
    return res;
  } catch (err) {
    console.error("[QCXIS callback]", err);
    return loginError(request, "qcxis_failed");
  }
}
