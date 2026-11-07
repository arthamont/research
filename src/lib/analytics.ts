/** Trading performance analytics over closed trades. All formulas documented inline. */
import type { Trade } from "@prisma/client";

const n = (v: unknown) => (v == null ? null : Number(v));

export interface ClosedTrade {
  netPnl: number | null;
  realizedR: number | null;
  closedAt: Date | null;
  ruleCompliant: boolean | null;
  instrument: string;
  market: string;
  session: string | null;
  setup: string | null;
}

export function toClosedTrade(t: Trade & { instrument: { symbol: string }; setup: { name: string } | null }): ClosedTrade {
  return {
    netPnl: n(t.netPnl),
    realizedR: n(t.realizedR),
    closedAt: t.closedAt,
    ruleCompliant: t.ruleCompliant,
    instrument: t.instrument.symbol,
    market: t.market,
    session: t.session,
    setup: t.setup?.name ?? null,
  };
}

export interface Analytics {
  count: number;
  wins: number;
  losses: number;
  winRate: number | null; // wins / closed
  avgWin: number | null;
  avgLoss: number | null;
  avgR: number | null; // mean realizedR
  expectancy: number | null; // mean netPnl per trade
  expectancyR: number | null; // mean R per trade
  profitFactor: number | null; // grossWins / |grossLosses|
  totalPnl: number;
  maxDrawdown: number | null; // peak-to-trough of cumulative equity
  ruleAdherence: number | null; // % trades flagged compliant
  equityCurve: { date: string; equity: number; pnl: number }[];
}

export function analyze(trades: ClosedTrade[]): Analytics {
  const withPnl = trades.filter((t) => t.netPnl !== null);
  const wins = withPnl.filter((t) => t.netPnl! > 0);
  const losses = withPnl.filter((t) => t.netPnl! < 0);

  const grossWins = wins.reduce((s, t) => s + t.netPnl!, 0);
  const grossLosses = Math.abs(losses.reduce((s, t) => s + t.netPnl!, 0));
  const totalPnl = withPnl.reduce((s, t) => s + t.netPnl!, 0);
  const rValues = trades.map((t) => t.realizedR).filter((r): r is number => r !== null);

  // equity curve ordered by close time
  const sorted = [...withPnl].sort((a, b) => (a.closedAt?.getTime() ?? 0) - (b.closedAt?.getTime() ?? 0));
  let equity = 0;
  let peak = 0;
  let maxDD = 0;
  const equityCurve = sorted.map((t) => {
    equity += t.netPnl!;
    peak = Math.max(peak, equity);
    maxDD = Math.max(maxDD, peak - equity);
    return {
      date: t.closedAt ? t.closedAt.toISOString().slice(0, 10) : "",
      equity: Math.round(equity * 100) / 100,
      pnl: t.netPnl!,
    };
  });

  const flagged = trades.filter((t) => t.ruleCompliant !== null);
  const compliant = flagged.filter((t) => t.ruleCompliant === true);

  const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);

  return {
    count: trades.length,
    wins: wins.length,
    losses: losses.length,
    winRate: withPnl.length ? wins.length / withPnl.length : null,
    avgWin: avg(wins.map((t) => t.netPnl!)),
    avgLoss: avg(losses.map((t) => t.netPnl!)),
    avgR: avg(rValues),
    expectancy: withPnl.length ? totalPnl / withPnl.length : null,
    expectancyR: avg(rValues),
    profitFactor: grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? Infinity : null,
    totalPnl,
    maxDrawdown: withPnl.length ? maxDD : null,
    ruleAdherence: flagged.length ? compliant.length / flagged.length : null,
    equityCurve,
  };
}

/** Group analytics by a dimension (instrument, session, setup, market). */
export function groupAnalytics(trades: ClosedTrade[], key: (t: ClosedTrade) => string | null) {
  const groups = new Map<string, ClosedTrade[]>();
  for (const t of trades) {
    const k = key(t) ?? "Unspecified";
    groups.set(k, [...(groups.get(k) ?? []), t]);
  }
  return [...groups.entries()]
    .map(([name, ts]) => ({ name, ...analyze(ts) }))
    .sort((a, b) => b.count - a.count);
}

/** Daily aggregation for the calendar view. */
export function dailyAggregates(trades: ClosedTrade[]) {
  const days = new Map<string, { trades: number; pnl: number; r: number[]; violations: number }>();
  for (const t of trades) {
    if (!t.closedAt) continue;
    const day = t.closedAt.toISOString().slice(0, 10);
    const d = days.get(day) ?? { trades: 0, pnl: 0, r: [], violations: 0 };
    d.trades += 1;
    d.pnl += t.netPnl ?? 0;
    if (t.realizedR !== null) d.r.push(t.realizedR);
    if (t.ruleCompliant === false) d.violations += 1;
    days.set(day, d);
  }
  return days;
}
