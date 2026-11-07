import { cn } from "@/lib/utils";

/**
 * NAYXOR wordmark — set in Space Grotesk with custom tracking.
 * The X carries a precision-crosshair accent: the brand's signature.
 */
export function Wordmark({ className, withTick = true }: { className?: string; withTick?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline gap-[0.02em] font-semibold tracking-[0.08em]", className)}>
      <span>NAY</span>
      <span className="relative inline-block">
        X
        {withTick && (
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[0.09em] w-[0.5em] -translate-x-1/2 -translate-y-1/2 bg-accent"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          />
        )}
      </span>
      <span>OR</span>
    </span>
  );
}

/**
 * N monogram — geometric mark built from two strokes and a diagonal,
 * forming an N with a precision crosshair node. Used for favicon/mobile.
 */
export function Monogram({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="NAYXOR"
      className={cn("shrink-0", className)}
    >
      {/* Left stem */}
      <path d="M9 31V9" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      {/* Right stem */}
      <path d="M31 9v22" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      {/* Diagonal */}
      <path d="M9 9l22 22" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      {/* Precision node on the diagonal */}
      <circle cx="20" cy="20" r="4.5" fill="var(--bg)" />
      <circle cx="20" cy="20" r="4.5" stroke="var(--accent)" strokeWidth="2" />
      <circle cx="20" cy="20" r="1.5" fill="var(--accent)" />
    </svg>
  );
}
