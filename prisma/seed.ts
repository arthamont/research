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

  // ── Demo content (clearly labeled) ───────────────────────────────────
  const hasContent = await db.researchArticle.count();
  if (hasContent === 0) {
    await db.researchArticle.create({
      data: {
        slug: "demo-weekly-outlook-structure-first",
        title: "[DEMO] Weekly outlook — structure before setups",
        excerpt: "A demonstration research entry: how the weekly map is built before a single intraday level is marked.",
        content: `## The map before the territory\n\nEvery week starts the same way: higher-timeframe structure first. Monthly and weekly candles define the narrative; intraday charts only refine it.\n\n### What I'm watching\n\n- **NQ** — consolidation beneath the prior weekly high. A sweep of the range high into a 4H FVG is the scenario worth waiting for.\n- **EURUSD** — trading mid-range. No edge until the weekly open is reclaimed or rejected decisively.\n- **NIFTY** — gap-up open into supply. First-hour structure will decide whether momentum is tradeable.\n\n### The principle\n\nPreparation is not prediction. The map narrows where I'm allowed to be wrong — it does not tell me where price must go.\n\n*This is demonstration content published to preview the research format.*`,
        market: "FUTURES",
        instruments: ["NQ", "EURUSD", "NIFTY"],
        tags: ["weekly-outlook", "market-structure"],
        readingTime: 2,
        status: "PUBLISHED",
        isDemo: true,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    });
    await db.caseStudy.create({
      data: {
        slug: "demo-nq-fvg-entry",
        title: "[DEMO] NQ — liquidity sweep into the 4H gap",
        summary: "Demonstration entry. Sell-side liquidity taken at the London close, retracement into the 4H FVG, continuation to the session low.",
        content: `## Context\n\nPrice had been building sell-side liquidity below the overnight low all session. The higher-timeframe bias was bearish — weekly candle trading inside a supply zone.\n\n## Hypothesis\n\nA sweep of the overnight low followed by displacement back above would create the conditions for a short continuation into the session low.\n\n## Execution\n\n- **Entry:** retracement into the 1-min FVG after displacement\n- **Stop:** above the displacement high\n- **Target:** session low, planned 3R\n\n## Review\n\nEntry matched the plan. Management was clean — no early exit despite the mid-range stall. The lesson: the stall was expected behavior inside the FVG, not a reason to interfere.\n\n*Demonstration entry — shown to preview the case-study format. Not a real trade record.*`,
        market: "FUTURES",
        instrument: "NQ",
        direction: "SHORT",
        session: "Q3",
        setup: "HTF Bias + FVG Entry",
        tradeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        rrPlanned: 3,
        rrActual: 2.8,
        grade: 4,
        tags: ["fvg", "liquidity", "ny-session"],
        status: "PUBLISHED",
        isDemo: true,
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    });
    await db.caseStudy.create({
      data: {
        slug: "demo-eurusd-po3-reversal",
        title: "[DEMO] EURUSD — power of three at the weekly open",
        summary: "Demonstration entry. Accumulation at the weekly open, manipulation below Asia's low, distribution into the session high.",
        content: `## Context\n\nEURUSD opened the week inside a higher-timeframe demand zone. The daily true open acted as the pivot.\n\n## Hypothesis\n\nClassic PO3: accumulation through Asia, a stop-run below the low during London, then expansion toward the session high.\n\n## Execution\n\n- **Entry:** on the reclaim of the weekly open after the sweep\n- **Stop:** below the manipulation low\n- **Target:** London session high extension, 3R\n\n## Review\n\nThe stop-run was deeper than anticipated — entry could have waited for the 5-minute close back inside range. Grade reflects patience on entry, not outcome.\n\n*Demonstration entry — shown to preview the case-study format. Not a real trade record.*`,
        market: "FOREX",
        instrument: "EURUSD",
        direction: "LONG",
        session: "Q2",
        setup: "PO3 Reversal",
        tradeDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        rrPlanned: 3,
        rrActual: -1,
        grade: 3,
        tags: ["po3", "weekly-open", "london"],
        status: "PUBLISHED",
        isDemo: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    await db.playbookItem.createMany({
      data: [
        {
          slug: "the-framework",
          title: "The framework",
          summary: "How every trading day is structured — from higher-timeframe context to post-trade review.",
          content: `## Principle\n\nEvery trade begins before the session. The framework moves top-down: monthly → weekly → daily → session → entry.\n\n## The sequence\n\n1. **Context** — where is price relative to HTF structure?\n2. **Narrative** — what is the dominant directional story?\n3. **Levels** — where is liquidity resting?\n4. **Window** — which session and time offers the best execution?\n5. **Setup** — does price present the defined model?\n6. **Risk** — invalidation first, size second.\n7. **Execution** — take the plan, not the emotion.\n8. **Review** — grade the process within 24 hours.`,
          sortOrder: 0,
          status: "PUBLISHED",
          isDemo: true,
        },
        {
          slug: "risk-rules",
          title: "Risk rules",
          summary: "The non-negotiables: position sizing, daily limits, and the rules that protect the account.",
          content: `## The rules\n\n- **One trade per day** — quality over frequency.\n- **0.5% risk** on futures prop accounts, **1%** on forex prop accounts.\n- **Minimum 1:3 R:R** — if the target isn't there, the trade isn't either.\n- **No partial exits** — the plan is the plan.\n- **Breakeven only after 2R** — never earlier.\n- **No revenge trading, no chasing** — missed setups stay missed.\n- **Review within 24 hours** — every trade, no exceptions.\n\nThese are my chosen constraints, not universal recommendations.`,
          sortOrder: 1,
          status: "PUBLISHED",
          isDemo: true,
        },
        {
          slug: "execution-model",
          title: "The execution model",
          summary: "The specific setup patterns traded — FVG entries, PO3, and session liquidity plays.",
          content: `## Model A — HTF bias + FVG\n\nDirectional bias from the 4H/daily. Wait for a liquidity sweep, displacement, then entry on retracement into the created fair value gap.\n\n## Model B — Power of Three\n\nAccumulation at a key reference (weekly/daily open), manipulation through obvious liquidity, distribution toward the session objective.\n\n## Model C — Opening momentum (India)\n\nFirst-hour structure on NSE indices: opening range break with momentum and clean structure behind it.`,
          sortOrder: 2,
          status: "PUBLISHED",
          isDemo: true,
        },
      ],
      skipDuplicates: true,
    });
    console.log("✓ demo content");
  } else {
    console.log("• content exists — skipping demo content");
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
