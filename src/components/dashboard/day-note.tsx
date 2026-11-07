"use client";

import { useState, useTransition } from "react";
import { upsertDayNote } from "@/server/actions/workspace";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function DayNoteEditor({ date, initial }: { date: string; initial: string }) {
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const dirty = text.trim() !== initial.trim();

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        rows={8}
        placeholder="How is this day going to behave? Bias, expected character, key risks…"
        className="w-full resize-y border border-border bg-surface px-3 py-2.5 font-mono text-xs leading-relaxed text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
      />
      <div className="mt-3 flex items-center gap-3">
        <Button
          variant="primary"
          disabled={pending || !dirty}
          onClick={() =>
            start(async () => {
              await upsertDayNote(date, text);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            })
          }
        >
          {pending ? "Saving…" : "Save note"}
        </Button>
        <span className={cn("text-xs text-long transition-opacity", saved ? "opacity-100" : "opacity-0")}>Saved.</span>
      </div>
    </div>
  );
}
