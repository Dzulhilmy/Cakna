import { NextRequest, NextResponse } from "next/server";
import {
  getFundingApplications,
  addFundingApplication,
} from "@/lib/society-store";
import { notifySubmitted } from "@/lib/notices-store";
import { getCurrentUser } from "@/lib/auth";
import type { FundingInput } from "@/lib/society";

export async function GET() {
  return NextResponse.json({ applications: await getFundingApplications() });
}

export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const str = (k: string) =>
    typeof body[k] === "string" ? (body[k] as string).trim() : "";

  for (const k of ["cawangan", "kluster", "namaProgram", "tarikh"]) {
    if (!str(k)) {
      return NextResponse.json(
        { error: `Field '${k}' is required.` },
        { status: 400 },
      );
    }
  }

  const input: FundingInput = {
    cawangan: str("cawangan"),
    namaFrancaisi: str("namaFrancaisi"),
    ajk: str("ajk"),
    kluster: str("kluster"),
    namaProgram: str("namaProgram"),
    tarikh: str("tarikh"),
    lokasi: str("lokasi"),
    penerangan: str("penerangan"),
    jumlahPeserta: str("jumlahPeserta"),
    kategoriPenerima: str("kategoriPenerima"),
    namaKomuniti: str("namaKomuniti"),
    jumlahPerbelanjaan: Number(body["jumlahPerbelanjaan"]) || 0,
    sumberDana: str("sumberDana"),
    pautanGambar: str("pautanGambar"),
    impak: str("impak"),
    cadangan: str("cadangan"),
    submittedBy: {
      id: me.id,
      name: me.name,
      role: me.role,
      branch: me.branch,
    },
  };

  const application = await addFundingApplication(input);
  // Notify Department (PIC) and CAKNA that a program awaits approval.
  await notifySubmitted(application);
  return NextResponse.json({ application }, { status: 201 });
}
