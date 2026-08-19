import type { Metadata } from "next";
import PublicShell from "@/components/public/PublicShell";
import SetemPageBody from "@/components/public/SetemPageBody";
import { getSiteContent } from "@/lib/site-store";

export const metadata: Metadata = {
  title: "SETEM · HOME CAKNA",
};

export const dynamic = "force-dynamic";

export default async function SetemPage() {
  const content = await getSiteContent();

  return (
    <PublicShell content={content}>
      <SetemPageBody content={content} />
    </PublicShell>
  );
}
