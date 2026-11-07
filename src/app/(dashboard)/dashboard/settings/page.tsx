import { requireUser } from "@/lib/require-user";
import { getUserSettings } from "@/lib/cached";
import { PageHeader } from "@/components/dashboard/widgets";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const settings = await getUserSettings(user.id);

  return (
    <>
      <PageHeader title="Settings" />
      <SettingsForm settings={settings} />
    </>
  );
}
