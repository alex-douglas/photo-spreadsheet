import type { DocType } from "@/lib/extraction-prompts";
import { generateId } from "@/lib/uuid";

const STORAGE_KEY = "photosheet.history.v1";
const MAX_ENTRIES = 25;

export interface HistoryPageSlice {
  fields: Record<string, string>;
  table?: string[][];
}

export interface HistoryEntry {
  id: string;
  savedAt: string;
  docLabel: string;
  type: DocType;
  fields: Record<string, string>;
  table?: string[][];
  /** Present when a multi-page PDF was split in the UI; export merges all slices. */
  pages?: HistoryPageSlice[];
  meta?: {
    pdfPageCount?: number;
    multiPagePdf?: boolean;
    creditCost?: number;
    /** Same upload/analyze batch (multi-file session). */
    batchGroupId?: string;
    batchIndex?: number;
    batchSize?: number;
  };
}

function readAll(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is HistoryEntry =>
        x &&
        typeof x === "object" &&
        typeof (x as HistoryEntry).id === "string" &&
        typeof (x as HistoryEntry).type === "string"
    );
  } catch {
    return [];
  }
}

function writeAll(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

function makeLabel(type: DocType, fields: Record<string, string>): string {
  const pick =
    fields.document_type ||
    fields.store_name ||
    fields.vendor_name ||
    fields.employer_name ||
    fields.employee_name ||
    fields.name ||
    Object.values(fields).find((v) => v && String(v).length > 2);
  const short = pick ? String(pick).slice(0, 48) : type.replace(/_/g, " ");
  return short;
}

export function loadHistory(): HistoryEntry[] {
  return readAll();
}

export function getHistoryEntryById(id: string): HistoryEntry | undefined {
  return readAll().find((e) => e.id === id);
}

/** Prev/next within the same multi-file analyze batch only (via meta.batchGroupId). */
export function getBatchNavigation(currentId: string): {
  prevId: string | null;
  nextId: string | null;
  index: number;
  total: number;
} | null {
  const all = readAll();
  const current = all.find((e) => e.id === currentId);
  const batchGroupId = current?.meta?.batchGroupId;
  const batchSize = current?.meta?.batchSize ?? 0;
  if (!batchGroupId || batchSize < 2) return null;

  const group = all
    .filter((e) => e.meta?.batchGroupId === batchGroupId)
    .sort((a, b) => (a.meta?.batchIndex ?? 0) - (b.meta?.batchIndex ?? 0));
  if (group.length < 2) return null;

  const idx = group.findIndex((e) => e.id === currentId);
  if (idx < 0) return null;

  return {
    prevId: idx > 0 ? group[idx - 1]!.id : null,
    nextId: idx < group.length - 1 ? group[idx + 1]!.id : null,
    index: idx,
    total: group.length,
  };
}

export function appendHistory(
  entry: Omit<HistoryEntry, "id" | "savedAt" | "docLabel"> & { docLabel?: string }
): HistoryEntry {
  const id = generateId("h");
  const savedAt = new Date().toISOString();
  const docLabel = entry.docLabel ?? makeLabel(entry.type, entry.fields);
  const full: HistoryEntry = {
    id,
    savedAt,
    docLabel,
    type: entry.type,
    fields: entry.fields,
    table: entry.table,
    pages: entry.pages,
    meta: entry.meta,
  };
  const next = [full, ...readAll()].slice(0, MAX_ENTRIES);
  writeAll(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("photosheet-history"));
  }
  return full;
}

export function removeHistoryEntry(id: string): void {
  writeAll(readAll().filter((e) => e.id !== id));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("photosheet-history"));
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("photosheet-history"));
}
