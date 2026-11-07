import { Reveal, RevealText } from "@/components/motion/reveal";
import { ButtonLink, MicroLabel, SectionHeading } from "@/components/ui/primitives";

const phases = [
  {
    label: "Research to execution",
    steps: [
      { title: "Observe", body: "Understand broader market conditions, economic developments, and price structure." },
      { title: "Analyze", body: "Identify meaningful market relationships, liquidity, and potential opportunities." },
      { title: "Plan", body: "Develop scenarios with defined objectives, risks, and invalidation conditions." },
      { title: "Execute", body: "Apply disciplined decision-making within established risk parameters." },
      { title: "Refine", body: "Review outcomes, evaluate decisions, and continuously improve the process." },
    ],
  },
];

let stepCounter = 0;
const numberedPhases = phases.map((phase) => ({
  ...phase,
  steps: phase.steps.map((s) => ({ ...s, n: String(++stepCounter).padStart(2, "0") })),
}));

export function ProcessSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* sticky rail */}
          <div>
            <div className="lg:sticky lg:top-28">
              <RevealText>
                <SectionHeading index="06" kicker="Research to Execution" title={<>Precision in thought.<br />Discipline in action.</>} />
              </RevealText>
              <Reveal delay={0.15}>
                <p className="mt-10 max-w-md text-lg leading-relaxed text-text-secondary">
                  Our approach follows a structured framework designed to bring clarity to complex market
                  environments.
                </p>
              </Reveal>
              <Reveal delay={0.35}>
                <div className="mt-10">
                  <ButtonLink href="/playbook" variant="secondary">
                    Explore our methodology
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>

          {/* phased spine */}
          <div>
            {numberedPhases.map((phase) => (
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
                    return (
                      <Reveal key={s.title} delay={i * 0.06}>
                        <li className="group relative flex gap-6 py-5 pl-0 sm:gap-8">
                          <span className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-bg font-mono text-[10px] text-text-faint transition-colors duration-300 group-hover:border-accent group-hover:text-accent" aria-hidden>
                            {s.n}
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
