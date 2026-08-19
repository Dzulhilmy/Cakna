"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { roleLabel, type PublicUser } from "@/lib/roles";

export default function UsersManager({
  initialUsers,
}: {
  initialUsers: PublicUser[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function approve(id: string) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "active" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to approve account.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Branch</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {initialUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 font-medium text-zinc-900">{u.name}</td>
                <td className="px-5 py-3 text-zinc-600">{u.email}</td>
                <td className="px-5 py-3 text-zinc-600">{roleLabel(u.role)}</td>
                <td className="px-5 py-3 text-zinc-600">{u.branch}</td>
                <td className="px-5 py-3">
                  {u.status === "active" ? (
                    <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  {u.status === "pending" ? (
                    <button
                      onClick={() => approve(u.id)}
                      disabled={busyId === u.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
                    >
                      <Check size={14} />
                      {busyId === u.id ? "…" : "Approve"}
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
