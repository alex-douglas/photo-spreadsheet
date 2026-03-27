"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { clearHistory, loadHistory, removeHistoryEntry, type HistoryEntry } from "@/lib/history-storage";

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function HistoryPanel() {
  const [items, setItems] = useState<HistoryEntry[]>(() => loadHistory());

  const refresh = useCallback(() => {
    setItems(loadHistory());
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "photosheet.history.v1") setItems(loadHistory());
    }
    function onLocal() {
      setItems(loadHistory());
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("photosheet-history", onLocal);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("photosheet-history", onLocal);
    };
  }, []);

  if (items.length === 0) {
    return (
      <Card className="ring-border">
        <CardHeader>
          <CardTitle className="text-base">Recent extractions</CardTitle>
          <CardDescription>
            Saved scans will appear here. Data stays in this browser only — clearing site data or switching
            devices removes it. Not a backup.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="ring-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent extractions</CardTitle>
        <CardDescription className="text-xs leading-relaxed">
          Stored only in this browser&apos;s local storage. Clearing cookies/site data, private browsing, or
          another device means this list (and saved results) are gone. We do not sync extraction results to a
          server — only credit balances can be tied to email in Supabase when you purchase or link.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[min(320px,50vh)] pr-3">
          <ul className="space-y-2">
            {items.map((e) => (
              <li
                key={e.id}
                className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm"
              >
                <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{e.docLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.type.replace(/_/g, " ")} · {formatWhen(e.savedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Link
                    href={`/extraction/${e.id}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 px-2")}
                  >
                    Open
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    aria-label="Remove from history"
                    onClick={() => {
                      removeHistoryEntry(e.id);
                      refresh();
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => {
            if (confirm("Remove all saved extractions from this browser?")) {
              clearHistory();
              refresh();
            }
          }}
        >
          Clear all history
        </Button>
      </CardContent>
    </Card>
  );
}
