"use client";

import { useMemo, useState } from "react";
import type { BqCalendarRow } from "@/lib/econ-calendar";
import { DayNoteEditor } from "./day-note";
import { cn } from "@/lib/utils";

const chip = (active: boolean) =>
  cn(
    "border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
    active ? "border-accent text-accent-text" : "border-border text-text-secondary hover:border-border-strong"
  );

function fmt(v: number | null, decimals = 2) {
  if (v === null || v === undefined) return "—";
  return v.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

function Change({ row }: { row: BqCalendarRow }) {
  if (row.change_abs === null) return <span className="text-text-faint">—</span>;
  const positive = row.change_abs > 0;
  // direction tells us whether rising is economically favourable
  const good = row.direction === "higher_better" ? positive : row.direction === "lower_better" ? !positive : null;
  const cls = good === null ? "text-text-secondary" : good ? "text-long" : "text-short";
  return (
    <span className={`numeric ${cls}`}>
      {positive ? "+" : ""}
      {fmt(row.change_abs, row.decimals)}
      {row.change_pct !== null && <span className="text-text-faint"> ({positive ? "+" : ""}{fmt(row.change_pct, 2)}%)</span>}
    </span>
  );
}

export function EconCalendarView({ rows, noteDate, notes }: { rows: BqCalendarRow[]; noteDate: string; notes: Record<string, string> }) {
  const [state, setState] = useState<"upcoming" | "released" | "all">("upcoming");
  const [category, setCategory] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [noteDay, setNoteDay] = useState(noteDate);

  const categories = useMemo(() => [...new Set(rows.map((r) => r.category))].sort(), [rows]);

  // Week frame: Sunday → Saturday
  const { weekStart, weekEnd, weekLabel } = useMemo(() => {
    const now = new Date(noteDate + "T00:00:00Z");
    const dow = now.getUTCDay(); // Sunday = 0
    const start = new Date(now);
    start.setUTCDate(start.getUTCDate() - dow + weekOffset * 7);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 6);
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const lbl = `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })} – ${end.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}`;
    return { weekStart: iso(start), weekEnd: iso(end), weekLabel: lbl };
  }, [noteDate, weekOffset]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (!r.next_release || r.next_release < weekStart || r.next_release > weekEnd) return false;
      if (state !== "all" && r.release_state !== state) return false;
      if (category && r.category !== category) return false;
      if (needle && !`${r.name} ${r.code}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [rows, state, category, q, weekStart, weekEnd]);

  const groups = useMemo(() => {
    const g = new Map<string, BqCalendarRow[]>();
    for (const r of filtered) {
      const key = r.next_release ?? "Unscheduled";
      g.set(key, [...(g.get(key) ?? []), r]);
    }
    return [...g.entries()];
  }, [filtered]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        {/* Week navigation — Sunday to Saturday */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setWeekOffset((w) => w - 1)} className="border border-border px-3 py-1.5 font-mono text-xs text-text-secondary hover:border-accent" aria-label="Previous week">←</button>
            <h2 className="text-lg font-semibold tracking-tight">{weekLabel}</h2>
            <button onClick={() => setWeekOffset((w) => w + 1)} className="border border-border px-3 py-1.5 font-mono text-xs text-text-secondary hover:border-accent" aria-label="Next week">→</button>
            {weekOffset !== 0 && (
              <button onClick={() => setWeekOffset(0)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint hover:text-accent-text">
                this week
              </button>
            )}
          </div>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or code…"
            className="w-52 border border-border bg-surface px-3 py-1.5 text-xs text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
          />
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {(["upcoming", "released", "all"] as const).map((s) => (
            <button key={s} onClick={() => setState(s)} className={chip(state === s)}>{s}</button>
          ))}
        </div>
        <div className="mb-6 flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(category === c ? null : c)} className={chip(category === c)}>
              {c}
            </button>
          ))}
        </div>

        {groups.length === 0 && (
          <p className="border border-dashed border-border px-8 py-12 text-center text-sm text-text-faint">
            No releases match these filters.
          </p>
        )}

        <div className="space-y-8">
          {groups.map(([day, items]) => (
            <section key={day}>
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                <button
                  onClick={() => setNoteDay(day)}
                  className="flex items-center gap-2 text-left"
                  title="Load day note"
                >
                  <h2 className="font-mono text-sm font-medium text-text">{day}</h2>
                  {day === noteDay && <span className="font-mono text-[9px] uppercase tracking-widest text-accent">note ↓</span>}
                </button>
                <span className="micro-label">{items.length} release{items.length === 1 ? "" : "s"}</span>
              </div>
              <ul className="divide-y divide-border/60">
                {items.map((r) => (
                  <li key={r.code} className="grid gap-1.5 py-3 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-medium text-text">{r.name}</span>
                        <span className="font-mono text-[10px] text-text-faint">{r.code}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <span className="border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-text-faint">{r.category}</span>
                        <span className="border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-text-faint">{r.freq_long}</span>
                        {r.release_state === "released" ? (
                          <span className="border border-long/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-long">released</span>
                        ) : (
                          <span className="border border-accent/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-text">
                            {r.days_until_next !== null ? `in ${r.days_until_next}d` : "scheduled"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-4 font-mono text-[11px] sm:text-right">
                      <span className="text-text-faint">
                        {fmt(r.latest_value, r.decimals)}{r.display_unit ? ` ${r.display_unit}` : ""}
                        <span className="mx-1 text-text-faint/60">prev</span>{fmt(r.prior_value, r.decimals)}
                      </span>
                      <Change row={r} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* Day note sidebar */}
      <aside className="h-fit border border-border bg-bg-elevated p-4 lg:sticky lg:top-10">
        <p className="micro-label mb-1">Day note — {noteDay}</p>
        <p className="mb-3 text-[11px] text-text-faint">How is this day going to behave? Private — workspace only.</p>
        <DayNoteEditor key={noteDay} date={noteDay} initial={notes[noteDay] ?? ""} />
      </aside>
    </div>
  );
}
