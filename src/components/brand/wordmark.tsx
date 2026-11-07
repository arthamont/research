import { cn } from "@/lib/utils";

/**
 * ARTHAMONT wordmark — set in Space Grotesk with custom tracking.
 * The A carries a precision crossbar accent: the brand's signature.
 */
export function Wordmark({ className, withTick = true }: { className?: string; withTick?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline gap-[0.02em] font-semibold tracking-[0.08em]", className)}>
      <span className="relative inline-block">
        A
        {withTick && (
          <span
            aria-hidden
            className="absolute left-1/2 top-[62%] h-[0.09em] w-[0.52em] -translate-x-1/2 bg-accent"
          />
        )}
      </span>
      <span>RTHAMONT</span>
    </span>
  );
}

/**
 * A monogram — geometric mark built from two strokes and a crossbar node,
 * forming an A with a precision target at its apex. Used for favicon/mobile.
 */
export function Monogram({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="ARTHAMONT"
      className={cn("shrink-0", className)}
    >
      {/* Left stroke */}
      <path d="M8 33L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      {/* Right stroke */}
      <path d="M20 7l12 26" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      {/* Crossbar */}
      <path d="M13 24h14" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      {/* Precision node at the apex */}
      <circle cx="20" cy="7" r="4.5" fill="var(--bg)" />
      <circle cx="20" cy="7" r="4.5" stroke="var(--accent)" strokeWidth="2" />
      <circle cx="20" cy="7" r="1.5" fill="var(--accent)" />
    </svg>
  );
}
