import { requireUser } from "@/lib/require-user";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: { default: "Workspace", template: "%s · NAYXOR Workspace" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <DashboardShell userEmail={user.email}>{children}</DashboardShell>;
}
