import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { PageHeader, Widget } from "@/components/dashboard/widgets";
import { ButtonLink, EmptyState } from "@/components/ui/primitives";
import { formatDate, formatR, formatCurrency } from "@/lib/utils";
import type { Market } from "@prisma/client";

export const dynamic = "force-dynamic";

const MARKETS: Market[] = ["FUTURES", "FOREX", "INDIA"];

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ market?: string; status?: string }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const market = MARKETS.find((m) => m === params.market);
  const status = ["OPEN", "CLOSED", "CANCELLED"].includes(params.status ?? "") ? (params.status as "OPEN" | "CLOSED" | "CANCELLED") : undefined;

  const trades = await db.trade.findMany({
    where: { userId: user.id, ...(market ? { market } : {}), ...(status ? { status } : {}) },
    orderBy: { openedAt: "desc" },
    include: { instrument: true, setup: true },
  });

  const href = (u: Record<string, string | undefined>) => {
    const m = { market: params.market, status: params.status, ...u };
    const q = Object.entries(m).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join("&");
    return `/dashboard/journal${q ? `?${q}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Trade journal">
        <ButtonLink href="/dashboard/journal/new" variant="primary">+ New trade</ButtonLink>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        {[{ l: "All", u: { market: undefined, status: undefined } }, ...MARKETS.map((m) => ({ l: m, u: { market: m } })), { l: "Open", u: { status: "OPEN" } }, { l: "Closed", u: { status: "CLOSED" } }].map((f) => (
          <Link
            key={f.l}
            href={href(f.u)}
            className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-accent hover:text-accent-text"
          >
            {f.l}
          </Link>
        ))}
      </div>

      {trades.length === 0 ? (
        <EmptyState
          title="No trades logged"
          hint="Every trade becomes data. Log your first execution."
          action={<ButtonLink href="/dashboard/journal/new" variant="primary" className="mt-2">Log a trade</ButtonLink>}
        />
      ) : (
        <Widget title={`${trades.length} trade${trades.length === 1 ? "" : "s"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Date", "Instrument", "Dir", "Setup", "Session", "Status", "P&L", "R", ""].map((h) => (
                    <th key={h} className="micro-label pb-3 pr-4 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id} className="border-b border-border/60 transition-colors hover:bg-surface">
                    <td className="numeric py-3 pr-4 text-xs text-text-secondary">{formatDate(t.openedAt)}</td>
                    <td className="py-3 pr-4 font-mono text-xs">{t.instrument.symbol}</td>
                    <td className={`py-3 pr-4 font-mono text-[10px] uppercase ${t.direction === "LONG" ? "text-long" : "text-short"}`}>{t.direction}</td>
                    <td className="py-3 pr-4 text-xs text-text-secondary">{t.setup?.name ?? "—"}</td>
                    <td className="py-3 pr-4 font-mono text-[10px] text-text-faint">{t.session ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <span className={`font-mono text-[10px] uppercase ${t.status === "OPEN" ? "text-info" : t.status === "CLOSED" ? "text-text-faint" : "text-warning"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className={`numeric py-3 pr-4 text-xs ${(t.netPnl?.toString() ?? "0").startsWith("-") ? "text-short" : t.netPnl ? "text-long" : "text-text-faint"}`}>
                      {t.netPnl ? formatCurrency(t.netPnl.toString(), t.currency) : "—"}
                    </td>
                    <td className="numeric py-3 pr-4 text-xs">{formatR(t.realizedR?.toString() ?? null)}</td>
                    <td className="py-3 text-right">
                      <Link href={`/dashboard/journal/${t.id}`} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint hover:text-accent-text">
                        open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Widget>
      )}
    </>
  );
}
