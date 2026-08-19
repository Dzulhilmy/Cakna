import Link from "next/link";
import { LayoutGrid, Users, ShieldCheck, Bell } from "lucide-react";
import PartitionTile from "@/components/PartitionTile";
import LogoutButton from "@/components/auth/LogoutButton";
import { roleLabel, type PublicUser } from "@/lib/roles";

export default function Hub({ user }: { user: PublicUser }) {
  const isStaff = user.role === "admin" || user.role === "reviewer";

  return (
    <main className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
      <div className="absolute inset-x-0 top-0 flex items-center justify-end gap-4 p-6 text-sm">
        <Link
          href="/notifications"
          className="inline-flex items-center gap-1.5 text-zinc-600 transition-colors hover:text-rose-500"
        >
          <Bell size={15} />
          Announcements
        </Link>
        <span className="text-zinc-500">
          {user.name}{" "}
          <span className="text-zinc-400">· {roleLabel(user.role)}</span>
        </span>
        <LogoutButton />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Cakna <span className="text-rose-600">Hub</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-500">
          Welcome back, {user.name.split(" ")[0]}. Choose a partition to
          continue.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        <PartitionTile
          href="/core"
          label="7 Core"
          description="Assist, Biz, Circle, Digital, Edu, Future & Green."
          Icon={LayoutGrid}
        />
        <PartitionTile
          href="/society"
          label="Society & Others"
          description="Community programs and everything else."
          Icon={Users}
        />
      </div>

      {isStaff && (
        <div className="mt-10 text-center">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-rose-600"
          >
            <ShieldCheck size={16} />
            Admin
          </Link>
        </div>
      )}
    </main>
  );
}
