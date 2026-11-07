import { requireUser } from "@/lib/require-user";
import { DashboardShell } from "@/components/dashboard/shell";

// Pin serverless functions near the Supabase DB to cut per-query RTT.
// If Supabase's region isn't ap-south-1, change to the closest Vercel region.
export const preferredRegion = "sin1";

export const metadata = {
  title: { default: "Workspace", template: "%s · NAYXOR Workspace" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <DashboardShell userEmail={user.email}>{children}</DashboardShell>;
}
