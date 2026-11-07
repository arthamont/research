"use client";

import { useEffect, useState } from "react";
import { getSessionStatuses, formatCountdown, type SessionStatus } from "@/lib/sessions";

export function SessionMonitor({ initial }: { initial: SessionStatus[] }) {
  const [statuses, setStatuses] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => setStatuses(getSessionStatuses()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {statuses.map((s) => (
        <div key={s.id} className="border border-border bg-bg p-3.5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary">{s.label}</p>
            <span className={`h-1.5 w-1.5 rounded-full ${s.isOpen ? "bg-long" : "bg-border-strong"}`} aria-hidden />
          </div>
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
      ))}
    </div>
  );
}
