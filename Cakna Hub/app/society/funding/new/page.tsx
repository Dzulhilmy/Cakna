import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import FundingForm from "@/components/society/FundingForm";

export const metadata: Metadata = {
  title: "New Funding Application · Cakna Hub",
};

export default function NewFundingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <SiteHeader showBack />

      <Link
        href="/society/funding"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft size={16} />
        Funding Applications
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Cakna Hub Programme Report
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Program funding application. Please complete the information below.
        </p>
      </div>

      <div className="mt-8">
        <FundingForm />
      </div>
    </main>
  );
}
