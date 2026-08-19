import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listMedia, deleteMedia } from "@/lib/media-store";
import { getSiteContent } from "@/lib/site-store";

export async function GET() {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ items: await listMedia() });
}

export async function DELETE(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { name?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name : "";

  // Don't let an image be deleted while it's still referenced on the site.
  const content = JSON.stringify(await getSiteContent());
  if (name && content.includes(`/uploads/${name}`)) {
    return NextResponse.json(
      {
        error:
          "This image is currently used on the website. Remove it from the page first, then delete it.",
      },
      { status: 409 },
    );
  }

  const ok = await deleteMedia(name);
  if (!ok) {
    return NextResponse.json({ error: "Could not delete image." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
