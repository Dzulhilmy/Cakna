import { NextResponse } from "next/server";
import { cores } from "@/lib/cores";

// Backend endpoint — returns the 7 Core data as JSON.
export function GET() {
  return NextResponse.json({ cores });
}
