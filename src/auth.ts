import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const ownerEmail = () => (process.env.OWNER_EMAIL ?? "").toLowerCase();

function isOwner(email?: string | null) {
  return !!email && email.toLowerCase() === ownerEmail();
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 days
  pages: { signIn: "/login" },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true, // Google verifies emails; links to seeded owner
    }),
    Credentials({
      name: "Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        // Rate limit credential attempts (5/min per IP) to blunt brute force.
        try {
          const h = await headers();
          const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
          const rl = rateLimit(`login:${ip}:${email}`, 5, 60_000);
          if (!rl.ok) return null;
        } catch {
          // headers() unavailable — continue without IP scoping
        }

        if (!isOwner(email) || !password) return null;
        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const valid = await verifyPassword(password, user.passwordHash);
        return valid ? { id: user.id, email: user.email, name: user.name, image: user.image } : null;
      },
    }),
  ],
  callbacks: {
    // Owner-only gate: no session is ever established for any other account.
    async signIn({ user }) {
      return isOwner(user.email);
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
