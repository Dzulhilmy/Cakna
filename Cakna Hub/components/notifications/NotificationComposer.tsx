"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Wand2 } from "lucide-react";
import {
  TEMPLATES,
  getTemplate,
  type NotificationType,
} from "@/lib/notifications";
import NotificationCard from "@/components/notifications/NotificationCard";

const AUDIENCES = [
  "All Franchisees, MTs & clients",
  "All Franchisees",
  "MTs & clients",
  "HQ Team",
];

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30";

const INITIAL_TYPE: NotificationType = "kemalangan";
const INITIAL = getTemplate(INITIAL_TYPE)!.generate({});

export default function NotificationComposer() {
  const router = useRouter();
  const [type, setType] = useState<NotificationType>(INITIAL_TYPE);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [title, setTitle] = useState(INITIAL.title);
  const [content, setContent] = useState(INITIAL.content);
  const [callout, setCallout] = useState(INITIAL.callout);
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const template = getTemplate(type)!;

  function selectType(next: NotificationType) {
    setType(next);
    setFields({});
    const t = getTemplate(next)!;
    const g = t.generate({});
    setTitle(g.title);
    setContent(g.content);
    setCallout(g.callout);
    setAudience(t.audience);
    setError("");
  }

  function generate() {
    const g = template.generate(fields);
    setTitle(g.title);
    setContent(g.content);
    setCallout(g.callout);
  }

  async function send() {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, content, callout, audience }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to send announcement.");
      }
      router.push("/notifications");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setSending(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="space-y-6">
        <div>
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Announcement type
          </span>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {TEMPLATES.map((t) => {
              const active = t.id === type;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectType(t.id)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-rose-500 bg-rose-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{t.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm font-medium text-zinc-700">Details</p>
          {template.fields.map((f) => (
            <label key={f.name} className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-600">
                {f.label}
                {f.required && <span className="text-rose-600"> *</span>}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  rows={2}
                  value={fields[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setFields((s) => ({ ...s, [f.name]: e.target.value }))
                  }
                  className={inputClass}
                />
              ) : (
                <input
                  type={f.type}
                  value={fields[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setFields((s) => ({ ...s, [f.name]: e.target.value }))
                  }
                  className={inputClass}
                />
              )}
            </label>
          ))}
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
          >
            <Wand2 size={15} />
            Generate content
          </button>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Title (internal reference)
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Content
          </span>
          <textarea
            rows={9}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputClass} font-mono text-xs leading-relaxed`}
          />
          <span className="mt-1 block text-xs text-zinc-400">
            Separate paragraphs with a blank line. Start a line with &gt; for a
            quote.
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Note &quot;Together With CAKNA&quot;
          </span>
          <textarea
            rows={5}
            value={callout}
            onChange={(e) => setCallout(e.target.value)}
            className={`${inputClass} font-mono text-xs leading-relaxed`}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Audience
          </span>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className={inputClass}
          >
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={send}
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          {sending ? "Sending…" : "Send announcement"}
        </button>
      </div>

      {/* Live preview */}
      <div>
        <p className="mb-3 text-sm font-medium text-zinc-500">
          Preview · sent to{" "}
          <span className="text-zinc-700">{audience}</span>
        </p>
        <div className="lg:sticky lg:top-6">
          <NotificationCard content={content} callout={callout} />
        </div>
      </div>
    </div>
  );
}
