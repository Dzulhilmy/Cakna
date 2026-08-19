import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getSiteContent } from "@/lib/site-store";
import DocsEditor from "@/components/admin/site/DocsEditor";

export const metadata: Metadata = { title: "Docs · Cakna Hub Admin" };
export const dynamic = "force-dynamic";

export default async function DocsEditorPage() {
  await requireRole(["admin"], "/admin/site/docs");
  const content = await getSiteContent();
  return <DocsEditor initial={content} />;
}
