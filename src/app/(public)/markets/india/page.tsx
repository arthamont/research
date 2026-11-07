import type { Metadata } from "next";
import { MarketPage } from "@/components/sections/market-page";

export const metadata: Metadata = {
  title: "Indian Markets",
  description: "NIFTY, BANKNIFTY, and Indian equities — research, structure, and journal entries.",
};

export default function IndiaPage() {
  return (
    <MarketPage
      config={{
        market: "INDIA",
        index: "03",
        name: "Indian Markets",
        tagline:
          "Index derivatives and select equities on the NSE. The open sets the tone — gap behavior, opening range, and momentum continuation define the day.",
        instruments: [
          { symbol: "NIFTY", name: "NSE Nifty 50" },
          { symbol: "BANKNIFTY", name: "NSE Bank Nifty" },
        ],
        sessionInfo: [
          { label: "Open", value: "09:15 IST" },
          { label: "Prime window", value: "09:15–11:00 IST" },
          { label: "Close", value: "15:30 IST" },
        ],
        focusAreas: ["Opening structure", "Gap behavior", "Index momentum", "Event risk", "Expiry dynamics"],
      }}
    />
  );
}
