import type { Metadata } from "next";
import { requireRole, listUsers } from "@/lib/auth";
import UsersManager from "@/components/admin/UsersManager";

export const metadata: Metadata = {
  title: "Users · Cakna Hub Admin",
};

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireRole(["admin"], "/admin/users");
  const users = await listUsers();
  const pending = users.filter((u) => u.status === "pending").length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Users
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Franchisee accounts and approvals.
          {pending > 0
            ? ` ${pending} account${pending > 1 ? "s" : ""} awaiting approval.`
            : " No accounts awaiting approval."}
        </p>
      </header>

      <UsersManager initialUsers={users} />
    </div>
  );
}
