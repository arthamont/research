import Link from "next/link";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { SectionHeading, ButtonLink, MicroLabel } from "@/components/ui/primitives";
import { Wordmark } from "@/components/brand/wordmark";

export function AboutSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-2">
          <RevealText>
            <SectionHeading index="09" kicker="Identity" title={<>The person behind<br />the process.</>} />
          </RevealText>
          <div>
            <Reveal delay={0.15}>
              <p className="text-lg leading-relaxed text-text-secondary">
                NAYXOR is my independent space for trading, research, and documenting the pursuit of better decisions.
                Across futures, forex, and Indian markets, the objective remains the same: approach uncertainty with
                preparation, structure, and discipline.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-text-faint">
                No signals. No courses. No performance claims — just the work, documented honestly.
              </p>
            </Reveal>
            <Reveal delay={0.25} className="mt-10">
              <ButtonLink href="/about" variant="secondary">
                More about NAYXOR
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const nav = [
  { href: "/journal", label: "Journal" },
  { href: "/outlook", label: "Research" },
  { href: "/playbook", label: "Playbook" },
  { href: "/about", label: "About" },
];

export function ClosingSection() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <RevealText>
          <h2 className="display-xl text-5xl sm:text-7xl lg:text-8xl">
            The process
            <br />
            is the point.
          </h2>
        </RevealText>
        <Reveal delay={0.2}>
          <p className="mt-8 text-sm tracking-wide text-text-secondary">
            Observe deliberately. Execute precisely. Review relentlessly.
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <nav className="mt-14 flex flex-wrap justify-center gap-3" aria-label="Explore">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-text-secondary transition-colors hover:border-accent hover:text-accent-text"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </Reveal>
        <Reveal delay={0.45} className="mt-20">
          <Wordmark className="text-3xl text-text-faint" />
          <MicroLabel className="mt-3">Discipline · Precision · Execution</MicroLabel>
        </Reveal>
      </div>
    </section>
  );
}
