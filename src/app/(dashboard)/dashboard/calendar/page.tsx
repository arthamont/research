import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { PageHeader, Widget } from "@/components/dashboard/widgets";
import { Tag } from "@/components/ui/primitives";
import { formatCurrency, formatR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const METRICS = [
  { id: "r", label: "Daily R" },
  { id: "trades", label: "Trades" },
  { id: "adherence", label: "Adherence" },
] as const;

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string; metric?: string; market?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  const now = new Date();
  const [py, pm] = (params.month ?? "").split("-").map(Number);
  const year = Number.isFinite(py) && py > 2000 ? py : now.getFullYear();
  const month = Number.isFinite(pm) && pm >= 1 && pm <= 12 ? pm - 1 : now.getMonth();
  const metric = params.metric === "trades" || params.metric === "adherence" ? params.metric : "r";
  const market = ["FUTURES", "FOREX", "INDIA"].includes(params.market ?? "") ? params.market : undefined;

  const monthStart = new Date(Date.UTC(year, month, 1));
  const monthEnd = new Date(Date.UTC(year, month + 1, 1));

  const selectedDate = params.day ? new Date(params.day) : null;
  const [trades, reviews, dayNote] = await Promise.all([
    db.trade.findMany({
      where: {
        userId: user.id,
        status: "CLOSED",
        closedAt: { gte: monthStart, lt: monthEnd },
        ...(market ? { market: market as never } : {}),
      },
      include: { instrument: true, setup: true },
    }),
    db.dailyReview.findMany({
      where: { userId: user.id, date: { gte: monthStart, lt: monthEnd } },
      select: { date: true },
    }),
    selectedDate && !isNaN(selectedDate.getTime())
      ? db.marketNote.findFirst({
          where: { userId: user.id, date: new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate())) },
        })
      : Promise.resolve(null),
  ]);

  const reviewDays = new Set(reviews.map((r) => r.date.toISOString().slice(0, 10)));

  // aggregate per day
  const days = new Map<string, { trades: number; pnl: number; r: number; violations: number; hasReview: boolean }>();
  for (const t of trades) {
    if (!t.closedAt) continue;
    const key = t.closedAt.toISOString().slice(0, 10);
    const d = days.get(key) ?? { trades: 0, pnl: 0, r: 0, violations: 0, hasReview: false };
    d.trades += 1;
    d.pnl += t.netPnl ? Number(t.netPnl) : 0;
    d.r += t.realizedR ? Number(t.realizedR) : 0;
    if (t.ruleCompliant === false) d.violations += 1;
    days.set(key, d);
  }
  for (const k of days.keys()) days.get(k)!.hasReview = reviewDays.has(k);

  // selected day detail
  const selectedDay = params.day;
  const dayTrades = selectedDay
    ? trades.filter((t) => t.closedAt && t.closedAt.toISOString().slice(0, 10) === selectedDay)
    : [];

  // calendar grid — week starts Monday
  const firstDow = (monthStart.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`),
  ];

  const prev = new Date(Date.UTC(year, month - 1, 1));
  const next = new Date(Date.UTC(year, month + 1, 1));
  const fmt = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  const monthLabel = monthStart.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const base = `/dashboard/calendar?month=${fmt(monthStart)}${metric !== "r" ? `&metric=${metric}` : ""}${market ? `&market=${market}` : ""}`;

  function cellTone(day: string) {
    const d = days.get(day);
    if (!d) return "bg-bg text-text-faint";
    if (metric === "trades") return d.trades > 0 ? "bg-accent-soft text-text" : "bg-bg text-text-faint";
    if (metric === "adherence") return d.violations > 0 ? "bg-short/15 text-short" : "bg-long/10 text-long";
    return d.r > 0 ? "bg-long/10 text-long" : d.r < 0 ? "bg-short/15 text-short" : "bg-bg text-text-faint";
  }

  return (
    <>
      <PageHeader title="Trading calendar" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/calendar?month=${fmt(prev)}&metric=${metric}${market ? `&market=${market}` : ""}`} className="border border-border px-3 py-1.5 font-mono text-xs text-text-secondary hover:border-accent" aria-label="Previous month">←</Link>
          <h2 className="text-lg font-semibold tracking-tight">{monthLabel}</h2>
          <Link href={`/dashboard/calendar?month=${fmt(next)}&metric=${metric}${market ? `&market=${market}` : ""}`} className="border border-border px-3 py-1.5 font-mono text-xs text-text-secondary hover:border-accent" aria-label="Next month">→</Link>
        </div>
        <div className="flex gap-2">
          {METRICS.map((m) => (
            <Link
              key={m.id}
              href={`/dashboard/calendar?month=${fmt(monthStart)}&metric=${m.id}${market ? `&market=${market}` : ""}`}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${metric === m.id ? "border-accent text-accent-text" : "border-border text-text-secondary hover:border-border-strong"}`}
            >
              {m.label}
            </Link>
          ))}
          {["FUTURES", "FOREX", "INDIA"].map((mk) => (
            <Link
              key={mk}
              href={`/dashboard/calendar?month=${fmt(monthStart)}&metric=${metric}${market === mk ? "" : `&market=${mk}`}`}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${market === mk ? "border-accent text-accent-text" : "border-border text-text-secondary hover:border-border-strong"}`}
            >
              {mk.slice(0, 3)}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="grid grid-cols-7 gap-px border border-border bg-border">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d} className="bg-bg-elevated py-2 text-center font-mono text-[10px] uppercase tracking-wider text-text-faint">
                {d}
              </div>
            ))}
            {cells.map((day, i) =>
              day === null ? (
                <div key={`x${i}`} className="min-h-16 bg-bg sm:min-h-20" />
              ) : (
                <Link
                  key={day}
                  href={`${base}&day=${day}`}
                  className={`min-h-16 p-2 transition-colors sm:min-h-20 ${cellTone(day)} ${selectedDay === day ? "outline outline-1 outline-accent" : "hover:bg-surface"}`}
                >
                  <p className="numeric text-[11px]">{Number(day.slice(-2))}</p>
                  {days.get(day) && (
                    <div className="mt-1">
                      <p className="font-mono text-[10px] leading-tight">{days.get(day)!.trades}t</p>
                      {metric === "r" && <p className="numeric text-[10px] leading-tight">{formatR(days.get(day)!.r)}</p>}
                      {days.get(day)!.hasReview && <p className="text-[9px] text-text-faint">reviewed</p>}
                    </div>
                  )}
                </Link>
              )
            )}
          </div>
          <p className="mt-3 text-[11px] text-text-faint">
            Neutral by default — switch the metric to view trades or rule adherence instead of R.
          </p>
        </div>

        <Widget title={selectedDay ? `Day — ${selectedDay}` : "Select a day"}>
          {dayNote && (
            <p className="mb-4 whitespace-pre-wrap border-b border-border pb-3 font-mono text-[11px] leading-relaxed text-text-secondary">
              {dayNote.content}
            </p>
          )}
          {!selectedDay ? (
            <p className="text-sm text-text-faint">Choose a day to inspect its trades and review.</p>
          ) : dayTrades.length === 0 && !dayNote ? (
            <p className="text-sm text-text-faint">No closed trades on this day.</p>
          ) : (
            <ul className="space-y-3">
              {dayTrades.map((t) => (
                <li key={t.id} className="border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{t.instrument.symbol}</span>
                    <span className={`font-mono text-[10px] ${t.direction === "LONG" ? "text-long" : "text-short"}`}>{t.direction}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
                    <span className="numeric">{t.netPnl ? formatCurrency(t.netPnl.toString(), t.currency) : "—"}</span>
                    <span className="numeric">{formatR(t.realizedR?.toString() ?? null)}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {t.setup && <Tag>{t.setup.name}</Tag>}
                    <Link href={`/dashboard/journal/${t.id}`} className="ml-auto font-mono text-[10px] uppercase text-text-faint hover:text-accent-text">
                      open →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Widget>
      </div>
    </>
  );
}
