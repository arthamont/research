import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { PageHeader } from "@/components/dashboard/widgets";
import { ContentManager } from "@/components/dashboard/content-manager";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await requireUser();
  const [articles, cases, playbook] = await Promise.all([
    db.researchArticle.findMany({ orderBy: { updatedAt: "desc" } }),
    db.caseStudy.findMany({ orderBy: { updatedAt: "desc" } }),
    db.playbookItem.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title="Content management" />
      <ContentManager articles={articles} cases={cases} playbook={playbook} />
    </>
  );
}
