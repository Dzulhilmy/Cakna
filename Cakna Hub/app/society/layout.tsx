import Link from "next/link";
import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { roleLabel } from "@/lib/roles";
import LogoutButton from "@/components/auth/LogoutButton";
import NoticeBell from "@/components/notices/NoticeBell";

export default async function SocietyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("/society");

  return (
    <>
      <div className="no-print border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-4 px-6 py-2 text-sm">
          <Link
            href="/notifications"
            className="inline-flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-rose-500"
          >
            <Bell size={15} />
            Announcements
          </Link>
          <span className="text-zinc-500">
            {user.name}{" "}
            <span className="text-zinc-400">· {roleLabel(user.role)}</span>
          </span>
          <NoticeBell />
          <LogoutButton />
        </div>
      </div>
      {children}
    </>
  );
}
