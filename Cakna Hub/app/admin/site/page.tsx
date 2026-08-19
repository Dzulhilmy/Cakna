import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Home,
  Info,
  Newspaper,
  Phone,
} from "lucide-react";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Website · Cakna Hub Admin",
};

export const dynamic = "force-dynamic";

const sections = [
  {
    key: "home",
    title: "Home Page",
    desc: "Hero, about, programs, impact & CTA.",
    Icon: Home,
  },
  {
    key: "about",
    title: "About Us",
    desc: "Who we are, purpose, collaboration & stats.",
    Icon: Info,
  },
  {
    key: "setem",
    title: "SETEM",
    desc: "Math therapy seminar page.",
    Icon: GraduationCap,
  },
  {
    key: "csr",
    title: "CSR Stories",
    desc: "Franchisee CSR stories.",
    Icon: Newspaper,
  },
  {
    key: "contact",
    title: "Contact & Footer",
    desc: "Footer contact details.",
    Icon: Phone,
  },
  {
    key: "docs",
    title: "Polisi, SOP & Panduan",
    desc: "Policy, SOP, guidelines & manual pages.",
    Icon: BookOpen,
  },
];

export default async function SiteHubPage() {
  await requireRole(["admin"], "/admin/site");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Website
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Edit the public website — pick a section to edit.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ key, title, desc, Icon }) => (
          <Link
            key={key}
            href={`/admin/site/${key}`}
            className="group relative rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Icon size={20} />
            </div>
            <h2 className="mt-4 font-semibold text-zinc-900">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{desc}</p>
            <ChevronRight
              size={18}
              className="absolute right-5 top-5 text-zinc-300 transition-colors group-hover:text-rose-400"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
