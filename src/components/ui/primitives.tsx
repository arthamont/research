import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

/* ── Buttons ──────────────────────────────────────────────────────────── */

const buttonBase =
  "group/btn relative inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.16em] transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";

export function ButtonLink({
  variant = "primary",
  className,
  children,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "primary" | "secondary" | "ghost" } & { href: string }) {
  const styles = {
    primary:
      "border border-accent bg-accent px-6 py-3 text-bg hover:bg-accent-text hover:border-accent-text",
    secondary:
      "border border-border-strong px-6 py-3 text-text hover:border-accent hover:text-accent-text",
    ghost: "px-2 py-1 text-text-secondary hover:text-accent-text",
  } as const;
  return (
    <Link className={cn(buttonBase, styles[variant], className)} href={href} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  const styles = {
    primary: "border border-accent bg-accent px-5 py-2.5 text-bg hover:bg-accent-text hover:border-accent-text",
    secondary: "border border-border-strong px-5 py-2.5 text-text hover:border-accent hover:text-accent-text",
    ghost: "px-2 py-1 text-text-secondary hover:text-text",
    danger: "border border-short px-5 py-2.5 text-short hover:bg-short hover:text-bg",
  } as const;
  return (
    <button type="button" className={cn(buttonBase, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}

/* ── Labels & headings ────────────────────────────────────────────────── */

export function MicroLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("micro-label", className)}>{children}</p>;
}

export function SectionHeading({
  index,
  kicker,
  title,
  className,
}: {
  index?: string;
  kicker?: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {(index || kicker) && (
        <div className="flex items-center gap-4">
          {index && <span className="numeric text-xs text-accent">{index}</span>}
          <span className="h-px w-10 bg-border-strong" aria-hidden />
          {kicker && <MicroLabel>{kicker}</MicroLabel>}
        </div>
      )}
      <h2 className="display-xl text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
    </div>
  );
}

/* ── Surfaces ─────────────────────────────────────────────────────────── */

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("border border-border bg-surface transition-colors hover:border-border-strong", className)}>
      {children}
    </div>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ── States ───────────────────────────────────────────────────────────── */

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-border px-8 py-16 text-center">
      <div className="h-px w-12 bg-accent" aria-hidden />
      <p className="text-sm text-text-secondary">{title}</p>
      {hint && <p className="max-w-sm text-xs text-text-faint">{hint}</p>}
      {action}
    </div>
  );
}

export function NxLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)} role="status" aria-label="Loading">
      <div className="h-px w-24 overflow-hidden bg-border">
        <div className="nx-loader h-px w-full bg-accent" />
      </div>
      <span className="micro-label nx-tick">NAYXOR</span>
    </div>
  );
}
