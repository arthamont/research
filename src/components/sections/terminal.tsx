import { Reveal, RevealText } from "@/components/motion/reveal";
import { ButtonLink, SectionHeading } from "@/components/ui/primitives";

/** Static product preview of the private workspace — no real data shown. */

function Widget({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-border bg-bg-elevated p-4 ${className ?? ""}`}>
      <p className="micro-label mb-3">{title}</p>
      {children}
    </div>
  );
}

function Bar({ w, tone = "accent" }: { w: string; tone?: "accent" | "long" | "short" }) {
  const color = tone === "long" ? "var(--long)" : tone === "short" ? "var(--short)" : "var(--accent)";
  return (
    <div className="h-1 w-full bg-border">
      <div className="h-1" style={{ width: w, background: color }} />
    </div>
  );
}

export function TerminalSection() {
  return (
    <section className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <RevealText>
              <SectionHeading index="07" kicker="Private headquarters" title={<>One workspace.<br />Total clarity.</>} />
            </RevealText>
            <Reveal delay={0.15}>
              <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
                A private terminal for daily preparation, execution, and review — session monitoring, journaling,
                analytics, and checklists in one place. Account data stays behind authentication.
              </p>
            </Reveal>
            <Reveal delay={0.25} className="mt-10">
              <ButtonLink href="/workspace" variant="secondary">
                Explore the workspace
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="border border-border-strong bg-bg p-2 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-faint">
                  NAYXOR / Terminal — preview
                </span>
                <span className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 rounded-full border border-border-strong" />
                  ))}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3">
                <Widget title="Sessions">
                  <div className="space-y-2.5 text-xs">
                    {[
                      ["London", "closed"],
                      ["New York", "live"],
                      ["India", "opens 09:15"],
                    ].map(([s, st]) => (
                      <div key={s} className="flex items-center justify-between">
                        <span className="text-text-secondary">{s}</span>
                        <span className={`numeric ${st === "live" ? "text-long" : "text-text-faint"}`}>{st}</span>
                      </div>
                    ))}
                  </div>
                </Widget>
                <Widget title="Today’s plan">
                  <div className="space-y-2">
                    <Bar w="80%" />
                    <Bar w="45%" />
                    <Bar w="60%" />
                  </div>
                </Widget>
                <Widget title="Execution score">
                  <p className="numeric text-3xl">4.2<span className="text-sm text-text-faint">/5</span></p>
                  <p className="mt-1 text-[10px] text-text-faint">process, not P&L</p>
                </Widget>
                <Widget title="Risk monitor">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-text-secondary"><span>Trades</span><span className="numeric">1/1</span></div>
                    <div className="flex justify-between text-text-secondary"><span>Daily loss</span><span className="numeric text-long">0%</span></div>
                  </div>
                </Widget>
                <Widget title="Checklist">
                  <div className="space-y-1.5 text-xs">
                    {["HTF context", "Levels marked", "News checked"].map((c) => (
                      <div key={c} className="flex items-center gap-2 text-text-secondary">
                        <span className="h-2 w-2 border border-accent bg-accent/20" />
                        {c}
                      </div>
                    ))}
                  </div>
                </Widget>
                <Widget title="Week">
                  <div className="flex items-end gap-1">
                    {[40, 70, 55, 90, 65].map((h, i) => (
                      <div key={i} className="w-full bg-accent/60" style={{ height: `${h * 0.5}px` }} />
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-text-faint">consistency</p>
                </Widget>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
