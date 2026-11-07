import type { Metadata } from "next";
import { db } from "@/lib/db";
import { MicroLabel } from "@/components/ui/primitives";
import { Reveal, RevealText } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "The person behind NAYXOR — an independent trader documenting the pursuit of better decisions.",
};

interface TimelineItem {
  year: string;
  title: string;
  body: string;
}

export default async function AboutPage() {
  const settings = await db.userSettings.findFirst();
  const timeline = (settings?.journeyTimeline as TimelineItem[] | null) ?? [];
  const interests = settings?.tradingInterests ?? [];
  const social = (settings?.socialLinks as Record<string, string> | null) ?? {};

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-40 sm:px-8">
      <MicroLabel>Identity</MicroLabel>
      <RevealText>
        <h1 className="display-xl mt-4 text-5xl sm:text-7xl">
          The person behind
          <br />
          the process.
        </h1>
      </RevealText>

      <Reveal delay={0.15}>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-text-secondary">
          {settings?.bio ??
            "NAYXOR is my independent space for trading, research, and documenting the pursuit of better decisions. Across futures, forex, and Indian markets, the objective remains the same: approach uncertainty with preparation, structure, and discipline."}
        </p>
      </Reveal>

      {timeline.length > 0 && (
        <section className="mt-20" aria-label="Journey">
          <MicroLabel>The journey</MicroLabel>
          <ol className="mt-8 space-y-0 border-l border-border">
            {timeline.map((t, i) => (
              <Reveal key={`${t.year}-${i}`} delay={i * 0.05}>
                <li className="relative pb-10 pl-8 last:pb-0">
                  <span className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] border border-accent bg-bg" aria-hidden />
                  <p className="numeric text-xs text-accent">{t.year}</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">{t.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-20 grid gap-px border border-border bg-border sm:grid-cols-2">
        {interests.length > 0 && (
          <div className="bg-bg p-8">
            <MicroLabel>Trading interests</MicroLabel>
            <ul className="mt-4 space-y-2">
              {interests.map((i) => (
                <li key={i} className="text-sm text-text-secondary">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        )}
        {settings?.riskApproach && (
          <div className="bg-bg p-8">
            <MicroLabel>Approach to risk</MicroLabel>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">{settings.riskApproach}</p>
          </div>
        )}
        {settings?.longTermObjectives && (
          <div className="bg-bg p-8">
            <MicroLabel>Long-term objectives</MicroLabel>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">{settings.longTermObjectives}</p>
          </div>
        )}
        {Object.keys(social).length > 0 && (
          <div className="bg-bg p-8">
            <MicroLabel>Elsewhere</MicroLabel>
            <ul className="mt-4 space-y-2">
              {Object.entries(social).map(([k, v]) => (
                <li key={k}>
                  <a href={v} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-accent-text underline-offset-4 hover:underline">
                    {k} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
