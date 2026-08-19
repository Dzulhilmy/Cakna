import AdminSidebar from "@/components/admin/AdminSidebar";
import { type PublicUser } from "@/lib/roles";

/**
 * The admin sidebar + content shell. Used by the /admin layout, and by other
 * staff-facing pages (e.g. /notifications) so the sidebar navigation stays
 * consistent even outside the /admin route tree.
 */
export default function AdminShell({
  user,
  children,
  contentClassName = "mx-auto max-w-5xl px-6 py-8 md:py-10",
}: {
  user: PublicUser;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="min-h-screen md:flex">
      <AdminSidebar user={user} />
      <main className="flex-1">
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}
