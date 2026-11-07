/** Editable /about page content — defaults are the current copy. */
export interface AboutJourneyItem { n: string; phase: string; title: string; body: string; detail: string }
export interface AboutPrinciple { title: string; sub: string; body: string }
export interface AboutMarket { title: string; tagline: string; body: string }

export interface AboutContent {
  heroTitle1: string;
  heroTitle2: string;
  foundation: string[];
  story: string[];
  journey: AboutJourneyItem[];
  principles: AboutPrinciple[];
  markets: AboutMarket[];
  riskTitle: string;
  risk: string[];
  visionParas: string[];
  visionQuote: string;
  founderParas: string[];
  philosophyHeadline: string[];
  philosophyBody: string;
  philosophyQuote: string;
  lockupLabel: string;
  disclaimer: string;
}

export const ABOUT_DEFAULTS: AboutContent = {
  heroTitle1: "Built on Principle.",
  heroTitle2: "Defined by Time.",
  foundation: [
    "Arthamont is a research-driven financial initiative founded on a simple conviction: lasting results in capital markets are engineered through rigorous analysis, measured leverage, and the disciplined compounding of principled decisions.",
    "Operating across US futures, global foreign exchange, and Indian capital markets, Arthamont brings together macroeconomic research, microstructural analysis, and systematic risk management into a single coherent framework.",
    "What begins as research and disciplined capital deployment carries a greater ambition — to establish the foundations of an enduring financial institution built to outlast cycles, regimes, and generations.",
  ],
  story: [
    "Arthamont began with a fundamental question — how do markets actually price risk, and how do the most disciplined participants allocate capital through uncertainty?",
    "That question led to years of study across market structure, liquidity mechanics, leverage, and the macroeconomic forces that move global capital.",
    "Over time, the work evolved from identifying opportunities toward building a repeatable process — grounded in preparation, measured risk, and continuous refinement.",
    "Today, Arthamont serves as a research platform where market convictions are documented, tested, and compounded into institutional-grade knowledge.",
    "The ambition extends beyond markets alone — to develop the intellectual, operational, and governance foundations of a respected financial organization.",
  ],
  journey: [
    { n: "01", phase: "Foundation", title: "Understanding Market Mechanics", body: "The journey began with a deep study of global markets — how capital flows, how price is delivered, and how leverage, liquidity, and time interact.", detail: "The objective was never merely to observe where prices move, but to understand the mechanisms and macroeconomic forces that drive them." },
    { n: "02", phase: "Discipline", title: "From Observation to Framework", body: "Focus shifted from individual positions toward building a rigorous framework for market analysis, risk measurement, and capital allocation.", detail: "Structured research notes, position-sizing rules, scenario planning, and systematic reviews became the operating standard." },
    { n: "03", phase: "Arthamont", title: "Establishing the Institution", body: "Arthamont represents the evolution of that work into a research-driven financial identity — where analysis, risk, and capital converge under one discipline.", detail: "A dedicated platform for publishing market research, stress-testing convictions, and compounding knowledge across cycles." },
    { n: "04", phase: "The Horizon", title: "Building Beyond the Present", body: "The long-term ambition is to evolve Arthamont into an enduring financial institution — spanning research, capital deployment, asset management, and private partnerships.", detail: "Growth will be measured not by speed, but by the strength of the analytical, risk, and governance foundations underneath it." },
  ],
  principles: [
    { title: "Conviction.", sub: "Research-driven decisions.", body: "Conviction is earned through rigorous analysis, macroeconomic understanding, and a clearly defined view of risk — not market sentiment or momentum." },
    { title: "Discipline.", sub: "A framework for every decision.", body: "Discipline means respecting leverage limits, honoring invalidation levels, and holding every position accountable to a defined process — regardless of outcome." },
    { title: "Longevity.", sub: "Compounding across decades.", body: "Long-term success comes from capital preservation, patient compounding, and building systems that remain valuable as markets and generations change." },
  ],
  markets: [
    { title: "US Futures", tagline: "Global Indices. Liquidity. Leverage.", body: "Research focused on major US equity index futures — Nasdaq-100 and S&P 500 — analyzing market structure, session liquidity, and leverage dynamics under varying macroeconomic regimes." },
    { title: "Global Forex & Metals", tagline: "Currencies. Macro Flows. Precious Metals.", body: "Analysis of major currency pairs and precious metals — EURUSD and gold in particular — through the lens of central-bank policy, macroeconomic releases, and global capital flows." },
    { title: "Indian Financial Markets", tagline: "Indices. Derivatives. Domestic Capital.", body: "Research across Indian equity indices and index derivatives, with attention to domestic liquidity, regulatory developments, and the risk-reward profile of emerging-market exposure." },
  ],
  riskTitle: "Risk is the first variable, never the last.",
  risk: [
    "Leverage amplifies both conviction and error — which is why risk analysis precedes every capital decision, not the other way around.",
    "Every position carries a defined invalidation level, a measured exposure limit, and a documented rationale before capital is committed.",
    "Macro and micro risks are assessed separately — regime shifts, liquidity conditions, and event risk on one axis; execution, position sizing, and correlation on the other.",
    "Capital preservation is not a defensive posture — it is the compounding engine of every future opportunity.",
  ],
  visionParas: [
    "Arthamont's ambition extends beyond trading and market research.",
    "Our long-term vision is to develop a respected financial institution built on analytical excellence, responsible capital stewardship, technological innovation, and disciplined investment principles.",
    "Over time, that ambition may extend into investment management, private capital, and broader financial services, subject to the necessary capabilities and regulatory authorizations.",
    "The objective is not simply to participate in financial markets, but to build something meaningful, resilient, and enduring.",
  ],
  visionQuote: "Our ambition is generational. Our approach is deliberate.",
  founderParas: [
    "With 3 years of experience in software engineering and 2 years in financial markets, Arthamont's founder brings together technology, analytical thinking, and disciplined market research.",
    "The long-term ambition is to combine financial expertise and technological innovation to build an enduring institution grounded in conviction, discipline, and longevity.",
  ],
  philosophyHeadline: ["Capital is responsibility.", "Discipline is the foundation.", "Time is the measure."],
  philosophyBody:
    "Arthamont is built on the belief that enduring results come from sound judgment, measured risk-taking, and the compounding of principled decisions. The objective is not to predict every market movement — it is to build the analytical and institutional foundations required to navigate uncertainty with clarity.",
  philosophyQuote: "Built on Principle. Defined by Time.",
  lockupLabel: "Arthamont Research — Capital Markets & Analysis",
  disclaimer:
    "Current activities comprise market research and analysis. Future institutional ambitions do not imply that Arthamont currently operates as a regulated investment fund, asset manager, or bank.",
};

/** Deep-merge saved aboutJson over defaults (per-section override). */
export function mergeAbout(raw: Record<string, unknown> | null | undefined): AboutContent {
  if (!raw) return ABOUT_DEFAULTS;
  const c = { ...ABOUT_DEFAULTS } as Record<string, unknown>;
  for (const k of Object.keys(ABOUT_DEFAULTS)) {
    if (raw[k] !== undefined && raw[k] !== null) c[k] = raw[k];
  }
  return c as unknown as AboutContent;
}
