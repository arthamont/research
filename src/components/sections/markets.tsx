import Link from "next/link";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { MicroLabel, SectionHeading } from "@/components/ui/primitives";

const markets = [
  {
    index: "01",
    name: "US Futures",
    href: "/markets/futures",
    instruments: ["NQ — Nasdaq-100 Futures", "ES — S&P 500 Futures"],
    focus: "Index futures across the New York session — structure, liquidity, and session profiles.",
    session: "New York · 09:30 ET open",
  },
  {
    index: "02",
    name: "Forex",
    href: "/markets/forex",
    instruments: ["EURUSD", "XAUUSD", "Selected pairs"],
    focus: "Majors and metals through the London–New York overlap — displacement and repricing.",
    session: "London · New York overlaps",
  },
  {
    index: "03",
    name: "Indian Markets",
    href: "/markets/india",
    instruments: ["NIFTY", "BANKNIFTY", "Indian equities"],
    focus: "Index derivatives and equities on the NSE — opening structure and intraday momentum.",
    session: "NSE · 09:15 IST open",
  },
];

export function MarketsSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <RevealText>
          <SectionHeading index="02" kicker="Coverage" title={<>Three markets.<br />One discipline.</>} />
        </RevealText>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-text-secondary">
            Different instruments. Different sessions. The same commitment to preparation, risk, and execution.
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
