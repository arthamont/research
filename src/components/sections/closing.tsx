import Link from "next/link";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { MicroLabel } from "@/components/ui/primitives";
import { Wordmark } from "@/components/brand/wordmark";

const nav = [
  { href: "/about", label: "Discover our philosophy" },
  { href: "/outlook", label: "Explore our research" },
];

export function ClosingSection() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <MicroLabel>Our Commitment</MicroLabel>
        <RevealText>
          <h2 className="font-display mt-6 text-5xl font-semibold sm:text-7xl lg:text-8xl">
            The future is built
            <br />
            <span className="text-text-secondary">on principle.</span>
          </h2>
        </RevealText>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-text-secondary">
            Every enduring institution begins with a vision.
            <br />
            Every meaningful achievement demands discipline.
            <br />
            And every lasting legacy is defined by time.
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
          <MicroLabel className="mt-3">Conviction · Discipline · Longevity</MicroLabel>
        </Reveal>
      </div>
    </section>
  );
}
