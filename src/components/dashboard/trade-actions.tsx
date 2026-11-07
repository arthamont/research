"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleTradePublic, deleteTrade } from "@/server/actions/trades";
import { Button } from "@/components/ui/primitives";

export function PublishToggle({ tradeId, isPublic }: { tradeId: string; isPublic: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Button variant="secondary" disabled={pending} onClick={() => start(() => toggleTradePublic(tradeId))}>
      {isPublic ? "Unpublish" : "Publish"}
    </Button>
  );
}

export function DeleteTradeButton({ tradeId }: { tradeId: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <Button variant="danger" onClick={() => setConfirming(true)}>
        Delete
      </Button>
    );
  }
  return (
    <span className="flex gap-2">
      <Button
        variant="danger"
        disabled={pending}
        onClick={() => start(async () => { await deleteTrade(tradeId); router.push("/dashboard/journal"); })}
      >
        Confirm delete
      </Button>
      <Button variant="ghost" onClick={() => setConfirming(false)}>
        Keep
      </Button>
    </span>
  );
}
