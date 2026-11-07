import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

const cols = [
  {
    title: "Navigate",
    links: [
      { href: "/markets", label: "Markets" },
      { href: "/journal", label: "Journal" },
      { href: "/outlook", label: "Outlook" },
      { href: "/playbook", label: "Playbook" },
    ],
  },
  {
    title: "NAYXOR",
    links: [
      { href: "/about", label: "About" },
      { href: "/workspace", label: "Workspace" },
      { href: "/login", label: "Sign in" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="space-y-4">
            <Wordmark className="text-2xl" />
            <p className="micro-label">Discipline · Precision · Execution</p>
            <p className="max-w-sm text-xs leading-relaxed text-text-faint">
              Independent research and a personal trading journal across US futures, forex, and Indian markets.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="micro-label mb-4">{c.title}</p>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-text-secondary transition-colors hover:text-accent-text">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-[11px] leading-relaxed text-text-faint">
          <p>
            Trading involves substantial risk of loss. All content on this site is personal research and opinion, shared
            for documentation purposes only — it is not financial advice, investment advice, or a solicitation to trade.
          </p>
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} NAYXOR</span>
            <span className="numeric">TRADE THE PLAN. NOT THE NOISE.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
