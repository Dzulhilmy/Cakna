import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import CoreCard from "@/components/CoreCard";
import { cores } from "@/lib/cores";

export const metadata: Metadata = {
  title: "7 Core · Cakna Hub",
};

export default function CorePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <SiteHeader showBack />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          7 Core
        </h1>
        <p className="mt-1.5 text-zinc-500">
          The seven core initiatives of Cakna.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cores.map((core) => (
          <CoreCard key={core.id} core={core} />
        ))}
      </div>
    </main>
  );
}
