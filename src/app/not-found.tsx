import Link from "next/link";
import { Monogram } from "@/components/brand/wordmark";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
      <Monogram size={40} />
      <div>
        <p className="micro-label">404 — off the chart</p>
        <h1 className="display-xl mt-4 text-4xl sm:text-5xl">This level doesn’t exist.</h1>
      </div>
      <Link
        href="/"
        className="border border-border-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-text-secondary transition-colors hover:border-accent hover:text-accent-text"
      >
        Back to the plan
      </Link>
    </div>
  );
}
