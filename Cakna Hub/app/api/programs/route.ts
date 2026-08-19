import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  type ProgramInput,
} from "@/lib/programs-store";

async function requireAdmin() {
  const me = await getCurrentUser();
  return me && me.role === "admin" ? me : null;
}

function readInput(body: Record<string, unknown>): ProgramInput {
  const str = (k: string) =>
    typeof body[k] === "string" ? (body[k] as string) : "";
  return {
    coreId: str("coreId"),
    name: str("name"),
    description: str("description"),
    image: str("image"),
  };
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ programs: await getPrograms() });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  try {
    const program = await createProgram(readInput(body));
    return NextResponse.json({ program }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not create program." },
      { status: 400 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "Missing program id." }, { status: 400 });
  }
  try {
    const program = await updateProgram(id, readInput(body));
    return NextResponse.json({ program });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not update program." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  let body: { id?: unknown };
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error();
    body = parsed as { id?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  const ok = await deleteProgram(id);
  if (!ok) {
    return NextResponse.json({ error: "Program not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
