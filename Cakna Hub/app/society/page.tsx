import type { Metadata } from "next";
import { HandCoins, CalendarDays } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PartitionTile from "@/components/PartitionTile";

export const metadata: Metadata = {
  title: "Society & Others · Cakna Hub",
};

export default function SocietyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <SiteHeader showBack />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Society &amp; Others
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Two ways to log community programs — applications for events that need
          funding, and records for events documented for the record.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <PartitionTile
          href="/society/funding"
          label="Funding Applications"
          description="Events that need funding. Submit the Cakna Hub Programme Report form."
          Icon={HandCoins}
        />
        <PartitionTile
          href="/society/events"
          label="Event Records"
          description="Events logged for the record — details and photos, no funding."
          Icon={CalendarDays}
        />
      </div>
    </main>
  );
}
