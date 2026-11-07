import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { getSessionStatuses } from "@/lib/sessions";
import { fetchEconCalendar } from "@/lib/econ-calendar";
import { SessionMonitor } from "@/components/dashboard/session-monitor";
import { Widget, Metric, PageHeader } from "@/components/dashboard/widgets";
import { ButtonLink, Tag } from "@/components/ui/primitives";
import { formatDate, formatR, formatCurrency } from "@/lib/utils";
import { toClosedTrade, analyze } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = today.toISOString().slice(0, 10);
  const in14 = new Date(today);
  in14.setUTCDate(in14.getUTCDate() + 14);
  const in14Str = in14.toISOString().slice(0, 10);

  const [settings, plan, todayTrades, recentTrades, events, checklistEntries, closedTrades, watchlist, dayNote] =
    await Promise.all([
      db.userSettings.findUnique({ where: { userId: user.id } }),
      db.tradingPlan.findUnique({ where: { userId_date: { userId: user.id, date: today } } }),
      db.trade.findMany({ where: { userId: user.id, openedAt: { gte: today } }, include: { instrument: true } }),
      db.trade.findMany({
        where: { userId: user.id },
        orderBy: { openedAt: "desc" },
        take: 5,
        include: { instrument: true, setup: true },
      }),
      fetchEconCalendar({ from: todayStr, to: in14Str }),
      db.checklistEntry.findMany({
        where: { userId: user.id, date: today },
        include: { template: true },
      }),
      db.trade.findMany({
        where: { userId: user.id, status: "CLOSED" },
        include: { instrument: true, setup: true },
        orderBy: { closedAt: "desc" },
        take: 50,
      }),
      db.watchlistItem.findMany({ where: { userId: user.id }, include: { instrument: true }, take: 4 }),
      db.marketNote.findFirst({ where: { userId: user.id, date: today } }),
    ]);

  const sessions = getSessionStatuses();
  const analytics = analyze(closedTrades.map(toClosedTrade));
  const todayPnl = todayTrades.reduce((s, t) => s + (t.netPnl ? Number(t.netPnl) : 0), 0);
  const keyLevels = (plan?.keyLevels as { instrument?: string; price?: number; note?: string }[] | null) ?? [];
  const checklistDone = checklistEntries.reduce((s, e) => s + (Array.isArray(e.checked) ? e.checked.length : 0), 0);
  const checklistTotal = checklistEntries.reduce(
    (s, e) => s + (Array.isArray(e.template.items) ? e.template.items.length : 0),
    0
  );

  return (
    <>
      <PageHeader title={`${formatDate(new Date())}`}>
        <ButtonLink href="/dashboard/journal/new" variant="primary">
          + New trade
        </ButtonLink>
        <ButtonLink href="/dashboard/reviews" variant="secondary">
          Daily review
        </ButtonLink>
      </PageHeader>

      <Widget title="Sessions" className="mb-4">
        <SessionMonitor initial={sessions} />
      </Widget>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Daily plan */}
        <Widget
          title="Today's plan"
          action={<Link href="/dashboard/reviews" className="font-mono text-[10px] uppercase text-text-faint hover:text-accent-text">edit</Link>}
        >
          {plan ? (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-text-secondary">{plan.narrative ?? "—"}</p>
              {keyLevels.length > 0 && (
                <ul className="space-y-1">
                  {keyLevels.slice(0, 4).map((l, i) => (
                    <li key={i} className="flex justify-between font-mono text-[11px] text-text-secondary">
                      <span>{l.instrument}</span>
                      <span className="numeric">{l.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-faint">
              No plan written for today.{" "}
              <Link href="/dashboard/reviews" className="text-accent-text underline-offset-4 hover:underline">
                Write one →
              </Link>
            </p>
          )}
        </Widget>

        {/* Risk monitor */}
        <Widget title="Risk monitor">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Trades today</span>
              <span className={`numeric ${todayTrades.length > (settings?.maxTradesPerDay ?? 1) ? "text-short" : ""}`}>
                {todayTrades.length} / {settings?.maxTradesPerDay ?? "—"}
              </span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Daily P&L</span>
              <span className={`numeric ${todayPnl > 0 ? "text-long" : todayPnl < 0 ? "text-short" : ""}`}>
                {formatCurrency(todayPnl, "USD")}
              </span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Target R:R</span>
              <span className="numeric">1:{settings?.targetRiskReward?.toString() ?? "—"}</span>
            </div>
            {todayTrades.length > (settings?.maxTradesPerDay ?? 1) && (
              <p className="border border-short/40 bg-short/10 px-2 py-1.5 text-[11px] text-short">
                Daily trade limit exceeded — rule violation logged.
              </p>
            )}
          </div>
        </Widget>

        {/* Execution score */}
        <Widget title="Execution — last 50 closed">
          <div className="grid grid-cols-3 gap-4">
            <Metric label="Win rate" value={analytics.winRate !== null ? `${Math.round(analytics.winRate * 100)}%` : "—"} />
            <Metric label="Avg R" value={analytics.avgR !== null ? formatR(analytics.avgR) : "—"} />
            <Metric
              label="Adherence"
              value={analytics.ruleAdherence !== null ? `${Math.round(analytics.ruleAdherence * 100)}%` : "—"}
            />
          </div>
        </Widget>

        {/* Checklist */}
        <Widget title="Checklist — today">
          {checklistEntries.length === 0 ? (
            <p className="text-sm text-text-faint">
              No checklist started.{" "}
              <Link href="/dashboard/reviews" className="text-accent-text underline-offset-4 hover:underline">
                Begin →
              </Link>
            </p>
          ) : (
            <div>
              <p className="numeric text-2xl">
                {checklistDone}
                <span className="text-sm text-text-faint"> / {checklistTotal}</span>
              </p>
              <div className="mt-2 h-1 w-full bg-border">
                <div
                  className="h-1 bg-accent"
                  style={{ width: `${checklistTotal ? (checklistDone / checklistTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </Widget>

        {/* Watchlist */}
        <Widget
          title="Watchlist"
          action={<Link href="/dashboard/watchlist" className="font-mono text-[10px] uppercase text-text-faint hover:text-accent-text">all</Link>}
        >
          {watchlist.length === 0 ? (
            <p className="text-sm text-text-faint">Nothing watched.</p>
          ) : (
            <ul className="space-y-2">
              {watchlist.map((w) => (
                <li key={w.id} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs">{w.instrument.symbol}</span>
                  <span
                    className={`font-mono text-[10px] uppercase ${
                      w.bias === "BULLISH" ? "text-long" : w.bias === "BEARISH" ? "text-short" : "text-text-faint"
                    }`}
                  >
                    {w.bias}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Widget>

        {/* Events (BusinessQuant feed) */}
        <Widget
          title="Upcoming releases"
          action={<Link href="/dashboard/economic" className="font-mono text-[10px] uppercase text-text-faint hover:text-accent-text">calendar</Link>}
        >
          {events.length === 0 ? (
            <p className="text-sm text-text-faint">Nothing scheduled in the next 14 days.</p>
          ) : (
            <ul className="space-y-2">
              {events
                .filter((e) => !e.released && e.importance !== "low")
                .slice(0, 4)
                .map((e) => (
                  <li key={e.code} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${e.importance === "high" ? "bg-short" : "bg-warning"}`} aria-hidden />
                      <span className="truncate text-text-secondary">{e.name}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-text-faint">
                      {e.daysUntil !== null ? (e.daysUntil === 0 ? "today" : `${e.daysUntil}d`) : e.date}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </Widget>
      </div>

      {/* Day note */}
      {dayNote && (
        <Widget title={`Day note — ${todayStr}`} className="mt-4">
          <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-text-secondary">{dayNote.content}</p>
        </Widget>
      )}

      {/* Recent journal activity */}
      <Widget
        title="Recent journal activity"
        className="mt-4"
        action={<Link href="/dashboard/journal" className="font-mono text-[10px] uppercase text-text-faint hover:text-accent-text">open journal</Link>}
      >
        {recentTrades.length === 0 ? (
          <p className="text-sm text-text-faint">No trades yet — your journal starts with the first execution.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recentTrades.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-[10px] uppercase ${t.direction === "LONG" ? "text-long" : "text-short"}`}>
                    {t.direction}
                  </span>
                  <span className="font-mono text-xs">{t.instrument.symbol}</span>
                  <span className="hidden text-xs text-text-faint sm:inline">{formatDate(t.openedAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  {t.setup && <Tag>{t.setup.name}</Tag>}
                  <span className="numeric text-xs">{formatR(t.realizedR?.toString() ?? null)}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${t.status === "OPEN" ? "bg-info" : t.status === "CLOSED" ? "bg-border-strong" : "bg-warning"}`} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Widget>
    </>
  );
}
