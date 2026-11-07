"use client";

import { useMemo, useState } from "react";
import type { BqCalendarRow } from "@/lib/econ-calendar";
import { usMarketHolidays, monthWeeks, weekHeadline } from "@/lib/holidays";
import { DayNoteEditor } from "./day-note";
import { cn } from "@/lib/utils";

const chip = (active: boolean) =>
  cn(
    "border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
    active ? "border-accent text-accent-text" : "border-border text-text-secondary hover:border-border-strong"
  );

/** Stable category → color mapping (real data, no invented impact levels). */
const CATEGORY_TONES: Record<string, string> = {
  Inflation: "var(--short)",
  Employment: "var(--accent)",
  Rates: "var(--info)",
  Growth: "var(--long)",
  Credit: "var(--warning)",
  Housing: "var(--long)",
  Trade: "var(--info)",
  Business: "var(--text-secondary)",
  Sentiment: "var(--warning)",
};
const tone = (c: string) => CATEGORY_TONES[c] ?? "var(--text-faint)";


export function EconCalendarView({ rows, noteDate, notes }: { rows: BqCalendarRow[]; noteDate: string; notes: Record<string, string> }) {
  const [category, setCategory] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [noteDay, setNoteDay] = useState(noteDate);

  const [y0, m0] = noteDate.split("-").map(Number);
  const [view, setView] = useState({ year: y0, month: m0 - 1 });

  const categories = useMemo(() => [...new Set(rows.map((r) => r.category))].sort(), [rows]);
  const holidays = useMemo(() => usMarketHolidays(view.year), [view.year]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (category && r.category !== category) return false;
      if (needle && !`${r.name} ${r.code}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [rows, category, q]);

  const byDay = useMemo(() => {
    const map = new Map<string, BqCalendarRow[]>();
    for (const r of filtered) {
      if (!r.next_release) continue;
      map.set(r.next_release, [...(map.get(r.next_release) ?? []), r]);
    }
    return map;
  }, [filtered]);

  const weeks = useMemo(() => monthWeeks(view.year, view.month), [view]);
  const monthLabel = new Date(Date.UTC(view.year, view.month, 1)).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const isCurrentMonth = view.year === y0 && view.month === m0 - 1;
  const nav = (d: number) => {
    const t = new Date(Date.UTC(view.year, view.month + d, 1));
    setView({ year: t.getUTCFullYear(), month: t.getUTCMonth() });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => nav(-1)} className="border border-border px-3 py-1.5 font-mono text-xs text-text-secondary hover:border-accent" aria-label="Previous month">←</button>
            <h2 className="display-xl text-2xl sm:text-3xl">{monthLabel}</h2>
            <button onClick={() => nav(1)} className="border border-border px-3 py-1.5 font-mono text-xs text-text-secondary hover:border-accent" aria-label="Next month">→</button>
            {!isCurrentMonth && (
              <button onClick={() => setView({ year: y0, month: m0 - 1 })} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint hover:text-accent-text">
                this month
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
        <div className="mb-6 flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(category === c ? null : c)} className={chip(category === c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Month grid — WEEK | MON–FRI */}
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[90px_repeat(5,1fr)] border-b border-border pb-2">
              <span className="micro-label">Week</span>
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
                <span key={d} className="micro-label text-center">{d}</span>
              ))}
            </div>
            {weeks.map((week, wi) => {
              const weekReleases = week.flatMap((d) => byDay.get(d) ?? []);
              const headline = weekHeadline(weekReleases.map((r) => r.name));
              return (
                <div key={wi} className="grid grid-cols-[90px_repeat(5,1fr)] border-b border-border">
                  <div className="border-r border-border py-3 pr-3">
                    {headline && <p className="text-xs font-medium text-accent-text">{headline}</p>}
                    <p className="mt-1 font-mono text-[9px] leading-snug text-text-faint">
                      {weekReleases.length ? `${weekReleases.length} release${weekReleases.length === 1 ? "" : "s"}` : "quiet"}
                    </p>
                  </div>
                  {[1, 2, 3, 4, 5].map((dow) => {
                    const day = week.find((d) => new Date(d + "T00:00:00Z").getUTCDay() === dow);
                    const holiday = day ? holidays.get(day) : undefined;
                    const releases = day ? byDay.get(day) ?? [] : [];
                    const isToday = day === noteDate;
                    return (
                      <button
                        key={dow}
                        onClick={() => day && setNoteDay(day)}
                        disabled={!day}
                        className={cn(
                          "min-h-[110px] border-r border-border p-2 text-left align-top transition-colors last:border-r-0",
                          day ? "hover:bg-surface" : "bg-surface/30",
                          noteDay === day && "bg-accent-soft"
                        )}
                      >
                        {day && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className={cn("numeric text-sm", isToday ? "font-semibold text-accent" : "text-text")}>
                                {Number(day.slice(-2))}
                              </span>
                              {isToday && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
                            </div>
                            {holiday && (
                              <p className="mt-1 border border-warning/40 bg-warning/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-warning">
                                {holiday}
                              </p>
                            )}
                            <ul className="mt-1.5 space-y-1">
                              {releases.map((r) => (
                                <li key={r.code} className="flex items-start gap-1.5 text-[11px] leading-tight">
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tone(r.category) }} aria-hidden />
                                  <span className="text-text-secondary">{r.name}</span>
                                </li>
                              ))}
                            </ul>
                            {!holiday && releases.length === 0 && (
                              <p className="mt-1.5 text-[10px] italic text-text-faint">No news</p>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border pt-3">
          {categories.map((c) => (
            <span key={c} className="flex items-center gap-1.5 font-mono text-[10px] text-text-faint">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone(c) }} aria-hidden />
              {c}
            </span>
          ))}
          <span className="ml-auto text-[10px] text-text-faint">Dates only — no times or impact ratings in the feed. Holiday = NYSE closed.</span>
        </div>
      </div>

      {/* Day note sidebar */}
      <aside className="h-fit border border-border bg-bg-elevated p-4 xl:sticky xl:top-10">
        <p className="micro-label mb-1">Day note — {noteDay}</p>
        <p className="mb-3 text-[11px] text-text-faint">How is this day going to behave? Private — workspace only.</p>
        <DayNoteEditor key={noteDay} date={noteDay} initial={notes[noteDay] ?? ""} />
      </aside>
    </div>
  );
}
