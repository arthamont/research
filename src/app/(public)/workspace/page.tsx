import type { Metadata } from "next";
import { MicroLabel, ButtonLink } from "@/components/ui/primitives";
import { Reveal, RevealText } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Workspace",
  description: "The NAYXOR private trading headquarters — daily preparation, journaling, analytics, and review.",
};

const features = [
  {
    title: "Daily preparation",
    body: "Mindset check-in, directional narrative, planned scenarios, key levels, and session focus — before the first candle prints.",
    items: ["Readiness notes", "Market selection", "Scenarios A/B", "Economic awareness"],
  },
  {
    title: "Trading journal",
    body: "Every trade documented with screenshots, thesis, execution notes, emotional state, mistakes, and lessons.",
    items: ["Entry / stop / target", "R-multiples", "Strategy tags", "Publish controls"],
  },
  {
    title: "Execution analytics",
    body: "Metrics that measure process, not just P&L — rule adherence, setup quality, consistency, expectancy.",
    items: ["Expectancy & profit factor", "By instrument / session / setup", "Equity curve", "Drawdown"],
  },
  {
    title: "Session command center",
    body: "Asia, London, New York, and India sessions with timezone awareness, progress, and transitions.",
    items: ["Live session status", "DST-aware", "Next transition", "Configurable hours"],
  },
  {
    title: "Checklists & reviews",
    body: "Preparation, execution, and post-session checklists plus structured daily and weekly reviews.",
    items: ["Checklist history", "Completion trends", "Weekly action plans", "Recurring mistakes"],
  },
  {
    title: "Risk monitoring",
    body: "Configurable daily limits, loss tracking, and rule-violation warnings tied to the owner's own framework.",
    items: ["Max trades/day", "Risk % per account", "Loss monitoring", "Violation alerts"],
  },
];

export default function WorkspacePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8">
      <MicroLabel>Private headquarters</MicroLabel>
      <RevealText>
        <h1 className="display-xl mt-4 text-5xl sm:text-7xl">
          One workspace.
          <br />
          Total clarity.
        </h1>
      </RevealText>
      <Reveal delay={0.15}>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
          The NAYXOR terminal is the private side of this site — where preparation happens, trades are journaled,
          and execution is graded. Everything below requires authentication.
        </p>
      </Reveal>

      <div className="mt-20 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06} className="bg-bg">
            <div className="h-full bg-bg p-8">
              <p className="numeric text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{f.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{f.body}</p>
              <ul className="mt-5 space-y-1.5">
                {f.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 font-mono text-[11px] text-text-faint">
                    <span className="h-1 w-1 bg-accent" aria-hidden />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="mt-16 flex flex-wrap items-center gap-4">
        <ButtonLink href="/login" variant="primary">
          Sign in to workspace
        </ButtonLink>
        <p className="text-xs text-text-faint">Owner access only — no public registration.</p>
      </Reveal>
    </div>
  );
}
