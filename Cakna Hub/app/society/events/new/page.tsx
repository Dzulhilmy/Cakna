import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import EventForm from "@/components/society/EventForm";

export const metadata: Metadata = {
  title: "Add Event · Cakna Hub",
};

export default function NewEventPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <SiteHeader showBack />

      <Link
        href="/society/events"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft size={16} />
        Event Records
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Add Event
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Record an event with its details and photos.
        </p>
      </div>

      <div className="mt-8">
        <EventForm />
      </div>
    </main>
  );
}
