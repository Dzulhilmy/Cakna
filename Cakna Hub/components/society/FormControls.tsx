// Presentational form primitives (no hooks) shared by the Society forms.
import type { ReactNode } from "react";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30";

function Label({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-sm font-medium text-zinc-700">
      {label}
      {required && <span className="text-rose-600"> *</span>}
    </span>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
  min,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  min?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <Label label={label} required={required} />
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        step={step}
        className={inputClass}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  required,
  placeholder,
  rows = 3,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <Label label={label} required={required} />
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={`${inputClass} resize-y`}
      />
    </label>
  );
}

export function Select({
  label,
  name,
  required,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <Label label={label} required={required} />
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={inputClass}
      >
        {children}
      </select>
    </label>
  );
}

export function FormSection({
  n,
  title,
  children,
}: {
  n?: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-zinc-200 bg-white p-6">
      <legend className="flex items-center gap-2 px-1 text-sm font-semibold text-zinc-900">
        {n !== undefined && (
          <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-white">
            {n}
          </span>
        )}
        {title}
      </legend>
      <div className="mt-4 space-y-4">{children}</div>
    </fieldset>
  );
}
