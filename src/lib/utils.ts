import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", ...opts });
}

export function formatNumber(n: number | string | null | undefined, decimals = 2) {
  if (n === null || n === undefined) return "—";
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(v)) return "—";
  return v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatSigned(n: number | null | undefined, decimals = 2, suffix = "") {
  if (n === null || n === undefined) return "—";
  const abs = formatNumber(Math.abs(n), decimals);
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${abs}${suffix}`;
}

export function formatCurrency(n: number | string | null | undefined, currency = "USD") {
  if (n === null || n === undefined) return "—";
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(v)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(v);
}

export function formatR(r: number | string | null | undefined) {
  if (r === null || r === undefined) return "—";
  const v = typeof r === "string" ? parseFloat(r) : r;
  if (Number.isNaN(v)) return "—";
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(2)}R`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function readingTimeMinutes(markdown: string) {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
