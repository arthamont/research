import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { PageHeader } from "@/components/dashboard/widgets";
import { TradeForm } from "@/components/dashboard/trade-form";

export const dynamic = "force-dynamic";

export default async function NewTradePage() {
  await requireUser();
  const instruments = await db.instrument.findMany({ where: { isActive: true }, orderBy: { symbol: "asc" } });

  return (
    <>
      <PageHeader title="Log a trade" />
      <TradeForm instruments={instruments} />
    </>
  );
}
