import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { getInstruments } from "@/lib/cached";
import { PageHeader } from "@/components/dashboard/widgets";
import { WatchlistManager } from "@/components/dashboard/watchlist-manager";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const user = await requireUser();
  const [items, instruments] = await Promise.all([
    db.watchlistItem.findMany({ where: { userId: user.id }, include: { instrument: true }, orderBy: { updatedAt: "desc" } }),
    getInstruments(),
  ]);

  return (
    <>
      <PageHeader title="Watchlist" />
      <WatchlistManager items={items} instruments={instruments} />
      <p className="mt-6 text-[11px] leading-relaxed text-text-faint">
        Levels and notes are manual — no live prices are displayed or implied. Use your charting platform for
        real-time data.
      </p>
    </>
  );
}
