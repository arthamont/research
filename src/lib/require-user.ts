import { cache } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Server-side guard for all dashboard routes/actions.
 * Session JWT already carries verified identity — every query filters by
 * userId, so a stale/deleted user simply sees empty rows. Skipping the
 * per-request user lookup removes a full DB round trip per page.
 * React `cache()` dedupes layout + page calls into one auth() per request.
 */
export const requireUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) redirect("/login");
  if (session.user.email.toLowerCase() !== (process.env.OWNER_EMAIL ?? "").toLowerCase()) {
    redirect("/login?error=AccessDenied");
  }
  return { id: session.user.id, email: session.user.email, name: session.user.name };
});
