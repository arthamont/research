import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { fetchEconCalendar, toISODate } from "@/lib/econ-calendar";
import { PageHeader } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/primitives";
import { EconCalendarView } from "@/components/dashboard/econ-calendar-view";
import { DayNoteEditor } from "@/components/dashboard/day-note";
import { localTodayStr } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function EconomicPage() {
  const user = await requireUser();
  const todayStr = localTodayStr();
  const today = new Date(todayStr + "T00:00:00Z");
  const from = new Date(today);
  from.setUTCDate(from.getUTCDate() - 45);
  const to = new Date(today);
  to.setUTCDate(to.getUTCDate() + 90);

  const [rows, notes] = await Promise.all([
    fetchEconCalendar({ from: toISODate(from), to: toISODate(to) }),
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
      {rows.length === 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <EmptyState
            title="Calendar unavailable"
            hint="The XOOMAR feed returned no data — check connectivity or try again later. Day notes still work."
          />
          <aside className="h-fit border border-border bg-bg-elevated p-4">
            <p className="micro-label mb-1">Day note — {todayStr}</p>
            <p className="mb-3 text-[11px] text-text-faint">How is this day going to behave? Private — workspace only.</p>
            <DayNoteEditor date={todayStr} initial={noteMap[todayStr] ?? ""} />
          </aside>
        </div>
      ) : (
        <EconCalendarView rows={rows} noteDate={todayStr} notes={noteMap} />
      )}
    </>
  );
}
