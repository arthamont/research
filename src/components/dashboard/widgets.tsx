import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Widget({
  title,
  children,
  className,
  action,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("border border-border bg-bg-elevated", className)}>
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="micro-label">{title}</h2>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Metric({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "long" | "short" }) {
  return (
    <div>
      <p className="micro-label">{label}</p>
      <p className={cn("numeric mt-1.5 text-2xl", tone === "long" && "text-long", tone === "short" && "text-short")}>
        {value}
      </p>
      {sub && <p className="mt-1 text-[11px] text-text-faint">{sub}</p>}
    </div>
  );
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="micro-label">ARTHAMONT / Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      </div>
      {children && <div className="flex gap-3">{children}</div>}
    </div>
  );
}
