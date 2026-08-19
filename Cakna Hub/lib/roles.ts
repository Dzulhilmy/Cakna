// Client-safe role types & labels (no server-only imports).

export type Role = "admin" | "reviewer" | "franchisee";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "HQ (CAKNA)",
  reviewer: "Department (PIC)",
  franchisee: "Franchisee",
};

export function roleLabel(role: string): string {
  return (ROLE_LABELS as Record<string, string>)[role] ?? role;
}

export type UserStatus = "active" | "pending";

/** A user without the password hash — safe to pass to the client. */
export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  branch: string;
  status: UserStatus;
  createdAt: string;
};
