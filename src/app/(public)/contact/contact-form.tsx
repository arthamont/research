"use client";

import { useState, useTransition } from "react";
import { submitContact } from "@/server/actions/contact";
import { field, EditorTextarea } from "@/components/dashboard/generic-forms";

const lbl = "mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError(null);
  };

  const submit = () =>
    start(async () => {
      const res = await submitContact(form);
      if (res.error) setError(res.error);
      else setSent(true);
    });

  if (sent) {
    return (
      <div className="border border-border bg-bg-elevated p-10 text-center">
        <p className="font-display text-2xl font-medium">Message received.</p>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Thank you for reaching out — every message is read and answered personally.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 border border-border bg-bg-elevated p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={lbl}>Name</label>
          <input className={field} value={form.name} onChange={set("name")} placeholder="Your name" />
        </div>
        <div>
          <label className={lbl}>Email *</label>
          <input type="email" className={field} value={form.email} onChange={set("email")} placeholder="you@email.com" />
        </div>
      </div>
      <div>
        <label className={lbl}>Subject</label>
        <input className={field} value={form.subject} onChange={set("subject")} placeholder="Question, suggestion, or research inquiry" />
      </div>
      <div>
        <label className={lbl}>Message *</label>
        <EditorTextarea rows={6} value={form.message} onChange={set("message")} placeholder="Questions, suggestions, research ideas — anything worth discussing." />
      </div>
      {error && <p className="text-xs text-short">{error}</p>}
      <button
        onClick={submit}
        disabled={pending}
        className="border border-accent bg-accent px-8 py-3 font-mono text-xs uppercase tracking-[0.16em] text-bg transition-colors hover:bg-accent-text disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </div>
  );
}
