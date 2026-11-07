/**
 * Trading session monitor — DST-aware via Intl timezone conversion.
 * Sessions are defined in local exchange time, not fixed UTC offsets.
 */

export interface SessionDef {
  id: string;
  label: string;
  tz: string;
  openMin: number; // minutes after local midnight
  closeMin: number;
}

export const SESSIONS: SessionDef[] = [
  { id: "ASIA", label: "Asia", tz: "Asia/Tokyo", openMin: 9 * 60, closeMin: 15 * 60 }, // equity proxy; forex Asia ≈ 00:00–09:00 UTC
  { id: "LONDON", label: "London", tz: "Europe/London", openMin: 8 * 60, closeMin: 16 * 60 + 30 },
  { id: "NEW_YORK", label: "New York", tz: "America/New_York", openMin: 9 * 60 + 30, closeMin: 16 * 60 },
  { id: "INDIA", label: "India (NSE)", tz: "Asia/Kolkata", openMin: 9 * 60 + 15, closeMin: 15 * 60 + 30 },
];

/** Minutes since midnight in `tz` for instant `now` — used to convert session hours across zones. */
export function tzMinutes(now: Date, tz: string): number {
  return localMinutes(now, tz).minutes;
}

function localMinutes(now: Date, tz: string): { minutes: number; dayKey: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    minutes: parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10),
    dayKey: `${get("year")}-${get("month")}-${get("day")}`,
  };
}

export interface SessionStatus {
  id: string;
  label: string;
  tz: string;
  isOpen: boolean;
  progress: number; // 0–1 through the session
  minutesUntilOpen: number | null;
  minutesUntilClose: number | null;
  localTime: string; // HH:mm in the session's timezone
}

export function getSessionStatuses(now = new Date()): SessionStatus[] {
  return SESSIONS.map((s) => {
    const { minutes } = localMinutes(now, s.tz);
    const isOpen = minutes >= s.openMin && minutes < s.closeMin;
    const span = s.closeMin - s.openMin;
    let minutesUntilOpen: number | null = null;
    let minutesUntilClose: number | null = null;
    if (isOpen) {
      minutesUntilClose = s.closeMin - minutes;
    } else if (minutes < s.openMin) {
      minutesUntilOpen = s.openMin - minutes;
    } else {
      minutesUntilOpen = 24 * 60 - minutes + s.openMin; // next day
    }
    const localTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: s.tz,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(now);
    return {
      id: s.id,
      label: s.label,
      tz: s.tz,
      isOpen,
      progress: isOpen ? Math.min(1, Math.max(0, (minutes - s.openMin) / span)) : 0,
      minutesUntilOpen,
      minutesUntilClose,
      localTime,
    };
  });
}

export function formatCountdown(mins: number | null): string {
  if (mins === null) return "—";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
