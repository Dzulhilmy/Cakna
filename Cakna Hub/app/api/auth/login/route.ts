import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword, startSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }
  if (user.status !== "active") {
    return NextResponse.json(
      { error: "Your account is still awaiting HQ / IT approval." },
      { status: 403 },
    );
  }

  await startSession(user.id);
  return NextResponse.json({ user: { name: user.name, role: user.role } });
}
