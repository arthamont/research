import { describe, it, expect } from "vitest";
import { getSessionStatuses, formatCountdown } from "./sessions";

describe("getSessionStatuses", () => {
  it("returns all four sessions with sane fields", () => {
    const statuses = getSessionStatuses(new Date("2026-11-07T14:30:00Z"));
    expect(statuses).toHaveLength(4);
    for (const s of statuses) {
      expect(["ASIA", "LONDON", "NEW_YORK", "INDIA"]).toContain(s.id);
      expect(s.progress).toBeGreaterThanOrEqual(0);
      expect(s.progress).toBeLessThanOrEqual(1);
      expect(s.localTime).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it("New York is open during 09:30 ET and closed after 16:00 ET", () => {
    // 2026-11-07 is EST (UTC-5): 14:30 UTC = 09:30 ET → just opened
    const open = getSessionStatuses(new Date("2026-11-07T15:00:00Z")).find((s) => s.id === "NEW_YORK")!;
    expect(open.isOpen).toBe(true);
    // 22:00 UTC = 17:00 ET → closed
    const closed = getSessionStatuses(new Date("2026-11-07T22:00:00Z")).find((s) => s.id === "NEW_YORK")!;
    expect(closed.isOpen).toBe(false);
  });

  it("is DST-aware: NY open shifts relative to UTC across summer", () => {
    // July: EDT (UTC-4) — 09:30 ET = 13:30 UTC
    const summer = getSessionStatuses(new Date("2026-07-07T13:45:00Z")).find((s) => s.id === "NEW_YORK")!;
    expect(summer.isOpen).toBe(true);
  });

  it("India session opens 09:15 IST", () => {
    // IST = UTC+5:30 → 09:15 IST = 03:45 UTC
    const s = getSessionStatuses(new Date("2026-11-07T04:00:00Z")).find((x) => x.id === "INDIA")!;
    expect(s.isOpen).toBe(true);
  });
});

describe("formatCountdown", () => {
  it("formats minutes", () => {
    expect(formatCountdown(45)).toBe("45m");
    expect(formatCountdown(130)).toBe("2h 10m");
    expect(formatCountdown(null)).toBe("—");
  });
});
