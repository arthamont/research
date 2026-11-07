"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Monogram } from "@/components/brand/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/dashboard", label: "Overview", icon: "▤" },
  { href: "/dashboard/journal", label: "Journal", icon: "▦" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "▧" },
  { href: "/dashboard/calendar", label: "Calendar", icon: "◫" },
  { href: "/dashboard/economic", label: "Economic", icon: "◧" },
  { href: "/dashboard/playbook", label: "Playbook", icon: "▨" },
  { href: "/dashboard/watchlist", label: "Watchlist", icon: "◈" },
  { href: "/dashboard/reviews", label: "Reviews", icon: "◉" },
  { href: "/dashboard/content", label: "Content", icon: "◈" },
  { href: "/dashboard/settings", label: "Settings", icon: "◍" },
];

export function DashboardShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-3 border-b border-border px-5 py-5">
        <Monogram size={24} />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">Terminal</span>
      </Link>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Workspace">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
              isActive(n.href)
                ? "border-l-2 border-accent bg-surface text-accent-text"
                : "border-l-2 border-transparent text-text-secondary hover:bg-surface hover:text-text"
            )}
          >
            <span aria-hidden className="w-4 text-center text-xs opacity-60">
              {n.icon}
            </span>
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="space-y-3 border-t border-border px-5 py-4">
        <p className="truncate font-mono text-[10px] text-text-faint">{userEmail}</p>
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary hover:text-short"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-bg">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-bg-elevated lg:block">
        {sidebar}
      </aside>

      {/* mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-bg-elevated px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Monogram size={22} />
        </Link>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
        >
          <span className={cn("h-px w-5 bg-text transition-transform", open && "translate-y-[3.5px] rotate-45")} />
          <span className={cn("h-px w-5 bg-text transition-transform", open && "-translate-y-[3.5px] -rotate-45")} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-30 bg-bg/95 pt-14 lg:hidden" onClick={() => setOpen(false)}>
          <div className="h-full bg-bg-elevated" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </div>
        </div>
      )}

      <main className="flex-1 px-4 pb-16 pt-20 sm:px-6 lg:ml-60 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
