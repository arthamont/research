import { Reveal, RevealText } from "@/components/motion/reveal";
import { ButtonLink, MicroLabel, SectionHeading } from "@/components/ui/primitives";

const phases = [
  {
    label: "Observation",
    steps: [
      { title: "Higher-timeframe context", body: "Monthly, weekly, and daily structure define the directional narrative before any intraday idea exists." },
      { title: "Market structure", body: "Trend, range, or transition — the framework everything else hangs on." },
      { title: "Liquidity & key levels", body: "Session highs/lows, true opens, and resting pools of orders mark where price is drawn." },
      { title: "Timing & session context", body: "When matters as much as where — session profiles and the power of three frame the window." },
      { title: "Setup identification", body: "A defined model: fair value gaps, order blocks, and SMT divergence — or no trade." },
    ],
  },
  {
    label: "Execution",
    steps: [
      { title: "Risk definition", body: "Entry, invalidation, and target fixed in advance. Position size follows risk, never conviction." },
      { title: "Execution", body: "Take the trade as planned. No chasing, no improvising, no negotiating with the stop." },
      { title: "Post-trade review", body: "Screenshots, notes, and a grade within 24 hours. Every trade becomes data." },
    ],
  },
];

const frameworks = ["Quarterly Theory", "Power of Three", "Market structure", "Fair Value Gaps", "Order Blocks", "Liquidity", "Session profiles", "SMT divergence", "HTF bias"];

export function ProcessSection() {
  let stepNo = 0;
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* sticky rail */}
          <div>
            <div className="lg:sticky lg:top-28">
              <RevealText>
                <SectionHeading index="04" kicker="Process" title={<>From observation<br />to execution.</>} />
              </RevealText>
              <Reveal delay={0.15}>
                <p className="mt-10 max-w-md text-lg leading-relaxed text-text-secondary">
                  Eight steps, two phases. Everything before the entry exists so the entry
                  needs no second thought.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-10">
                  <MicroLabel>Frameworks referenced</MicroLabel>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {frameworks.map((f) => (
                      <li
                        key={f}
                        className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 max-w-sm text-xs leading-relaxed text-text-faint">
                    Analytical frameworks, not predictors. They structure observation — they don’t promise outcomes.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.35}>
                <div className="mt-8">
                  <ButtonLink href="/playbook" variant="secondary">
                    Explore the playbook
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>

          {/* phased spine */}
          <div>
            {phases.map((phase) => (
              <div key={phase.label} className="mb-14 last:mb-0">
                <Reveal>
                  <div className="mb-2 flex items-center gap-4">
                    <MicroLabel className="text-accent-text">{phase.label}</MicroLabel>
                    <span className="h-px flex-1 bg-border" aria-hidden />
                  </div>
                </Reveal>
                <ol className="relative">
                  {/* spine */}
                  <span aria-hidden className="absolute bottom-5 left-[13px] top-5 w-px bg-border" />
                  {phase.steps.map((s, i) => {
                    stepNo += 1;
                    const n = String(stepNo).padStart(2, "0");
                    return (
                      <Reveal key={s.title} delay={i * 0.06}>
                        <li className="group relative flex gap-6 py-5 pl-0 sm:gap-8">
                          <span className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-bg font-mono text-[10px] text-text-faint transition-colors duration-300 group-hover:border-accent group-hover:text-accent" aria-hidden>
                            {n}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-accent-text sm:text-2xl">
                              {s.title}
                            </h3>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">{s.body}</p>
                          </div>
                        </li>
                      </Reveal>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
