import Link from "next/link";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { MicroLabel, SectionHeading } from "@/components/ui/primitives";

const markets = [
  {
    index: "01",
    name: "US Futures",
    href: "/markets/futures",
    tagline: "Global Indices. Market Structure. Liquidity.",
    instruments: ["NQ — Nasdaq-100 Futures", "ES — S&P 500 Futures"],
    focus: "Research focused on US equity index futures, including Nasdaq-100 and S&P 500 futures, with an emphasis on market structure, liquidity, and session dynamics.",
    session: "Explore Futures",
  },
  {
    index: "02",
    name: "Global Forex & Metals",
    href: "/markets/forex",
    tagline: "Currencies. Macroeconomics. Global Flows.",
    instruments: ["EURUSD", "XAUUSD", "Selected pairs"],
    focus: "Analysis of major currency pairs and precious metals, examining economic developments, price behavior, and global trading sessions.",
    session: "Explore Forex",
  },
  {
    index: "03",
    name: "Indian Financial Markets",
    href: "/markets/india",
    tagline: "Equities. Indices. Derivatives.",
    instruments: ["NIFTY", "BANKNIFTY", "Indian equities"],
    focus: "Research across Indian equity indices, index derivatives, and selected equities, supported by structured market analysis and risk evaluation.",
    session: "Explore Indian Markets",
  },
];

export function MarketsSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="04" kicker="Global Perspective" title={<>Across markets.<br />Beyond boundaries.</>} />
        </RevealText>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-text-secondary">
            Our research spans major global financial markets, each offering distinct opportunities, complexities,
            and market dynamics.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
          {markets.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1} className="bg-bg">
              <Link
                href={m.href}
                className="group flex h-full flex-col bg-bg p-8 transition-colors duration-300 hover:bg-surface lg:p-10"
              >
                <div className="flex items-baseline justify-between">
                  <span className="numeric text-xs text-accent">{m.index}</span>
                  <span className="text-text-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">
                    →
                  </span>
                </div>
                <h3 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">{m.name}</h3>
                <p className="micro-label mt-3">{m.tagline}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary">{m.focus}</p>
                <ul className="mt-8 space-y-1.5">
                  {m.instruments.map((ins) => (
                    <li key={ins} className="font-mono text-xs text-text-secondary">
                      {ins}
                    </li>
                  ))}
                </ul>
                <MicroLabel className="mt-6">{m.session}</MicroLabel>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
