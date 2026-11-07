"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(160).optional(),
  message: z.string().min(10, "Tell us a bit more").max(5000),
});

/** Public contact form — unauthenticated by design. */
export async function submitContact(input: unknown): Promise<{ error?: string; sent?: boolean }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { name, email, subject, message } = parsed.data;
  await db.contactEntry.create({
    data: {
      name: name?.trim() || null,
      email: email.toLowerCase().trim(),
      subject: subject?.trim() || null,
      message: message.trim(),
    },
  });
  return { sent: true };
}
