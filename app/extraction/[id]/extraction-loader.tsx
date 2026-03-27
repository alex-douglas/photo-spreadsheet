"use client";

import dynamic from "next/dynamic";

import { SiteShell } from "@/components/site-shell";

const ExtractionClient = dynamic(() => import("./extraction-client"), {
  ssr: false,
  loading: () => (
    <SiteShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center text-muted-foreground">
        Loading…
      </main>
    </SiteShell>
  ),
});

export function ExtractionLoader({ id }: { id: string }) {
  return <ExtractionClient id={id} />;
}
