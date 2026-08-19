import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register · Cakna Hub",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "franchisee" ? "/society" : "/admin");

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link
        href="/"
        className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-rose-600"
      >
        <ArrowLeft size={16} />
        Back to website
      </Link>

      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-zinc-900"
        >
          Cakna <span className="text-rose-600">Hub</span>
        </Link>
        <p className="mt-2 text-sm text-zinc-500">
          Register as a franchisee. Accounts must be approved by HQ / IT.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
    </main>
  );
}
