import type { Metadata } from "next";
import { MarketPage } from "@/components/sections/market-page";

export const metadata: Metadata = {
  title: "US Futures",
  description: "NASDAQ-100 (NQ) and S&P 500 (ES) futures — research, structure, and journal entries.",
};

export default function FuturesPage() {
  return (
    <MarketPage
      config={{
        market: "FUTURES",
        index: "01",
        name: "US Futures",
        tagline:
          "Index futures through the New York session. The higher-timeframe narrative is built overnight; execution happens in the opening repricing.",
        instruments: [
          { symbol: "NQ", name: "Nasdaq-100 E-mini" },
          { symbol: "ES", name: "S&P 500 E-mini" },
        ],
        sessionInfo: [
          { label: "Primary", value: "09:30–11:00 ET" },
          { label: "Secondary", value: "PM session" },
          { label: "Overnight", value: "context only" },
        ],
        focusAreas: ["Market structure", "Opening drive", "Liquidity sweeps", "FVG / OB entries", "Session profiles"],
      }}
    />
  );
}
