"use client";

import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={cn(
        "group relative flex h-8 w-14 items-center rounded-full border border-border bg-surface px-1 transition-colors hover:border-border-strong",
        className
      )}
    >
      <span
        className={cn(
          "block h-5 w-5 rounded-full bg-accent transition-transform duration-300 ease-out",
          theme === "light" ? "translate-x-0" : "translate-x-[26px]"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
