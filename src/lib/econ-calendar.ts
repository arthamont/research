/**
 * BusinessQuant Economic Calendar — server-side only.
 * Free API: https://businessquant.com — set BQ_API_KEY in .env.
 * Never import this file from client components (the key must stay server-side).
 */

export interface BqCalendarRow {
  indicator_id: number;
  code: string;
  name: string;
  category: string;
  direction: string;
  freq: string;
  freq_long: string;
  seasonal_adj: string;
  display_unit: string;
  decimals: number;
  last_release: string | null;
  next_release: string | null;
  days_until_next: number | null;
  release_state: "upcoming" | "released" | string;
  latest_date: string | null;
  latest_value: number | null;
  prior_value: number | null;
  change_abs: number | null;
  change_pct: number | null;
}

interface BqCalendarResponse {
  total_indicators: number;
  data: BqCalendarRow[];
}

const ENDPOINT = "https://data.businessquant.com/calendar/economic";

export interface EconCalendarParams {
  category?: string;
  release_state?: "upcoming" | "released";
  code?: string;
  from_date?: string; // YYYY-MM-DD — must be paired with till_date
  till_date?: string;
}

export function hasEconKey() {
  return !!process.env.BQ_API_KEY;
}

export async function fetchEconCalendar(params: EconCalendarParams = {}): Promise<BqCalendarRow[]> {
  const key = process.env.BQ_API_KEY;
  if (!key) return [];

  const qs = new URLSearchParams({ api_key: key });
  if (params.category) qs.set("category", params.category);
  if (params.release_state) qs.set("release_state", params.release_state);
  if (params.code) qs.set("code", params.code);
  if (params.from_date && params.till_date) {
    qs.set("from_date", params.from_date);
    qs.set("till_date", params.till_date);
  }

  try {
    const res = await fetch(`${ENDPOINT}?${qs}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as BqCalendarResponse;
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export const toISODate = (d: Date) => d.toISOString().slice(0, 10);
