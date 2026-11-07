"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  wing: z.enum(["capital", "partners", "holdings", "research"]),
});

/** Public waitlist signup — unauthenticated by design. */
export async function joinWaitlist(input: unknown): Promise<{ error?: string; joined?: boolean }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { email, wing } = parsed.data;
  await db.waitlistEntry.upsert({
    where: { email_wing: { email: email.toLowerCase(), wing } },
    update: {},
    create: { email: email.toLowerCase(), wing },
  });
  return { joined: true };
}
