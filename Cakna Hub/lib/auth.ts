// Server-only authentication: file-based users, scrypt password hashing,
// HMAC-signed session cookie, and server-side route guards.
// Demo-grade for a no-database prototype — set AUTH_SECRET and move to a real
// database + hardened session store before production use.
import { promises as fs } from "fs";
import path from "path";
import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHmac,
  randomUUID,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role, PublicUser } from "./roles";

export type User = PublicUser & { passwordHash: string };

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const SECRET =
  process.env.AUTH_SECRET || "cakna-hub-dev-secret-change-in-production";
export const SESSION_COOKIE = "cakna_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

// --- password hashing -------------------------------------------------------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const test = scryptSync(password, salt, 64);
  return hashBuf.length === test.length && timingSafeEqual(hashBuf, test);
}

// --- session token (HMAC-signed cookie value) ------------------------------

export function createSessionToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + SESSION_MAX_AGE * 1000 }),
  ).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return typeof data.uid === "string" ? data.uid : null;
  } catch {
    return null;
  }
}

// --- user store -------------------------------------------------------------

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as User[]) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function toPublic(u: User): PublicUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    branch: u.branch,
    status: u.status,
    createdAt: u.createdAt,
  };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const key = email.trim().toLowerCase();
  return (await readUsers()).find((u) => u.email.toLowerCase() === key);
}

export async function getUserById(id: string): Promise<User | undefined> {
  return (await readUsers()).find((u) => u.id === id);
}

export async function listUsers(): Promise<PublicUser[]> {
  return (await readUsers()).map(toPublic);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  branch: string;
  role?: Role;
  status?: "active" | "pending";
}): Promise<PublicUser> {
  const users = await readUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("This email is already registered.");
  }
  const user: User = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password),
    role: input.role ?? "franchisee",
    branch: input.branch.trim(),
    status: input.status ?? "pending",
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  return toPublic(user);
}

/** Create or update a user who authenticated via QCXIS OAuth. */
export async function upsertQcxisUser(input: {
  qcxisId: string;
  email: string;
  name: string;
  role: Role;
}): Promise<PublicUser> {
  const users = await readUsers();
  const email = input.email.trim().toLowerCase();
  let user = users.find((u) => u.email.toLowerCase() === email);
  if (user) {
    user.name = input.name || user.name;
    user.role = input.role;
    user.status = "active";
  } else {
    user = {
      id: randomUUID(),
      name: input.name.trim() || email,
      email,
      passwordHash: `oauth:qcxis:${input.qcxisId}`,
      role: input.role,
      branch: "",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    users.push(user);
  }
  await writeUsers(users);
  return toPublic(user);
}

export async function setUserStatus(
  id: string,
  status: "active" | "pending",
): Promise<void> {
  const users = await readUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return;
  user.status = status;
  await writeUsers(users);
}

// --- session helpers --------------------------------------------------------

export async function startSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const uid = verifySessionToken(token);
  if (!uid) return null;
  const user = await getUserById(uid);
  if (!user || user.status !== "active") return null;
  return toPublic(user);
}

// --- route guards (call from server layouts / pages) -----------------------

export async function requireUser(next = "/"): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireRole(
  roles: Role[],
  next = "/",
): Promise<PublicUser> {
  const user = await requireUser(next);
  if (!roles.includes(user.role)) redirect("/");
  return user;
}
