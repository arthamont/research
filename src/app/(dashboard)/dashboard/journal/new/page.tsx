import { requireUser } from "@/lib/require-user";
import { getInstruments } from "@/lib/cached";
import { PageHeader } from "@/components/dashboard/widgets";
import { TradeForm } from "@/components/dashboard/trade-form";

export const dynamic = "force-dynamic";

export default async function NewTradePage() {
  await requireUser();
  const instruments = await getInstruments();

  return (
    <>
      <PageHeader title="Log a trade" />
      <TradeForm instruments={instruments} />
    </>
  );
}
