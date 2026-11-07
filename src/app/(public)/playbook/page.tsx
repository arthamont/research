import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Markdown } from "@/components/markdown";
import { MicroLabel, Tag, EmptyState } from "@/components/ui/primitives";
import { Reveal, RevealText } from "@/components/motion/reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Playbook",
  description: "The documented trading methodology — frameworks, models, and rules behind every NAYXOR trade.",
};

export default async function PlaybookPage() {
  const items = await db.playbookItem.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-40 sm:px-8">
      <MicroLabel>Methodology</MicroLabel>
      <RevealText>
        <h1 className="display-xl mt-4 text-5xl sm:text-7xl">The playbook.</h1>
      </RevealText>
      <Reveal delay={0.15}>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
          The documented framework behind every trade — how context is read, how setups are defined,
          and how risk is handled. Analytical models, not promises.
        </p>
      </Reveal>

      {items.length === 0 ? (
        <div className="mt-16">
          <EmptyState title="Playbook is being written" hint="Methodology entries will be published here as they're documented." />
        </div>
      ) : (
        <div className="mt-16 space-y-20">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <section id={item.slug} className="scroll-mt-28">
                <div className="flex items-center gap-4">
                  <span className="numeric text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="text-3xl font-semibold tracking-tight">{item.title}</h2>
                  {item.market && <Tag>{item.market}</Tag>}
                  {item.isDemo && <Tag>Demo</Tag>}
                </div>
                {item.summary && <p className="mt-4 text-lg leading-relaxed text-text-secondary">{item.summary}</p>}
                <Markdown content={item.content} className="mt-6" />
              </section>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
