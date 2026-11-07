/**
 * Instrument-aware P&L and R-multiple math.
 *
 * Uniform formula across markets:
 *   grossPnl = (exit − entry) × direction × positionSize × pointValue
 *
 * pointValue = currency value of a 1.00 price move per unit of positionSize:
 *   - futures/indices → per contract (NQ: $20/pt, ES: $50/pt, NIFTY lot ≈ ₹75/pt)
 *   - forex → per 1.0 lot (EURUSD: $100,000/pt ≈ $10 per pip; XAUUSD: $100/pt per 100oz)
 *
 * plannedRisk  = |entry − stop| × positionSize × pointValue + fees
 * realizedR    = netPnl ÷ plannedRisk
 */
import type { Direction } from "@prisma/client";

const num = (v: unknown) => (v === null || v === undefined ? 0 : Number(v));

export function directionSign(d: Direction) {
  return d === "LONG" ? 1 : -1;
}

export function computeGrossPnl(args: {
  direction: Direction;
  entry: number;
  exit: number;
  positionSize: number;
  pointValue: number;
}): number {
  return (args.exit - args.entry) * directionSign(args.direction) * args.positionSize * args.pointValue;
}

export function computePlannedRisk(args: {
  direction: Direction;
  entry: number;
  stop: number | null | undefined;
  positionSize: number;
  pointValue: number;
  fees?: number;
}): number | null {
  if (args.stop === null || args.stop === undefined) return null;
  const priceRisk = Math.abs(args.entry - args.stop) * args.positionSize * args.pointValue;
  return priceRisk + (args.fees ?? 0);
}

export function computePlannedRR(args: {
  direction: Direction;
  entry: number;
  stop: number | null | undefined;
  target: number | null | undefined;
}): number | null {
  if (args.stop == null || args.target == null) return null;
  const risk = Math.abs(args.entry - args.stop);
  const reward = Math.abs(args.target - args.entry);
  if (risk === 0) return null;
  // sanity: reward must be in the trade direction
  const dir = directionSign(args.direction);
  if ((args.target - args.entry) * dir <= 0) return null;
  return reward / risk;
}

export function computeRealizedR(netPnl: number | null, plannedRisk: number | null): number | null {
  if (netPnl === null || plannedRisk === null || plannedRisk === 0) return null;
  return netPnl / plannedRisk;
}

/** Full settlement for a closed trade. */
export function settleTrade(args: {
  direction: Direction;
  entryPrice: number;
  exitPrice: number | null | undefined;
  stopLoss: number | null | undefined;
  positionSize: number;
  fees: number;
  instrument: { pointValue: number | string | { toString(): string } };
}) {
  const pointValue = num(args.instrument.pointValue);
  const plannedRisk = computePlannedRisk({
    direction: args.direction,
    entry: args.entryPrice,
    stop: args.stopLoss,
    positionSize: args.positionSize,
    pointValue,
    fees: args.fees,
  });
  if (args.exitPrice === null || args.exitPrice === undefined) {
    return { grossPnl: null, netPnl: null, plannedRisk, realizedR: null };
  }
  const grossPnl = computeGrossPnl({
    direction: args.direction,
    entry: args.entryPrice,
    exit: args.exitPrice,
    positionSize: args.positionSize,
    pointValue,
  });
  const netPnl = grossPnl - args.fees;
  return { grossPnl, netPnl, plannedRisk, realizedR: computeRealizedR(netPnl, plannedRisk) };
}
