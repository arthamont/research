import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

// Pin serverless functions near the Supabase DB to cut per-query RTT.
export const preferredRegion = "sin1";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
