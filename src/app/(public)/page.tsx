import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { FoundationSection, FocusSection } from "@/components/sections/foundation";
import { MarketsSection } from "@/components/sections/markets";
import { PhilosophySection } from "@/components/sections/philosophy";
import { ProcessSection } from "@/components/sections/process";
import { ResearchSection } from "@/components/sections/research";
import { ClosingSection } from "@/components/sections/closing";
import { NxLoader } from "@/components/ui/primitives";
import { db } from "@/lib/db";

export const revalidate = 300;

export default async function HomePage() {
  const settings = await db.userSettings.findFirst();
  const heroContent = (settings?.heroJson as Record<string, string> | null) ?? undefined;
  return (
    <>
      <Hero content={heroContent} />
      <FoundationSection />
      <FocusSection />
      <MarketsSection />
      <PhilosophySection />
      <ProcessSection />
      <Suspense fallback={<div className="flex justify-center py-24"><NxLoader /></div>}>
        <ResearchSection />
      </Suspense>
      <ClosingSection />
    </>
  );
}
