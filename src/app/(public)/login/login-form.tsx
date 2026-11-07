"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    params.get("error") === "AccessDenied" ? "Access denied — owner account only." : null
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials or too many attempts.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="mt-8 space-y-5">
      {googleEnabled && (
        <>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-3 border border-border-strong px-4 py-3 text-sm text-text transition-colors hover:border-accent hover:text-accent-text"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-2.15-.15-2.15z"
              />
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="micro-label">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="micro-label mb-2 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border bg-surface px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="micro-label mb-2 block">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border bg-surface px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>
        {error && (
          <p role="alert" className="border border-short/40 bg-short/10 px-3 py-2 text-xs text-short">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full border border-accent bg-accent px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-bg transition-colors hover:bg-accent-text disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
