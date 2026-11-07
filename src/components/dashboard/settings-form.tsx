"use client";

import { useState } from "react";
import type { UserSettings } from "@prisma/client";
import { updateSettings } from "@/server/actions/workspace";
import { Button } from "@/components/ui/primitives";
import { field, lbl, useActionForm, FormError, EditorTextarea } from "./generic-forms";
import { cn } from "@/lib/utils";
import { mergeAbout } from "@/lib/about-content";
import { AboutEditor } from "./about-editor";

interface HeroJson {
  eyebrow?: string;
  line1?: string;
  line2?: string;
  lede?: string;
  cta1Label?: string;
  cta2Label?: string;
  strip?: string;
  note?: string;
}

export function SettingsForm({ settings }: { settings: UserSettings | null }) {
  const { error, pending, run } = useActionForm();
  const [saved, setSaved] = useState(false);
  const social = settings?.socialLinks ? JSON.stringify(settings.socialLinks, null, 2).replace(/^\{|\}$/g, "").trim() : "";

  const [form, setForm] = useState({
    maxTradesPerDay: settings?.maxTradesPerDay?.toString() ?? "1",
    futuresPropRiskPct: settings?.futuresPropRiskPct?.toString() ?? "0.5",
    forexPropRiskPct: settings?.forexPropRiskPct?.toString() ?? "1",
    targetRiskReward: settings?.targetRiskReward?.toString() ?? "3",
    minRiskReward: settings?.minRiskReward?.toString() ?? "3",
    breakevenAfterR: settings?.breakevenAfterR?.toString() ?? "2",
    allowPartialExits: settings?.allowPartialExits ?? false,
    noRevengeTrading: settings?.noRevengeTrading ?? true,
    noChasingMissedSetups: settings?.noChasingMissedSetups ?? true,
    reviewWithinHours: settings?.reviewWithinHours?.toString() ?? "24",
    timezone: settings?.timezone ?? "Asia/Kolkata",
    bio: settings?.bio ?? "",
    riskApproach: settings?.riskApproach ?? "",
    longTermObjectives: settings?.longTermObjectives ?? "",
    tradingInterests: (settings?.tradingInterests ?? []).join(", "),
    socialLinks: social,
    hero: {
      eyebrow: (settings?.heroJson as HeroJson)?.eyebrow ?? "Conviction. Discipline. Longevity.",
      line1: (settings?.heroJson as HeroJson)?.line1 ?? "Built on principle.",
      line2: (settings?.heroJson as HeroJson)?.line2 ?? "Defined by time.",
      lede: (settings?.heroJson as HeroJson)?.lede ?? "An independent pursuit of disciplined trading, rigorous market research, and long-term capital stewardship.",
      cta1Label: (settings?.heroJson as HeroJson)?.cta1Label ?? "Explore our philosophy",
      cta2Label: (settings?.heroJson as HeroJson)?.cta2Label ?? "Discover our research",
      strip: (settings?.heroJson as HeroJson)?.strip ?? "Futures / Global markets / Research",
      note: (settings?.heroJson as HeroJson)?.note ?? "An independent trading and research initiative with a long-term institutional vision.",
    },
    about: mergeAbout(settings?.aboutJson as Record<string, unknown> | null),
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const num = (v: string) => (v === "" ? 0 : parseFloat(v));

  return (
    <div className="space-y-10">
      {/* Homepage hero */}
      <section>
        <h2 className="micro-label mb-4">Homepage hero — editable copy</h2>
        <div className="space-y-4 border border-border bg-bg-elevated p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className={lbl}>Tagline (eyebrow)</label>
              <input className={field} value={form.hero.eyebrow} onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, eyebrow: e.target.value } }))} />
            </div>
            <div>
              <label className={lbl}>Strip text</label>
              <input className={field} value={form.hero.strip} onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, strip: e.target.value } }))} />
            </div>
            <div>
              <label className={lbl}>Headline — line 1</label>
              <input className={field} value={form.hero.line1} onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, line1: e.target.value } }))} />
            </div>
            <div>
              <label className={lbl}>Headline — line 2</label>
              <input className={field} value={form.hero.line2} onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, line2: e.target.value } }))} />
            </div>
            <div>
              <label className={lbl}>Button 1 label</label>
              <input className={field} value={form.hero.cta1Label} onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, cta1Label: e.target.value } }))} />
            </div>
            <div>
              <label className={lbl}>Button 2 label</label>
              <input className={field} value={form.hero.cta2Label} onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, cta2Label: e.target.value } }))} />
            </div>
          </div>
          <div>
            <label className={lbl}>Lead paragraph</label>
            <EditorTextarea rows={3} value={form.hero.lede} onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, lede: e.target.value } }))} />
          </div>
          <div>
            <label className={lbl}>Italic note (small print)</label>
            <EditorTextarea rows={2} value={form.hero.note} onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, note: e.target.value } }))} />
          </div>
        </div>
      </section>

      {/* About page */}
      <AboutEditor value={form.about} onChange={(v) => setForm((f) => ({ ...f, about: v }))} />

      {/* Identity */}
      <section>
        <h2 className="micro-label mb-4">Identity — shown on /about</h2>
        <div className="space-y-4 border border-border bg-bg-elevated p-5">
          <div>
            <label className={lbl}>Bio</label>
            <EditorTextarea rows={4} value={form.bio} onChange={set("bio")} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className={lbl}>Approach to risk</label>
              <EditorTextarea rows={3} value={form.riskApproach} onChange={set("riskApproach")} />
            </div>
            <div>
              <label className={lbl}>Long-term objectives</label>
              <EditorTextarea rows={3} value={form.longTermObjectives} onChange={set("longTermObjectives")} />
            </div>
          </div>
          <div>
            <label className={lbl}>Trading interests (comma-separated)</label>
            <input className={field} value={form.tradingInterests} onChange={set("tradingInterests")} />
          </div>
          <div>
            <label className={lbl}>Social links — name: url per line, or JSON</label>
            <EditorTextarea rows={3} value={form.socialLinks} onChange={set("socialLinks")} placeholder={'x: https://x.com/you\ninstagram: https://instagram.com/you'} />
          </div>
        </div>
      </section>

      <FormError error={error} />
      <div className="flex items-center gap-4">
        <Button
          variant="primary"
          disabled={pending}
          onClick={() =>
            run(
              () =>
                updateSettings({
                  ...form,
                  maxTradesPerDay: parseInt(form.maxTradesPerDay) || 1,
                  futuresPropRiskPct: num(form.futuresPropRiskPct),
                  forexPropRiskPct: num(form.forexPropRiskPct),
                  targetRiskReward: num(form.targetRiskReward),
                  minRiskReward: num(form.minRiskReward),
                  breakevenAfterR: num(form.breakevenAfterR),
                  reviewWithinHours: parseInt(form.reviewWithinHours) || 24,
                }),
              () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
              }
            )
          }
        >
          {pending ? "Saving…" : "Save settings"}
        </Button>
        <span className={cn("text-xs text-long transition-opacity", saved ? "opacity-100" : "opacity-0")}>Saved.</span>
      </div>
    </div>
  );
}
