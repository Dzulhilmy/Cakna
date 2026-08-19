import type { Metadata } from "next";
import PublicShell from "@/components/public/PublicShell";
import CsrPageBody from "@/components/public/CsrPageBody";
import { getSiteContent } from "@/lib/site-store";

export const metadata: Metadata = {
  title: "CSR Stories · HOME CAKNA",
};

export const dynamic = "force-dynamic";

export default async function CsrStoriesPage() {
  const content = await getSiteContent();

  return (
    <PublicShell content={content}>
      <CsrPageBody content={content} />
    </PublicShell>
  );
}
