/**
 * XOOMAR Economic Calendar — server-side only.
 * Free JSON API, no key required (10 req/min/IP; we cache 1h anyway).
 * https://xoomar.com/markets/api/calendar — attribution "Data: XOOMAR" required.
 */

export interface EconRow {
  code: string; // source + eventName slug — stable key
  name: string; // eventName
  source: string; // bls, fed, bea, census, eia, …
  importance: "high" | "med" | "low";
  scheduledAt: string; // ISO UTC
  date: string; // ET date for calendar grouping
  periodLabel: string | null;
  previous: string | null;
  forecast: string | null;
  actual: string | null;
  unit: string;
  released: boolean;
  daysUntil: number | null;
}

interface XoomarRow {
  source: string;
  eventName: string;
  importance: "high" | "med" | "low";
  scheduledAt: string;
  periodLabel: string | null;
  previous: string | null;
  forecast: string | null;
  actual: string | null;
  unit: string;
}

const ENDPOINT = "https://xoomar.com/api/markets/calendar";

const SOURCE_LABELS: Record<string, string> = {
  bls: "BLS",
  fed: "FED",
  bea: "BEA",
  census: "Census",
  eia: "EIA",
  treasury: "Treasury",
  usda: "USDA",
  ism: "ISM",
  umich: "UoM",
};

export function sourceLabel(s: string) {
  return SOURCE_LABELS[s] ?? s.toUpperCase();
}

function etDate(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
}

export function etTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(iso)) + " ET";
}

export interface EconCalendarParams {
  from?: string; // YYYY-MM-DD
  to?: string;
  importance?: "high" | "med" | "low";
}

/** Fetch + normalize. `importance` is a single-value param upstream; filter client-side for multi. */
export async function fetchEconCalendar(params: EconCalendarParams = {}): Promise<EconRow[]> {
  const qs = new URLSearchParams();
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.importance) qs.set("importance", params.importance);

  try {
    const res = await fetch(`${ENDPOINT}?${qs}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: XoomarRow[] };
    const rows = Array.isArray(json.data) ? json.data : [];
    const today = new Date().toISOString().slice(0, 10);
    return rows.map((r) => {
      const date = etDate(r.scheduledAt);
      const diff = Math.round((new Date(date + "T00:00:00Z").getTime() - new Date(today + "T00:00:00Z").getTime()) / 86400000);
      return {
        code: `${r.source}:${r.eventName}`,
        name: r.eventName,
        source: r.source,
        importance: r.importance,
        scheduledAt: r.scheduledAt,
        date,
        periodLabel: r.periodLabel,
        previous: r.previous,
        forecast: r.forecast,
        actual: r.actual,
        unit: r.unit,
        released: r.actual !== null,
        daysUntil: diff,
      };
    });
  } catch {
    return [];
  }
}

export const toISODate = (d: Date) => d.toISOString().slice(0, 10);
