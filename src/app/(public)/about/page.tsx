import type { Metadata } from "next";
import { MicroLabel } from "@/components/ui/primitives";
import { Wordmark } from "@/components/brand/wordmark";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { WingsSection } from "@/components/sections/wings";
import { VisionSection, FounderSection } from "@/components/sections/foundation";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description:
    "About Arthamont — a research-driven financial initiative built on conviction, discipline, and longevity.",
};

const journey = [
  {
    n: "01",
    phase: "Foundation",
    title: "Understanding Market Mechanics",
    body: "The journey began with a deep study of global markets — how capital flows, how price is delivered, and how leverage, liquidity, and time interact.",
    detail:
      "The objective was never merely to observe where prices move, but to understand the mechanisms and macroeconomic forces that drive them.",
  },
  {
    n: "02",
    phase: "Discipline",
    title: "From Observation to Framework",
    body: "Focus shifted from individual positions toward building a rigorous framework for market analysis, risk measurement, and capital allocation.",
    detail:
      "Structured research notes, position-sizing rules, scenario planning, and systematic reviews became the operating standard.",
  },
  {
    n: "03",
    phase: "Arthamont",
    title: "Establishing the Institution",
    body: "Arthamont represents the evolution of that work into a research-driven financial identity — where analysis, risk, and capital converge under one discipline.",
    detail:
      "A dedicated platform for publishing market research, stress-testing convictions, and compounding knowledge across cycles.",
  },
  {
    n: "04",
    phase: "The Horizon",
    title: "Building Beyond the Present",
    body: "The long-term ambition is to evolve Arthamont into an enduring financial institution — spanning research, capital deployment, asset management, and private partnerships.",
    detail:
      "Growth will be measured not by speed, but by the strength of the analytical, risk, and governance foundations underneath it.",
  },
];

const principles = [
  {
    title: "Conviction.",
    sub: "Research-driven decisions.",
    body: "Conviction is earned through rigorous analysis, macroeconomic understanding, and a clearly defined view of risk — not market sentiment or momentum.",
  },
  {
    title: "Discipline.",
    sub: "A framework for every decision.",
    body: "Discipline means respecting leverage limits, honoring invalidation levels, and holding every position accountable to a defined process — regardless of outcome.",
  },
  {
    title: "Longevity.",
    sub: "Compounding across decades.",
    body: "Long-term success comes from capital preservation, patient compounding, and building systems that remain valuable as markets and generations change.",
  },
];

const markets = [
  {
    title: "US Futures",
    tagline: "Global Indices. Liquidity. Leverage.",
    body: "Research focused on major US equity index futures — Nasdaq-100 and S&P 500 — analyzing market structure, session liquidity, and leverage dynamics under varying macroeconomic regimes.",
  },
  {
    title: "Global Forex & Metals",
    tagline: "Currencies. Macro Flows. Precious Metals.",
    body: "Analysis of major currency pairs and precious metals — EURUSD and gold in particular — through the lens of central-bank policy, macroeconomic releases, and global capital flows.",
  },
  {
    title: "Indian Financial Markets",
    tagline: "Indices. Derivatives. Domestic Capital.",
    body: "Research across Indian equity indices and index derivatives, with attention to domestic liquidity, regulatory developments, and the risk-reward profile of emerging-market exposure.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-40 sm:px-8">
      {/* ── Foundation ── */}
      <MicroLabel>Our Foundation</MicroLabel>
      <RevealText>
        <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] sm:text-7xl">
          Built on Principle.
          <br />
          <span className="text-text-secondary">Defined by Time.</span>
        </h1>
      </RevealText>
      <Reveal delay={0.15}>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-text-secondary">
          Arthamont is a research-driven financial initiative founded on a simple conviction: lasting results in
          capital markets are engineered through rigorous analysis, measured leverage, and the disciplined
          compounding of principled decisions.
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
          Operating across US futures, global foreign exchange, and Indian capital markets, Arthamont brings together
          macroeconomic research, microstructural analysis, and systematic risk management into a single coherent
          framework.
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
          What begins as research and disciplined capital deployment carries a greater ambition — to establish the
          foundations of an enduring financial institution built to outlast cycles, regimes, and generations.
        </p>
        <p className="micro-label mt-8 text-accent-text">Conviction. Discipline. Longevity.</p>
      </Reveal>

      {/* ── Our Story ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="Our story">
        <MicroLabel>Our Story</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-4 text-3xl font-medium sm:text-4xl">
            Every institution begins with a principle.
          </h2>
        </RevealText>
        <Reveal delay={0.1}>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-text-secondary">
            <p>
              Arthamont began with a fundamental question — how do markets actually price risk, and how do the most
              disciplined participants allocate capital through uncertainty?
            </p>
            <p>
              That question led to years of study across market structure, liquidity mechanics, leverage, and the
              macroeconomic forces that move global capital.
            </p>
            <p>
              Over time, the work evolved from identifying opportunities toward building a repeatable process —
              grounded in preparation, measured risk, and continuous refinement.
            </p>
            <p>
              Today, Arthamont serves as a research platform where market convictions are documented, tested, and
              compounded into institutional-grade knowledge.
            </p>
            <p>
              The ambition extends beyond markets alone — to develop the intellectual, operational, and governance
              foundations of a respected financial organization.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── The Journey ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="The journey">
        <MicroLabel>The Journey</MicroLabel>
        <div className="mt-10">
          {journey.map((j, i) => (
            <Reveal key={j.n} delay={i * 0.07}>
              <div className="group relative border-t border-border py-10 last:border-b">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-2 right-0 select-none font-display text-[6rem] font-semibold leading-none tracking-tighter text-text opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.14] sm:text-[8rem]"
                >
                  {j.n}
                </span>
                <div className="relative max-w-2xl">
                  <p className="numeric font-mono text-xs tracking-[0.2em] text-accent">{j.n} — {j.phase}</p>
                  <h3 className="font-display mt-4 text-2xl font-medium sm:text-3xl">
                    <span className="transition-colors duration-300 group-hover:text-accent-text">{j.title}</span>
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-text-secondary">{j.body}</p>
                  <p className="mt-3 text-sm leading-relaxed text-text-faint">{j.detail}</p>
                </div>
                <span aria-hidden className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="Our principles">
        <MicroLabel>Our Principles</MicroLabel>
        <div className="mt-10 grid gap-px border border-border bg-border lg:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="bg-bg">
              <div className="h-full bg-bg p-8">
                <h3 className="font-display text-2xl font-medium">{p.title}</h3>
                <p className="micro-label mt-3">{p.sub}</p>
                <p className="mt-5 text-sm leading-relaxed text-text-secondary">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Markets & Research ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="Markets and research">
        <MicroLabel>Markets &amp; Research</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-4 text-3xl font-medium sm:text-4xl">
            Three principal areas of study.
          </h2>
        </RevealText>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {markets.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.08}>
              <div className="border border-border p-8 transition-colors hover:border-accent">
                <p className="numeric font-mono text-xs tracking-[0.2em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{m.title}</h3>
                <p className="micro-label mt-3">{m.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Risk ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="Risk">
        <MicroLabel>Our Approach to Risk</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-medium sm:text-4xl">
            Risk is the first variable, never the last.
          </h2>
        </RevealText>
        <Reveal delay={0.1}>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-text-secondary">
            <p>
              Leverage amplifies both conviction and error — which is why risk analysis precedes every capital
              decision, not the other way around.
            </p>
            <p>
              Every position carries a defined invalidation level, a measured exposure limit, and a documented
              rationale before capital is committed.
            </p>
            <p>
              Macro and micro risks are assessed separately — regime shifts, liquidity conditions, and event risk
              on one axis; execution, position sizing, and correlation on the other.
            </p>
            <p>
              Capital preservation is not a defensive posture — it is the compounding engine of every future
              opportunity.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Vision (moved from homepage) ── */}
      <div className="-mx-5 sm:-mx-8">
        <VisionSection />
      </div>

      {/* ── Founder (moved from homepage) ── */}
      <div className="-mx-5 sm:-mx-8">
        <FounderSection />
      </div>

      {/* ── Our wings ── */}
      <section className="mt-4 border-t border-border pt-16" aria-label="Our wings">
        <MicroLabel>Our Wings</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-4 text-3xl font-medium sm:text-4xl">
            One master brand. Future entities.
          </h2>
        </RevealText>
        <Reveal delay={0.1}>
          <div className="mt-10">
            <WingsSection />
          </div>
        </Reveal>
      </section>

      {/* ── Philosophy close ── */}
      <section className="mt-28 border-t border-border pt-20 text-center" aria-label="Philosophy">
        <MicroLabel>The Philosophy</MicroLabel>
        <RevealText>
          <h2 className="font-display mx-auto mt-6 max-w-3xl text-3xl font-medium leading-snug sm:text-5xl">
            Capital is responsibility.
            <br />
            Discipline is the foundation.
            <br />
            <span className="text-text-secondary">Time is the measure.</span>
          </h2>
        </RevealText>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-text-secondary">
            Arthamont is built on the belief that enduring results come from sound judgment, measured risk-taking,
            and the compounding of principled decisions. The objective is not to predict every market movement — it
            is to build the analytical and institutional foundations required to navigate uncertainty with clarity.
          </p>
          <p className="font-display mt-8 text-xl italic text-text sm:text-2xl">
            Built on Principle. Defined by Time.
          </p>
        </Reveal>
      </section>

      {/* ── Brand lockup ── */}
      <div className="mt-24 border-t border-border pt-12 text-center">
        <Wordmark className="text-3xl" />
        <p className="micro-label mt-4">Conviction · Discipline · Longevity</p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-faint">
          Arthamont Research — Capital Markets &amp; Analysis
        </p>
        <p className="mx-auto mt-6 max-w-lg text-[11px] leading-relaxed text-text-faint">
          Current activities comprise market research and analysis. Future institutional ambitions do not imply
          that Arthamont currently operates as a regulated investment fund, asset manager, or bank.
        </p>
      </div>
    </div>
  );
}
