import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NotificationComposer from "@/components/notifications/NotificationComposer";

export const metadata: Metadata = {
  title: "Send Announcement · Cakna Hub Admin",
};

export default function NewNotificationPage() {
  // Access is guarded by the admin layout (admin / reviewer only).
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/notifications"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft size={16} />
          Announcements
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
          Send Announcement
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Choose a template, fill in the details, review the preview, and send
          to the HOME CAKNA family.
        </p>
      </div>

      <NotificationComposer />
    </div>
  );
}
