import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";
import QcxisButton from "@/components/auth/QcxisButton";

export const metadata: Metadata = {
  title: "Log in · Cakna Hub",
};

const QCXIS_ERRORS: Record<string, string> = {
  qcxis_config: "QCXIS login is not configured yet. Use email & password below.",
  qcxis_denied: "QCXIS login was cancelled.",
  qcxis_invalid: "Invalid response from QCXIS.",
  qcxis_state: "Session expired. Please try again.",
  qcxis_no_email: "Your QCXIS account has no email address.",
  qcxis_failed: "QCXIS login failed. Please try again or use email & password.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "franchisee" ? "/society" : "/admin");

  const { next, error } = await searchParams;
  const errorMsg = error ? (QCXIS_ERRORS[error] ?? "Something went wrong. Please try again.") : null;

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
          Log in to continue.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMsg}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <QcxisButton next={next} />

        <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
          <span className="h-px flex-1 bg-zinc-200" />
          Or
          <span className="h-px flex-1 bg-zinc-200" />
        </div>

        <LoginForm next={next} />
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-500">
        <p className="mb-1.5 font-medium text-zinc-600">Demo accounts</p>
        <ul className="space-y-0.5">
          <li>HQ / CAKNA — admin@cakna.com / admin123</li>
          <li>Department / PIC — reviewer@cakna.com / review123</li>
          <li>Franchisee — franchisee@cakna.com / franchise123</li>
        </ul>
      </div>
    </main>
  );
}
