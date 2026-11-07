import { Reveal, RevealText } from "@/components/motion/reveal";
import { SectionHeading, MicroLabel } from "@/components/ui/primitives";

const principles = [
  { n: "01", title: "Patience", body: "No trade is better than a forced trade." },
  { n: "02", title: "Precision", body: "A defined setup. A clear invalidation. A planned outcome." },
  { n: "03", title: "Risk", body: "Capital preservation comes before opportunity." },
  { n: "04", title: "Discipline", body: "Execution is measured by adherence to process, not a single result." },
  { n: "05", title: "Reflection", body: "Every trade is information. Every review is an opportunity to improve." },
];

const measures = [
  { title: "Rule adherence", body: "Did the trade follow the plan — not whether it won." },
  { title: "Planned vs impulsive", body: "The share of trades that existed before the session did." },
  { title: "Journal completion", body: "Every trade documented, every review written." },
  { title: "Risk consistency", body: "Same exposure logic, every single position." },
  { title: "Setup quality", body: "Grade the entry by criteria met, not by outcome." },
  { title: "Weekly improvement", body: "One identified weakness, one committed fix." },
];

export function PhilosophySection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-bg-elevated">
      {/* faint oversized background glyph */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 top-6 select-none font-display text-[22rem] font-bold leading-none tracking-tighter text-text opacity-[0.03]"
      >
        ×
      </span>

      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* sticky manifesto */}
          <div>
            <div className="lg:sticky lg:top-28">
              <RevealText>
                <SectionHeading index="03" kicker="Philosophy" title={<>The edge is not<br />in the noise.</>} />
              </RevealText>
              <Reveal delay={0.15}>
                <p className="mt-10 border-l-2 border-accent pl-6 text-xl leading-relaxed text-text sm:text-2xl">
                  Preparation creates clarity.<br />
                  Discipline governs execution.<br />
                  Consistency is built one decision at a time.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="mt-8 max-w-md font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-text-faint">
                  Five operating rules — the same ones, every session, every market.
                </p>
              </Reveal>
            </div>
          </div>

          {/* principle ledger */}
          <div>
            {principles.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08}>
                <div className="group relative border-t border-border py-10 last:border-b">
                  {/* ghost numeral */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-2 right-0 select-none font-display text-[7rem] font-bold leading-none tracking-tighter text-text opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.14] sm:text-[9rem]"
                  >
                    {p.n}
                  </span>
                  <div className="relative max-w-lg">
                    <p className="numeric font-mono text-xs tracking-[0.2em] text-accent">{p.n}</p>
                    <h3 className="display-xl mt-4 text-3xl sm:text-4xl">
                      <span className="transition-colors duration-300 group-hover:text-accent-text">{p.title}</span>
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-text-secondary">{p.body}</p>
                  </div>
                  {/* hover underline accent */}
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProcessOverProfitsSection() {
  return (
    <section className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="08" kicker="Execution quality" title={<>Measure what<br />you can control.</>} />
        </RevealText>
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary">
            Profitability is a byproduct. The dashboard tracks the inputs: process, discipline, and review —
            the parts of trading that are actually mine to control.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {measures.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.07} className="bg-bg-elevated">
              <div className="h-full bg-bg-elevated p-8">
                <MicroLabel>{String(i + 1).padStart(2, "0")}</MicroLabel>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
