import type { Metadata } from "next";
import { MarketPage } from "@/components/sections/market-page";

export const metadata: Metadata = {
  title: "Forex",
  description: "EURUSD, XAUUSD, and selected pairs — research, structure, and journal entries.",
};

export default function ForexPage() {
  return (
    <MarketPage
      config={{
        market: "FOREX",
        index: "02",
        name: "Forex",
        tagline:
          "Majors and metals across London and New York. Accumulation, manipulation, distribution — timing is read through sessions, entries through inefficiency.",
        instruments: [
          { symbol: "EURUSD", name: "Euro / US Dollar" },
          { symbol: "XAUUSD", name: "Gold / US Dollar" },
        ],
        sessionInfo: [
          { label: "London", value: "08:00–11:00 UK" },
          { label: "New York", value: "08:30–11:00 ET" },
          { label: "Asia", value: "range context" },
        ],
        focusAreas: ["Power of Three", "Session timing", "Fair Value Gaps", "SMT divergence", "Dollar correlation"],
      }}
    />
  );
}
