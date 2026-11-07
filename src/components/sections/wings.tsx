"use client";

import { useState, useTransition } from "react";
import { joinWaitlist } from "@/server/actions/waitlist";
import { field } from "@/components/dashboard/generic-forms";
import { cn } from "@/lib/utils";

const WINGS = [
  { id: "research", title: "Arthamont Research", body: "Trading analysis and research", live: true },
  { id: "capital", title: "Arthamont Capital", body: "Potential future investment firm", live: false },
  { id: "partners", title: "Arthamont Partners", body: "Private capital and partnerships", live: false },
  { id: "holdings", title: "Arthamont Holdings", body: "Potential future group structure", live: false },
] as const;

type Wing = (typeof WINGS)[number];

export function WingsSection() {
  const [open, setOpen] = useState<Wing | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [pending, start] = useTransition();

  const openWing = (w: Wing) => {
    setOpen(w);
    setEmail("");
    setError(null);
    setJoined(false);
  };

  const submit = () =>
    start(async () => {
      const res = await joinWaitlist({ email, wing: open!.id });
      if (res.error) setError(res.error);
      else setJoined(true);
    });

  return (
    <>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {WINGS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => openWing(w)}
            className={cn(
              "group bg-bg p-6 text-left transition-colors",
              w.live ? "cursor-default" : "hover:bg-bg-elevated"
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-medium leading-tight">{w.title}</p>
              {w.live ? (
                <span className="h-1.5 w-1.5 rounded-full bg-long" aria-hidden />
              ) : (
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-text-faint transition-colors group-hover:text-accent-text">
                  soon →
                </span>
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-text-secondary">{w.body}</p>
            {w.live && <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-long">Current — this site</p>}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[11px] italic text-text-faint">
        Illustrative brand architecture — future entities, not existing or licensed businesses.
      </p>

      {/* Coming-soon modal */}
      {open && !open.live && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-5 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${open.title} — coming soon`}
        >
          <div className="w-full max-w-sm border border-border bg-bg-elevated p-8" onClick={(e) => e.stopPropagation()}>
            <p className="micro-label">{open.title}</p>
            <h3 className="font-display mt-3 text-2xl font-medium">Coming soon.</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              This entity is part of the long-term vision — not yet active. Leave your email to stay updated when it
              launches.
            </p>
            {joined ? (
              <p className="mt-6 text-sm text-long">You&apos;re on the list. We&apos;ll reach out when {open.title} moves.</p>
            ) : (
              <div className="mt-6 space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="you@email.com"
                  className={field}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
                {error && <p className="text-xs text-short">{error}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={submit}
                    disabled={pending}
                    className="border border-accent bg-accent px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bg transition-colors hover:bg-accent-text disabled:opacity-50"
                  >
                    {pending ? "Joining…" : "Stay updated"}
                  </button>
                  <button
                    onClick={() => setOpen(null)}
                    className="border border-border px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary hover:border-border-strong"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
