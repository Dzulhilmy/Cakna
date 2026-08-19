"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { englishDate } from "@/lib/notifications";
import type { NoticeView } from "@/lib/notices";

export default function NoticeBell({
  align = "right",
}: {
  align?: "left" | "right";
}) {
  const [notices, setNotices] = useState<NoticeView[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) return;
      const data = await res.json();
      setNotices(data.notices ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      /* ignore */
    }
  }

  // Load on mount and poll gently so approvals surface without a refresh.
  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  async function markAll() {
    setUnread(0);
    setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  }

  function markOne(id: string) {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnread((u) => Math.max(0, u - 1));
    fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load();
        }}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        aria-expanded={open}
        className="relative inline-flex items-center justify-center rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`fixed inset-x-3 top-14 z-40 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg sm:absolute sm:inset-x-auto sm:top-full sm:mt-2 sm:w-80 sm:max-w-[90vw] ${
            align === "left" ? "sm:left-0" : "sm:right-0"
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5">
            <p className="text-sm font-semibold text-zinc-900">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notices.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-zinc-400">
                You&apos;re all caught up.
              </p>
            ) : (
              notices.map((n) => {
                const inner = (
                  <div className="flex gap-2.5">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        n.read ? "bg-transparent" : "bg-rose-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-900">
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">{n.body}</p>
                      <p className="mt-1 text-[11px] text-zinc-400">
                        {englishDate(n.createdAt)}
                      </p>
                    </div>
                  </div>
                );
                const cls = `block px-4 py-3 text-left transition-colors hover:bg-zinc-50 ${
                  n.read ? "" : "bg-rose-50/40"
                }`;
                return n.href ? (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => {
                      markOne(n.id);
                      setOpen(false);
                    }}
                    className={cls}
                  >
                    {inner}
                  </Link>
                ) : (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markOne(n.id)}
                    className={`w-full ${cls}`}
                  >
                    {inner}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
