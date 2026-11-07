import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { PageHeader } from "@/components/dashboard/widgets";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { EventsManager } from "@/components/dashboard/events-manager";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const [settings, events] = await Promise.all([
    db.userSettings.findUnique({ where: { userId: user.id } }),
    db.economicEvent.findMany({ where: { userId: user.id }, orderBy: { eventAt: "asc" }, take: 20 }),
  ]);

  return (
    <>
      <PageHeader title="Settings" />
      <SettingsForm settings={settings} />
      <section className="mt-12">
        <h2 className="micro-label mb-4">Economic events — shown on the overview</h2>
        <EventsManager events={events} />
      </section>
    </>
  );
}
