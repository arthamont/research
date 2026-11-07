"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Instrument, TradingAccount, Setup, Trade } from "@prisma/client";
import { createTrade, updateTrade } from "@/server/actions/trades";
import { computePlannedRR } from "@/lib/calculations";
import { cn } from "@/lib/utils";

interface Props {
  instruments: Pick<Instrument, "id" | "symbol" | "market" | "pointValue" | "currency">[];
  accounts: Pick<TradingAccount, "id" | "name" | "type">[];
  setups: Pick<Setup, "id" | "name">[];
  trade?: Trade;
}

const field = "w-full border border-border bg-surface px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none";
const label = "micro-label mb-1.5 block";

export function TradeForm({ instruments, accounts, setups, trade }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    accountId: trade?.accountId ?? "",
    instrumentId: trade?.instrumentId ?? instruments[0]?.id ?? "",
    setupId: trade?.setupId ?? "",
    direction: (trade?.direction ?? "LONG") as "LONG" | "SHORT",
    status: (trade?.status ?? "OPEN") as "OPEN" | "CLOSED" | "CANCELLED",
    session: trade?.session ?? "",
    openedAt: trade ? toLocal(trade.openedAt) : toLocal(new Date()),
    closedAt: trade?.closedAt ? toLocal(trade.closedAt) : "",
    entryPrice: trade?.entryPrice?.toString() ?? "",
    stopLoss: trade?.stopLoss?.toString() ?? "",
    takeProfit: trade?.takeProfit?.toString() ?? "",
    exitPrice: trade?.exitPrice?.toString() ?? "",
    positionSize: trade?.positionSize?.toString() ?? "1",
    currency: trade?.currency ?? "USD",
    feesCommission: trade?.feesCommission?.toString() ?? "0",
    thesis: trade?.thesis ?? "",
    executionNotes: trade?.executionNotes ?? "",
    emotionalNotes: trade?.emotionalNotes ?? "",
    mistakes: trade?.mistakes ?? "",
    lessons: trade?.lessons ?? "",
    executionGrade: trade?.executionGrade?.toString() ?? "",
    ruleCompliant: trade?.ruleCompliant == null ? "" : String(trade.ruleCompliant),
  });

  function toLocal(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    const dt = new Date(d);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const instrument = instruments.find((i) => i.id === form.instrumentId);
  const entry = parseFloat(form.entryPrice);
  const stop = parseFloat(form.stopLoss);
  const target = parseFloat(form.takeProfit);
  const size = parseFloat(form.positionSize) || 1;
  const pv = instrument ? Number(instrument.pointValue) : 0;

  const plannedRR =
    !isNaN(entry) && !isNaN(stop) && !isNaN(target)
      ? computePlannedRR({ direction: form.direction, entry, stop, target })
      : null;
  const plannedRisk = !isNaN(entry) && !isNaN(stop) ? Math.abs(entry - stop) * size * pv : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      accountId: form.accountId || null,
      setupId: form.setupId || null,
      session: form.session || null,
      closedAt: form.closedAt || null,
      stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : null,
      takeProfit: form.takeProfit ? parseFloat(form.takeProfit) : null,
      exitPrice: form.exitPrice ? parseFloat(form.exitPrice) : null,
      executionGrade: form.executionGrade ? parseInt(form.executionGrade) : null,
      ruleCompliant: form.ruleCompliant === "" ? null : form.ruleCompliant === "true",
    };
    const res = trade ? await updateTrade(trade.id, payload) : await createTrade(payload);
    setSaving(false);
    if ("error" in res && res.error) setError(res.error);
    else router.push("/dashboard/journal");
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Core */}
      <fieldset className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={label}>Instrument</label>
          <select value={form.instrumentId} onChange={set("instrumentId")} className={field} required>
            {instruments.map((i) => (
              <option key={i.id} value={i.id}>
                {i.symbol} — {i.market}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Direction</label>
          <div className="grid grid-cols-2 gap-px border border-border bg-border">
            {(["LONG", "SHORT"] as const).map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setForm((f) => ({ ...f, direction: d }))}
                className={cn(
                  "py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
                  form.direction === d
                    ? d === "LONG"
                      ? "bg-long text-bg"
                      : "bg-short text-bg"
                    : "bg-surface text-text-secondary hover:text-text"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={label}>Status</label>
          <select value={form.status} onChange={set("status")} className={field}>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div>
          <label className={label}>Session</label>
          <select value={form.session} onChange={set("session")} className={field}>
            <option value="">—</option>
            {["ASIA", "LONDON", "NEW_YORK", "INDIA", "OVERLAP", "OTHER"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Account</label>
          <select value={form.accountId} onChange={set("accountId")} className={field}>
            <option value="">—</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Setup</label>
          <select value={form.setupId} onChange={set("setupId")} className={field}>
            <option value="">—</option>
            {setups.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Opened</label>
          <input type="datetime-local" value={form.openedAt} onChange={set("openedAt")} className={field} required />
        </div>
        <div>
          <label className={label}>Closed</label>
          <input type="datetime-local" value={form.closedAt} onChange={set("closedAt")} className={field} />
        </div>
      </fieldset>

      {/* Prices */}
      <fieldset className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className={label}>Entry</label>
          <input type="number" step="any" required value={form.entryPrice} onChange={set("entryPrice")} className={field} />
        </div>
        <div>
          <label className={label}>Stop loss</label>
          <input type="number" step="any" value={form.stopLoss} onChange={set("stopLoss")} className={field} />
        </div>
        <div>
          <label className={label}>Take profit</label>
          <input type="number" step="any" value={form.takeProfit} onChange={set("takeProfit")} className={field} />
        </div>
        <div>
          <label className={label}>Exit</label>
          <input type="number" step="any" value={form.exitPrice} onChange={set("exitPrice")} className={field} />
        </div>
        <div>
          <label className={label}>Size</label>
          <input type="number" step="any" min="0" required value={form.positionSize} onChange={set("positionSize")} className={field} />
        </div>
      </fieldset>

      {/* Live risk preview */}
      <div className="flex flex-wrap gap-6 border border-border bg-bg px-4 py-3 font-mono text-xs text-text-secondary">
        <span>
          Planned risk: <span className="numeric text-text">{plannedRisk !== null ? plannedRisk.toFixed(2) + " " + form.currency : "—"}</span>
        </span>
        <span>
          Planned R:R: <span className="numeric text-text">{plannedRR !== null ? `1:${plannedRR.toFixed(2)}` : "—"}</span>
        </span>
        <span>
          Point value: <span className="numeric text-text-faint">{pv}</span>
        </span>
      </div>

      {/* Journal narrative */}
      <fieldset className="grid gap-4 lg:grid-cols-2">
        {(
          [
            ["thesis", "Thesis / hypothesis"],
            ["executionNotes", "Execution notes"],
            ["emotionalNotes", "Emotional state"],
            ["mistakes", "Mistakes"],
            ["lessons", "Lessons"],
          ] as const
        ).map(([k, l]) => (
          <div key={k} className={k === "thesis" ? "lg:col-span-2" : ""}>
            <label className={label}>{l}</label>
            <textarea value={form[k]} onChange={set(k)} rows={k === "thesis" ? 3 : 2} className={cn(field, "resize-y")} />
          </div>
        ))}
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Execution grade (1–5)</label>
          <select value={form.executionGrade} onChange={set("executionGrade")} className={field}>
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Rule compliant</label>
          <select value={form.ruleCompliant} onChange={set("ruleCompliant")} className={field}>
            <option value="">—</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className={label}>Fees / commissions</label>
          <input type="number" step="any" min="0" value={form.feesCommission} onChange={set("feesCommission")} className={field} />
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="border border-short/40 bg-short/10 px-3 py-2 text-sm text-short">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="border border-accent bg-accent px-8 py-3 font-mono text-xs uppercase tracking-[0.16em] text-bg transition-colors hover:bg-accent-text disabled:opacity-50"
        >
          {saving ? "Saving…" : trade ? "Update trade" : "Log trade"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-border-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-text-secondary hover:border-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
