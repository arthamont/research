"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const field =
  "w-full border border-border bg-surface px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none";
export const lbl = "micro-label mb-1.5 block";

/** Small reusable submit wrapper for workspace actions. */
export function useActionForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const run = (fn: () => Promise<{ error?: string } | void>, onDone?: () => void) =>
    start(async () => {
      setError(null);
      const res = await fn();
      if (res && "error" in res && res.error) setError(res.error);
      else onDone?.();
      router.refresh();
    });
  return { error, pending, run, setError };
}

export function DeleteButton({ onDelete, label = "Delete" }: { onDelete: () => Promise<void>; label?: string }) {
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();
  if (!confirm) {
    return (
      <button onClick={() => setConfirm(true)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint hover:text-short">
        {label}
      </button>
    );
  }
  return (
    <span className="flex gap-2">
      <button
        disabled={pending}
        onClick={() => start(async () => { await onDelete(); })}
        className="font-mono text-[10px] uppercase tracking-[0.14em] text-short"
      >
        Confirm
      </button>
      <button onClick={() => setConfirm(false)} className="font-mono text-[10px] uppercase text-text-faint">
        Cancel
      </button>
    </span>
  );
}

export function FormError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="border border-short/40 bg-short/10 px-3 py-2 text-xs text-short">
      {error}
    </p>
  );
}

export function EditorTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(field, "min-h-[120px] resize-y font-mono text-xs leading-relaxed", props.className)} />;
}
