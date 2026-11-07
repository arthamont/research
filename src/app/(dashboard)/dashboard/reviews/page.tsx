import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { PageHeader } from "@/components/dashboard/widgets";
import { ReviewsManager } from "@/components/dashboard/reviews-manager";

export const dynamic = "force-dynamic";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(d: Date) {
  const w = new Date(d);
  w.setDate(w.getDate() - ((w.getDay() + 6) % 7)); // Monday = 0
  return w;
}

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const parsed = params.date ? new Date(params.date) : null;
  const selected = parsed && !isNaN(parsed.getTime()) ? parsed : new Date();
  selected.setHours(0, 0, 0, 0);

  const weekStart = startOfWeek(selected);

  const [plan, templates, entries, dailyReview, weeklyReview, history] = await Promise.all([
    db.tradingPlan.findUnique({ where: { userId_date: { userId: user.id, date: selected } } }),
    db.checklistTemplate.findMany({ where: { userId: user.id }, orderBy: { sortOrder: "asc" } }),
    db.checklistEntry.findMany({ where: { userId: user.id, date: selected } }),
    db.dailyReview.findUnique({ where: { userId_date: { userId: user.id, date: selected } } }),
    db.weeklyReview.findUnique({ where: { userId_weekStart: { userId: user.id, weekStart } } }),
    db.dailyReview.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 14, select: { date: true, executionGrade: true } }),
  ]);

  const dateStr = selected.toISOString().slice(0, 10);
  const isToday = dateStr === startOfToday().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader title="Preparation & review">
        <form method="get" className="flex items-center gap-2">
          <input
            type="date"
            name="date"
            defaultValue={dateStr}
            className="border border-border bg-surface px-3 py-2 font-mono text-xs text-text focus:border-accent focus:outline-none"
          />
          <button type="submit" className="border border-border-strong px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary hover:border-accent">
            Open
          </button>
        </form>
      </PageHeader>

      {!isToday && (
        <p className="mb-6 border border-info/40 bg-info/10 px-3 py-2 text-xs text-info">
          Viewing {dateStr} — saved data for this day loads below.
        </p>
      )}

      <ReviewsManager
        key={dateStr}
        date={dateStr}
        weekStart={weekStart.toISOString().slice(0, 10)}
        plan={plan}
        templates={templates}
        entries={entries}
        dailyReview={dailyReview}
        weeklyReview={weeklyReview}
      />

      {history.length > 0 && (
        <section className="mt-12">
          <h2 className="micro-label mb-4">Recent reviews</h2>
          <ul className="divide-y divide-border border border-border">
            {history.map((r) => {
              const d = r.date.toISOString().slice(0, 10);
              return (
                <li key={d}>
                  <a href={`/dashboard/reviews?date=${d}`} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-surface">
                    <span className="numeric text-xs">{d}</span>
                    <span className="font-mono text-[10px] text-text-faint">
                      {r.executionGrade ? `grade ${r.executionGrade}/5` : "reviewed"}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
