import { requireUser } from "@/lib/require-user";
import { getSetups } from "@/lib/cached";
import { PageHeader } from "@/components/dashboard/widgets";
import { SetupManager } from "@/components/dashboard/setup-manager";

export const dynamic = "force-dynamic";

export default async function PlaybookDashPage() {
  const user = await requireUser();
  const setups = await getSetups(user.id);

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
