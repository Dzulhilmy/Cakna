import type { Metadata } from "next";
import PublicShell from "@/components/public/PublicShell";
import AboutPageBody from "@/components/public/AboutPageBody";
import { getSiteContent } from "@/lib/site-store";

export const metadata: Metadata = {
  title: "About Us · HOME CAKNA",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <PublicShell content={content}>
      <AboutPageBody content={content} />
    </PublicShell>
  );
}
