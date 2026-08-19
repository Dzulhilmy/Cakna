import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

type PartitionTileProps = {
  href: string;
  label: string;
  description: string;
  Icon: LucideIcon;
};

export default function PartitionTile({
  href,
  label,
  description,
  Icon,
}: PartitionTileProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-rose-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600">
        <Icon size={28} strokeWidth={1.75} />
      </span>
      <h2 className="mt-6 text-xl font-semibold text-zinc-900">{label}</h2>
      <p className="mt-1.5 text-sm text-zinc-500">{description}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-rose-600">
        Continue
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
