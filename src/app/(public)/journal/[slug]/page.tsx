import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Markdown } from "@/components/markdown";
import { MicroLabel, Tag } from "@/components/ui/primitives";
import { formatDate, formatR, formatNumber } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await db.caseStudy.findUnique({ where: { slug } });
  if (!c || c.status !== "PUBLISHED") return { title: "Not found" };
  return {
    title: c.seoTitle ?? c.title,
    description: c.seoDescription ?? c.summary ?? undefined,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await db.caseStudy.findUnique({ where: { slug } });
  if (!c || c.status !== "PUBLISHED") notFound();

  const stats: [string, string][] = [
    ["Instrument", c.instrument],
    ["Market", c.market],
    ["Direction", c.direction],
    ["Session", c.session ?? "—"],
    ["Setup", c.setup ?? "—"],
    ["Planned R:R", c.rrPlanned ? `1:${formatNumber(c.rrPlanned.toString(), 1)}` : "—"],
    ["Outcome", formatR(c.rrActual?.toString() ?? null)],
    ["Grade", c.grade ? `${c.grade}/5` : "—"],
  ];

  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-40 sm:px-8">
      <Link href="/journal" className="font-mono text-xs uppercase tracking-[0.16em] text-text-secondary hover:text-accent-text">
        ← Journal
      </Link>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <MicroLabel>{formatDate(c.tradeDate)}</MicroLabel>
        {c.isDemo && <Tag>Demo entry</Tag>}
      </div>
      <h1 className="display-xl mt-4 text-4xl sm:text-5xl">{c.title}</h1>
      {c.summary && <p className="mt-6 text-lg leading-relaxed text-text-secondary">{c.summary}</p>}

      <dl className="mt-12 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="bg-bg p-4">
            <dt className="micro-label">{k}</dt>
            <dd className="numeric mt-2 text-sm">{v}</dd>
          </div>
        ))}
      </dl>

      {c.chartImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.chartImage} alt={`${c.title} — annotated chart`} className="mt-12 w-full border border-border" />
      )}

      <Markdown content={c.content} className="mt-14" />

      {c.tags.length > 0 && (
        <div className="mt-14 flex flex-wrap gap-2 border-t border-border pt-8">
          {c.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}

      <p className="mt-12 border-t border-border pt-8 text-xs leading-relaxed text-text-faint">
        Personal trading journal entry. Shared for documentation and learning — not advice, not a signal,
        and not a claim about future results.
      </p>
    </article>
  );
}
