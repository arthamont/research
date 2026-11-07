import { unstable_cache } from "next/cache";
import { updateTag } from "next/cache";
import { db } from "./db";

/**
 * Near-static per-user data, cached 60s. Single-owner app — one tag for all
 * workspace data; write actions call `bustWorkspaceCache()` after mutations.
 */
const TAG = "workspace";

export function bustWorkspaceCache() {
  updateTag(TAG);
}

export const getUserSettings = unstable_cache(
  async (userId: string) => db.userSettings.findUnique({ where: { userId } }),
  ["user-settings"],
  { revalidate: 60, tags: [TAG] }
);

export const getChecklistTemplates = unstable_cache(
  async (userId: string) => db.checklistTemplate.findMany({ where: { userId }, orderBy: [{ stage: "asc" }, { sortOrder: "asc" }] }),
  ["checklist-templates"],
  { revalidate: 60, tags: [TAG] }
);

export const getSetups = unstable_cache(
  async (userId: string) => db.setup.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ["setups"],
  { revalidate: 60, tags: [TAG] }
);

export const getInstruments = unstable_cache(
  async () => db.instrument.findMany({ where: { isActive: true }, orderBy: { symbol: "asc" } }),
  ["instruments"],
  { revalidate: 300, tags: [TAG] }
);
