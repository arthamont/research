import Link from "next/link";
import { db } from "@/lib/db";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { ButtonLink, SectionHeading, Tag, EmptyState } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

export async function ResearchSection() {
  const articles = await db.researchArticle.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="07" kicker="Arthamont Research" title={<>Perspectives that<br />matter.</>} />
        </RevealText>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
            Markets are constantly evolving. Our research documents the ideas, observations, and analytical
            frameworks shaping our perspective — market outlooks, technical studies, macroeconomic developments, and
            detailed trading case studies.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Market Outlooks", b: "Weekly perspectives on major financial markets." },
              { t: "Market Structure", b: "Studies of liquidity, price behavior, and market dynamics." },
              { t: "Trade Case Studies", b: "Documented decisions, execution reviews, and lessons." },
              { t: "Macroeconomic Insights", b: "Analysis of important economic events and their potential market implications." },
            ].map((c) => (
              <div key={c.t} className="bg-bg p-6">
                <p className="micro-label">{c.t}</p>
                <p className="mt-3 text-xs leading-relaxed text-text-secondary">{c.b}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {articles.length === 0 ? (
          <Reveal delay={0.2} className="mt-16">
            <EmptyState
              title="Latest published research articles will appear here automatically."
              hint="Weekly outlooks and market-structure studies will appear here once published."
            />
          </Reveal>
        ) : (
          <div className="mt-16 border-t border-border">
            {articles.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <Link
                  href={`/outlook/${a.slug}`}
                  className="group grid gap-3 border-b border-border py-8 transition-colors hover:bg-surface sm:grid-cols-[110px_1fr_auto] sm:items-baseline sm:gap-8 sm:px-4"
                >
                  <span className="numeric text-xs text-text-faint">
                    {a.publishedAt ? formatDate(a.publishedAt) : "—"}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-accent-text sm:text-2xl">
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{a.excerpt}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {a.market && <Tag>{a.market}</Tag>}
                      {a.tags.slice(0, 3).map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                      {a.isDemo && <Tag>Demo</Tag>}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-text-faint">
                    {a.readingTime ? `${a.readingTime} min` : ""}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={0.25} className="mt-12">
          <ButtonLink href="/outlook" variant="secondary">
            Explore all research
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
