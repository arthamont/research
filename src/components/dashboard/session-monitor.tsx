"use client";

import { useEffect, useState } from "react";
import { getSessionStatuses, formatCountdown, tzMinutes, SESSIONS, type SessionStatus } from "@/lib/sessions";

const TZS: string[] =
  typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : ["Asia/Kolkata", "America/New_York", "UTC"];

const NY_OFFSETS = [
  { value: "Etc/GMT+4", label: "NY · UTC-4 (EDT)" },
  { value: "Etc/GMT+5", label: "NY · UTC-5 (EST)" },
];

const clock = (now: Date, tz: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now);

const abbr = (now: Date, tz: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" })
    .formatToParts(now)
    .find((p) => p.type === "timeZoneName")?.value ?? tz;

function tzOffset(now: Date, tz: string): string {
  try {
    const v = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value;
    return v ?? "";
  } catch {
    return "";
  }
}

/** "Asia/Kolkata" → "Kolkata (UTC+5:30)" — city name + offset so it's searchable. */
function tzLabel(now: Date, tz: string): string {
  const city = tz.split("/").pop()!.replace(/_/g, " ");
  const off = tzOffset(now, tz).replace("GMT", "UTC");
  return off ? `${city} (${off})` : city;
}

/** Offset in minutes, for sorting negative → positive. */
function tzOffsetMin(now: Date, tz: string): number {
  const m = /GMT([+-])(\d+)(?::(\d+))?/.exec(tzOffset(now, tz));
  return m ? (m[1] === "-" ? -1 : 1) * (parseInt(m[2], 10) * 60 + parseInt(m[3] ?? "0", 10)) : 0;
}

export function SessionMonitor({ initial }: { initial: SessionStatus[] }) {
  const [statuses, setStatuses] = useState(initial);
  const [now, setNow] = useState(() => new Date());
  const [nyTz, setNyTz] = useState("Etc/GMT+5");
  const [localTz, setLocalTz] = useState("Asia/Kolkata");

  useEffect(() => {
    const id = setInterval(() => {
      const t = new Date();
      setNow(t);
      setStatuses(getSessionStatuses(t));
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const sel =
    "border border-border bg-surface px-2 py-1 font-mono text-[10px] text-text-secondary focus:border-accent focus:outline-none";

  return (
    <div>
      {/* Timezone row — NY offset + local tz */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="numeric text-sm text-text">
          <span className="micro-label mr-1.5">NY</span>
          {clock(now, nyTz)}
        </span>
        <span className="text-text-faint">·</span>
        <span className="numeric text-sm text-text">
          <span className="micro-label mr-1.5">{abbr(now, localTz)}</span>
          {clock(now, localTz)}
        </span>
        <span className="flex-1" />
        <select value={nyTz} onChange={(e) => setNyTz(e.target.value)} className={sel} aria-label="New York offset">
          {NY_OFFSETS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select value={localTz} onChange={(e) => setLocalTz(e.target.value)} className={`${sel} max-w-52`} aria-label="Local timezone">
          {[...TZS].sort((a, b) => tzOffsetMin(now, a) - tzOffsetMin(now, b) || tzLabel(now, a).localeCompare(tzLabel(now, b))).map((tz) => (
            <option key={tz} value={tz}>{tzLabel(now, tz)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statuses.map((s) => {
          const def = SESSIONS.find((d) => d.id === s.id)!;
          const curMin = tzMinutes(now, def.tz);
          const toLocal = (mins: number) => clock(new Date(now.getTime() + (mins - curMin) * 60000), localTz);
          return (
          <div key={s.id} className="border border-border bg-bg p-3.5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary">{s.label}</p>
              <span className={`h-1.5 w-1.5 rounded-full ${s.isOpen ? "bg-long" : "bg-border-strong"}`} aria-hidden />
            </div>
            <p className="numeric mt-1 font-mono text-[10px] text-text-faint">
              {toLocal(def.openMin)}–{toLocal(def.closeMin)} {abbr(now, localTz)}
            </p>
            <p className={`mt-2 font-mono text-[10px] uppercase tracking-wider ${s.isOpen ? "text-long" : "text-text-faint"}`}>
              {s.isOpen ? "Open" : "Closed"}
            </p>
            <div className="mt-2 h-0.5 w-full bg-border">
              <div className="h-0.5 bg-accent transition-all" style={{ width: `${s.progress * 100}%` }} />
            </div>
            <p className="numeric mt-2 text-[11px] text-text-faint">
              {s.isOpen
                ? `closes in ${formatCountdown(s.minutesUntilClose)}`
                : `opens in ${formatCountdown(s.minutesUntilOpen)}`}
            </p>
            <p className="numeric mt-0.5 text-[10px] text-text-faint/70">{s.localTime} local</p>
          </div>
          );
        })}
      </div>
    </div>
  );
}
