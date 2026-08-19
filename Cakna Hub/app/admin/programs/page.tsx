import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getPrograms } from "@/lib/programs-store";
import ProgramsManager from "@/components/admin/ProgramsManager";

export const metadata: Metadata = {
  title: "Programs · Cakna Hub Admin",
};

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  await requireRole(["admin"], "/admin/programs");
  const programs = await getPrograms();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Programs
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Manage the programs shown under each core — add, edit, or remove them
          and their details.
        </p>
      </header>

      <ProgramsManager initialPrograms={programs} />
    </div>
  );
}
