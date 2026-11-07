import type { Metadata } from "next";
import Link from "next/link";
import { MicroLabel } from "@/components/ui/primitives";
import { Reveal, RevealText } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Markets",
  description: "Three markets, one discipline — US index futures, forex, and Indian markets.",
};

const markets = [
  {
    index: "01",
    name: "US Futures",
    href: "/markets/futures",
    instruments: "NQ · ES",
    body: "Index futures through the New York session. Higher-timeframe bias, overnight structure, and opening-drive behavior on the Nasdaq-100 and S&P 500.",
    detail: ["Session: New York, 09:30 ET", "Focus: structure, liquidity, displacement"],
  },
  {
    index: "02",
    name: "Forex",
    href: "/markets/forex",
    instruments: "EURUSD · XAUUSD",
    body: "Majors and gold through the London and New York sessions. Repricing into inefficiency after liquidity is taken.",
    detail: ["Sessions: London, New York overlap", "Focus: PO3, FVG entries, session timing"],
  },
  {
    index: "03",
    name: "Indian Markets",
    href: "/markets/india",
    instruments: "NIFTY · BANKNIFTY",
    body: "Index derivatives and select equities on the NSE. Opening range behavior and intraday momentum around key levels.",
    detail: ["Session: NSE, 09:15–15:30 IST", "Focus: open structure, momentum, event risk"],
  },
];

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8">
      <MicroLabel>Coverage</MicroLabel>
      <RevealText>
        <h1 className="display-xl mt-4 text-5xl sm:text-7xl">
          Three markets.
          <br />
          One discipline.
        </h1>
      </RevealText>
      <Reveal delay={0.15}>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Different instruments, different sessions, different microstructure — the same preparation, risk
          framework, and review process applied to all of them.
        </p>
      </Reveal>

      <div className="mt-20 border-t border-border">
        {markets.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08}>
            <Link
              href={m.href}
              className="group grid gap-4 border-b border-border py-10 transition-colors hover:bg-surface sm:grid-cols-[80px_1fr_auto] sm:items-center sm:px-4"
            >
              <span className="numeric text-sm text-accent">{m.index}</span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent-text sm:text-3xl">
                  {m.name}
                </h2>
                <p className="mt-1 font-mono text-xs text-accent">{m.instruments}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">{m.body}</p>
                <ul className="mt-3 space-y-1">
                  {m.detail.map((d) => (
                    <li key={d} className="font-mono text-[11px] text-text-faint">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="text-2xl text-text-faint transition-transform duration-300 group-hover:translate-x-2 group-hover:text-accent">
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="mt-12">
        <p className="text-xs leading-relaxed text-text-faint">
          Research and observations for each market live in the{" "}
          <Link href="/outlook" className="text-accent-text underline-offset-4 hover:underline">
            outlook archive
          </Link>{" "}
          and the{" "}
          <Link href="/journal" className="text-accent-text underline-offset-4 hover:underline">
            journal
          </Link>
          .
        </p>
      </Reveal>
    </div>
  );
}
