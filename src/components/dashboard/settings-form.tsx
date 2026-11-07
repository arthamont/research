"use client";

import { useState } from "react";
import type { UserSettings } from "@prisma/client";
import { updateSettings } from "@/server/actions/workspace";
import { Button } from "@/components/ui/primitives";
import { lbl, useActionForm, FormError, EditorTextarea } from "./generic-forms";
import { cn } from "@/lib/utils";

export function SettingsForm({ settings }: { settings: UserSettings | null }) {
  const { error, pending, run } = useActionForm();
  const [saved, setSaved] = useState(false);
  const social = settings?.socialLinks ? JSON.stringify(settings.socialLinks, null, 2).replace(/^\{|\}$/g, "").trim() : "";

  const [form, setForm] = useState({ socialLinks: social });

  return (
    <div className="space-y-10">
      <section>
        <h2 className="micro-label mb-4">Social links — shown on /about</h2>
        <div className="space-y-4 border border-border bg-bg-elevated p-5">
          <div>
            <label className={lbl}>Social links — name: url per line, or JSON</label>
            <EditorTextarea
              rows={3}
              value={form.socialLinks}
              onChange={(e) => setForm({ socialLinks: e.target.value })}
              placeholder={'x: https://x.com/you\ninstagram: https://instagram.com/you'}
            />
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
              () => updateSettings({ socialLinks: form.socialLinks }),
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
