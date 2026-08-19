import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getNoticesForUser,
  markNoticeRead,
  markAllNoticesRead,
} from "@/lib/notices-store";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const raw = await getNoticesForUser(me);
  // Expose a per-user `read` flag; don't leak other users' read state.
  const notices = raw.map(({ readBy, ...n }) => ({
    ...n,
    read: readBy.includes(me.id),
  }));
  const unread = notices.filter((n) => !n.read).length;
  return NextResponse.json({ notices, unread });
}

export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: unknown; all?: unknown };
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error();
    body = parsed as { id?: unknown; all?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  if (body.all === true) {
    await markAllNoticesRead(me);
  } else if (typeof body.id === "string") {
    await markNoticeRead(body.id, me.id);
  } else {
    return NextResponse.json({ error: "Nothing to mark." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
