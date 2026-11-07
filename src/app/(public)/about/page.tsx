import type { Metadata } from "next";
import { MicroLabel } from "@/components/ui/primitives";
import { Wordmark } from "@/components/brand/wordmark";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { WingsSection } from "@/components/sections/wings";
import { VisionSection, FounderSection } from "@/components/sections/foundation";
import { db } from "@/lib/db";
import { mergeAbout } from "@/lib/about-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description:
    "About Arthamont — a research-driven financial initiative built on conviction, discipline, and longevity.",
};

export default async function AboutPage() {
  const settings = await db.userSettings.findFirst();
  const c = mergeAbout(settings?.aboutJson as Record<string, unknown> | null);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-40 sm:px-8">
      {/* ── Foundation ── */}
      <MicroLabel>Our Foundation</MicroLabel>
      <RevealText>
        <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] sm:text-7xl">
          {c.heroTitle1}
          <br />
          <span className="text-text-secondary">{c.heroTitle2}</span>
        </h1>
      </RevealText>
      <Reveal delay={0.15}>
        <div className="mt-10 max-w-2xl space-y-5">
          {c.foundation.map((t, i) => (
            <p key={i} className={i === 0 ? "text-lg leading-relaxed text-text-secondary" : "text-base leading-relaxed text-text-secondary"}>
              {t}
            </p>
          ))}
        </div>
        <p className="micro-label mt-8 text-accent-text">Conviction. Discipline. Longevity.</p>
      </Reveal>

      {/* ── Our Story ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="Our story">
        <MicroLabel>Our Story</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-4 text-3xl font-medium sm:text-4xl">
            Every institution begins with a principle.
          </h2>
        </RevealText>
        <Reveal delay={0.1}>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-text-secondary">
            {c.story.map((t, i) => <p key={i}>{t}</p>)}
          </div>
        </Reveal>
      </section>

      {/* ── The Journey ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="The journey">
        <MicroLabel>The Journey</MicroLabel>
        <div className="mt-10">
          {c.journey.map((j, i) => (
            <Reveal key={j.n} delay={i * 0.07}>
              <div className="group relative border-t border-border py-10 last:border-b">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-2 right-0 select-none font-display text-[6rem] font-semibold leading-none tracking-tighter text-text opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.14] sm:text-[8rem]"
                >
                  {j.n}
                </span>
                <div className="relative max-w-2xl">
                  <p className="numeric font-mono text-xs tracking-[0.2em] text-accent">{j.n} — {j.phase}</p>
                  <h3 className="font-display mt-4 text-2xl font-medium sm:text-3xl">
                    <span className="transition-colors duration-300 group-hover:text-accent-text">{j.title}</span>
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-text-secondary">{j.body}</p>
                  <p className="mt-3 text-sm leading-relaxed text-text-faint">{j.detail}</p>
                </div>
                <span aria-hidden className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="Our principles">
        <MicroLabel>Our Principles</MicroLabel>
        <div className="mt-10 grid gap-px border border-border bg-border lg:grid-cols-3">
          {c.principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="bg-bg">
              <div className="h-full bg-bg p-8">
                <h3 className="font-display text-2xl font-medium">{p.title}</h3>
                <p className="micro-label mt-3">{p.sub}</p>
                <p className="mt-5 text-sm leading-relaxed text-text-secondary">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Markets & Research ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="Markets and research">
        <MicroLabel>Markets &amp; Research</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-4 text-3xl font-medium sm:text-4xl">
            Three principal areas of study.
          </h2>
        </RevealText>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {c.markets.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.08}>
              <div className="border border-border p-8 transition-colors hover:border-accent">
                <p className="numeric font-mono text-xs tracking-[0.2em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{m.title}</h3>
                <p className="micro-label mt-3">{m.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Risk ── */}
      <section className="mt-28 border-t border-border pt-16" aria-label="Risk">
        <MicroLabel>Our Approach to Risk</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-medium sm:text-4xl">
            {c.riskTitle}
          </h2>
        </RevealText>
        <Reveal delay={0.1}>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-text-secondary">
            {c.risk.map((t, i) => <p key={i}>{t}</p>)}
          </div>
        </Reveal>
      </section>

      {/* ── Vision / Founder ── */}
      <div className="-mx-5 sm:-mx-8">
        <VisionSection paras={c.visionParas} quote={c.visionQuote} />
        <FounderSection paras={c.founderParas} />
      </div>

      {/* ── Our wings ── */}
      <section className="mt-4 border-t border-border pt-16" aria-label="Our wings">
        <MicroLabel>Our Wings</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-4 text-3xl font-medium sm:text-4xl">
            One master brand. Future entities.
          </h2>
        </RevealText>
        <Reveal delay={0.1}>
          <div className="mt-10">
            <WingsSection />
          </div>
        </Reveal>
      </section>

      {/* ── Philosophy close ── */}
      <section className="mt-28 border-t border-border pt-20 text-center" aria-label="Philosophy">
        <MicroLabel>The Philosophy</MicroLabel>
        <RevealText>
          <h2 className="font-display mx-auto mt-6 max-w-3xl text-3xl font-medium leading-snug sm:text-5xl">
            {c.philosophyHeadline[0]}
            <br />
            {c.philosophyHeadline[1]}
            <br />
            <span className="text-text-secondary">{c.philosophyHeadline[2]}</span>
          </h2>
        </RevealText>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-text-secondary">
            {c.philosophyBody}
          </p>
          <p className="font-display mt-8 text-xl italic text-text sm:text-2xl">{c.philosophyQuote}</p>
        </Reveal>
      </section>

      {/* ── Brand lockup ── */}
      <div className="mt-24 border-t border-border pt-12 text-center">
        <Wordmark className="text-3xl" />
        <p className="micro-label mt-4">Conviction · Discipline · Longevity</p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-faint">{c.lockupLabel}</p>
        <p className="mx-auto mt-6 max-w-lg text-[11px] leading-relaxed text-text-faint">{c.disclaimer}</p>
      </div>
    </div>
  );
}
