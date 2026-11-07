import { describe, it, expect } from "vitest";
import { computeGrossPnl, computePlannedRisk, computePlannedRR, settleTrade } from "./calculations";

const NQ = { pointValue: 20 };
const EURUSD = { pointValue: 100000 };

describe("computeGrossPnl", () => {
  it("futures long: (exit-entry) × size × pointValue", () => {
    // NQ: +50 points, 1 contract = +$1000
    expect(computeGrossPnl({ direction: "LONG", entry: 21000, exit: 21050, positionSize: 1, pointValue: 20 })).toBe(1000);
  });
  it("futures short works symmetrically", () => {
    expect(computeGrossPnl({ direction: "SHORT", entry: 21000, exit: 21050, positionSize: 1, pointValue: 20 })).toBe(-1000);
  });
  it("forex: 50-pip move on 1 standard lot", () => {
    // EURUSD 1.0800 → 1.0850 = 0.005 × 100000 = $500
    expect(computeGrossPnl({ direction: "LONG", entry: 1.08, exit: 1.085, positionSize: 1, pointValue: 100000 })).toBeCloseTo(500, 2);
  });
  it("respects position size", () => {
    expect(computeGrossPnl({ direction: "LONG", entry: 21000, exit: 21050, positionSize: 3, pointValue: 20 })).toBe(3000);
  });
});

describe("computePlannedRisk", () => {
  it("risk = |entry − stop| × size × pointValue + fees", () => {
    expect(computePlannedRisk({ direction: "LONG", entry: 21000, stop: 20950, positionSize: 1, pointValue: 20, fees: 10 })).toBe(1010);
  });
  it("returns null without a stop", () => {
    expect(computePlannedRisk({ direction: "LONG", entry: 21000, stop: null, positionSize: 1, pointValue: 20 })).toBeNull();
  });
});

describe("computePlannedRR", () => {
  it("computes reward ÷ risk", () => {
    expect(computePlannedRR({ direction: "LONG", entry: 21000, stop: 20950, target: 21150 })).toBe(3);
  });
  it("rejects targets against the trade direction", () => {
    expect(computePlannedRR({ direction: "LONG", entry: 21000, stop: 20950, target: 20900 })).toBeNull();
  });
  it("returns null without stop or target", () => {
    expect(computePlannedRR({ direction: "LONG", entry: 1, stop: null, target: 2 })).toBeNull();
  });
});

describe("settleTrade", () => {
  it("settles a closed NQ trade into gross/net/R", () => {
    const r = settleTrade({ direction: "LONG", entryPrice: 21000, exitPrice: 21100, stopLoss: 20950, positionSize: 1, fees: 10, instrument: NQ });
    expect(r.grossPnl).toBe(2000);
    expect(r.netPnl).toBe(1990);
    expect(r.plannedRisk).toBe(1010);
    expect(r.realizedR).toBeCloseTo(1990 / 1010, 3);
  });
  it("forex short with fees", () => {
    const r = settleTrade({ direction: "SHORT", entryPrice: 1.085, exitPrice: 1.08, stopLoss: 1.0875, positionSize: 1, fees: 7, instrument: EURUSD });
    expect(r.grossPnl).toBeCloseTo(500, 2);
    expect(r.netPnl).toBeCloseTo(493, 2);
  });
  it("open trade has no pnl but keeps planned risk", () => {
    const r = settleTrade({ direction: "LONG", entryPrice: 21000, exitPrice: null, stopLoss: 20900, positionSize: 1, fees: 0, instrument: NQ });
    expect(r.grossPnl).toBeNull();
    expect(r.plannedRisk).toBe(2000);
  });
});
