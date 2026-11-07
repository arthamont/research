"use client";

import { useState } from "react";
import type { WatchlistItem, Instrument } from "@prisma/client";
import { upsertWatchlist, deleteWatchlist } from "@/server/actions/workspace";
import { Button, Tag } from "@/components/ui/primitives";
import { field, lbl, useActionForm, DeleteButton, FormError, EditorTextarea } from "./generic-forms";

type Item = WatchlistItem & { instrument: Instrument };

export function WatchlistManager({ items, instruments }: { items: Item[]; instruments: Instrument[] }) {
  const { error, pending, run } = useActionForm();
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState({
    instrumentId: instruments[0]?.id ?? "",
    notes: "",
    bias: "NEUTRAL" as "BULLISH" | "BEARISH" | "NEUTRAL",
    setupStatus: "",
    keyLevels: "",
  });

  const startEdit = (w: Item) => {
    setEditing(w);
    const levels = Array.isArray(w.keyLevels)
      ? (w.keyLevels as { price: number; label: string | null }[]).map((l) => `${l.price}${l.label ? ":" + l.label : ""}`).join("\n")
      : "";
    setForm({
      instrumentId: w.instrumentId,
      notes: w.notes ?? "",
      bias: w.bias,
      setupStatus: w.setupStatus ?? "",
      keyLevels: levels,
    });
  };

  const reset = () => {
    setEditing(null);
    setForm({ instrumentId: instruments[0]?.id ?? "", notes: "", bias: "NEUTRAL", setupStatus: "", keyLevels: "" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-border border border-border">
        {items.length === 0 && <li className="p-8 text-center text-sm text-text-faint">Watchlist is empty.</li>}
        {items.map((w) => (
          <li key={w.id} className="p-4 hover:bg-surface">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{w.instrument.symbol}</span>
                  <span className={`font-mono text-[10px] uppercase ${w.bias === "BULLISH" ? "text-long" : w.bias === "BEARISH" ? "text-short" : "text-text-faint"}`}>
                    {w.bias}
                  </span>
                  {w.setupStatus && <Tag>{w.setupStatus}</Tag>}
                </div>
                {w.notes && <p className="mt-1.5 text-sm text-text-secondary">{w.notes}</p>}
                {Array.isArray(w.keyLevels) && (w.keyLevels as { price: number; label?: string }[]).length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {(w.keyLevels as { price: number; label?: string }[]).map((l, i) => (
                      <li key={i} className="font-mono text-[11px] text-text-faint">
                        {l.price} {l.label ? `· ${l.label}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => startEdit(w)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint hover:text-accent-text">
                  Edit
                </button>
                <DeleteButton onDelete={() => deleteWatchlist(w.id)} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border border-border bg-bg-elevated p-5">
        <h3 className="micro-label mb-4">{editing ? `Edit — ${editing.instrument.symbol}` : "Add instrument"}</h3>
        <div className="space-y-4">
          <div>
            <label className={lbl}>Instrument</label>
            <select className={field} value={form.instrumentId} onChange={(e) => setForm((f) => ({ ...f, instrumentId: e.target.value }))}>
              {instruments.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.symbol} — {i.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl}>Bias</label>
            <select className={field} value={form.bias} onChange={(e) => setForm((f) => ({ ...f, bias: e.target.value as typeof form.bias }))}>
              <option value="NEUTRAL">Neutral</option>
              <option value="BULLISH">Bullish</option>
              <option value="BEARISH">Bearish</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Setup status</label>
            <input className={field} placeholder="watching / forming / triggered" value={form.setupStatus} onChange={(e) => setForm((f) => ({ ...f, setupStatus: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>Key levels — one per line: price:label</label>
            <EditorTextarea placeholder={"21450.25:weekly high\n21380:demand"} value={form.keyLevels} onChange={(e) => setForm((f) => ({ ...f, keyLevels: e.target.value }))} rows={3} />
          </div>
          <div>
            <label className={lbl}>Notes</label>
            <EditorTextarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} />
          </div>
          <FormError error={error} />
          <div className="flex gap-3">
            <Button variant="primary" disabled={pending} onClick={() => run(() => upsertWatchlist(editing?.id ?? null, form), reset)}>
              {pending ? "Saving…" : editing ? "Update" : "Add"}
            </Button>
            {editing && (
              <Button variant="ghost" onClick={reset}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
