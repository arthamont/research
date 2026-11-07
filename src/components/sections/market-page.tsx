import Link from "next/link";
import type { Market } from "@prisma/client";
import { db } from "@/lib/db";
import { MicroLabel, Tag, EmptyState } from "@/components/ui/primitives";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { formatDate, formatR } from "@/lib/utils";

export interface MarketPageConfig {
  market: Market;
  index: string;
  name: string;
  tagline: string;
  instruments: { symbol: string; name: string }[];
  sessionInfo: { label: string; value: string }[];
  focusAreas: string[];
}

export async function MarketPage({ config }: { config: MarketPageConfig }) {
  const [articles, cases] = await Promise.all([
    db.researchArticle.findMany({
      where: { status: "PUBLISHED", market: config.market },
      orderBy: { publishedAt: "desc" },
      take: 5,
    }),
    db.caseStudy.findMany({
      where: { status: "PUBLISHED", market: config.market },
      orderBy: { tradeDate: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8">
      <div className="flex items-center gap-4">
        <span className="numeric text-sm text-accent">{config.index}</span>
        <span className="h-px w-10 bg-border-strong" aria-hidden />
        <MicroLabel>Market focus</MicroLabel>
      </div>
      <RevealText>
        <h1 className="display-xl mt-4 text-5xl sm:text-7xl">{config.name}</h1>
      </RevealText>
      <Reveal delay={0.15}>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-text-secondary">{config.tagline}</p>
      </Reveal>

      <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-bg p-6">
          <MicroLabel>Instruments</MicroLabel>
          <ul className="mt-4 space-y-2">
            {config.instruments.map((i) => (
              <li key={i.symbol}>
                <span className="font-mono text-sm">{i.symbol}</span>
                <span className="ml-2 text-xs text-text-faint">{i.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-bg p-6">
          <MicroLabel>Sessions</MicroLabel>
          <ul className="mt-4 space-y-2">
            {config.sessionInfo.map((s) => (
              <li key={s.label} className="text-sm">
                <span className="text-text-secondary">{s.label}</span>
                <span className="numeric ml-2 text-xs">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-bg p-6 sm:col-span-2">
          <MicroLabel>Focus areas</MicroLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {config.focusAreas.map((f) => (
              <Tag key={f}>{f}</Tag>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20 grid gap-16 lg:grid-cols-2">
        <section aria-label={`${config.name} research`}>
          <h2 className="text-2xl font-semibold tracking-tight">Latest research</h2>
          {articles.length === 0 ? (
            <div className="mt-8">
              <EmptyState title="No published research yet" hint="Research for this market will appear here once published." />
            </div>
          ) : (
            <ul className="mt-8 border-t border-border">
              {articles.map((a) => (
                <li key={a.id}>
                  <Link href={`/outlook/${a.slug}`} className="group block border-b border-border py-5 transition-colors hover:bg-surface sm:px-3">
                    <p className="numeric text-[11px] text-text-faint">{a.publishedAt ? formatDate(a.publishedAt) : ""}</p>
                    <h3 className="mt-1.5 font-semibold tracking-tight transition-colors group-hover:text-accent-text">
                      {a.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-label={`${config.name} journal`}>
          <h2 className="text-2xl font-semibold tracking-tight">Journal entries</h2>
          {cases.length === 0 ? (
            <div className="mt-8">
              <EmptyState title="No published entries yet" hint="Trade case studies for this market will appear here once published." />
            </div>
          ) : (
            <ul className="mt-8 border-t border-border">
              {cases.map((c) => (
                <li key={c.id}>
                  <Link href={`/journal/${c.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-border py-5 transition-colors hover:bg-surface sm:px-3">
                    <div>
                      <p className="numeric text-[11px] text-text-faint">{formatDate(c.tradeDate)}</p>
                      <h3 className="mt-1.5 font-semibold tracking-tight transition-colors group-hover:text-accent-text">
                        {c.title}
                      </h3>
                    </div>
                    <span className="numeric text-sm">{formatR(c.rrActual?.toString() ?? null)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
