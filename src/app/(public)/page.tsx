import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { MarketsSection } from "@/components/sections/markets";
import { PhilosophySection, ProcessOverProfitsSection } from "@/components/sections/philosophy";
import { ProcessSection } from "@/components/sections/process";
import { TradesSection } from "@/components/sections/trades";
import { ResearchSection } from "@/components/sections/research";
import { TerminalSection } from "@/components/sections/terminal";
import { AboutSection, ClosingSection } from "@/components/sections/closing";
import { NxLoader } from "@/components/ui/primitives";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarketsSection />
      <PhilosophySection />
      <ProcessSection />
      <Suspense fallback={<div className="flex justify-center py-24"><NxLoader /></div>}>
        <TradesSection />
      </Suspense>
      <Suspense fallback={<div className="flex justify-center py-24"><NxLoader /></div>}>
        <ResearchSection />
      </Suspense>
      <TerminalSection />
      <ProcessOverProfitsSection />
      <AboutSection />
      <ClosingSection />
    </>
  );
}
