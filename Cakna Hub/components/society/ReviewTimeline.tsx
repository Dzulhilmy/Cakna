import { CheckCircle2, RotateCcw, Send, Clock } from "lucide-react";
import {
  STAGE_LABELS,
  type ReviewEntry,
  type ReviewStatus,
} from "@/lib/society";

function meta(e: ReviewEntry) {
  const who = e.stage === "cakna" ? STAGE_LABELS.cakna : STAGE_LABELS.dept;
  switch (e.decision) {
    case "submitted":
      return { label: "Submitted", Icon: Send, cls: "text-zinc-400" };
    case "resubmitted":
      return { label: "Resubmitted", Icon: Send, cls: "text-amber-600" };
    case "needs_revision":
      return {
        label: `${who} — needs revision`,
        Icon: RotateCcw,
        cls: "text-rose-600",
      };
    default:
      return {
        label: `${who} — approved`,
        Icon: CheckCircle2,
        cls: "text-emerald-600",
      };
  }
}

export default function ReviewTimeline({
  log,
  status,
}: {
  log: ReviewEntry[];
  status: ReviewStatus;
}) {
  return (
    <ol className="space-y-3">
      {log.map((e, i) => {
        const { label, Icon, cls } = meta(e);
        return (
          <li key={i} className="flex gap-3">
            <span className={`mt-0.5 shrink-0 ${cls}`}>
              <Icon size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-800">{label}</p>
              <p className="text-xs text-zinc-400">
                {e.by} · {e.at.slice(0, 10)}
              </p>
              {e.note && (
                <p className="mt-0.5 text-xs italic text-zinc-600">
                  “{e.note}”
                </p>
              )}
            </div>
          </li>
        );
      })}
      {(status === "pending_dept" || status === "pending_cakna") && (
        <li className="flex gap-3">
          <span className="mt-0.5 shrink-0 text-amber-500">
            <Clock size={16} />
          </span>
          <p className="text-sm font-medium text-zinc-700">
            Awaiting{" "}
            {status === "pending_dept" ? STAGE_LABELS.dept : STAGE_LABELS.cakna}{" "}
            approval
          </p>
        </li>
      )}
    </ol>
  );
}
