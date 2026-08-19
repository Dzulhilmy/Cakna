import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import AdminShell from "@/components/admin/AdminShell";
import NotificationCard from "@/components/notifications/NotificationCard";
import { requireUser } from "@/lib/auth";
import { getNotifications } from "@/lib/notifications-store";
import { typeLabel, englishDate } from "@/lib/notifications";

export const metadata: Metadata = {
  title: "Announcements · Cakna Hub",
};

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireUser("/notifications");
  const isStaff = user.role === "admin" || user.role === "reviewer";
  const notifications = await getNotifications();

  const feed = (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Announcements
          </h1>
          <p className="mt-1.5 text-zinc-500">
            CAKNA For The HOME Family announcements.
          </p>
        </div>
        {isStaff && (
          <Link
            href="/admin/notifications/new"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
          >
            <Plus size={16} />
            Send announcement
          </Link>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <Bell size={26} strokeWidth={1.75} />
          </span>
          <h2 className="mt-5 text-lg font-medium text-zinc-700">
            No announcements
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
            Announcements that are sent will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {notifications.map((n) => (
            <div key={n.id}>
              <p className="mb-2 text-xs text-zinc-400">
                {typeLabel(n.type)} · {englishDate(n.createdAt)} ·{" "}
                {n.createdBy?.name ?? "HQ CAKNA"} · {n.audience}
              </p>
              <NotificationCard content={n.content} callout={n.callout} />
            </div>
          ))}
        </div>
      )}
    </>
  );

  // Staff get the admin sidebar for consistent navigation; others get the
  // simple hub header.
  if (isStaff) {
    return (
      <AdminShell
        user={user}
        contentClassName="mx-auto max-w-6xl px-6 py-8 md:py-10"
      >
        {feed}
      </AdminShell>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <SiteHeader showBack />
      {feed}
    </main>
  );
}
