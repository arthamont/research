"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives";

export function ScreenshotUpload({ tradeId }: { tradeId: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState("BEFORE");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/uploads?tradeId=${tradeId}&kind=${kind}`, { method: "POST", body: fd });
    setBusy(false);
    if (input.current) input.current.value = "";
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Upload failed");
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={kind}
        onChange={(e) => setKind(e.target.value)}
        className="border border-border bg-surface px-2 py-2 font-mono text-[11px] uppercase text-text-secondary"
        aria-label="Screenshot type"
      >
        {["BEFORE", "AFTER", "CONTEXT", "OTHER"].map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} className="hidden" />
      <Button variant="secondary" disabled={busy} onClick={() => input.current?.click()}>
        {busy ? "Uploading…" : "+ Screenshot"}
      </Button>
      {error && <span className="text-xs text-short">{error}</span>}
    </div>
  );
}
