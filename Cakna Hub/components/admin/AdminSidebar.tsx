"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, X } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/auth/LogoutButton";
import NoticeBell from "@/components/notices/NoticeBell";
import { roleLabel, type PublicUser } from "@/lib/roles";

/**
 * Admin sidebar. On desktop it's a fixed left column; on narrow windows it
 * collapses to a header with a hamburger that toggles the nav + account menu.
 */
export default function AdminSidebar({ user }: { user: PublicUser }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <aside className="no-print border-b border-zinc-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3 p-4 md:p-5">
        <div>
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900"
          >
            Cakna <span className="text-rose-600">Hub</span>
          </Link>
          <p className="mt-0.5 hidden text-xs font-medium uppercase tracking-wide text-zinc-400 md:block">
            Admin
          </p>
        </div>

        <div className="flex items-center gap-1">
          <NoticeBell align="left" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 md:hidden"
          >
            <ArrowLeft size={16} />
            Hub
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Nav + account. Always shown on desktop; toggled on mobile. */}
      <div
        id="admin-mobile-nav"
        className={`${
          open ? "block" : "hidden"
        } border-t border-zinc-200 md:flex md:flex-1 md:flex-col md:border-t-0`}
      >
        <div className="px-3 py-4 md:flex-1 md:py-0 md:pt-0">
          <AdminNav role={user.role} />
        </div>

        <div className="border-t border-zinc-200 p-3">
          <div className="px-3 pb-2">
            <p className="truncate text-sm font-medium text-zinc-800">
              {user.name}
            </p>
            <p className="text-xs text-zinc-400">{roleLabel(user.role)}</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <LogoutButton className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900" />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <ArrowLeft size={16} />
              Back to hub
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
