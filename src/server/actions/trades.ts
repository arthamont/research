"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { settleTrade, computePlannedRR } from "@/lib/calculations";
import { slugify } from "@/lib/utils";

const tradeSchema = z.object({
  accountId: z.string().optional().nullable(),
  instrumentId: z.string().min(1, "Instrument required"),
  setupId: z.string().optional().nullable(),
  market: z.enum(["FUTURES", "FOREX", "INDIA"]),
  direction: z.enum(["LONG", "SHORT"]),
  status: z.enum(["OPEN", "CLOSED", "CANCELLED"]).default("OPEN"),
  session: z.enum(["ASIA", "LONDON", "NEW_YORK", "INDIA", "OVERLAP", "OTHER"]).optional().nullable(),
  openedAt: z.string().min(1, "Open time required"),
  closedAt: z.string().optional().nullable(),
  entryPrice: z.coerce.number().positive(),
  stopLoss: z.coerce.number().positive().optional().nullable(),
  takeProfit: z.coerce.number().positive().optional().nullable(),
  exitPrice: z.coerce.number().positive().optional().nullable(),
  positionSize: z.coerce.number().positive().default(1),
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

const dateOrNull = (s?: string | null) => (s ? new Date(s) : null);

export async function createTrade(formData: unknown): Promise<{ error?: string; id?: string }> {
  const user = await requireUser();
  const parsed = tradeSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const instrument = await db.instrument.findUnique({ where: { id: d.instrumentId } });
  if (!instrument) return { error: "Instrument not found" };

  const fees = d.feesCommission;
  const settled = d.status === "CLOSED" || d.exitPrice
    ? settleTrade({
        direction: d.direction,
        entryPrice: d.entryPrice,
        exitPrice: d.exitPrice ?? null,
        stopLoss: d.stopLoss ?? null,
        positionSize: d.positionSize,
        fees,
        instrument,
      })
    : {
        grossPnl: null,
        netPnl: null,
        plannedRisk: null,
        realizedR: null,
      };

  const trade = await db.trade.create({
    data: {
      userId: user.id,
      accountId: d.accountId || null,
      instrumentId: d.instrumentId,
      setupId: d.setupId || null,
      market: instrument.market,
      direction: d.direction,
      status: d.status,
      session: d.session || null,
      openedAt: new Date(d.openedAt),
      closedAt: dateOrNull(d.closedAt),
      entryPrice: d.entryPrice,
      stopLoss: d.stopLoss ?? null,
      takeProfit: d.takeProfit ?? null,
      exitPrice: d.exitPrice ?? null,
      positionSize: d.positionSize,
      currency: d.currency,
      feesCommission: fees,
      grossPnl: settled.grossPnl,
      netPnl: settled.netPnl,
      plannedRisk: settled.plannedRisk,
      realizedR: settled.realizedR,
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

  const fees = d.feesCommission;
  const settled = d.status === "CLOSED" || d.exitPrice
    ? settleTrade({
        direction: d.direction,
        entryPrice: d.entryPrice,
        exitPrice: d.exitPrice ?? null,
        stopLoss: d.stopLoss ?? null,
        positionSize: d.positionSize,
        fees,
        instrument,
      })
    : { grossPnl: null, netPnl: null, plannedRisk: null, realizedR: null };

  await db.trade.update({
    where: { id },
    data: {
      accountId: d.accountId || null,
      instrumentId: d.instrumentId,
      setupId: d.setupId || null,
      market: instrument.market,
      direction: d.direction,
      status: d.status,
      session: d.session || null,
      openedAt: new Date(d.openedAt),
      closedAt: dateOrNull(d.closedAt),
      entryPrice: d.entryPrice,
      stopLoss: d.stopLoss ?? null,
      takeProfit: d.takeProfit ?? null,
      exitPrice: d.exitPrice ?? null,
      positionSize: d.positionSize,
      currency: d.currency,
      feesCommission: fees,
      grossPnl: settled.grossPnl,
      netPnl: settled.netPnl,
      plannedRisk: settled.plannedRisk,
      realizedR: settled.realizedR,
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

export { computePlannedRR };
