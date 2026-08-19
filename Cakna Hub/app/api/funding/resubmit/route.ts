import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { resubmitFundingApplication } from "@/lib/society-store";
import { notifyResubmitted } from "@/lib/notices-store";

export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const result = await resubmitFundingApplication(id, {
    id: me.id,
    name: me.name,
    role: me.role,
  });
  if (result === "not_found") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (result === "not_allowed") {
    return NextResponse.json(
      { error: "This application can't be resubmitted." },
      { status: 403 },
    );
  }

  await notifyResubmitted(result);
  return NextResponse.json({ application: result });
}
