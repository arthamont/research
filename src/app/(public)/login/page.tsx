import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { Monogram } from "@/components/brand/wordmark";
import { MicroLabel } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Sign in",
  description: "ARTHAMONT private workspace — owner access only.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await auth();
  // Only auto-redirect when the session's user actually exists — a stale JWT
  // (e.g. from a previous database) would otherwise loop /login ↔ /dashboard.
  if (session?.user?.id) {
    const exists = await db.user.findUnique({ where: { id: session.user.id }, select: { id: true } });
    if (exists) redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm border border-border bg-bg-elevated p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Monogram size={36} />
          <h1 className="text-xl font-semibold tracking-tight">Workspace access</h1>
          <MicroLabel>Owner only</MicroLabel>
        </div>
        <LoginForm googleEnabled={!!process.env.GOOGLE_CLIENT_ID} />
        <p className="mt-6 text-center text-[11px] leading-relaxed text-text-faint">
          Private area. No public registration.
        </p>
      </div>
    </div>
  );
}
