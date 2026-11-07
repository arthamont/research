import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { PageHeader } from "@/components/dashboard/widgets";
import { TradeForm } from "@/components/dashboard/trade-form";

export const dynamic = "force-dynamic";

export default async function NewTradePage() {
  const user = await requireUser();
  const [instruments, accounts, setups] = await Promise.all([
    db.instrument.findMany({ where: { isActive: true }, orderBy: { symbol: "asc" } }),
    db.tradingAccount.findMany({ where: { userId: user.id, isActive: true } }),
    db.setup.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title="Log a trade" />
      <TradeForm instruments={instruments} accounts={accounts} setups={setups} />
    </>
  );
}
