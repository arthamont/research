/**
 * US market holidays (NYSE), computed deterministically.
 * Returns a map of "YYYY-MM-DD" → label for observed holidays.
 */

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function nthWeekday(year: number, month: number, weekday: number, n: number) {
  const d = new Date(Date.UTC(year, month, 1));
  const offset = (weekday - d.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(year, month, 1 + offset + (n - 1) * 7));
}

function lastWeekday(year: number, month: number, weekday: number) {
  const d = new Date(Date.UTC(year, month + 1, 0));
  const offset = (d.getUTCDay() - weekday + 7) % 7;
  return new Date(Date.UTC(year, month + 1, -offset));
}

/** Observed: Sat → Fri, Sun → Mon. */
function observed(year: number, month: number, day: number) {
  const d = new Date(Date.UTC(year, month, day));
  const dow = d.getUTCDay();
  if (dow === 6) d.setUTCDate(d.getUTCDate() - 1);
  else if (dow === 0) d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

/** Anonymous Gregorian Easter → Good Friday (NYSE closed). */
function goodFriday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  const gf = new Date(Date.UTC(year, month, day - 2));
  return gf;
}

export function usMarketHolidays(year: number): Map<string, string> {
  const map = new Map<string, string>();
  const add = (d: Date, label: string) => map.set(iso(d), label);

  add(observed(year, 0, 1), "New Year's Day");
  add(nthWeekday(year, 0, 1, 3), "MLK Jr. Day");
  add(nthWeekday(year, 1, 1, 3), "Washington's Birthday");
  add(goodFriday(year), "Good Friday");
  add(lastWeekday(year, 4, 1), "Memorial Day");
  add(observed(year, 5, 19), "Juneteenth");
  add(observed(year, 6, 4), "Independence Day");
  add(nthWeekday(year, 8, 1, 1), "Labor Day");
  add(nthWeekday(year, 10, 4, 4), "Thanksgiving");
  add(observed(year, 11, 25), "Christmas Day");

  return map;
}

/** Weekday (Mon–Fri) dates of a calendar month, grouped by week. */
export function monthWeeks(year: number, month: number): string[][] {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const weeks: string[][] = [];
  let current: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(Date.UTC(year, month, d));
    const dow = date.getUTCDay();
    if (dow === 1 || current.length === 0) {
      if (current.length) weeks.push(current);
      current = [];
    }
    if (dow >= 1 && dow <= 5) current.push(iso(date));
  }
  if (current.length) weeks.push(current);
  return weeks;
}

const HEADLINE_KEYWORDS: [RegExp, string][] = [
  [/non-?farm|nfp|employment situation/i, "NFP week"],
  [/\bCPI\b|consumer price/i, "CPI week"],
  [/\bPPI\b|producer price/i, "PPI week"],
  [/FOMC|federal funds|fed rate/i, "FOMC week"],
  [/\bGDP\b/i, "GDP week"],
  [/\bPCE\b|personal consumption/i, "PCE week"],
  [/retail sales/i, "Retail sales week"],
  [/ISM/i, "ISM week"],
];

/** Picks a headline name for a week from its releases, like the reference's "NFP week". */
export function weekHeadline(names: string[]): string {
  const joined = names.join(" ");
  for (const [re, label] of HEADLINE_KEYWORDS) if (re.test(joined)) return label;
  return "";
}
