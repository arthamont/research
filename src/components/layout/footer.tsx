import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

const cols = [
  {
    title: "Explore",
    links: [
      { href: "/markets", label: "Markets" },
      { href: "/outlook", label: "Research & Outlook" },
      { href: "/journal", label: "Trading Journal" },
      { href: "/playbook", label: "Playbook" },
    ],
  },
  {
    title: "Arthamont",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/about", label: "Our Vision" },
      { href: "/workspace", label: "Workspace" },
      { href: "/login", label: "Sign In" },
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
            <p className="micro-label">Conviction · Discipline · Longevity</p>
            <p className="max-w-sm text-xs leading-relaxed text-text-faint">
              A research-driven financial initiative focused on global capital markets, disciplined market
              strategies, and a long-term institutional vision.
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
            Trading and investing involve substantial risk of loss. All information presented is for research,
            educational, and informational purposes only and does not constitute investment advice, an offer to
            manage funds, or a solicitation to trade.
          </p>
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} ARTHAMONT. All rights reserved.</span>
            <span className="numeric">BUILT ON PRINCIPLE. DEFINED BY TIME.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
