import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    password?: string;
    branch?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  const branch = (body.branch ?? "").trim();

  if (!name || !email || !password || !branch) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  try {
    // New sign-ups are always pending franchisees, awaiting HQ / IT approval.
    await createUser({ name, email, password, branch });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Registration error." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
