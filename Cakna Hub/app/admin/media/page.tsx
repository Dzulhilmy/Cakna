import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { listMedia } from "@/lib/media-store";
import MediaLibrary from "@/components/admin/MediaLibrary";

export const metadata: Metadata = {
  title: "Media · Cakna Hub Admin",
};

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireRole(["admin"], "/admin/media");
  const items = await listMedia();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Media Library
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Upload and manage images used across the public website. Copy an
          image&apos;s URL, or pick it directly when editing a page.
        </p>
      </header>

      <MediaLibrary initialItems={items} />
    </div>
  );
}
