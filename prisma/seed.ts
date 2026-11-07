/**
 * NAYXOR seed — owner account, instruments with real contract specs,
 * default trading rules, checklist templates, and clearly-labeled DEMO content.
 *
 * Run: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { scrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const db = new PrismaClient();

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function main() {
  const email = (process.env.OWNER_EMAIL ?? "owner@nayxor.local").toLowerCase();
  const password = process.env.OWNER_PASSWORD ?? "nayxor-dev-password";

  // ── Owner ────────────────────────────────────────────────────────────
  const passwordHash = await hashPassword(password);
  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "NAYXOR", passwordHash, role: "OWNER" },
  });
  console.log("✓ owner:", user.email);

  await db.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      bio: "NAYXOR is my independent space for trading, research, and documenting the pursuit of better decisions. Across futures, forex, and Indian markets, the objective remains the same: approach uncertainty with preparation, structure, and discipline.",
      tradingInterests: ["Index futures", "FX majors & metals", "Indian index derivatives"],
      riskApproach: "Fixed fractional risk per trade. Daily loss limits are hard stops, not suggestions. Size follows the stop distance, never the conviction.",
      longTermObjectives: "Build a documented, repeatable process — consistency measured in rule adherence, not any single outcome.",
      journeyTimeline: [
        { year: "Start", title: "First charts", body: "Began studying market structure and order flow across index futures." },
        { year: "Process", title: "System over signals", body: "Moved from reactive trading to a written playbook and journaling routine." },
        { year: "Now", title: "NAYXOR", body: "This site — a public archive and private headquarters for the work." },
      ],
      socialLinks: {},
    },
  });
  console.log("✓ settings");

  // ── Instruments (real contract specs; lot sizes are configurable) ────
  const instruments = [
    { symbol: "NQ", name: "Nasdaq-100 E-mini", market: "FUTURES" as const, exchange: "CME", currency: "USD", tickSize: 0.25, tickValue: 5, pointValue: 20, notes: "Index points. 4 ticks per point." },
    { symbol: "MNQ", name: "Micro Nasdaq-100", market: "FUTURES" as const, exchange: "CME", currency: "USD", tickSize: 0.25, tickValue: 0.5, pointValue: 2 },
    { symbol: "ES", name: "S&P 500 E-mini", market: "FUTURES" as const, exchange: "CME", currency: "USD", tickSize: 0.25, tickValue: 12.5, pointValue: 50 },
    { symbol: "MES", name: "Micro S&P 500", market: "FUTURES" as const, exchange: "CME", currency: "USD", tickSize: 0.25, tickValue: 1.25, pointValue: 5 },
    { symbol: "EURUSD", name: "Euro / US Dollar", market: "FOREX" as const, currency: "USD", tickSize: 0.00001, tickValue: 1, pointValue: 100000, pipSize: 0.0001, lotSize: 100000, notes: "Per standard lot (100k units)." },
    { symbol: "XAUUSD", name: "Gold / US Dollar", market: "FOREX" as const, currency: "USD", tickSize: 0.01, tickValue: 1, pointValue: 100, pipSize: 0.01, lotSize: 100, notes: "Per 100oz lot." },
    { symbol: "NIFTY", name: "NSE Nifty 50 Index", market: "INDIA" as const, exchange: "NSE", currency: "INR", tickSize: 0.05, tickValue: 3.75, pointValue: 75, notes: "pointValue = lot size (75 as of 2025). Verify current lot size." },
    { symbol: "BANKNIFTY", name: "NSE Bank Nifty Index", market: "INDIA" as const, exchange: "NSE", currency: "INR", tickSize: 0.05, tickValue: 1.75, pointValue: 35, notes: "pointValue = lot size (35 as of 2025). Verify current lot size." },
  ];
  for (const i of instruments) {
    await db.instrument.upsert({ where: { symbol: i.symbol }, update: {}, create: i });
  }
  console.log("✓ instruments:", instruments.length);

  // ── Accounts ─────────────────────────────────────────────────────────
  await db.tradingAccount.createMany({
    data: [
      { userId: user.id, name: "Futures prop — evaluation", type: "PROP", market: "FUTURES", currency: "USD", propFirm: "TBD", notes: "0.5% risk per trade." },
      { userId: user.id, name: "Forex prop — funded", type: "PROP", market: "FOREX", currency: "USD", propFirm: "TBD", notes: "1% risk per trade." },
    ],
    skipDuplicates: true,
  });
  console.log("✓ accounts");

  // ── Setups ───────────────────────────────────────────────────────────
  const setups = [
    { name: "HTF Bias + FVG Entry", description: "Higher-timeframe directional bias, entry on retracement into a fair value gap after a liquidity sweep.", market: "FUTURES" as const },
    { name: "PO3 Reversal", description: "Power of three — accumulation, manipulation below the open, distribution into the session target.", market: "FOREX" as const },
    { name: "Opening Momentum", description: "First-hour momentum continuation after a clean opening range break on NSE indices.", market: "INDIA" as const },
  ];
  for (const s of setups) {
    await db.setup.upsert({
      where: { userId_name: { userId: user.id, name: s.name } },
      update: {},
      create: { ...s, userId: user.id },
    });
  }
  console.log("✓ setups");

  // ── Checklist templates (spec defaults) ──────────────────────────────
  const templates = [
    {
      name: "Preparation",
      stage: "PREPARATION" as const,
      isDefault: true,
      sortOrder: 0,
      items: [
        { key: "mindset", label: "Mindset & readiness check" },
        { key: "monthly-weekly", label: "Monthly / weekly context reviewed" },
        { key: "quarterly", label: "Quarterly Theory cycle assessed" },
        { key: "po3", label: "4H / 1H PO3 mapped" },
        { key: "true-opens", label: "Weekly / daily True Opens marked" },
        { key: "nwog-ndog", label: "NWOG / NDOG noted" },
        { key: "session-hl", label: "Session highs & lows marked" },
        { key: "fvg-ob", label: "FVG & order-block context reviewed" },
        { key: "liquidity", label: "Liquidity targets identified" },
        { key: "news", label: "News restrictions checked" },
      ],
    },
    {
      name: "Execution",
      stage: "EXECUTION" as const,
      isDefault: true,
      sortOrder: 1,
      items: [
        { key: "entry-stop-target", label: "Entry, stop & target defined" },
        { key: "risk-sized", label: "Position sized to planned risk" },
        { key: "rr-check", label: "Meets minimum R:R" },
        { key: "plan-trade", label: "Trade matches the written plan" },
      ],
    },
    {
      name: "Post-session",
      stage: "POST_SESSION" as const,
      isDefault: true,
      sortOrder: 2,
      items: [
        { key: "screenshots", label: "Post-trade screenshots saved" },
        { key: "journal", label: "Journal entry written" },
        { key: "emotional", label: "Emotional review noted" },
        { key: "grade", label: "Execution grade assigned" },
      ],
    },
  ];
  for (const t of templates) {
    const existing = await db.checklistTemplate.findFirst({ where: { userId: user.id, name: t.name } });
    if (!existing) await db.checklistTemplate.create({ data: { ...t, userId: user.id } });
  }
  console.log("✓ checklist templates");

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
