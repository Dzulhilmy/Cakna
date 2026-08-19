"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HandCoins,
  BarChart3,
  CalendarDays,
  Bell,
  Boxes,
  Globe,
  ImageIcon,
  Users,
  type LucideIcon,
} from "lucide-react";

type NavLink = { href: string; label: string; Icon: LucideIcon };

const baseLinks: NavLink[] = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/funding", label: "Funding", Icon: HandCoins },
  { href: "/admin/calendar", label: "QC Calendar", Icon: CalendarDays },
  { href: "/admin/analytics", label: "Analytics", Icon: BarChart3 },
  { href: "/notifications", label: "Announcements", Icon: Bell },
];

const adminOnlyLinks: NavLink[] = [
  { href: "/admin/programs", label: "Programs", Icon: Boxes },
  { href: "/admin/site", label: "Website", Icon: Globe },
  { href: "/admin/media", label: "Media", Icon: ImageIcon },
  { href: "/admin/users", label: "Users", Icon: Users },
];

export default function AdminNav({ role }: { role: string }) {
  const pathname = usePathname();
  const links: NavLink[] =
    role === "admin" ? [...baseLinks, ...adminOnlyLinks] : baseLinks;

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-rose-50 text-rose-700"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
