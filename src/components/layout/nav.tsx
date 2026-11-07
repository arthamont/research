"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Monogram, Wordmark } from "@/components/brand/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/journal", label: "Journal" },
  { href: "/outlook", label: "Outlook" },
  { href: "/playbook", label: "Playbook" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation — derived-state-during-render pattern.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "border-b border-border backdrop-blur-md" : "border-b border-transparent"
        )}
        style={scrolled ? { background: "var(--nav-bg)" } : undefined}
      >
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-8",
            scrolled ? "h-14" : "h-20"
          )}
          aria-label="Primary"
        >
          <Link href="/" className="flex items-center gap-3 text-text" aria-label="ARTHAMONT home">
            <Monogram size={26} className="sm:hidden" />
            <Wordmark className="hidden text-lg sm:inline-flex" />
            <span className="text-lg sm:hidden">ARTHAMONT</span>
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "group relative py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                    isActive(l.href) ? "text-accent-text" : "text-text-secondary hover:text-text"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300",
                      isActive(l.href) ? "w-full" : "w-0 group-hover:w-full"
                    )}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <ThemeToggle className="hidden sm:flex" />
            <Link
              href="/login"
              className="hidden border border-border-strong px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent hover:text-accent-text sm:block"
            >
              Workspace
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span className="h-px w-6 bg-text transition-transform" />
              <span className="h-px w-6 bg-text transition-transform" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-bg transition-all duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex h-20 items-center justify-between px-5">
          <span className="text-lg font-semibold tracking-[0.08em]">ARTHAMONT</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-2xl text-text-secondary"
          >
            ×
          </button>
        </div>
        <ul className="flex flex-1 flex-col justify-center gap-2 px-8">
          {[...links, { href: "/login", label: "Workspace" }].map((l, i) => (
            <li
              key={l.href}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={cn(
                "transition-all duration-300",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              <Link
                href={l.href}
                className={cn(
                  "block border-b border-border py-4 text-3xl font-medium tracking-tight transition-colors",
                  isActive(l.href) ? "text-accent-text" : "text-text hover:text-accent-text"
                )}
              >
                <span className="numeric mr-4 text-xs text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between px-8 pb-10">
          <MicroLabelRow />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}

function MicroLabelRow() {
  return <p className="micro-label">Discipline · Precision · Execution</p>;
}
