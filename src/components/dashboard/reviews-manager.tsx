"use client";

import { useState } from "react";
import type { TradingPlan, ChecklistTemplate, ChecklistEntry, DailyReview, WeeklyReview } from "@prisma/client";
import { upsertPlan, saveChecklistEntry, upsertDailyReview, upsertWeeklyReview } from "@/server/actions/workspace";
import { Button, Tag } from "@/components/ui/primitives";
import { field, lbl, useActionForm, FormError, EditorTextarea } from "./generic-forms";
import { cn } from "@/lib/utils";

type Tab = "plan" | "checklist" | "daily" | "weekly";

interface Props {
  date: string;
  plan: TradingPlan | null;
  templates: ChecklistTemplate[];
  entries: ChecklistEntry[];
  dailyReview: DailyReview | null;
  weeklyReview: WeeklyReview | null;
  weekStart: string;
}

export function ReviewsManager({ date, plan, templates, entries, dailyReview, weeklyReview, weekStart }: Props) {
  const [tab, setTab] = useState<Tab>("plan");

  const tabs: { id: Tab; label: string }[] = [
    { id: "plan", label: "Daily plan" },
    { id: "checklist", label: "Checklists" },
    { id: "daily", label: "Daily review" },
    { id: "weekly", label: "Weekly review" },
  ];

  return (
    <div>
      <div className="mb-6 flex gap-px border border-border bg-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
              tab === t.id ? "bg-accent text-bg" : "bg-bg-elevated text-text-secondary hover:text-text"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "plan" && <PlanForm date={date} plan={plan} />}
      {tab === "checklist" && <ChecklistSection date={date} templates={templates} entries={entries} />}
      {tab === "daily" && <DailyForm date={date} review={dailyReview} />}
      {tab === "weekly" && <WeeklyForm weekStart={weekStart} review={weeklyReview} />}
    </div>
  );
}

/* ── Daily plan ───────────────────────────────────────────────────────── */

function PlanForm({ date, plan }: { date: string; plan: TradingPlan | null }) {
  const { error, pending, run } = useActionForm();
  const levels = Array.isArray(plan?.keyLevels)
    ? (plan!.keyLevels as { instrument: string; price: number; note?: string }[]).map((l) => `${l.instrument}:${l.price}${l.note ? ":" + l.note : ""}`).join("\n")
    : "";
  const scenarios = Array.isArray(plan?.scenarios)
    ? (plan!.scenarios as { label: string; condition: string; action: string }[]).map((s) => `${s.label}|${s.condition}|${s.action}`).join("\n")
    : "";
  const readiness = (plan?.readiness as { sleep?: string; mindset?: string } | null) ?? {};

  const [form, setForm] = useState({
    narrative: plan?.narrative ?? "",
    marketFocus: (plan?.marketFocus ?? []) as string[],
    sessionFocus: (plan?.sessionFocus ?? []) as string[],
    keyLevels: levels,
    scenarios,
    sleep: readiness.sleep ?? "",
    mindset: readiness.mindset ?? "",
  });

  const toggle = (key: "marketFocus" | "sessionFocus", v: string) =>
    setForm((f) => ({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className={lbl}>Directional narrative</label>
          <EditorTextarea rows={5} value={form.narrative} onChange={(e) => setForm((f) => ({ ...f, narrative: e.target.value }))} placeholder="What is the market telling you today?" />
        </div>
        <div>
          <label className={lbl}>Market focus</label>
          <div className="flex gap-2">
            {["FUTURES", "FOREX", "INDIA"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggle("marketFocus", m)}
                className={cn("border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]", form.marketFocus.includes(m) ? "border-accent text-accent-text" : "border-border text-text-secondary")}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={lbl}>Session focus</label>
          <div className="flex flex-wrap gap-2">
            {["ASIA", "LONDON", "NEW_YORK", "INDIA"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle("sessionFocus", s)}
                className={cn("border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]", form.sessionFocus.includes(s) ? "border-accent text-accent-text" : "border-border text-text-secondary")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className={lbl}>Key levels — instrument:price:note</label>
          <EditorTextarea rows={4} value={form.keyLevels} onChange={(e) => setForm((f) => ({ ...f, keyLevels: e.target.value }))} placeholder={"NQ:21450:weekly high\nEURUSD:1.0850:demand"} />
        </div>
        <div>
          <label className={lbl}>Scenarios — label|condition|action</label>
          <EditorTextarea rows={4} value={form.scenarios} onChange={(e) => setForm((f) => ({ ...f, scenarios: e.target.value }))} placeholder={"A|sweep of ON low + displacement|short into FVG\nB|no sweep|stand aside"} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Sleep / readiness</label>
            <input className={field} value={form.sleep} onChange={(e) => setForm((f) => ({ ...f, sleep: e.target.value }))} placeholder="7h, rested" />
          </div>
          <div>
            <label className={lbl}>Mindset</label>
            <input className={field} value={form.mindset} onChange={(e) => setForm((f) => ({ ...f, mindset: e.target.value }))} placeholder="calm, focused" />
          </div>
        </div>
        <FormError error={error} />
        <Button variant="primary" disabled={pending} onClick={() => run(() => upsertPlan({ date, ...form, marketFocus: form.marketFocus, sessionFocus: form.sessionFocus }))}>
          {pending ? "Saving…" : "Save plan"}
        </Button>
      </div>
    </div>
  );
}

/* ── Checklists ───────────────────────────────────────────────────────── */

function ChecklistSection({ date, templates, entries }: { date: string; templates: ChecklistTemplate[]; entries: ChecklistEntry[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {templates.map((t) => {
        const entry = entries.find((e) => e.templateId === t.id);
        return <ChecklistCard key={t.id} date={date} template={t} entry={entry ?? null} />;
      })}
    </div>
  );
}

function ChecklistCard({ date, template, entry }: { date: string; template: ChecklistTemplate; entry: ChecklistEntry | null }) {
  const { error, pending, run } = useActionForm();
  const items = (template.items as { key: string; label: string }[]) ?? [];
  const [checked, setChecked] = useState<string[]>(Array.isArray(entry?.checked) ? (entry.checked as string[]) : []);

  const toggle = (k: string) =>
    setChecked((c) => {
      const next = c.includes(k) ? c.filter((x) => x !== k) : [...c, k];
      run(() => saveChecklistEntry(template.id, date, next));
      return next;
    });

  return (
    <div className="border border-border bg-bg-elevated p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold tracking-tight">{template.name}</h3>
        <Tag>{template.stage.replace("_", " ")}</Tag>
      </div>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.key}>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-text-secondary hover:text-text">
              <span
                className={cn("flex h-4 w-4 items-center justify-center border transition-colors", checked.includes(item.key) ? "border-accent bg-accent text-bg" : "border-border-strong")}
                aria-hidden
              >
                {checked.includes(item.key) && "✓"}
              </span>
              <input type="checkbox" className="sr-only" checked={checked.includes(item.key)} onChange={() => toggle(item.key)} disabled={pending} />
              {item.label}
            </label>
          </li>
        ))}
      </ul>
      <p className="numeric mt-4 text-xs text-text-faint">
        {checked.length} / {items.length}
      </p>
      <FormError error={error} />
    </div>
  );
}

/* ── Daily review ─────────────────────────────────────────────────────── */

function DailyForm({ date, review }: { date: string; review: DailyReview | null }) {
  const { error, pending, run } = useActionForm();
  const [form, setForm] = useState({
    summary: review?.summary ?? "",
    executionGrade: review?.executionGrade?.toString() ?? "",
    mistakes: review?.mistakes ?? "",
    lessons: review?.lessons ?? "",
    emotionalReview: review?.emotionalReview ?? "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <label className={lbl}>Summary — how did the day go?</label>
        <EditorTextarea rows={4} value={form.summary} onChange={set("summary")} />
      </div>
      <div>
        <label className={lbl}>Execution grade</label>
        <select className={field} value={form.executionGrade} onChange={set("executionGrade")}>
          <option value="">—</option>
          {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl}>Emotional review</label>
        <input className={field} value={form.emotionalReview} onChange={set("emotionalReview")} placeholder="calm / impatient / frustrated…" />
      </div>
      <div>
        <label className={lbl}>Mistakes</label>
        <EditorTextarea rows={3} value={form.mistakes} onChange={set("mistakes")} />
      </div>
      <div>
        <label className={lbl}>Lessons</label>
        <EditorTextarea rows={3} value={form.lessons} onChange={set("lessons")} />
      </div>
      <div className="lg:col-span-2">
        <FormError error={error} />
        <Button variant="primary" disabled={pending} onClick={() => run(() => upsertDailyReview({ date, ...form, executionGrade: form.executionGrade ? parseInt(form.executionGrade) : null }))}>
          {pending ? "Saving…" : "Save daily review"}
        </Button>
      </div>
    </div>
  );
}

/* ── Weekly review ────────────────────────────────────────────────────── */

function WeeklyForm({ weekStart, review }: { weekStart: string; review: WeeklyReview | null }) {
  const { error, pending, run } = useActionForm();
  const [form, setForm] = useState({
    tradesTaken: review?.tradesTaken.toString() ?? "0",
    tradesAvoided: review?.tradesAvoided.toString() ?? "0",
    ruleViolations: review?.ruleViolations.toString() ?? "0",
    executionGrade: review?.executionGrade?.toString() ?? "",
    strongestSetup: review?.strongestSetup ?? "",
    recurringMistakes: review?.recurringMistakes ?? "",
    improvementPriorities: review?.improvementPriorities ?? "",
    nextWeekPlan: review?.nextWeekPlan ?? "",
    summary: review?.summary ?? "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <p className="mb-4 font-mono text-xs text-text-faint">Week starting {weekStart}</p>
      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <label className={lbl}>Trades taken</label>
          <input type="number" min="0" className={field} value={form.tradesTaken} onChange={set("tradesTaken")} />
        </div>
        <div>
          <label className={lbl}>Trades avoided</label>
          <input type="number" min="0" className={field} value={form.tradesAvoided} onChange={set("tradesAvoided")} />
        </div>
        <div>
          <label className={lbl}>Rule violations</label>
          <input type="number" min="0" className={field} value={form.ruleViolations} onChange={set("ruleViolations")} />
        </div>
        <div>
          <label className={lbl}>Execution grade</label>
          <select className={field} value={form.executionGrade} onChange={set("executionGrade")}>
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className={lbl}>Strongest setup</label>
          <input className={field} value={form.strongestSetup} onChange={set("strongestSetup")} />
        </div>
        <div>
          <label className={lbl}>Recurring mistakes</label>
          <EditorTextarea rows={3} value={form.recurringMistakes} onChange={set("recurringMistakes")} />
        </div>
        <div>
          <label className={lbl}>Improvement priorities</label>
          <EditorTextarea rows={3} value={form.improvementPriorities} onChange={set("improvementPriorities")} />
        </div>
        <div>
          <label className={lbl}>Next week&rsquo;s plan</label>
          <EditorTextarea rows={3} value={form.nextWeekPlan} onChange={set("nextWeekPlan")} />
        </div>
        <div className="lg:col-span-3">
          <label className={lbl}>Summary</label>
          <EditorTextarea rows={3} value={form.summary} onChange={set("summary")} />
          <div className="mt-4">
            <FormError error={error} />
            <Button
              variant="primary"
              disabled={pending}
              onClick={() =>
                run(() =>
                  upsertWeeklyReview({
                    weekStart,
                    tradesTaken: parseInt(form.tradesTaken) || 0,
                    tradesAvoided: parseInt(form.tradesAvoided) || 0,
                    ruleViolations: parseInt(form.ruleViolations) || 0,
                    executionGrade: form.executionGrade ? parseInt(form.executionGrade) : null,
                    strongestSetup: form.strongestSetup || null,
                    recurringMistakes: form.recurringMistakes || null,
                    improvementPriorities: form.improvementPriorities || null,
                    nextWeekPlan: form.nextWeekPlan || null,
                    summary: form.summary || null,
                  })
                )
              }
            >
              {pending ? "Saving…" : "Save weekly review"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
