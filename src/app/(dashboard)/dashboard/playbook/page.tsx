import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { PageHeader } from "@/components/dashboard/widgets";
import { SetupManager } from "@/components/dashboard/setup-manager";

export const dynamic = "force-dynamic";

export default async function PlaybookDashPage() {
  const user = await requireUser();
  const setups = await db.setup.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } });

  return (
    <>
      <PageHeader title="Private playbook" />
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-text-secondary">
        Your setups and rules — used to tag trades and grade adherence. The public methodology lives under{" "}
        <span className="font-mono text-xs">Content → Playbook</span>.
      </p>
      <SetupManager setups={setups} />
    </>
  );
}
