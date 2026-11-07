"use client";

import { useMemo, useState } from "react";
import type { EconRow } from "@/lib/econ-calendar";
import { etTime, sourceLabel } from "@/lib/econ-calendar";
import { usMarketHolidays, monthWeeks, weekHeadline } from "@/lib/holidays";
import { DayNoteEditor } from "./day-note";
import { cn } from "@/lib/utils";

const chip = (active: boolean) =>
  cn(
    "border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
    active ? "border-accent text-accent-text" : "border-border text-text-secondary hover:border-border-strong"
  );

const IMPACT_TONE: Record<string, string> = {
  high: "var(--short)",
  med: "#e8833a",
  low: "var(--text-faint)",
};

const IMPACT_LABEL: Record<string, string> = { high: "High", med: "Med", low: "Low" };

function fmtCell(v: string | number | null) {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

export function EconCalendarView({ rows, noteDate, notes }: { rows: EconRow[]; noteDate: string; notes: Record<string, string> }) {
  const [importance, setImportance] = useState<"high" | "med" | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [noteDay, setNoteDay] = useState(noteDate);

  const [y0, m0] = noteDate.split("-").map(Number);
  const [view, setView] = useState({ year: y0, month: m0 - 1 });

  const sources = useMemo(() => [...new Set(rows.map((r) => r.source))].sort(), [rows]);
  const holidays = useMemo(() => usMarketHolidays(view.year), [view.year]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (importance && r.importance !== importance) return false;
      if (!importance && r.importance === "low") return false; // default: high + medium only
      if (source && r.source !== source) return false;
      if (needle && !r.name.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [rows, importance, source, q]);

  const byDay = useMemo(() => {
    const map = new Map<string, EconRow[]>();
    for (const r of filtered) {
      map.set(r.date, [...(map.get(r.date) ?? []), r]);
    }
    // chronological within the day
    for (const list of map.values()) list.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
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
            placeholder="Search releases…"
            className="w-52 border border-border bg-surface px-3 py-1.5 text-xs text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
          />
        </div>
        <div className="mb-6 flex flex-wrap gap-1.5">
          {(["high", "med"] as const).map((i) => (
            <button key={i} onClick={() => setImportance(importance === i ? null : i)} className={chip(importance === i)}>
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full" style={{ background: IMPACT_TONE[i] }} aria-hidden />
              {i === "med" ? "medium" : i}
            </button>
          ))}
          <span className="mx-1 w-px self-stretch bg-border" aria-hidden />
          {sources.map((s) => (
            <button key={s} onClick={() => setSource(source === s ? null : s)} className={chip(source === s)}>
              {sourceLabel(s)}
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
                                <li key={r.code + r.scheduledAt} className="flex items-start gap-1.5 text-[11px] leading-tight">
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: IMPACT_TONE[r.importance] }} aria-hidden />
                                  <span className="min-w-0">
                                    <span className="numeric mr-1 text-[9px] text-text-faint">{etTime(r.scheduledAt).replace(" ET", "")}</span>
                                    <span className="text-text-secondary">{r.name}</span>
                                    {r.actual !== null && (
                                      <span className="ml-1 font-mono text-[9px] text-long">{r.actual}{r.unit ? ` ${r.unit.split(",")[0].replace(/[^%\w]/g, "")}` : ""}</span>
                                    )}
                                  </span>
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

        {/* Releases table — clean list for the viewed month */}
        <div className="mt-8 overflow-x-auto">
          <p className="micro-label mb-3">Releases — {monthLabel}</p>
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Date", "Time", "Release", "Period", "Imp", "Previous", "Forecast", "Actual"].map((h) => (
                  <th key={h} className="micro-label pb-2.5 pr-4 font-normal last:text-right">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.flatMap((week) =>
                week.flatMap((day) => {
                  const releases = byDay.get(day) ?? [];
                  return releases.map((r, i) => (
                    <tr key={r.code + r.scheduledAt} className="border-b border-border/50 transition-colors hover:bg-surface">
                      {i === 0 ? (
                        <td rowSpan={releases.length} className="numeric py-2.5 pr-4 align-top text-xs text-text-faint">
                          {new Date(day + "T00:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })}
                        </td>
                      ) : null}
                      <td className="numeric py-2.5 pr-4 text-xs text-text-secondary">{etTime(r.scheduledAt)}</td>
                      <td className="py-2.5 pr-4">
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: IMPACT_TONE[r.importance] }} aria-hidden />
                          <span className="text-text">{r.name}</span>
                          <span className="font-mono text-[9px] uppercase text-text-faint">{sourceLabel(r.source)}</span>
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-text-faint">{r.periodLabel ?? "—"}</td>
                      <td className="py-2.5 pr-4 font-mono text-[10px] uppercase" style={{ color: IMPACT_TONE[r.importance] }}>{IMPACT_LABEL[r.importance]}</td>
                      <td className="numeric py-2.5 pr-4 text-xs text-text-secondary">{fmtCell(r.previous)}</td>
                      <td className="numeric py-2.5 pr-4 text-xs text-text-faint">{fmtCell(r.forecast)}</td>
                      <td className={`numeric py-2.5 pr-0 text-right text-xs ${r.actual !== null ? "text-long" : "text-text-faint"}`}>
                        {fmtCell(r.actual)}{r.actual !== null && r.unit ? <span className="ml-1 text-[9px] text-text-faint">{r.unit.split(",")[0]}</span> : null}
                      </td>
                    </tr>
                  ));
                })
              )}
            </tbody>
          </table>
          {weeks.every((w) => w.every((d) => (byDay.get(d) ?? []).length === 0)) && (
            <p className="border border-dashed border-border px-8 py-10 text-center text-sm text-text-faint">
              No releases this month (or outside the feed window).
            </p>
          )}
        </div>

        {/* Legend + attribution */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border pt-3">
          {(["high", "med", "low"] as const).map((i) => (
            <span key={i} className="flex items-center gap-1.5 font-mono text-[10px] text-text-faint">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: IMPACT_TONE[i] }} aria-hidden />
              {i === "med" ? "Medium impact" : `${i[0].toUpperCase()}${i.slice(1)} impact`}
            </span>
          ))}
          <span className="font-mono text-[10px] text-text-faint">Holiday = NYSE closed · Times ET</span>
          <a href="https://xoomar.com" target="_blank" rel="noopener noreferrer" className="ml-auto font-mono text-[10px] text-text-faint underline-offset-4 hover:text-accent-text hover:underline">
            Data: XOOMAR
          </a>
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
