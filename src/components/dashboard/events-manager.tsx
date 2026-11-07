"use client";

import { useState } from "react";
import type { EconomicEvent } from "@prisma/client";
import { upsertEvent, deleteEvent } from "@/server/actions/workspace";
import { Button, Tag } from "@/components/ui/primitives";
import { field, lbl, useActionForm, DeleteButton, FormError } from "./generic-forms";
import { formatDate } from "@/lib/utils";

export function EventsManager({ events }: { events: EconomicEvent[] }) {
  const { error, pending, run } = useActionForm();
  const [form, setForm] = useState({ title: "", currency: "", impact: "MEDIUM", eventAt: "", notes: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <ul className="divide-y divide-border border border-border">
        {events.length === 0 && <li className="p-6 text-center text-sm text-text-faint">No events scheduled.</li>}
        {events.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-4 p-3.5 hover:bg-surface">
            <div className="flex items-center gap-3">
              <Tag className={e.impact === "HIGH" ? "border-warning/50 text-warning" : ""}>{e.impact}</Tag>
              <div>
                <p className="text-sm">{e.title}</p>
                <p className="font-mono text-[10px] text-text-faint">
                  {e.currency ? `${e.currency} · ` : ""}
                  {formatDate(e.eventAt, { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <DeleteButton onDelete={() => deleteEvent(e.id)} />
          </li>
        ))}
      </ul>
      <div className="border border-border bg-bg-elevated p-5">
        <h3 className="micro-label mb-4">Add event</h3>
        <div className="space-y-3">
          <div>
            <label className={lbl}>Title</label>
            <input className={field} value={form.title} onChange={set("title")} placeholder="FOMC, CPI, RBI policy…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Currency</label>
              <input className={field} value={form.currency} onChange={set("currency")} placeholder="USD" />
            </div>
            <div>
              <label className={lbl}>Impact</label>
              <select className={field} value={form.impact} onChange={set("impact")}>
                {["LOW", "MEDIUM", "HIGH"].map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl}>When</label>
            <input type="datetime-local" className={field} value={form.eventAt} onChange={set("eventAt")} />
          </div>
          <FormError error={error} />
          <Button
            variant="primary"
            disabled={pending || !form.title || !form.eventAt}
            onClick={() => run(() => upsertEvent(null, { ...form, currency: form.currency || null, notes: form.notes || null }), () => setForm({ title: "", currency: "", impact: "MEDIUM", eventAt: "", notes: "" }))}
          >
            {pending ? "Saving…" : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}
