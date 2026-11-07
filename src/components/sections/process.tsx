import { Reveal, RevealText } from "@/components/motion/reveal";
import { ButtonLink, MicroLabel, SectionHeading } from "@/components/ui/primitives";

const steps = [
  { title: "Higher-timeframe context", body: "Monthly, weekly, and daily structure define the directional narrative before any intraday idea exists." },
  { title: "Market structure", body: "Trend, range, or transition — the framework everything else hangs on." },
  { title: "Liquidity & key levels", body: "Session highs/lows, true opens, and resting pools of orders mark where price is drawn." },
  { title: "Timing & session context", body: "When matters as much as where — session profiles and the power of three frame the window." },
  { title: "Setup identification", body: "A defined model: fair value gaps, order blocks, and SMT divergence — or no trade." },
  { title: "Risk definition", body: "Entry, invalidation, and target fixed in advance. Position size follows risk, never conviction." },
  { title: "Execution", body: "Take the trade as planned. No chasing, no improvising, no negotiating with the stop." },
  { title: "Post-trade review", body: "Screenshots, notes, and a grade within 24 hours. Every trade becomes data." },
];

const frameworks = ["Quarterly Theory", "Power of Three", "Market structure", "Fair Value Gaps", "Order Blocks", "Liquidity", "Session profiles", "SMT divergence", "HTF bias"];

export function ProcessSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="04" kicker="Process" title={<>From observation<br />to execution.</>} />
        </RevealText>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_320px]">
          <ol className="relative space-y-0 border-l border-border">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <li className="group relative pb-10 pl-8 last:pb-0">
                  <span
                    className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] border border-accent bg-bg transition-colors group-hover:bg-accent"
                    aria-hidden
                  />
                  <div className="flex items-baseline gap-4">
                    <span className="numeric text-xs text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{s.title}</h3>
                  </div>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <div className="space-y-8 lg:sticky lg:top-32 lg:self-start">
            <div>
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
              <p className="mt-4 text-xs leading-relaxed text-text-faint">
                Analytical frameworks, not predictors. They structure observation — they don’t promise outcomes.
              </p>
            </div>
            <ButtonLink href="/playbook" variant="secondary">
              Explore the playbook
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
