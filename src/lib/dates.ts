/**
 * Date-keyed records (plans, notes, checklist entries, reviews) are stored at
 * UTC midnight so the calendar date is unambiguous across timezones.
 * Always convert user-facing "YYYY-MM-DD" strings through utcDay() —
 * never `new Date(str)` + `setHours(0,0,0,0)` (that mixes UTC parse with
 * local-midnight snap and produces off-by-one dates outside UTC).
 */

/** "YYYY-MM-DD" → Date at UTC midnight. */
export function utcDay(dateStr: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return isNaN(d.getTime()) ? null : d;
}

/** Today's local date as "YYYY-MM-DD" (the day the user sees). */
export function localTodayStr(): string {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** Local midnight of today — for timestamp-range queries ("trades opened today"). */
export function localMidnight(d = new Date()): Date {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  return t;
}
