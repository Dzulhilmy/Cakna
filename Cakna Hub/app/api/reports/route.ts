import { NextResponse } from "next/server";
import { reports, getSummary, byState, byCore, byPic } from "@/lib/reports";

// Backend endpoint — all report data plus the aggregations the admin uses.
export function GET() {
  return NextResponse.json({
    summary: getSummary(),
    byState: byState(),
    byCore: byCore(),
    byPic: byPic(),
    reports,
  });
}
