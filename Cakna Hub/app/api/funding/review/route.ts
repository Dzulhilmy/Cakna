import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getFundingApplicationById,
  reviewFundingApplication,
} from "@/lib/society-store";
import {
  notifyApproved,
  notifyDeptApproved,
  notifyRejected,
} from "@/lib/notices-store";
import { stageForStatus, canActOnStage } from "@/lib/society";

export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me || (me.role !== "admin" && me.role !== "reviewer")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { id?: string; decision?: string; note?: string };
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error();
    body = parsed as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const decision = body.decision;
  if (
    !body.id ||
    (decision !== "approved" && decision !== "needs_revision")
  ) {
    return NextResponse.json({ error: "Invalid parameters." }, { status: 400 });
  }

  const app = await getFundingApplicationById(body.id);
  if (!app) {
    return NextResponse.json(
      { error: "Application not found." },
      { status: 404 },
    );
  }

  const stage = stageForStatus(app.status);
  if (!stage) {
    return NextResponse.json(
      { error: "This application isn't awaiting review." },
      { status: 409 },
    );
  }
  // Early, friendly gate — the store re-checks authoritatively against its own
  // fresh read (the actual race-safe enforcement).
  if (!canActOnStage(me.role, stage)) {
    return NextResponse.json(
      { error: "Only CAKNA (HQ) can give final approval." },
      { status: 403 },
    );
  }

  const result = await reviewFundingApplication(body.id, {
    decision,
    reviewerId: me.id,
    reviewerName: me.name,
    reviewerRole: me.role,
    note: (body.note ?? "").trim(),
  });
  if (result === "not_allowed") {
    return NextResponse.json(
      { error: "Only CAKNA (HQ) can give final approval." },
      { status: 403 },
    );
  }
  if (typeof result === "string") {
    return NextResponse.json(
      { error: "Could not record the review." },
      { status: 409 },
    );
  }

  // Fire the appropriate workflow notice.
  if (result.decision === "needs_revision") {
    await notifyRejected(result.app, (body.note ?? "").trim());
  } else if (result.stage === "dept") {
    await notifyDeptApproved(result.app);
  } else {
    await notifyApproved(result.app);
  }

  return NextResponse.json({ application: result.app });
}
