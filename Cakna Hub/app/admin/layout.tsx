import AdminShell from "@/components/admin/AdminShell";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["admin", "reviewer"], "/admin");
  return <AdminShell user={user}>{children}</AdminShell>;
}
