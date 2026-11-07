"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertDayNote } from "@/server/actions/workspace";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function DayNoteEditor({ date, initial }: { date: string; initial: string }) {
  const router = useRouter();
  const [text, setText] = useState(initial);
  const [existing, setExisting] = useState(initial.trim().length > 0);
  const [editing, setEditing] = useState(initial.trim().length === 0);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const dirty = text.trim() !== initial.trim();

  const save = () =>
    start(async () => {
      await upsertDayNote(date, text);
      setExisting(text.trim().length > 0);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });

  const remove = () =>
    start(async () => {
      await upsertDayNote(date, "");
      setText("");
      setExisting(false);
      setEditing(true);
      router.refresh();
    });

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        rows={8}
        readOnly={existing && !editing}
        placeholder="How is this day going to behave? Bias, expected character, key risks…"
        className={cn(
          "w-full resize-y border px-3 py-2.5 font-mono text-xs leading-relaxed placeholder:text-text-faint focus:outline-none",
          existing && !editing
            ? "border-border/50 bg-bg text-text-secondary"
            : "border-border bg-surface text-text focus:border-accent"
        )}
      />
      <div className="mt-3 flex items-center gap-3">
        {!existing && (
          <Button variant="primary" disabled={pending || !text.trim()} onClick={save}>
            {pending ? "Saving…" : "Save note"}
          </Button>
        )}
        {existing && !editing && (
          <>
            <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
            <Button variant="danger" disabled={pending} onClick={remove}>Delete</Button>
          </>
        )}
        {existing && editing && (
          <>
            <Button variant="primary" disabled={pending || !dirty || !text.trim()} onClick={save}>
              {pending ? "Saving…" : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => { setText(initial); setEditing(false); }}>Cancel</Button>
            <Button variant="danger" disabled={pending} onClick={remove}>Delete</Button>
          </>
        )}
        <span className={cn("text-xs text-long transition-opacity", saved ? "opacity-100" : "opacity-0")}>Saved.</span>
      </div>
    </div>
  );
}
