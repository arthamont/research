"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { slugify, readingTimeMinutes } from "@/lib/utils";
import { utcDay } from "@/lib/dates";
import { bustWorkspaceCache } from "@/lib/cached";

/* ── Settings ─────────────────────────────────────────────────────────── */

const settingsSchema = z.object({
  socialLinks: z.string().optional().nullable(), // JSON or "key:url" lines
});

export async function updateSettings(data: unknown) {
  const user = await requireUser();
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  let social: Record<string, string> = {};
  if (d.socialLinks?.trim()) {
    try {
      social = JSON.parse(d.socialLinks);
    } catch {
      for (const line of d.socialLinks.split("\n")) {
        const [k, ...rest] = line.split(":");
        if (k && rest.length) social[k.trim()] = rest.join(":").trim();
      }
    }
  }

  await db.userSettings.upsert({
    where: { userId: user.id },
    update: { socialLinks: social },
    create: { userId: user.id, socialLinks: social },
  });
  bustWorkspaceCache();
  revalidatePath("/dashboard/settings");
  revalidatePath("/about");
  return {};
}

/* ── Setups (private playbook) ────────────────────────────────────────── */

const setupSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().optional().nullable(),
  market: z.enum(["FUTURES", "FOREX", "INDIA"]).optional().nullable(),
  rules: z.string().optional().nullable(),
});

export async function upsertSetup(id: string | null, data: unknown) {
  const user = await requireUser();
  const parsed = setupSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  if (id) {
    await db.setup.updateMany({ where: { id, userId: user.id }, data: { ...parsed.data, market: parsed.data.market || null } });
  } else {
    await db.setup.create({ data: { ...parsed.data, market: parsed.data.market || null, userId: user.id } });
  }
  revalidatePath("/dashboard/playbook");
  return {};
}

export async function deleteSetup(id: string) {
  const user = await requireUser();
  await db.setup.deleteMany({ where: { id, userId: user.id } });
  bustWorkspaceCache();
  revalidatePath("/dashboard/playbook");
}

/* ── Watchlist ────────────────────────────────────────────────────────── */

const watchSchema = z.object({
  instrumentId: z.string().min(1),
  notes: z.string().optional().nullable(),
  bias: z.enum(["BULLISH", "BEARISH", "NEUTRAL"]),
  setupStatus: z.string().optional().nullable(),
  keyLevels: z.string().optional().nullable(), // "price:label" per line
});

export async function upsertWatchlist(id: string | null, data: unknown) {
  const user = await requireUser();
  const parsed = watchSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;
  const keyLevels = (d.keyLevels ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [price, ...rest] = l.split(":");
      return { price: parseFloat(price) || null, label: rest.join(":").trim() || null };
    })
    .filter((l) => l.price !== null);

  const payload = {
    instrumentId: d.instrumentId,
    notes: d.notes,
    bias: d.bias,
    setupStatus: d.setupStatus,
    keyLevels,
    lastReviewedAt: new Date(),
  };
  if (id) {
    await db.watchlistItem.updateMany({ where: { id, userId: user.id }, data: payload });
  } else {
    await db.watchlistItem.upsert({
      where: { userId_instrumentId: { userId: user.id, instrumentId: d.instrumentId } },
      update: payload,
      create: { ...payload, userId: user.id },
    });
  }
  revalidatePath("/dashboard/watchlist");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteWatchlist(id: string) {
  const user = await requireUser();
  await db.watchlistItem.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard/watchlist");
}

/* ── Trading plan ─────────────────────────────────────────────────────── */

const planSchema = z.object({
  date: z.string().min(1),
  narrative: z.string().optional().nullable(),
  marketFocus: z.array(z.enum(["FUTURES", "FOREX", "INDIA"])).default([]),
  sessionFocus: z.array(z.enum(["Q1", "Q2", "Q3", "Q4"])).default([]),
  keyLevels: z.string().optional().nullable(), // "SYM:price:note" lines
  scenarios: z.string().optional().nullable(), // "label:condition:action" lines
  sleep: z.string().optional().nullable(),
  mindset: z.string().optional().nullable(),
});

export async function upsertPlan(data: unknown) {
  const user = await requireUser();
  const parsed = planSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;
  const date = utcDay(d.date);
  if (!date) return { error: "Invalid date" };

  const keyLevels = (d.keyLevels ?? "")
    .split("\n").map((l) => l.trim()).filter(Boolean)
    .map((l) => {
      const [instrument, price, ...rest] = l.split(":");
      return { instrument: instrument?.trim(), price: parseFloat(price ?? "") || null, note: rest.join(":").trim() || null };
    });
  const scenarios = (d.scenarios ?? "")
    .split("\n").map((l) => l.trim()).filter(Boolean)
    .map((l) => {
      const [label, condition, ...rest] = l.split("|");
      return { label: label?.trim(), condition: condition?.trim(), action: rest.join("|").trim() };
    });
  const readiness = { sleep: d.sleep ?? null, mindset: d.mindset ?? null };

  await db.tradingPlan.upsert({
    where: { userId_date: { userId: user.id, date } },
    update: { narrative: d.narrative, marketFocus: d.marketFocus, sessionFocus: d.sessionFocus, keyLevels, scenarios, readiness },
    create: { userId: user.id, date, narrative: d.narrative, marketFocus: d.marketFocus, sessionFocus: d.sessionFocus, keyLevels, scenarios, readiness },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reviews");
  return {};
}

/* ── Checklist entries ────────────────────────────────────────────────── */

export async function saveChecklistEntry(templateId: string, date: string, checked: string[]) {
  const user = await requireUser();
  const template = await db.checklistTemplate.findFirst({ where: { id: templateId, userId: user.id } });
  if (!template) return { error: "Template not found" };
  const d = utcDay(date);
  if (!d) return { error: "Invalid date" };
  const total = Array.isArray(template.items) ? template.items.length : 0;
  await db.checklistEntry.upsert({
    where: { templateId_date: { templateId, date: d } },
    update: { checked, completedAt: checked.length >= total && total > 0 ? new Date() : null },
    create: { userId: user.id, templateId, date: d, checked, completedAt: checked.length >= total && total > 0 ? new Date() : null },
  });
  revalidatePath("/dashboard/reviews");
  revalidatePath("/dashboard");
  return {};
}

/* ── Reviews ──────────────────────────────────────────────────────────── */

const dailySchema = z.object({
  date: z.string().min(1),
  summary: z.string().optional().nullable(),
  executionGrade: z.coerce.number().int().min(1).max(5).optional().nullable(),
  mistakes: z.string().optional().nullable(),
  lessons: z.string().optional().nullable(),
  emotionalReview: z.string().optional().nullable(),
});

export async function upsertDailyReview(data: unknown) {
  const user = await requireUser();
  const parsed = dailySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;
  const date = utcDay(d.date);
  if (!date) return { error: "Invalid date" };
  await db.dailyReview.upsert({
    where: { userId_date: { userId: user.id, date } },
    update: { summary: d.summary, executionGrade: d.executionGrade, mistakes: d.mistakes, lessons: d.lessons, emotionalReview: d.emotionalReview },
    create: { userId: user.id, date, summary: d.summary, executionGrade: d.executionGrade, mistakes: d.mistakes, lessons: d.lessons, emotionalReview: d.emotionalReview },
  });
  revalidatePath("/dashboard/reviews");
  return {};
}

const weeklySchema = z.object({
  weekStart: z.string().min(1),
  tradesTaken: z.coerce.number().int().min(0).default(0),
  tradesAvoided: z.coerce.number().int().min(0).default(0),
  ruleViolations: z.coerce.number().int().min(0).default(0),
  executionGrade: z.coerce.number().int().min(1).max(5).optional().nullable(),
  strongestSetup: z.string().optional().nullable(),
  recurringMistakes: z.string().optional().nullable(),
  improvementPriorities: z.string().optional().nullable(),
  nextWeekPlan: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
});

export async function upsertWeeklyReview(data: unknown) {
  const user = await requireUser();
  const parsed = weeklySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;
  const weekStart = utcDay(d.weekStart);
  if (!weekStart) return { error: "Invalid date" };
  await db.weeklyReview.upsert({
    where: { userId_weekStart: { userId: user.id, weekStart } },
    update: d,
    create: { ...d, userId: user.id, weekStart },
  });
  revalidatePath("/dashboard/reviews");
  return {};
}

/* ── Day note (private, one per day) ─────────────────────────────────── */

export async function upsertDayNote(date: string, content: string) {
  const user = await requireUser();
  const d = utcDay(date);
  if (!d) return { error: "Invalid date" };
  const text = content.trim();
  if (!text) {
    await db.marketNote.deleteMany({ where: { userId: user.id, date: d } });
  } else {
    await db.marketNote.upsert({
      where: { userId_date: { userId: user.id, date: d } },
      update: { content: text },
      create: { userId: user.id, date: d, content: text },
    });
  }
  revalidatePath("/dashboard/economic");
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");
  return {};
}

/* ── Content: research articles ───────────────────────────────────────── */

const articleSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  market: z.enum(["FUTURES", "FOREX", "INDIA"]).optional().nullable(),
  instruments: z.string().optional().nullable(), // comma-separated
  tags: z.string().optional().nullable(), // comma-separated
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

const csv = (s?: string | null) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean) : []);

/** Public pages that surface content — invalidated on every content change. */
function revalidatePublic() {
  for (const p of ["/", "/markets", "/markets/futures", "/markets/forex", "/markets/india", "/journal", "/outlook", "/playbook", "/about"]) {
    revalidatePath(p);
  }
}

export async function upsertArticle(id: string | null, data: unknown) {
  const user = await requireUser();
  void user;
  const parsed = articleSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;
  const slug = d.slug?.trim() ? slugify(d.slug) : slugify(d.title);
  const payload = {
    slug,
    title: d.title,
    excerpt: d.excerpt,
    content: d.content,
    coverImage: d.coverImage || null,
    market: d.market || null,
    instruments: csv(d.instruments),
    tags: csv(d.tags),
    readingTime: readingTimeMinutes(d.content),
    status: d.status,
    publishedAt: d.status === "PUBLISHED" ? new Date() : null,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
  };
  if (id) {
    await db.researchArticle.update({ where: { id }, data: payload });
  } else {
    const exists = await db.researchArticle.findUnique({ where: { slug } });
    if (exists) return { error: "Slug already in use" };
    await db.researchArticle.create({ data: payload });
  }
  revalidatePath("/dashboard/content");
  revalidatePublic();
  return {};
}

export async function deleteArticle(id: string) {
  await requireUser();
  await db.researchArticle.delete({ where: { id } });
  revalidatePath("/dashboard/content");
  revalidatePublic();
}

/* ── Content: case studies ────────────────────────────────────────────── */

const caseSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  content: z.string().min(1),
  tradeId: z.string().optional().nullable(),
  market: z.enum(["FUTURES", "FOREX", "INDIA"]),
  instrument: z.string().min(1),
  direction: z.enum(["LONG", "SHORT"]),
  session: z.enum(["Q1", "Q2", "Q3", "Q4"]).optional().nullable(),
  setup: z.string().optional().nullable(),
  tradeDate: z.string().min(1),
  rrPlanned: z.coerce.number().optional().nullable(),
  rrActual: z.coerce.number().optional().nullable(),
  grade: z.coerce.number().int().min(1).max(5).optional().nullable(),
  chartImage: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isDemo: z.coerce.boolean().default(false),
});

export async function upsertCaseStudy(id: string | null, data: unknown) {
  await requireUser();
  const parsed = caseSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;
  const slug = d.slug?.trim() ? slugify(d.slug) : slugify(d.title);
  const payload = {
    slug,
    title: d.title,
    summary: d.summary,
    content: d.content,
    tradeId: d.tradeId || null,
    market: d.market,
    instrument: d.instrument.toUpperCase(),
    direction: d.direction,
    session: d.session || null,
    setup: d.setup,
    tradeDate: new Date(d.tradeDate),
    rrPlanned: d.rrPlanned,
    rrActual: d.rrActual,
    grade: d.grade,
    chartImage: d.chartImage || null,
    tags: csv(d.tags),
    status: d.status,
    isDemo: d.isDemo,
    publishedAt: d.status === "PUBLISHED" ? new Date() : null,
  };
  if (id) {
    await db.caseStudy.update({ where: { id }, data: payload });
  } else {
    const exists = await db.caseStudy.findUnique({ where: { slug } });
    if (exists) return { error: "Slug already in use" };
    await db.caseStudy.create({ data: payload });
  }
  revalidatePath("/dashboard/content");
  revalidatePublic();
  return {};
}

export async function deleteCaseStudy(id: string) {
  await requireUser();
  await db.caseStudy.delete({ where: { id } });
  revalidatePath("/dashboard/content");
  revalidatePublic();
}

/* ── Content: playbook items ──────────────────────────────────────────── */

const playbookSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  content: z.string().min(1),
  market: z.enum(["FUTURES", "FOREX", "INDIA"]).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export async function upsertPlaybookItem(id: string | null, data: unknown) {
  await requireUser();
  const parsed = playbookSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;
  const slug = d.slug?.trim() ? slugify(d.slug) : slugify(d.title);
  const payload = { ...d, slug, market: d.market || null };
  if (id) {
    await db.playbookItem.update({ where: { id }, data: payload });
  } else {
    const exists = await db.playbookItem.findUnique({ where: { slug } });
    if (exists) return { error: "Slug already in use" };
    await db.playbookItem.create({ data: payload });
  }
  revalidatePath("/dashboard/content");
  revalidatePublic();
  return {};
}

export async function deletePlaybookItem(id: string) {
  await requireUser();
  await db.playbookItem.delete({ where: { id } });
  revalidatePath("/dashboard/content");
  revalidatePublic();
}
