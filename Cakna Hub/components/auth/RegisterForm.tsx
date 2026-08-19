"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function RegisterForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          branch: fd.get("branch"),
          password: fd.get("password"),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Registration failed.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
        <CheckCircle2 size={28} className="mx-auto text-rose-600" />
        <h2 className="mt-3 text-base font-semibold text-zinc-900">
          Registration successful
        </h2>
        <p className="mt-1.5 text-sm text-zinc-600">
          Your account is now awaiting HQ / IT approval. You can log in
          once it has been approved.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-rose-700 hover:text-rose-800"
        >
          Go to the login page
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-700">
          Name
        </span>
        <input name="name" type="text" required className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-700">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="nama@cakna.com"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-700">
          Branch
        </span>
        <input
          name="branch"
          type="text"
          required
          placeholder="e.g. Kuala Terengganu"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-700">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="At least 6 characters"
          className={inputClass}
        />
      </label>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Registering…" : "Create account"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-rose-600 hover:text-rose-700"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
