import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { PageHeader, Widget, Metric } from "@/components/dashboard/widgets";
import { EquityChart } from "@/components/dashboard/equity-chart";
import { EmptyState } from "@/components/ui/primitives";
import { analyze, groupAnalytics, toClosedTrade } from "@/lib/analytics";
import { formatCurrency, formatNumber, formatR } from "@/lib/utils";

export const dynamic = "force-dynamic";

function GroupTable({ title, rows }: { title: string; rows: { name: string; count: number; winRate: number | null; avgR: number | null; totalPnl: number }[] }) {
  if (rows.length === 0) return null;
  return (
    <Widget title={title}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {["", "Trades", "Win %", "Avg R", "P&L"].map((h) => (
              <th key={h} className="micro-label pb-2 pr-4 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border/60">
              <td className="py-2.5 pr-4 font-mono text-xs">{r.name}</td>
              <td className="numeric py-2.5 pr-4 text-xs">{r.count}</td>
              <td className="numeric py-2.5 pr-4 text-xs">{r.winRate !== null ? `${Math.round(r.winRate * 100)}%` : "—"}</td>
              <td className="numeric py-2.5 pr-4 text-xs">{formatR(r.avgR)}</td>
              <td className={`numeric py-2.5 pr-4 text-xs ${r.totalPnl > 0 ? "text-long" : r.totalPnl < 0 ? "text-short" : ""}`}>
                {formatCurrency(r.totalPnl)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  );
}

export default async function AnalyticsPage() {
  const user = await requireUser();
  const trades = await db.trade.findMany({
    where: { userId: user.id, status: "CLOSED" },
    include: { instrument: true, setup: true },
    orderBy: { closedAt: "asc" },
  });

  const closed = trades.map(toClosedTrade);
  const a = analyze(closed);
  const byInstrument = groupAnalytics(closed, (t) => t.instrument);
  const bySession = groupAnalytics(closed, (t) => t.session);
  const bySetup = groupAnalytics(closed, (t) => t.setup);
  const byMarket = groupAnalytics(closed, (t) => t.market);

  if (closed.length === 0) {
    return (
      <>
        <PageHeader title="Analytics" />
        <EmptyState title="No closed trades yet" hint="Analytics appear once you log and close trades." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Analytics" />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Widget title="Trades"><Metric label="Closed" value={String(a.count)} sub={`${a.wins}W / ${a.losses}L`} /></Widget>
        <Widget title="Win rate"><Metric label="wins ÷ closed" value={a.winRate !== null ? `${(a.winRate * 100).toFixed(1)}%` : "—"} /></Widget>
        <Widget title="Expectancy"><Metric label="per trade" value={a.expectancy !== null ? formatCurrency(a.expectancy) : "—"} sub={a.avgR !== null ? `${formatR(a.avgR)} avg` : undefined} /></Widget>
        <Widget title="Profit factor"><Metric label="wins ÷ losses" value={a.profitFactor !== null ? (a.profitFactor === Infinity ? "∞" : formatNumber(a.profitFactor, 2)) : "—"} /></Widget>
        <Widget title="Total P&L"><Metric label="net" value={formatCurrency(a.totalPnl)} tone={a.totalPnl > 0 ? "long" : a.totalPnl < 0 ? "short" : undefined} /></Widget>
        <Widget title="Max drawdown"><Metric label="peak → trough" value={a.maxDrawdown !== null ? formatCurrency(a.maxDrawdown) : "—"} tone="short" /></Widget>
        <Widget title="Avg win / loss"><Metric label="win" value={a.avgWin !== null ? formatCurrency(a.avgWin) : "—"} sub={`loss ${a.avgLoss !== null ? formatCurrency(a.avgLoss) : "—"}`} /></Widget>
        <Widget title="Rule adherence"><Metric label="compliant trades" value={a.ruleAdherence !== null ? `${Math.round(a.ruleAdherence * 100)}%` : "—"} sub="process metric" /></Widget>
      </div>

      <Widget title="Equity curve" className="mb-4">
        <EquityChart data={a.equityCurve} />
      </Widget>

      <div className="grid gap-4 lg:grid-cols-2">
        <GroupTable title="By instrument" rows={byInstrument} />
        <GroupTable title="By session" rows={bySession} />
        <GroupTable title="By setup" rows={bySetup} />
        <GroupTable title="By market" rows={byMarket} />
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-text-faint">
        Formulas: win rate = wins ÷ closed trades · expectancy = mean net P&L · profit factor = gross wins ÷ |gross
        losses| · R = net P&L ÷ planned risk · drawdown = max peak-to-trough decline of cumulative equity. P&L uses
        per-instrument point values — see <span className="font-mono">lib/calculations.ts</span>.
      </p>
    </>
  );
}
