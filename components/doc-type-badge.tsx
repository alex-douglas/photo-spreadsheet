"use client";

import { DOC_TYPE_LABELS, type DocType } from "@/lib/extraction-prompts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES: Record<DocType, string> = {
  w2: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200",
  receipt:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
  invoice:
    "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-200",
  business_card:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
  table: "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-200",
  other: "border-border bg-muted text-foreground",
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
    <Badge variant="outline" className={cn("h-7 gap-1.5 rounded-full px-3 text-sm font-medium", STYLES[type])}>
      <span aria-hidden>{ICONS[type]}</span>
      {DOC_TYPE_LABELS[type]}
    </Badge>
  );
}
