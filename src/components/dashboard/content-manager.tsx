"use client";

import { useState } from "react";
import type { ResearchArticle, CaseStudy, PlaybookItem } from "@prisma/client";
import {
  upsertArticle,
  deleteArticle,
  upsertCaseStudy,
  deleteCaseStudy,
  upsertPlaybookItem,
  deletePlaybookItem,
} from "@/server/actions/workspace";
import { Button, Tag } from "@/components/ui/primitives";
import { field, lbl, useActionForm, DeleteButton, FormError, EditorTextarea } from "./generic-forms";
import { cn } from "@/lib/utils";

type Tab = "articles" | "cases" | "playbook";

export function ContentManager({
  articles,
  cases,
  playbook,
}: {
  articles: ResearchArticle[];
  cases: CaseStudy[];
  playbook: PlaybookItem[];
}) {
  const [tab, setTab] = useState<Tab>("articles");
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "articles", label: "Research", count: articles.length },
    { id: "cases", label: "Case studies", count: cases.length },
    { id: "playbook", label: "Playbook", count: playbook.length },
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
            {t.label} ({t.count})
          </button>
        ))}
      </div>
      {tab === "articles" && <ArticlesTab articles={articles} />}
      {tab === "cases" && <CasesTab cases={cases} />}
      {tab === "playbook" && <PlaybookTab items={playbook} />}
    </div>
  );
}

function StatusTag({ s, demo }: { s: string; demo?: boolean }) {
  return (
    <span className="flex gap-1.5">
      <Tag className={s === "PUBLISHED" ? "border-long/40 text-long" : ""}>{s.toLowerCase()}</Tag>
      {demo && <Tag>demo</Tag>}
    </span>
  );
}

/* ── Research articles ────────────────────────────────────────────────── */

function ArticlesTab({ articles }: { articles: ResearchArticle[] }) {
  const { error, pending, run } = useActionForm();
  const [editing, setEditing] = useState<ResearchArticle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const empty = {
    title: "", slug: "", excerpt: "", content: "", coverImage: "", market: "" as "" | "FUTURES" | "FOREX" | "INDIA",
    instruments: "", tags: "", status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED", seoTitle: "", seoDescription: "",
  };
  const [form, setForm] = useState(empty);

  const edit = (a: ResearchArticle) => {
    setEditing(a);
    setShowForm(true);
    setForm({
      title: a.title, slug: a.slug, excerpt: a.excerpt ?? "", content: a.content,
      coverImage: a.coverImage ?? "", market: a.market ?? "", instruments: a.instruments.join(", "),
      tags: a.tags.join(", "), status: a.status, seoTitle: a.seoTitle ?? "", seoDescription: a.seoDescription ?? "",
    });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (showForm) {
    return (
      <div className="space-y-4 border border-border bg-bg-elevated p-5">
        <h3 className="micro-label">{editing ? `Edit — ${editing.title}` : "New research article"}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl}>Title</label>
            <input className={field} value={form.title} onChange={set("title")} />
          </div>
          <div>
            <label className={lbl}>Slug (optional)</label>
            <input className={field} value={form.slug} onChange={set("slug")} placeholder="auto from title" />
          </div>
          <div>
            <label className={lbl}>Market</label>
            <select className={field} value={form.market} onChange={set("market")}>
              <option value="">—</option>
              {["FUTURES", "FOREX", "INDIA"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Status</label>
            <select className={field} value={form.status} onChange={set("status")}>
              {["DRAFT", "PUBLISHED", "ARCHIVED"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Instruments (csv)</label>
            <input className={field} value={form.instruments} onChange={set("instruments")} placeholder="NQ, ES" />
          </div>
          <div>
            <label className={lbl}>Tags (csv)</label>
            <input className={field} value={form.tags} onChange={set("tags")} placeholder="weekly-outlook, structure" />
          </div>
        </div>
        <div>
          <label className={lbl}>Excerpt</label>
          <EditorTextarea rows={2} value={form.excerpt} onChange={set("excerpt")} />
        </div>
        <div>
          <label className={lbl}>Content (markdown)</label>
          <EditorTextarea rows={14} value={form.content} onChange={set("content")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl}>Cover image URL</label>
            <input className={field} value={form.coverImage} onChange={set("coverImage")} placeholder="/storage/… or https://…" />
          </div>
          <div>
            <label className={lbl}>SEO title</label>
            <input className={field} value={form.seoTitle} onChange={set("seoTitle")} />
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>SEO description</label>
            <input className={field} value={form.seoDescription} onChange={set("seoDescription")} />
          </div>
        </div>
        <FormError error={error} />
        <div className="flex gap-3">
          <Button
            variant="primary"
            disabled={pending || !form.title || !form.content}
            onClick={() => run(() => upsertArticle(editing?.id ?? null, { ...form, market: form.market || null }), () => { setShowForm(false); setEditing(null); })}
          >
            {pending ? "Saving…" : editing ? "Update article" : "Create article"}
          </Button>
          <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="secondary" className="mb-4" onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }}>
        + New article
      </Button>
      <ul className="divide-y divide-border border border-border">
        {articles.length === 0 && <li className="p-8 text-center text-sm text-text-faint">No articles yet.</li>}
        {articles.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-4 p-4 hover:bg-surface">
            <div>
              <h3 className="font-semibold tracking-tight">{a.title}</h3>
              <p className="mt-0.5 font-mono text-[11px] text-text-faint">/outlook/{a.slug}</p>
            </div>
            <div className="flex items-center gap-4">
              <StatusTag s={a.status} demo={a.isDemo} />
              <button onClick={() => edit(a)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint hover:text-accent-text">Edit</button>
              <DeleteButton onDelete={() => deleteArticle(a.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Case studies ─────────────────────────────────────────────────────── */

function CasesTab({ cases }: { cases: CaseStudy[] }) {
  const { error, pending, run } = useActionForm();
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [showForm, setShowForm] = useState(false);
  const empty = {
    title: "", slug: "", summary: "", content: "", market: "FUTURES" as "FUTURES" | "FOREX" | "INDIA", instrument: "",
    direction: "LONG" as "LONG" | "SHORT", session: "" as "" | "ASIA" | "LONDON" | "NEW_YORK" | "INDIA" | "OVERLAP" | "OTHER", setup: "", tradeDate: "", rrPlanned: "", rrActual: "",
    grade: "", chartImage: "", tags: "", status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED", isDemo: false,
  };
  const [form, setForm] = useState(empty);

  const edit = (c: CaseStudy) => {
    setEditing(c);
    setShowForm(true);
    setForm({
      title: c.title, slug: c.slug, summary: c.summary ?? "", content: c.content, market: c.market,
      instrument: c.instrument, direction: c.direction, session: c.session ?? "", setup: c.setup ?? "",
      tradeDate: c.tradeDate.toISOString().slice(0, 10), rrPlanned: c.rrPlanned?.toString() ?? "",
      rrActual: c.rrActual?.toString() ?? "", grade: c.grade?.toString() ?? "", chartImage: c.chartImage ?? "",
      tags: c.tags.join(", "), status: c.status, isDemo: c.isDemo,
    });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (showForm) {
    return (
      <div className="space-y-4 border border-border bg-bg-elevated p-5">
        <h3 className="micro-label">{editing ? `Edit — ${editing.title}` : "New case study"}</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className={lbl}>Title</label>
            <input className={field} value={form.title} onChange={set("title")} />
          </div>
          <div>
            <label className={lbl}>Trade date</label>
            <input type="date" className={field} value={form.tradeDate} onChange={set("tradeDate")} />
          </div>
          <div>
            <label className={lbl}>Market</label>
            <select className={field} value={form.market} onChange={set("market")}>
              {["FUTURES", "FOREX", "INDIA"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Instrument</label>
            <input className={field} value={form.instrument} onChange={set("instrument")} placeholder="NQ" />
          </div>
          <div>
            <label className={lbl}>Direction</label>
            <select className={field} value={form.direction} onChange={set("direction")}>
              <option value="LONG">Long</option>
              <option value="SHORT">Short</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Session</label>
            <select className={field} value={form.session} onChange={set("session")}>
              <option value="">—</option>
              {["ASIA", "LONDON", "NEW_YORK", "INDIA", "OVERLAP", "OTHER"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Setup</label>
            <input className={field} value={form.setup} onChange={set("setup")} />
          </div>
          <div>
            <label className={lbl}>Planned R:R (e.g. 3)</label>
            <input type="number" step="any" className={field} value={form.rrPlanned} onChange={set("rrPlanned")} />
          </div>
          <div>
            <label className={lbl}>Actual R</label>
            <input type="number" step="any" className={field} value={form.rrActual} onChange={set("rrActual")} />
          </div>
          <div>
            <label className={lbl}>Grade (1–5)</label>
            <input type="number" min="1" max="5" className={field} value={form.grade} onChange={set("grade")} />
          </div>
          <div>
            <label className={lbl}>Status</label>
            <select className={field} value={form.status} onChange={set("status")}>
              {["DRAFT", "PUBLISHED", "ARCHIVED"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={form.isDemo} onChange={(e) => setForm((f) => ({ ...f, isDemo: e.target.checked }))} className="h-4 w-4 accent-[var(--accent)]" />
              Demo entry (labeled publicly)
            </label>
          </div>
        </div>
        <div>
          <label className={lbl}>Summary</label>
          <EditorTextarea rows={2} value={form.summary} onChange={set("summary")} />
        </div>
        <div>
          <label className={lbl}>Content (markdown — context → hypothesis → execution → review)</label>
          <EditorTextarea rows={12} value={form.content} onChange={set("content")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl}>Chart image URL</label>
            <input className={field} value={form.chartImage} onChange={set("chartImage")} />
          </div>
          <div>
            <label className={lbl}>Tags (csv)</label>
            <input className={field} value={form.tags} onChange={set("tags")} />
          </div>
          <div>
            <label className={lbl}>Slug (optional)</label>
            <input className={field} value={form.slug} onChange={set("slug")} placeholder="auto from title" />
          </div>
        </div>
        <FormError error={error} />
        <div className="flex gap-3">
          <Button
            variant="primary"
            disabled={pending || !form.title || !form.content || !form.instrument || !form.tradeDate}
            onClick={() =>
              run(
                () =>
                  upsertCaseStudy(editing?.id ?? null, {
                    ...form,
                    session: form.session || null,
                    rrPlanned: form.rrPlanned ? parseFloat(form.rrPlanned) : null,
                    rrActual: form.rrActual ? parseFloat(form.rrActual) : null,
                    grade: form.grade ? parseInt(form.grade) : null,
                  }),
                () => { setShowForm(false); setEditing(null); }
              )
            }
          >
            {pending ? "Saving…" : editing ? "Update" : "Create case study"}
          </Button>
          <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="secondary" className="mb-4" onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }}>
        + New case study
      </Button>
      <ul className="divide-y divide-border border border-border">
        {cases.length === 0 && <li className="p-8 text-center text-sm text-text-faint">No case studies yet.</li>}
        {cases.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-4 p-4 hover:bg-surface">
            <div>
              <h3 className="font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-0.5 font-mono text-[11px] text-text-faint">
                /journal/{c.slug} · {c.instrument}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <StatusTag s={c.status} demo={c.isDemo} />
              <button onClick={() => edit(c)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint hover:text-accent-text">Edit</button>
              <DeleteButton onDelete={() => deleteCaseStudy(c.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Public playbook items ────────────────────────────────────────────── */

function PlaybookTab({ items }: { items: PlaybookItem[] }) {
  const { error, pending, run } = useActionForm();
  const [editing, setEditing] = useState<PlaybookItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const empty = { title: "", slug: "", summary: "", content: "", market: "" as "" | "FUTURES" | "FOREX" | "INDIA", sortOrder: "0", status: "PUBLISHED" as "DRAFT" | "PUBLISHED" | "ARCHIVED" };
  const [form, setForm] = useState(empty);

  const edit = (p: PlaybookItem) => {
    setEditing(p);
    setShowForm(true);
    setForm({
      title: p.title, slug: p.slug, summary: p.summary ?? "", content: p.content,
      market: p.market ?? "", sortOrder: String(p.sortOrder), status: p.status,
    });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (showForm) {
    return (
      <div className="space-y-4 border border-border bg-bg-elevated p-5">
        <h3 className="micro-label">{editing ? `Edit — ${editing.title}` : "New playbook entry"}</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className={lbl}>Title</label>
            <input className={field} value={form.title} onChange={set("title")} />
          </div>
          <div>
            <label className={lbl}>Sort order</label>
            <input type="number" className={field} value={form.sortOrder} onChange={set("sortOrder")} />
          </div>
          <div>
            <label className={lbl}>Market</label>
            <select className={field} value={form.market} onChange={set("market")}>
              <option value="">All</option>
              {["FUTURES", "FOREX", "INDIA"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Status</label>
            <select className={field} value={form.status} onChange={set("status")}>
              {["DRAFT", "PUBLISHED", "ARCHIVED"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Slug</label>
            <input className={field} value={form.slug} onChange={set("slug")} placeholder="auto" />
          </div>
        </div>
        <div>
          <label className={lbl}>Summary</label>
          <EditorTextarea rows={2} value={form.summary} onChange={set("summary")} />
        </div>
        <div>
          <label className={lbl}>Content (markdown)</label>
          <EditorTextarea rows={12} value={form.content} onChange={set("content")} />
        </div>
        <FormError error={error} />
        <div className="flex gap-3">
          <Button
            variant="primary"
            disabled={pending || !form.title || !form.content}
            onClick={() => run(() => upsertPlaybookItem(editing?.id ?? null, { ...form, market: form.market || null, sortOrder: parseInt(form.sortOrder) || 0 }), () => { setShowForm(false); setEditing(null); })}
          >
            {pending ? "Saving…" : editing ? "Update" : "Create"}
          </Button>
          <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="secondary" className="mb-4" onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }}>
        + New playbook entry
      </Button>
      <ul className="divide-y divide-border border border-border">
        {items.length === 0 && <li className="p-8 text-center text-sm text-text-faint">No playbook entries yet.</li>}
        {items.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 p-4 hover:bg-surface">
            <div>
              <h3 className="font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-0.5 font-mono text-[11px] text-text-faint">/playbook#{p.slug}</p>
            </div>
            <div className="flex items-center gap-4">
              <StatusTag s={p.status} demo={p.isDemo} />
              <button onClick={() => edit(p)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint hover:text-accent-text">Edit</button>
              <DeleteButton onDelete={() => deletePlaybookItem(p.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
