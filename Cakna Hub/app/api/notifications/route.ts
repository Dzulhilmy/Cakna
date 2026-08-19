import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getNotifications, addNotification } from "@/lib/notifications-store";
import { TYPE_LABELS, type NotificationType } from "@/lib/notifications";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  return NextResponse.json({ notifications: await getNotifications() });
}

export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me || (me.role !== "admin" && me.role !== "reviewer")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    type?: string;
    title?: string;
    content?: string;
    callout?: string;
    audience?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const type = body.type ?? "";
  const title = (body.title ?? "").trim();
  const content = (body.content ?? "").trim();
  if (!(type in TYPE_LABELS)) {
    return NextResponse.json({ error: "Invalid announcement type." }, { status: 400 });
  }
  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 },
    );
  }

  const notification = await addNotification({
    type: type as NotificationType,
    title,
    content,
    callout: (body.callout ?? "").trim(),
    audience: (body.audience ?? "").trim() || "All Franchisees",
    createdBy: { id: me.id, name: me.name },
  });

  return NextResponse.json({ notification }, { status: 201 });
}
