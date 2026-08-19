import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getFundingApplications } from "@/lib/society-store";
import { stateForBranch } from "@/lib/reports";
import { clusterLabel, statusLabel } from "@/lib/society";

function csvField(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const me = await getCurrentUser();
  if (!me || (me.role !== "admin" && me.role !== "reviewer")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apps = await getFundingApplications();

  const headers = [
    "Reference",
    "Status",
    "Branch",
    "State",
    "Core",
    "Program Name",
    "Date",
    "Location",
    "Total Participants",
    "Beneficiary Category",
    "Community Name",
    "Expenditure (RM)",
    "Funding Source",
    "Impact",
    "Suggestion",
    "Submitted By",
    "Reviewed By",
    "Review Notes",
  ];

  const rows = apps.map((a) => [
    a.reference,
    statusLabel(a.status ?? "pending"),
    a.cawangan,
    stateForBranch(a.cawangan),
    clusterLabel(a.kluster),
    a.namaProgram,
    a.tarikh,
    a.lokasi,
    a.jumlahPeserta,
    a.kategoriPenerima,
    a.namaKomuniti,
    a.jumlahPerbelanjaan,
    a.sumberDana,
    a.impak,
    a.cadangan,
    a.submittedBy?.name ?? "",
    a.reviewedBy?.name ?? "",
    a.reviewNote ?? "",
  ]);

  const csv =
    String.fromCharCode(0xfeff) + // BOM so Excel reads UTF-8 correctly
    [headers, ...rows]
      .map((r) => r.map(csvField).join(","))
      .join("\r\n");

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cakna-funding-${date}.csv"`,
    },
  });
}
