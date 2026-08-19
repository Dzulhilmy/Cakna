import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import { getEvents, addEvent } from "@/lib/society-store";
import { getCurrentUser } from "@/lib/auth";
import type { EventInput } from "@/lib/society";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function GET() {
  return NextResponse.json({ events: await getEvents() });
}

export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  if (!str("title")) {
    return NextResponse.json({ error: "Event name is required." }, { status: 400 });
  }
  if (!str("tarikh")) {
    return NextResponse.json({ error: "Date is required." }, { status: 400 });
  }

  const files = form
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const images: string[] = [];
  if (files.length > 0) {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    for (const file of files) {
      const ext = EXT_BY_TYPE[file.type];
      if (!ext) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type || file.name}` },
          { status: 400 },
        );
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: `File too large (max 5MB): ${file.name}` },
          { status: 400 },
        );
      }
      const filename = `${randomUUID()}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
      images.push(`/uploads/${filename}`);
    }
  }

  const input: EventInput = {
    title: str("title"),
    kluster: str("kluster"),
    tarikh: str("tarikh"),
    lokasi: str("lokasi"),
    anjuran: str("anjuran"),
    jumlahPeserta: str("jumlahPeserta"),
    penerangan: str("penerangan"),
    images,
    submittedBy: {
      id: me.id,
      name: me.name,
      role: me.role,
      branch: me.branch,
    },
  };

  const event = await addEvent(input);
  return NextResponse.json({ event }, { status: 201 });
}
