import type { Metadata } from "next";
import { MicroLabel } from "@/components/ui/primitives";
import { Wordmark } from "@/components/brand/wordmark";
import { Reveal, RevealText } from "@/components/motion/reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description:
    "About Arthamont — an independent trading and market research initiative built on conviction, discipline, and longevity.",
};

const journey = [
  {
    n: "01",
    phase: "Foundation",
    title: "Understanding the Markets",
    body: "The journey began with studying financial markets, price action, liquidity, and market structure across global instruments.",
    detail:
      "The objective was to understand not merely where prices move, but the conditions and mechanisms that influence market behavior.",
  },
  {
    n: "02",
    phase: "Discipline",
    title: "From Observation to Process",
    body: "The focus shifted from individual trading opportunities toward developing a consistent framework for market analysis, risk management, and execution.",
    detail:
      "Trading plans, structured playbooks, journaling, and systematic reviews became central to the process.",
  },
  {
    n: "03",
    phase: "Arthamont",
    title: "Establishing the Foundation",
    body: "Arthamont represents the evolution of that pursuit into an independent trading and research identity.",
    detail:
      "A dedicated space for publishing research, documenting market observations, evaluating decisions, and building the foundations of a more structured investment operation.",
  },
  {
    n: "04",
    phase: "The Horizon",
    title: "Building Beyond the Present",
    body: "The long-term ambition is to evolve Arthamont into an enduring financial institution, with potential capabilities spanning investment research, trading, asset management, and private capital.",
    detail:
      "Growth will be guided by experience, governance, regulatory requirements, and responsible capital stewardship. The objective is not simply to build something successful today, but to create something capable of lasting for generations.",
  },
];

const principles = [
  {
    title: "Conviction.",
    sub: "Independent thinking. Research-driven decisions.",
    body: "Conviction must be earned through preparation, evidence, and a clearly defined understanding of risk. We value independent analysis over market noise and thoughtful judgment over impulsive speculation.",
  },
  {
    title: "Discipline.",
    sub: "A process that governs every decision.",
    body: "Discipline means respecting risk limits, maintaining consistency, and remaining accountable to a defined framework — regardless of short-term outcomes. The quality of an investment or trading decision cannot be measured by its outcome alone.",
  },
  {
    title: "Longevity.",
    sub: "Thinking in decades, not days.",
    body: "Long-term success requires patience, adaptability, resilience, and the preservation of capital. Our aspiration is to build processes and principles that remain valuable as markets, technologies, and generations change.",
  },
];

const markets = [
  {
    title: "US Futures",
    body: "Research focused on major US equity index futures, including the Nasdaq-100 and S&P 500. Areas of interest include market structure, liquidity, session dynamics, price delivery, and time-based trading models.",
  },
  {
    title: "Global Forex & Metals",
    body: "Research across major currency pairs and precious metals, with particular attention to EURUSD and gold. The approach considers macroeconomic events, market structure, liquidity, and global trading-session dynamics.",
  },
  {
    title: "Indian Financial Markets",
    body: "Research focused on Indian equity indices, index derivatives, and selected equity-market opportunities. Areas of study include broader market conditions, price structure, risk, and instrument-specific behavior.",
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
          Arthamont is an independent trading and market research initiative founded on a simple conviction: lasting
          success in financial markets is built through disciplined decision-making, rigorous research, and an
          unwavering commitment to risk management.
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
          Operating across US futures, global foreign exchange, and Indian financial markets, Arthamont represents
          the pursuit of a structured, research-driven approach to understanding markets and navigating uncertainty.
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
          What begins with independent trading and research carries a greater ambition — to establish the foundations
          of an enduring financial institution, built to evolve across markets, investment disciplines, and
          generations.
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
              Arthamont began with an interest in understanding financial markets — how capital moves, how price is
              delivered, and how disciplined participants approach risk and opportunity.
            </p>
            <p>
              That curiosity developed into a commitment to studying market structure, institutional trading
              concepts, liquidity, and the relationship between time and price.
            </p>
            <p>
              Over time, the focus evolved beyond identifying profitable opportunities toward developing a repeatable
              process grounded in preparation, execution, and reflection.
            </p>
            <p>
              Today, Arthamont serves as an independent platform for market research, trading documentation, and the
              continuous refinement of that process.
            </p>
            <p>
              The ambition extends beyond trading alone. The long-term vision is to develop the knowledge,
              infrastructure, and principles required to build a respected investment organization.
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
            Protecting capital is foundational.
          </h2>
        </RevealText>
        <Reveal delay={0.1}>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-text-secondary">
            <p>Risk management is not a secondary consideration. It is part of every decision.</p>
            <p>
              Our trading process emphasizes predefined risk, position sizing based on invalidation levels,
              disciplined exposure limits, and careful review of execution.
            </p>
            <p>
              Every position must have a clear rationale, an acceptable level of risk, and a defined plan before
              capital is committed.
            </p>
            <p>Opportunities will always exist. Preserving the ability to participate in them is essential.</p>
          </div>
        </Reveal>
      </section>

      {/* ── Long-term vision ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="Long-term vision">
        <MicroLabel>The Long-Term Vision</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-medium sm:text-4xl">
            Building an institution that endures.
          </h2>
        </RevealText>
        <Reveal delay={0.1}>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-text-secondary">
            <p>
              Arthamont&apos;s ambition extends beyond individual trades, market cycles, or short-term performance.
            </p>
            <p>
              The vision is to gradually establish a respected financial organization rooted in independent research,
              disciplined capital allocation, responsible governance, and long-term value creation.
            </p>
            <p>
              Future aspirations include exploring opportunities in investment management, private capital, and
              broader financial services, subject to the experience, resources, and regulatory authorizations those
              activities require.
            </p>
            <p>The measure of that journey will not be speed, but the quality and durability of what is built.</p>
          </div>
          <p className="font-display mt-8 border-l-2 border-accent pl-6 text-xl italic text-text sm:text-2xl">
            Our horizon is generational. Our foundation is discipline.
          </p>
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
            Arthamont is built on the belief that enduring financial success comes from sound judgment, thoughtful
            risk-taking, and the consistent application of principles. The objective is not to predict every market
            movement — it is to develop the knowledge, discipline, and institutional foundations required to navigate
            uncertainty with clarity.
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
          Independent Trading &amp; Market Research
        </p>
        <p className="mx-auto mt-6 max-w-lg text-[11px] leading-relaxed text-text-faint">
          Current activities comprise independent trading and research. Future institutional ambitions do not imply
          that Arthamont currently operates as a regulated investment fund, asset manager, or bank.
        </p>
      </div>
    </div>
  );
}
