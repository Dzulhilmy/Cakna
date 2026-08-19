// QCXIS OAuth 2.0 / OIDC helpers.
// All QCXIS-specific constants are read from env vars — see .env.local.

import type { Role } from "./roles";

const CLIENT_ID = process.env.QCXIS_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.QCXIS_CLIENT_SECRET ?? "";
const AUTH_URL =
  process.env.QCXIS_AUTH_URL ?? "https://qcxis.com/oauth/authorize";
const TOKEN_URL =
  process.env.QCXIS_TOKEN_URL ?? "https://qcxis.com/oauth/token";
const USERINFO_URL =
  process.env.QCXIS_USERINFO_URL ?? "https://qcxis.com/api/v1/me";
const SCOPE = process.env.QCXIS_SCOPE ?? "openid profile email";
const ROLE_FIELD = process.env.QCXIS_ROLE_FIELD ?? "role";

export const REDIRECT_URI =
  process.env.QCXIS_REDIRECT_URI ??
  "http://localhost:3000/api/auth/qcxis/callback";

// Maps the raw QCXIS role/department string → Cakna Hub Role.
// Edit this map to match whatever values QCXIS sends in the role field.
const ROLE_MAP: Record<string, Role> = {
  // CAKNA HQ / Admin
  admin: "admin",
  hq: "admin",
  cakna: "admin",
  cakna_dept: "admin",
  "cakna dept": "admin",
  superadmin: "admin",
  // PIC / Dept
  pic: "reviewer",
  reviewer: "reviewer",
  department: "reviewer",
  staff: "reviewer",
  manager: "reviewer",
  // Franchisee
  franchisee: "franchisee",
  franchise: "franchisee",
  franchisor: "franchisee",
  outlet: "franchisee",
};

export type QcxisUserInfo = {
  sub?: string;
  email: string;
  name?: string;
  [key: string]: unknown;
};

/** Build the QCXIS authorization URL. */
export function buildAuthorizationUrl(state: string): string {
  if (!CLIENT_ID) throw new Error("QCXIS_CLIENT_ID is not configured.");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state,
  });
  return `${AUTH_URL}?${params}`;
}

/** Exchange an authorization code for an access token. */
export async function exchangeCodeForToken(code: string): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`QCXIS token exchange failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("No access_token in QCXIS response.");
  return data.access_token;
}

/** Fetch the authenticated user's profile from QCXIS. */
export async function getQcxisUserInfo(
  accessToken: string,
): Promise<QcxisUserInfo> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`QCXIS userinfo failed (${res.status})`);
  }
  return res.json() as Promise<QcxisUserInfo>;
}

/** Map a QCXIS userinfo object → Cakna Hub Role (defaults to franchisee). */
export function mapQcxisRole(userInfo: QcxisUserInfo): Role {
  const raw = String(userInfo[ROLE_FIELD] ?? "")
    .toLowerCase()
    .trim();
  return ROLE_MAP[raw] ?? "franchisee";
}
