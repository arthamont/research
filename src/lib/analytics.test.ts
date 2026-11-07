import { describe, it, expect } from "vitest";
import { analyze, groupAnalytics, type ClosedTrade } from "./analytics";

const t = (over: Partial<ClosedTrade>): ClosedTrade => ({
  netPnl: 0,
  realizedR: null,
  closedAt: new Date("2026-01-01"),
  ruleCompliant: null,
  instrument: "NQ",
  market: "FUTURES",
  session: null,
  setup: null,
  ...over,
});

describe("analyze", () => {
  const trades = [
    t({ netPnl: 300, realizedR: 3, closedAt: new Date("2026-01-01"), ruleCompliant: true }),
    t({ netPnl: -100, realizedR: -1, closedAt: new Date("2026-01-02"), ruleCompliant: true }),
    t({ netPnl: 200, realizedR: 2, closedAt: new Date("2026-01-03"), ruleCompliant: false }),
  ];

  it("computes win rate, expectancy, profit factor", () => {
    const a = analyze(trades);
    expect(a.count).toBe(3);
    expect(a.wins).toBe(2);
    expect(a.losses).toBe(1);
    expect(a.winRate).toBeCloseTo(2 / 3, 3);
    expect(a.avgWin).toBe(250);
    expect(a.avgLoss).toBe(-100);
    expect(a.profitFactor).toBeCloseTo(500 / 100, 3);
    expect(a.expectancy).toBeCloseTo(400 / 3, 2);
    expect(a.avgR).toBeCloseTo((3 - 1 + 2) / 3, 3);
  });

  it("builds an equity curve and max drawdown", () => {
    const a = analyze(trades);
    expect(a.equityCurve.map((p) => p.equity)).toEqual([300, 200, 400]);
    expect(a.maxDrawdown).toBe(100);
  });

  it("computes rule adherence over flagged trades only", () => {
    const a = analyze(trades);
    expect(a.ruleAdherence).toBeCloseTo(2 / 3, 3);
  });

  it("handles empty input", () => {
    const a = analyze([]);
    expect(a.count).toBe(0);
    expect(a.winRate).toBeNull();
    expect(a.profitFactor).toBeNull();
  });
});

describe("groupAnalytics", () => {
  it("groups and sorts by count", () => {
    const trades = [
      t({ instrument: "NQ", netPnl: 100 }),
      t({ instrument: "NQ", netPnl: 100 }),
      t({ instrument: "ES", netPnl: -50 }),
    ];
    const groups = groupAnalytics(trades, (x) => x.instrument);
    expect(groups[0].name).toBe("NQ");
    expect(groups[0].count).toBe(2);
    expect(groups[1].name).toBe("ES");
  });
});
