import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Markdown } from "@/components/markdown";
import { MicroLabel, Tag } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await db.researchArticle.findUnique({ where: { slug } });
  if (!a || a.status !== "PUBLISHED") return { title: "Not found" };
  return {
    title: a.seoTitle ?? a.title,
    description: a.seoDescription ?? a.excerpt ?? undefined,
    openGraph: { type: "article", publishedTime: a.publishedAt?.toISOString() },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await db.researchArticle.findUnique({ where: { slug } });
  if (!a || a.status !== "PUBLISHED") notFound();

  const related = await db.researchArticle.findMany({
    where: { status: "PUBLISHED", id: { not: a.id }, ...(a.market ? { market: a.market } : {}) },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-40 sm:px-8">
      <Link href="/outlook" className="font-mono text-xs uppercase tracking-[0.16em] text-text-secondary hover:text-accent-text">
        ← Outlook
      </Link>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <MicroLabel>
          {a.publishedAt ? formatDate(a.publishedAt) : ""}
          {a.readingTime ? ` · ${a.readingTime} min read` : ""}
        </MicroLabel>
        {a.isDemo && <Tag>Demo content</Tag>}
      </div>
      <h1 className="display-xl mt-4 text-4xl sm:text-5xl">{a.title}</h1>
      {a.excerpt && <p className="mt-6 text-lg leading-relaxed text-text-secondary">{a.excerpt}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {a.market && <Tag>{a.market}</Tag>}
        {a.instruments.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>

      {a.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.coverImage} alt={a.title} className="mt-12 w-full border border-border" />
      )}

      <Markdown content={a.content} className="mt-14" />

      {a.tags.length > 0 && (
        <div className="mt-14 flex flex-wrap gap-2 border-t border-border pt-8">
          {a.tags.map((t) => (
            <Tag key={t}>#{t}</Tag>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <aside className="mt-16 border-t border-border pt-10" aria-label="Related research">
          <MicroLabel>Related research</MicroLabel>
          <ul className="mt-6 space-y-4">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/outlook/${r.slug}`} className="group flex items-baseline justify-between gap-4">
                  <span className="font-semibold tracking-tight transition-colors group-hover:text-accent-text">
                    {r.title}
                  </span>
                  <span className="numeric shrink-0 text-xs text-text-faint">
                    {r.publishedAt ? formatDate(r.publishedAt) : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <p className="mt-12 border-t border-border pt-8 text-xs leading-relaxed text-text-faint">
        Personal market research and opinion. Educational documentation only — not investment advice or a
        recommendation to trade any instrument.
      </p>
    </article>
  );
}
