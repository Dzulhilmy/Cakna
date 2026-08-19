import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-store";
import type { SiteContent } from "@/lib/site";

export async function GET() {
  return NextResponse.json({ content: await getSiteContent() });
}

export async function PUT(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { content?: SiteContent };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.content || typeof body.content !== "object") {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }

  await saveSiteContent(body.content);
  return NextResponse.json({ ok: true });
}
