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
    <section className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="03" kicker="Philosophy" title={<>The edge is not<br />in the noise.</>} />
        </RevealText>
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary">
            Preparation creates clarity. Discipline governs execution. Consistency is built one decision at a time.
          </p>
        </Reveal>

        <div className="mt-20 border-t border-border">
          {principles.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.06}>
              <div className="group grid grid-cols-[auto_1fr] items-baseline gap-6 border-b border-border py-7 transition-colors hover:bg-surface sm:grid-cols-[80px_280px_1fr] sm:gap-10 sm:px-4">
                <span className="numeric text-sm text-accent">{p.n}</span>
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{p.title}</h3>
                <p className="col-span-2 text-sm leading-relaxed text-text-secondary sm:col-span-1">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
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
