import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, listUsers, setUserStatus } from "@/lib/auth";

export async function GET() {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ users: await listUsers() });
}

export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.id || (body.status !== "active" && body.status !== "pending")) {
    return NextResponse.json({ error: "Invalid parameter." }, { status: 400 });
  }

  await setUserStatus(body.id, body.status);
  return NextResponse.json({ ok: true });
}
