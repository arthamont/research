"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { computeGrossPnl, computeRealizedR } from "@/lib/calculations";
import { slugify } from "@/lib/utils";

/**
 * Trades are logged only when complete — always CLOSED.
 * Session uses the owner's Quarterly frame: Q1 Asia, Q2 London, Q3 NY AM, Q4 NY PM.
 * Risk/target are entered as currency amounts ($), not prices.
 */
const tradeSchema = z.object({
  instrumentId: z.string().min(1, "Instrument required"),
  direction: z.enum(["LONG", "SHORT"]),
  session: z.enum(["Q1", "Q2", "Q3", "Q4"]).optional().nullable(),
  openedAt: z.string().min(1, "Open time required"),
  closedAt: z.string().min(1, "Close time required"),
  entryPrice: z.coerce.number().positive(),
  exitPrice: z.coerce.number().positive(),
  positionSize: z.coerce.number().positive().default(1),
  stopAmount: z.coerce.number().positive().optional().nullable(), // SL $
  targetAmount: z.coerce.number().positive().optional().nullable(), // TP $
  currency: z.string().default("USD"),
  feesCommission: z.coerce.number().min(0).default(0),
  thesis: z.string().optional().nullable(),
  executionNotes: z.string().optional().nullable(),
  emotionalNotes: z.string().optional().nullable(),
  mistakes: z.string().optional().nullable(),
  lessons: z.string().optional().nullable(),
  executionGrade: z.coerce.number().int().min(1).max(5).optional().nullable(),
  ruleCompliant: z.coerce.boolean().optional().nullable(),
});

async function settle(d: z.infer<typeof tradeSchema>, instrument: { pointValue: unknown }) {
  const grossPnl = computeGrossPnl({
    direction: d.direction,
    entry: d.entryPrice,
    exit: d.exitPrice,
    positionSize: d.positionSize,
    pointValue: Number(instrument.pointValue),
  });
  const netPnl = grossPnl - d.feesCommission;
  const plannedRisk = d.stopAmount ?? null;
  return {
    grossPnl,
    netPnl,
    plannedRisk,
    plannedTarget: d.targetAmount ?? null,
    realizedR: computeRealizedR(netPnl, plannedRisk),
  };
}

export async function createTrade(formData: unknown): Promise<{ error?: string; id?: string }> {
  const user = await requireUser();
  const parsed = tradeSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const instrument = await db.instrument.findUnique({ where: { id: d.instrumentId } });
  if (!instrument) return { error: "Instrument not found" };
  const s = await settle(d, instrument);

  const trade = await db.trade.create({
    data: {
      userId: user.id,
      instrumentId: d.instrumentId,
      market: instrument.market,
      direction: d.direction,
      status: "CLOSED",
      session: d.session || null,
      openedAt: new Date(d.openedAt),
      closedAt: new Date(d.closedAt),
      entryPrice: d.entryPrice,
      exitPrice: d.exitPrice,
      positionSize: d.positionSize,
      currency: d.currency,
      feesCommission: d.feesCommission,
      grossPnl: s.grossPnl,
      netPnl: s.netPnl,
      plannedRisk: s.plannedRisk,
      plannedTarget: s.plannedTarget,
      realizedR: s.realizedR,
      thesis: d.thesis,
      executionNotes: d.executionNotes,
      emotionalNotes: d.emotionalNotes,
      mistakes: d.mistakes,
      lessons: d.lessons,
      executionGrade: d.executionGrade,
      ruleCompliant: d.ruleCompliant,
    },
  });
  revalidatePath("/dashboard/journal");
  revalidatePath("/dashboard");
  return { id: trade.id };
}

export async function updateTrade(id: string, formData: unknown): Promise<{ error?: string }> {
  const user = await requireUser();
  const existing = await db.trade.findFirst({ where: { id, userId: user.id } });
  if (!existing) return { error: "Trade not found" };

  const parsed = tradeSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const instrument = await db.instrument.findUnique({ where: { id: d.instrumentId } });
  if (!instrument) return { error: "Instrument not found" };
  const s = await settle(d, instrument);

  await db.trade.update({
    where: { id },
    data: {
      instrumentId: d.instrumentId,
      market: instrument.market,
      direction: d.direction,
      status: "CLOSED",
      session: d.session || null,
      openedAt: new Date(d.openedAt),
      closedAt: new Date(d.closedAt),
      entryPrice: d.entryPrice,
      exitPrice: d.exitPrice,
      positionSize: d.positionSize,
      currency: d.currency,
      feesCommission: d.feesCommission,
      grossPnl: s.grossPnl,
      netPnl: s.netPnl,
      plannedRisk: s.plannedRisk,
      plannedTarget: s.plannedTarget,
      realizedR: s.realizedR,
      thesis: d.thesis,
      executionNotes: d.executionNotes,
      emotionalNotes: d.emotionalNotes,
      mistakes: d.mistakes,
      lessons: d.lessons,
      executionGrade: d.executionGrade,
      ruleCompliant: d.ruleCompliant,
    },
  });
  revalidatePath("/dashboard/journal");
  revalidatePath(`/dashboard/journal/${id}`);
  revalidatePath("/dashboard");
  return {};
}

export async function deleteTrade(id: string) {
  const user = await requireUser();
  await db.trade.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard/journal");
  redirect("/dashboard/journal");
}

/** Explicit publication workflow — a trade only goes public via this action. */
export async function toggleTradePublic(id: string) {
  const user = await requireUser();
  const trade = await db.trade.findFirst({ where: { id, userId: user.id } });
  if (!trade) return;
  const isPublic = !trade.isPublic;
  await db.trade.update({
    where: { id },
    data: {
      isPublic,
      publicSlug: isPublic ? trade.publicSlug ?? slugify(`${trade.id.slice(-6)}-${trade.id}`) : trade.publicSlug,
    },
  });
  revalidatePath("/dashboard/journal");
}
