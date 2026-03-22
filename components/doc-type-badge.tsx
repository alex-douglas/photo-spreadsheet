"use client";

import { DOC_TYPE_LABELS, type DocType } from "@/lib/extraction-prompts";

const COLORS: Record<DocType, string> = {
  w2: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  receipt: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  invoice: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  business_card: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  table: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const ICONS: Record<DocType, string> = {
  w2: "📄",
  receipt: "🧾",
  invoice: "📑",
  business_card: "💼",
  table: "📊",
  other: "📋",
};

export function DocTypeBadge({ type }: { type: DocType }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${COLORS[type]}`}
    >
      <span>{ICONS[type]}</span>
      {DOC_TYPE_LABELS[type]}
    </span>
  );
}
