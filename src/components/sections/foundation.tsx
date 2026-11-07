import Link from "next/link";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { ButtonLink, MicroLabel, SectionHeading } from "@/components/ui/primitives";

/* ── 02 — Who We Are ─────────────────────────────────────────────────── */

export function FoundationSection() {
  return (
    <section className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="02" kicker="Our Foundation" title={<>A vision beyond<br />markets.</>} />
        </RevealText>
        <Reveal delay={0.15}>
          <div className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-text-secondary">
            <p>
              Arthamont is built at the intersection of financial markets, research, and technology.
            </p>
            <p>
              Our approach combines independent thinking, analytical precision, and disciplined risk management to
              understand market opportunities and navigate uncertainty.
            </p>
            <p>
              What begins with market research and trading is driven by a greater vision — building the foundations
              of an enduring financial institution.
            </p>
          </div>
          <div className="mt-10">
            <ButtonLink href="/about" variant="secondary">Discover our story</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 03 — What We Do ─────────────────────────────────────────────────── */

const focus = [
  {
    n: "01",
    title: "Capital Markets",
    body: "Studying global financial markets through price behavior, liquidity, market structure, and macroeconomic developments.",
  },
  {
    n: "02",
    title: "Research & Analysis",
    body: "Developing structured market perspectives through technical research, data analysis, and continuous observation.",
  },
  {
    n: "03",
    title: "Trading & Risk Strategy",
    body: "Applying disciplined risk frameworks, systematic preparation, and measured execution to financial-market decisions.",
  },
];

export function FocusSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading
            index="03"
            kicker="Our Core Focus"
            title={<>Understanding markets.<br />Building perspective.</>}
          />
        </RevealText>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-text-secondary">
            Our work is centered on three fundamental disciplines.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-px border border-border bg-border lg:grid-cols-3">
          {focus.map((f, i) => (
            <Reveal key={f.n} delay={i * 0.08} className="bg-bg">
              <div className="h-full bg-bg p-8 lg:p-10">
                <p className="numeric font-mono text-xs tracking-[0.2em] text-accent">{f.n}</p>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <p className="font-display mt-10 text-lg italic text-text-secondary">
            Research informs conviction. Discipline governs execution.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 08 — The Vision ─────────────────────────────────────────────────── */

export function VisionSection() {
  return (
    <section className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="08" kicker="Looking Beyond the Present" title={<>Building for<br />generations.</>} />
        </RevealText>
        <Reveal delay={0.15}>
          <div className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-text-secondary">
            <p>Arthamont&apos;s ambition extends beyond trading and market research.</p>
            <p>
              Our long-term vision is to develop a respected financial institution built on analytical excellence,
              responsible capital stewardship, technological innovation, and disciplined investment principles.
            </p>
            <p>
              Over time, that ambition may extend into investment management, private capital, and broader financial
              services, subject to the necessary capabilities and regulatory authorizations.
            </p>
            <p>
              The objective is not simply to participate in financial markets, but to build something meaningful,
              resilient, and enduring.
            </p>
          </div>
          <p className="font-display mt-10 border-l-2 border-accent pl-6 text-xl italic text-text sm:text-2xl">
            Our ambition is generational. Our approach is deliberate.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 09 — Meet the Founder ───────────────────────────────────────────── */

export function FounderSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="09" kicker="The Mind Behind Arthamont" title={<>Engineering precision.<br />Financial vision.</>} />
        </RevealText>
        <Reveal delay={0.15}>
          <div className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-text-secondary">
            <p>
              With 3 years of experience in software engineering and 2 years in financial markets, Arthamont&apos;s
              founder brings together technology, analytical thinking, and disciplined market research.
            </p>
            <p>
              The long-term ambition is to combine financial expertise and technological innovation to build an
              enduring institution grounded in conviction, discipline, and longevity.
            </p>
          </div>
          <div className="mt-10">
            <ButtonLink href="/about" variant="secondary">Meet the founder</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
