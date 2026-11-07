import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { fetchEconCalendar, hasEconKey } from "@/lib/econ-calendar";
import { PageHeader } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/primitives";
import { EconCalendarView } from "@/components/dashboard/econ-calendar-view";
import { DayNoteEditor } from "@/components/dashboard/day-note";

export const dynamic = "force-dynamic";

export default async function EconomicPage() {
  const user = await requireUser();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  const [rows, notes] = await Promise.all([
    fetchEconCalendar(),
    db.marketNote.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 365,
      select: { date: true, content: true },
    }),
  ]);

  const noteMap = Object.fromEntries(notes.map((n) => [n.date.toISOString().slice(0, 10), n.content]));

  return (
    <>
      <PageHeader title="Economic calendar" />
      {hasEconKey() ? (
        <EconCalendarView rows={rows} noteDate={todayStr} notes={noteMap} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <EmptyState
            title="No API key configured"
            hint="Add BQ_API_KEY to .env — free key at businessquant.com — then restart the dev server. The day-note editor still works."
          />
          <aside className="h-fit border border-border bg-bg-elevated p-4">
            <p className="micro-label mb-1">Day note — {todayStr}</p>
            <p className="mb-3 text-[11px] text-text-faint">How is this day going to behave? Private — workspace only.</p>
            <DayNoteEditor date={todayStr} initial={noteMap[todayStr] ?? ""} />
          </aside>
        </div>
      )}
    </>
  );
}
