"use client";

import type { AboutContent } from "@/lib/about-content";
import { field, lbl, EditorTextarea } from "./generic-forms";

type ItemSection = "journey" | "principles" | "markets";

const ITEM_KEYS: Record<ItemSection, readonly string[]> = {
  journey: ["n", "phase", "title", "body", "detail"],
  principles: ["title", "sub", "body"],
  markets: ["title", "tagline", "body"],
};

export function AboutEditor({ value, onChange }: { value: AboutContent; onChange: (v: AboutContent) => void }) {
  const set = (key: keyof AboutContent, v: unknown) => onChange({ ...value, [key]: v });
  const setItem = (sec: ItemSection, i: number, k: string, v: string) => {
    const arr = [...value[sec]] as unknown as Record<string, unknown>[];
    arr[i] = { ...arr[i], [k]: v };
    onChange({ ...value, [sec]: arr });
  };
  const paras = (key: "foundation" | "story" | "risk" | "visionParas" | "founderParas") => ({
    value: value[key].join("\n\n"),
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      set(key, e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)),
  });

  return (
    <section>
      <h2 className="micro-label mb-4">About page — editable copy</h2>
      <div className="space-y-6 border border-border bg-bg-elevated p-5">
        {/* headline */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className={lbl}>Headline — line 1</label>
            <input className={field} value={value.heroTitle1} onChange={(e) => set("heroTitle1", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Headline — line 2</label>
            <input className={field} value={value.heroTitle2} onChange={(e) => set("heroTitle2", e.target.value)} />
          </div>
        </div>

        {/* paragraph blocks — blank line separates paragraphs */}
        {(
          [
            ["foundation", "Foundation paragraphs"],
            ["story", "Our Story paragraphs"],
            ["risk", "Risk paragraphs"],
            ["visionParas", "Vision paragraphs"],
            ["founderParas", "Founder paragraphs"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className={lbl}>{label} — blank line separates paragraphs</label>
            <EditorTextarea rows={6} {...paras(key)} />
          </div>
        ))}

        {/* scalars */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className={lbl}>Risk section title</label>
            <input className={field} value={value.riskTitle} onChange={(e) => set("riskTitle", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Vision pull-quote</label>
            <input className={field} value={value.visionQuote} onChange={(e) => set("visionQuote", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Brand lockup label</label>
            <input className={field} value={value.lockupLabel} onChange={(e) => set("lockupLabel", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Philosophy closing quote</label>
            <input className={field} value={value.philosophyQuote} onChange={(e) => set("philosophyQuote", e.target.value)} />
          </div>
        </div>

        {/* philosophy headline + body */}
        <div>
          <label className={lbl}>Philosophy headline — one line per row (3 lines)</label>
          <EditorTextarea
            rows={3}
            value={value.philosophyHeadline.join("\n")}
            onChange={(e) => set("philosophyHeadline", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </div>
        <div>
          <label className={lbl}>Philosophy body</label>
          <EditorTextarea rows={4} value={value.philosophyBody} onChange={(e) => set("philosophyBody", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Disclaimer</label>
          <EditorTextarea rows={3} value={value.disclaimer} onChange={(e) => set("disclaimer", e.target.value)} />
        </div>

        {/* item groups */}
        {(
          [
            ["journey", "The Journey — 4 phases"],
            ["principles", "Our Principles — 3 items"],
            ["markets", "Markets — 3 areas"],
          ] as const
        ).map(([sec, title]) => (
          <div key={sec}>
            <p className="micro-label mb-3">{title}</p>
            <div className="space-y-4">
              {(value[sec] as unknown as Record<string, string>[]).map((item, i) => (
                <div key={i} className="border border-border p-4">
                  <div className="grid gap-3 lg:grid-cols-2">
                    {ITEM_KEYS[sec].map((k) => (
                      <div key={k} className={k === "body" || k === "detail" ? "lg:col-span-2" : ""}>
                        <label className={lbl}>{k}</label>
                        {k === "body" || k === "detail" ? (
                          <EditorTextarea rows={2} value={item[k] ?? ""} onChange={(e) => setItem(sec, i, k, e.target.value)} />
                        ) : (
                          <input className={field} value={item[k] ?? ""} onChange={(e) => setItem(sec, i, k, e.target.value)} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
