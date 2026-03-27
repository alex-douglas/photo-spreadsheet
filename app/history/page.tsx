"use client";

import Link from "next/link";

import { HistoryPanel } from "@/components/history-panel";
import { SiteShell } from "@/components/site-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Recent extractions</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Stored only in this browser. Clearing site data removes this list.
            </p>
          </div>
          <Link href="/" className={cn(buttonVariants())}>
            New upload
          </Link>
        </div>
        <HistoryPanel />
      </main>
    </SiteShell>
  );
}
