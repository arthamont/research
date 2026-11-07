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

function startOfWeek() {
  const d = startOfToday();
  const dow = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - dow);
  return d;
}

export default async function ReviewsPage() {
  const user = await requireUser();
  const today = startOfToday();
  const weekStart = startOfWeek();

  const [plan, templates, entries, dailyReview, weeklyReview] = await Promise.all([
    db.tradingPlan.findUnique({ where: { userId_date: { userId: user.id, date: today } } }),
    db.checklistTemplate.findMany({ where: { userId: user.id }, orderBy: { sortOrder: "asc" } }),
    db.checklistEntry.findMany({ where: { userId: user.id, date: today } }),
    db.dailyReview.findUnique({ where: { userId_date: { userId: user.id, date: today } } }),
    db.weeklyReview.findUnique({ where: { userId_weekStart: { userId: user.id, weekStart } } }),
  ]);

  return (
    <>
      <PageHeader title="Preparation & review" />
      <ReviewsManager
        date={today.toISOString().slice(0, 10)}
        weekStart={weekStart.toISOString().slice(0, 10)}
        plan={plan}
        templates={templates}
        entries={entries}
        dailyReview={dailyReview}
        weeklyReview={weeklyReview}
      />
    </>
  );
}
