import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { getInstruments } from "@/lib/cached";
import { PageHeader, Widget, Metric } from "@/components/dashboard/widgets";
import { TradeForm } from "@/components/dashboard/trade-form";
import { PublishToggle, DeleteTradeButton } from "@/components/dashboard/trade-actions";
import { ScreenshotUpload } from "@/components/dashboard/screenshot-upload";
import { Tag } from "@/components/ui/primitives";
import { formatDate, formatR, formatCurrency, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TradeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const [trade, instruments] = await Promise.all([
    db.trade.findFirst({ where: { id, userId: user.id }, include: { instrument: true, setup: true, screenshots: true } }),
    getInstruments(),
  ]);
  if (!trade) notFound();

  return (
    <>
      <PageHeader title={`${trade.instrument.symbol} — ${formatDate(trade.openedAt)}`}>
        <PublishToggle tradeId={trade.id} isPublic={trade.isPublic} />
        <DeleteTradeButton tradeId={trade.id} />
      </PageHeader>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Widget title="P&L">
          <Metric
            label="Net"
            value={trade.netPnl ? formatCurrency(trade.netPnl.toString(), trade.currency) : "—"}
            tone={trade.netPnl && Number(trade.netPnl) > 0 ? "long" : trade.netPnl && Number(trade.netPnl) < 0 ? "short" : undefined}
            sub={`fees ${formatCurrency(trade.feesCommission.toString(), trade.currency)}`}
          />
        </Widget>
        <Widget title="R multiple">
          <Metric label="Realized" value={formatR(trade.realizedR?.toString() ?? null)} sub={`risk ${trade.plannedRisk ? formatCurrency(trade.plannedRisk.toString(), trade.currency) : "—"}`} />
        </Widget>
        <Widget title="Prices">
          <dl className="space-y-1.5 font-mono text-xs text-text-secondary">
            <div className="flex justify-between"><dt>Entry</dt><dd className="numeric">{formatNumber(trade.entryPrice.toString())}</dd></div>
            <div className="flex justify-between"><dt>Stop</dt><dd className="numeric">{trade.stopLoss ? formatNumber(trade.stopLoss.toString()) : "—"}</dd></div>
            <div className="flex justify-between"><dt>Target</dt><dd className="numeric">{trade.takeProfit ? formatNumber(trade.takeProfit.toString()) : "—"}</dd></div>
            <div className="flex justify-between"><dt>Exit</dt><dd className="numeric">{trade.exitPrice ? formatNumber(trade.exitPrice.toString()) : "—"}</dd></div>
          </dl>
        </Widget>
        <Widget title="Meta">
          <div className="flex flex-wrap gap-2">
            <Tag>{trade.status}</Tag>
            {trade.session && <Tag>{trade.session}</Tag>}
            {trade.setup && <Tag>{trade.setup.name}</Tag>}
            {trade.isPublic && <Tag>Public</Tag>}
            {trade.executionGrade && <Tag>Grade {trade.executionGrade}/5</Tag>}
          </div>
        </Widget>
      </div>

      <Widget title="Screenshots" className="mb-8">
        <ScreenshotUpload tradeId={trade.id} />
        {trade.screenshots.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {trade.screenshots.map((s) => (
              <figure key={s.id} className="border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/uploads?p=${encodeURIComponent(s.filePath)}`} alt={s.caption ?? s.kind} className="w-full object-cover" />
                <figcaption className="micro-label px-2 py-1.5">{s.kind}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </Widget>

      <Widget title="Edit trade">
        <TradeForm instruments={instruments} trade={trade} />
      </Widget>
    </>
  );
}
