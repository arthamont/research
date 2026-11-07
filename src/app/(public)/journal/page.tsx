import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { MicroLabel, Tag, EmptyState } from "@/components/ui/primitives";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { formatDate, formatR } from "@/lib/utils";
import type { Market } from "@prisma/client";

export const metadata: Metadata = {
  title: "Journal",
  description: "Public trade case studies — the context, the decision, the execution, and the lesson.",
};

const MARKETS: { value: Market; label: string }[] = [
  { value: "FUTURES", label: "Futures" },
  { value: "FOREX", label: "Forex" },
  { value: "INDIA", label: "India" },
];

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string; instrument?: string; setup?: string }>;
}) {
  const params = await searchParams;
  const market = MARKETS.find((m) => m.value === params.market)?.value;
  const instrument = params.instrument?.toUpperCase();
  const setup = params.setup;

  const where = {
    status: "PUBLISHED" as const,
    ...(market ? { market } : {}),
    ...(instrument ? { instrument: { contains: instrument } } : {}),
    ...(setup ? { setup: { contains: setup, mode: "insensitive" as const } } : {}),
  };

  const [cases, instruments, setups] = await Promise.all([
    db.caseStudy.findMany({ where, orderBy: { tradeDate: "desc" } }),
    db.caseStudy.findMany({ where: { status: "PUBLISHED" }, select: { instrument: true }, distinct: ["instrument"] }),
    db.caseStudy.findMany({ where: { status: "PUBLISHED", setup: { not: null } }, select: { setup: true }, distinct: ["setup"] }),
  ]);

  const filterHref = (updates: Record<string, string | undefined>) => {
    const merged = { market: params.market, instrument: params.instrument, setup: params.setup, ...updates };
    const q = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join("&");
    return `/journal${q ? `?${q}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8">
      <MicroLabel>Public journal</MicroLabel>
      <RevealText>
        <h1 className="display-xl mt-4 text-5xl sm:text-7xl">Anatomy of a trade.</h1>
      </RevealText>
      <Reveal delay={0.15}>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-text-secondary">
          Selectively published case studies — context, hypothesis, execution, and the honest lesson.
          Only reviewed trades make it here.
        </p>
      </Reveal>

      {/* Filters */}
      <div className="mt-12 flex flex-wrap items-center gap-2 border-y border-border py-4">
        <MicroLabel className="mr-3">Filter</MicroLabel>
        <Link
          href="/journal"
          className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
            !params.market && !params.instrument && !params.setup
              ? "border-accent text-accent-text"
              : "border-border text-text-secondary hover:border-border-strong"
          }`}
        >
          All
        </Link>
        {MARKETS.map((m) => (
          <Link
            key={m.value}
            href={filterHref({ market: params.market === m.value ? undefined : m.value })}
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              params.market === m.value
                ? "border-accent text-accent-text"
                : "border-border text-text-secondary hover:border-border-strong"
            }`}
          >
            {m.label}
          </Link>
        ))}
        {instruments.slice(0, 6).map((i) => (
          <Link
            key={i.instrument}
            href={filterHref({ instrument: params.instrument === i.instrument ? undefined : i.instrument })}
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              params.instrument === i.instrument
                ? "border-accent text-accent-text"
                : "border-border text-text-secondary hover:border-border-strong"
            }`}
          >
            {i.instrument}
          </Link>
        ))}
        {setups.map((s) => (
          <Link
            key={s.setup}
            href={filterHref({ setup: params.setup === s.setup! ? undefined : s.setup! })}
            className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] transition-colors ${
              params.setup === s.setup
                ? "border-accent text-accent-text"
                : "border-border text-text-secondary hover:border-border-strong"
            }`}
          >
            {s.setup}
          </Link>
        ))}
      </div>

      {cases.length === 0 ? (
        <div className="mt-16">
          <EmptyState
            title="No case studies match"
            hint="Nothing published under this filter yet — or the archive is still being built. Check back soon."
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i, 5) * 0.06} className="bg-bg">
              <Link href={`/journal/${c.slug}`} className="group flex h-full flex-col bg-bg p-7 transition-colors hover:bg-surface">
                <div className="flex items-center justify-between">
                  <span className="numeric text-[11px] text-text-faint">{formatDate(c.tradeDate)}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${c.direction === "LONG" ? "text-long" : "text-short"}`}>
                    {c.direction}
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-semibold tracking-tight transition-colors group-hover:text-accent-text">
                  {c.title}
                </h2>
                <p className="mt-1 font-mono text-xs text-text-secondary">
                  {c.instrument} · {c.market}{c.session ? ` · ${c.session}` : ""}
                </p>
                {c.summary && <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-3">{c.summary}</p>}
                <div className="mt-6 flex items-end justify-between">
                  <p className="numeric text-xl">{formatR(c.rrActual?.toString() ?? null)}</p>
                  <div className="flex gap-2">
                    {c.setup && <Tag>{c.setup}</Tag>}
                    {c.isDemo && <Tag>Demo</Tag>}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      <p className="mt-12 max-w-2xl text-xs leading-relaxed text-text-faint">
        Entries marked “Demo” are clearly-labeled demonstration records shown while the real archive is built.
        Nothing here is a performance claim or a recommendation to trade.
      </p>
    </div>
  );
}
