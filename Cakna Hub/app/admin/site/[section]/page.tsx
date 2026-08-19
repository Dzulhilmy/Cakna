import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getSiteContent } from "@/lib/site-store";
import type { SiteContent } from "@/lib/site";
import HomeEditor from "@/components/admin/site/HomeEditor";
import AboutEditor from "@/components/admin/site/AboutEditor";
import SetemEditor from "@/components/admin/site/SetemEditor";
import CsrEditor from "@/components/admin/site/CsrEditor";
import ContactEditor from "@/components/admin/site/ContactEditor";

export const dynamic = "force-dynamic";

const titles: Record<string, string> = {
  home: "Home Page",
  about: "About Us",
  setem: "SETEM",
  csr: "CSR Stories",
  contact: "Contact & Footer",
};

const editors: Record<
  string,
  (props: { initial: SiteContent }) => React.ReactNode
> = {
  home: HomeEditor,
  about: AboutEditor,
  setem: SetemEditor,
  csr: CsrEditor,
  contact: ContactEditor,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const label = titles[section];
  return {
    title: label
      ? `${label} · Cakna Hub Admin`
      : "Website · Cakna Hub Admin",
  };
}

export default async function SiteSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  await requireRole(["admin"], "/admin/site");

  const Editor = editors[section];
  if (!Editor) notFound();

  const content = await getSiteContent();
  return <Editor initial={content} />;
}
