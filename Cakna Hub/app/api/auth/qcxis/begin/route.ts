import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { buildAuthorizationUrl } from "@/lib/qcxis-oauth";

const STATE_COOKIE = "qcxis_state";
const NEXT_COOKIE = "qcxis_next";
const COOKIE_MAX_AGE = 300; // 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "";

  // Validate next is a safe relative path (prevent open redirect)
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "";

  let authUrl: string;
  try {
    const state = randomBytes(32).toString("hex");
    authUrl = buildAuthorizationUrl(state);

    const res = NextResponse.redirect(authUrl);
    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    };
    res.cookies.set(STATE_COOKIE, state, cookieOpts);
    if (safeNext) res.cookies.set(NEXT_COOKIE, safeNext, cookieOpts);
    return res;
  } catch (err) {
    console.error("[QCXIS begin]", err);
    return NextResponse.redirect(
      new URL("/login?error=qcxis_config", request.url),
    );
  }
}
