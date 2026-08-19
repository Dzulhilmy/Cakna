import { Heart, House } from "lucide-react";
import { parseContent } from "@/lib/notifications";

/**
 * The CAKNA "Untuk Keluarga HOME" notification card — pink header, cream body,
 * "Bersama Kita CAKNA" callout, and a constant HQ CAKNA footer.
 */
export default function NotificationCard({
  content,
  callout,
}: {
  content: string;
  callout: string;
}) {
  const blocks = parseContent(content);
  const calloutParas = callout
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="overflow-hidden rounded-3xl border border-rose-200 shadow-sm">
      <div className="bg-gradient-to-b from-rose-500 to-rose-600 px-6 py-8 text-center text-white">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-rose-500 shadow-sm">
          <House size={26} strokeWidth={1.75} />
          <Heart
            size={11}
            className="absolute"
            fill="currentColor"
            strokeWidth={0}
          />
        </div>
        <h3 className="mt-4 font-serif text-xl font-bold uppercase tracking-wide">
          CAKNA Untuk Keluarga HOME
        </h3>
        <p className="mt-1 font-serif text-sm italic text-rose-50">
          Satu Sentuhan, Sejuta Makna
        </p>
      </div>

      <div className="bg-[#fdf6f1] px-6 py-7 text-[15px] text-zinc-700">
        {blocks.map((b, i) =>
          b.kind === "quote" ? (
            <blockquote
              key={i}
              className="my-4 border-l-4 border-rose-300 pl-4 italic text-rose-500"
            >
              {b.text}
            </blockquote>
          ) : (
            <p key={i} className="mb-3 whitespace-pre-wrap break-words leading-relaxed">
              {b.text}
            </p>
          ),
        )}

        {calloutParas.length > 0 && (
          <div className="mt-5 rounded-2xl bg-rose-100/70 p-5">
            <p className="mb-2 flex items-center gap-2 font-semibold text-rose-500">
              <Heart size={16} fill="currentColor" strokeWidth={0} />
              Bersama Kita CAKNA
            </p>
            {calloutParas.map((p, i) => (
              <p
                key={i}
                className="mb-2 whitespace-pre-wrap break-words text-sm leading-relaxed last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-sm font-medium text-zinc-500">
          Daripada, HQ CAKNA
        </p>
      </div>
    </div>
  );
}
