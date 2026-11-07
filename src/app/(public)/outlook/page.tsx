import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { MicroLabel, Tag, EmptyState } from "@/components/ui/primitives";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { formatDate } from "@/lib/utils";
import type { Market } from "@prisma/client";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Outlook",
  description: "Market research and weekly outlooks across futures, forex, and Indian markets.",
};

const MARKETS: Market[] = ["FUTURES", "FOREX", "INDIA"];

export default async function OutlookPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string; tag?: string; q?: string }>;
}) {
  const params = await searchParams;
  const market = MARKETS.find((m) => m === params.market);
  const tag = params.tag;
  const q = params.q?.trim();

  const articles = await db.researchArticle.findMany({
    where: {
      status: "PUBLISHED",
      ...(market ? { market } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
  });

  const allTags = await db.researchArticle.findMany({
    where: { status: "PUBLISHED" },
    select: { tags: true },
  });
  const tags = [...new Set(allTags.flatMap((a) => a.tags))].slice(0, 12);

  const href = (updates: Record<string, string | undefined>) => {
    const merged = { market: params.market, tag: params.tag, q: params.q, ...updates };
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join("&");
    return `/outlook${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8">
      <MicroLabel>Research archive</MicroLabel>
      <RevealText>
        <h1 className="display-xl mt-4 text-5xl sm:text-7xl">The market, through my lens.</h1>
      </RevealText>
      <Reveal delay={0.15}>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-text-secondary">
          Weekly outlooks, higher-timeframe observations, session recaps, and market-structure studies.
        </p>
      </Reveal>

      <div className="mt-12 space-y-4 border-y border-border py-4">
        <form method="get" className="flex gap-3">
          {params.market && <input type="hidden" name="market" value={params.market} />}
          {params.tag && <input type="hidden" name="tag" value={params.tag} />}
          <input
            type="search"
            name="q"
            defaultValue={params.q}
            placeholder="Search research…"
            className="w-full max-w-sm border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="border border-border-strong px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary transition-colors hover:border-accent hover:text-accent-text"
          >
            Search
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/outlook"
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${!params.market && !params.tag ? "border-accent text-accent-text" : "border-border text-text-secondary hover:border-border-strong"}`}
          >
            All
          </Link>
          {MARKETS.map((m) => (
            <Link
              key={m}
              href={href({ market: params.market === m ? undefined : m })}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${params.market === m ? "border-accent text-accent-text" : "border-border text-text-secondary hover:border-border-strong"}`}
            >
              {m}
            </Link>
          ))}
          {tags.map((t) => (
            <Link
              key={t}
              href={href({ tag: params.tag === t ? undefined : t })}
              className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] ${params.tag === t ? "border-accent text-accent-text" : "border-border text-text-secondary hover:border-border-strong"}`}
            >
              #{t}
            </Link>
          ))}
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="mt-16">
          <EmptyState title="No research found" hint="Nothing published under this filter yet." />
        </div>
      ) : (
        <div className="mt-12 border-t border-border">
          {articles.map((a, i) => (
            <Reveal key={a.id} delay={Math.min(i, 4) * 0.05}>
              <Link
                href={`/outlook/${a.slug}`}
                className="group grid gap-3 border-b border-border py-8 transition-colors hover:bg-surface sm:grid-cols-[110px_1fr_auto] sm:items-baseline sm:gap-8 sm:px-4"
              >
                <span className="numeric text-xs text-text-faint">{a.publishedAt ? formatDate(a.publishedAt) : "—"}</span>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-accent-text sm:text-2xl">
                    {a.title}
                  </h2>
                  {a.excerpt && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{a.excerpt}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {a.market && <Tag>{a.market}</Tag>}
                    {a.instruments.slice(0, 4).map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                    {a.isDemo && <Tag>Demo</Tag>}
                  </div>
                </div>
                <span className="font-mono text-xs text-text-faint">{a.readingTime ? `${a.readingTime} min` : ""}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
