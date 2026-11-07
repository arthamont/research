"use client";

import { useState } from "react";
import type { Setup } from "@prisma/client";
import { upsertSetup, deleteSetup } from "@/server/actions/workspace";
import { Button, Tag } from "@/components/ui/primitives";
import { field, lbl, useActionForm, DeleteButton, FormError, EditorTextarea } from "./generic-forms";

export function SetupManager({ setups }: { setups: Setup[] }) {
  const { error, pending, run } = useActionForm();
  const [editing, setEditing] = useState<Setup | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", market: "", rules: "" });

  const startEdit = (s: Setup) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description ?? "", market: s.market ?? "", rules: s.rules ?? "" });
    setShowForm(true);
  };

  const reset = () => {
    setEditing(null);
    setForm({ name: "", description: "", market: "", rules: "" });
    setShowForm(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-border border border-border">
        {setups.length === 0 && (
          <li className="p-8 text-center text-sm text-text-faint">No setups defined yet.</li>
        )}
        {setups.map((s) => (
          <li key={s.id} className="flex items-start justify-between gap-4 p-4 hover:bg-surface">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold tracking-tight">{s.name}</h3>
                {s.market && <Tag>{s.market}</Tag>}
              </div>
              {s.description && <p className="mt-1 text-sm text-text-secondary">{s.description}</p>}
            </div>
            <div className="flex shrink-0 gap-3">
              <button onClick={() => startEdit(s)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint hover:text-accent-text">
                Edit
              </button>
              <DeleteButton onDelete={() => deleteSetup(s.id)} />
            </div>
          </li>
        ))}
      </ul>

      <div className="border border-border bg-bg-elevated p-5">
        <h3 className="micro-label mb-4">{editing ? `Edit — ${editing.name}` : "New setup"}</h3>
        <div className="space-y-4">
          <div>
            <label className={lbl}>Name</label>
            <input className={field} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>Market</label>
            <select className={field} value={form.market} onChange={(e) => setForm((f) => ({ ...f, market: e.target.value }))}>
              <option value="">Any</option>
              {["FUTURES", "FOREX", "INDIA"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl}>Description</label>
            <EditorTextarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>Rules / criteria (markdown)</label>
            <EditorTextarea value={form.rules} onChange={(e) => setForm((f) => ({ ...f, rules: e.target.value }))} rows={5} />
          </div>
          <FormError error={error} />
          <div className="flex gap-3">
            <Button
              variant="primary"
              disabled={pending || !form.name}
              onClick={() => run(() => upsertSetup(editing?.id ?? null, { ...form, market: form.market || null }), reset)}
            >
              {pending ? "Saving…" : editing ? "Update" : "Create"}
            </Button>
            {showForm && (
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
