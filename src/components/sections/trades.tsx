import Link from "next/link";
import { db } from "@/lib/db";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { ButtonLink, SectionHeading, Tag, EmptyState } from "@/components/ui/primitives";
import { formatDate, formatR, formatNumber } from "@/lib/utils";

export async function TradesSection() {
  const cases = await db.caseStudy.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { tradeDate: "desc" },
    take: 3,
  });

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="05" kicker="Case studies" title={<>Anatomy of<br />a trade.</>} />
        </RevealText>
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Beyond the entry and exit: the context, the decision, the execution, and the lesson.
          </p>
        </Reveal>

        {cases.length === 0 ? (
          <Reveal delay={0.2} className="mt-16">
            <EmptyState
              title="No published case studies yet"
              hint="Trades are published selectively after review. The archive grows as real executions are documented — nothing fabricated."
            />
          </Reveal>
        ) : (
          <div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
            {cases.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08} className="bg-bg">
                <Link href={`/journal/${c.slug}`} className="group flex h-full flex-col bg-bg p-8 transition-colors hover:bg-surface">
                  <div className="flex items-center justify-between">
                    <span className="numeric text-xs text-text-faint">{formatDate(c.tradeDate)}</span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                        c.direction === "LONG" ? "text-long" : "text-short"
                      }`}
                    >
                      {c.direction}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{c.title}</h3>
                  <p className="mt-1 font-mono text-xs text-text-secondary">
                    {c.instrument} · {c.market}
                  </p>
                  {c.summary && <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary">{c.summary}</p>}
                  <div className="mt-8 flex items-end justify-between">
                    <div>
                      <p className="micro-label">Outcome</p>
                      <p className="numeric mt-1 text-2xl">{formatR(c.rrActual?.toString() ?? null)}</p>
                    </div>
                    <div className="flex gap-2">
                      {c.setup && <Tag>{c.setup}</Tag>}
                      {c.isDemo && <Tag>Demo</Tag>}
                    </div>
                  </div>
                  {c.rrPlanned && (
                    <p className="mt-2 font-mono text-[10px] text-text-faint">
                      planned {formatNumber(c.rrPlanned.toString(), 1)}R
                    </p>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={0.25} className="mt-12">
          <ButtonLink href="/journal" variant="secondary">
            Browse the journal
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
