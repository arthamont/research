import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

/** Server-side guard for all dashboard routes/actions. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) redirect("/login");
  if (session.user.email.toLowerCase() !== (process.env.OWNER_EMAIL ?? "").toLowerCase()) {
    redirect("/login?error=AccessDenied");
  }
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");
  return user;
}
