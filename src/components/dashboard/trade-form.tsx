"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTrade, updateTrade } from "@/server/actions/trades";
import { computeGrossPnl } from "@/lib/calculations";
import { formatCurrency, cn } from "@/lib/utils";
import type { Instrument, Trade } from "@prisma/client";
import { Button } from "@/components/ui/primitives";
import { field, lbl } from "./generic-forms";

const SESSIONS = [
  { value: "Q1", label: "Asia (Q1)" },
  { value: "Q2", label: "London (Q2)" },
  { value: "Q3", label: "New York AM (Q3)" },
  { value: "Q4", label: "New York PM (Q4)" },
];

const num = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const toLocal = (d: Date | string | null | undefined) =>
  d ? new Date(d).toLocaleString("sv-SE").slice(0, 16) : "";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={lbl}>{label}{required ? " *" : ""}</span>
      {children}
    </label>
  );
}

export function TradeForm({ trade, instruments }: { trade?: Trade; instruments: Instrument[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    instrumentId: trade?.instrumentId ?? "",
    direction: trade?.direction ?? "LONG",
    session: trade?.session ?? "",
    openedAt: toLocal(trade?.openedAt),
    closedAt: toLocal(trade?.closedAt),
    entryPrice: num(trade?.entryPrice),
    exitPrice: num(trade?.exitPrice),
    stopAmount: num(trade?.plannedRisk),
    targetAmount: num(trade?.plannedTarget),
    positionSize: num(trade?.positionSize) || "1",
    feesCommission: num(trade?.feesCommission) || "0",
    thesis: trade?.thesis ?? "",
    executionNotes: trade?.executionNotes ?? "",
    emotionalNotes: trade?.emotionalNotes ?? "",
    mistakes: trade?.mistakes ?? "",
    lessons: trade?.lessons ?? "",
    executionGrade: num(trade?.executionGrade),
    ruleCompliant: (trade?.ruleCompliant ?? null) as boolean | null,
  });

  const set = <K extends keyof typeof values>(k: K, v: (typeof values)[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const instrument = instruments.find((i) => i.id === values.instrumentId) ?? null;
  const entry = parseFloat(values.entryPrice);
  const exit = parseFloat(values.exitPrice);
  const size = parseFloat(values.positionSize) || 1;
  const fees = parseFloat(values.feesCommission) || 0;
  const stopAmt = parseFloat(values.stopAmount);
  const tgtAmt = parseFloat(values.targetAmount);
  const pv = instrument ? Number(instrument.pointValue) : 0;

  const preview = useMemo(() => {
    if (!instrument || !entry || !exit) return null;
    const gross = computeGrossPnl({ direction: values.direction as "LONG" | "SHORT", entry, exit, positionSize: size, pointValue: pv });
    const net = gross - fees;
    return {
      gross,
      net,
      r: !isNaN(stopAmt) && stopAmt > 0 ? net / stopAmt : null,
      rr: !isNaN(stopAmt) && stopAmt > 0 && !isNaN(tgtAmt) && tgtAmt > 0 ? tgtAmt / stopAmt : null,
    };
  }, [instrument, entry, exit, size, fees, stopAmt, tgtAmt, pv, values.direction]);

  const submit = () =>
    start(async () => {
      setError(null);
      const res = trade
        ? await updateTrade(trade.id, { ...values, currency: instrument?.currency ?? "USD" })
        : await createTrade({ ...values, currency: instrument?.currency ?? "USD" });
      if (res.error) { setError(res.error); return; }
      router.push("/dashboard/journal");
      router.refresh();
    });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Instrument" required>
          <select className={field} value={values.instrumentId} onChange={(e) => set("instrumentId", e.target.value)}>
            <option value="">Select…</option>
            {instruments.map((i) => <option key={i.id} value={i.id}>{i.symbol} — {i.name}</option>)}
          </select>
        </Field>
        <Field label="Direction" required>
          <select className={field} value={values.direction} onChange={(e) => set("direction", e.target.value as "LONG" | "SHORT")}>
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </Field>
        <Field label="Session">
          <select className={field} value={values.session} onChange={(e) => set("session", e.target.value)}>
            <option value="">—</option>
            {SESSIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Opened" required>
          <input type="datetime-local" className={field} value={values.openedAt} onChange={(e) => set("openedAt", e.target.value)} />
        </Field>
        <Field label="Closed" required>
          <input type="datetime-local" className={field} value={values.closedAt} onChange={(e) => set("closedAt", e.target.value)} />
        </Field>
        <Field label="Entry" required>
          <input type="number" step="any" className={field} value={values.entryPrice} onChange={(e) => set("entryPrice", e.target.value)} />
        </Field>
        <Field label="Exit" required>
          <input type="number" step="any" className={field} value={values.exitPrice} onChange={(e) => set("exitPrice", e.target.value)} />
        </Field>
        <Field label="Size">
          <input type="number" step="any" className={field} value={values.positionSize} onChange={(e) => set("positionSize", e.target.value)} />
        </Field>
        <Field label="SL amount ($)">
          <input type="number" step="any" className={field} value={values.stopAmount} onChange={(e) => set("stopAmount", e.target.value)} placeholder="Risk $" />
        </Field>
        <Field label="TP amount ($)">
          <input type="number" step="any" className={field} value={values.targetAmount} onChange={(e) => set("targetAmount", e.target.value)} placeholder="Target $" />
        </Field>
        <Field label="Fees">
          <input type="number" step="any" className={field} value={values.feesCommission} onChange={(e) => set("feesCommission", e.target.value)} />
        </Field>
        <Field label="Execution grade">
          <select className={field} value={values.executionGrade} onChange={(e) => set("executionGrade", e.target.value)}>
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>{g} / 5</option>)}
          </select>
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <span className="micro-label">Rule compliant</span>
        {([true, false, null] as const).map((v) => (
          <button key={String(v)} type="button" onClick={() => set("ruleCompliant", v)}
            className={cn("border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
              values.ruleCompliant === v ? "border-accent text-accent-text" : "border-border text-text-secondary hover:border-border-strong")}>
            {v === true ? "Yes" : v === false ? "No" : "—"}
          </button>
        ))}
      </div>

      {/* Live P&L + R preview */}
      <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
        {[
          { l: "Net P&L", v: preview ? formatCurrency(preview.net) : "—", tone: preview && preview.net < 0 ? "text-short" : "text-long" },
          { l: "Realized R", v: preview?.r != null ? `${preview.r.toFixed(2)}R` : "—", tone: preview?.r != null && preview.r < 0 ? "text-short" : "text-text" },
          { l: "Planned R:R", v: preview?.rr != null ? `1 : ${preview.rr.toFixed(1)}` : "—", tone: "text-text" },
        ].map((s) => (
          <div key={s.l} className="bg-bg-elevated px-4 py-3">
            <p className="micro-label mb-1">{s.l}</p>
            <p className={cn("numeric text-xl", s.tone)}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Thesis"><textarea rows={4} className={cn(field, "resize-y")} value={values.thesis} onChange={(e) => set("thesis", e.target.value)} /></Field>
        <Field label="Execution notes"><textarea rows={4} className={cn(field, "resize-y")} value={values.executionNotes} onChange={(e) => set("executionNotes", e.target.value)} /></Field>
        <Field label="Emotional notes"><textarea rows={3} className={cn(field, "resize-y")} value={values.emotionalNotes} onChange={(e) => set("emotionalNotes", e.target.value)} /></Field>
        <div className="grid gap-4">
          <Field label="Mistakes"><textarea rows={3} className={cn(field, "resize-y")} value={values.mistakes} onChange={(e) => set("mistakes", e.target.value)} /></Field>
          <Field label="Lessons"><textarea rows={3} className={cn(field, "resize-y")} value={values.lessons} onChange={(e) => set("lessons", e.target.value)} /></Field>
        </div>
      </div>

      {error && <p className="text-sm text-short">{error}</p>}
      <div className="flex gap-3">
        <Button variant="primary" disabled={pending} onClick={submit}>
          {pending ? "Saving…" : trade ? "Save changes" : "Log trade"}
        </Button>
        <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
      </div>
    </div>
  );
}
