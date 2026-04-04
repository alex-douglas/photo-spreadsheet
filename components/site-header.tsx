"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";
import { useCredits } from "@/components/credits-provider";
import { Button } from "@/components/ui/button";
import { SITE_DOMAIN } from "@/lib/brand";
import { photoLogoFont } from "@/lib/photo-logo-font";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { credits, creditsMode, openBuyCredits } = useCredits();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            title={SITE_DOMAIN}
            className="flex min-w-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div
              className={cn(
                photoLogoFont.className,
                "flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-primary px-1 text-[0.65rem] font-bold leading-none tracking-wide text-primary-foreground"
              )}
              aria-hidden
            >
              PTS
            </div>
            <span
              className={cn(
                photoLogoFont.className,
                "truncate text-[1.0625rem] font-bold tracking-[-0.03em] sm:text-lg"
              )}
            >
              <span className="text-foreground">Photo</span>
              <span className="text-primary">To</span>
              <span className="text-foreground">Sheet</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/"
              className={cn(
                "rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground",
                pathname === "/" && "bg-muted text-foreground"
              )}
            >
              Upload
            </Link>
            <Link
              href="/history"
              className={cn(
                "rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground",
                pathname === "/history" && "bg-muted text-foreground"
              )}
            >
              History
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
          <span
            className="inline-flex h-9 items-center px-1 text-xs font-medium leading-none text-muted-foreground"
            title={
              creditsMode === "unconfigured"
                ? "Credits stored in this browser until Supabase is configured"
                : "Credits (server + optional email wallet)"
            }
          >
            {credits} credits
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 min-h-9 px-3 text-xs sm:text-sm"
            onClick={() => openBuyCredits()}
          >
            Buy
          </Button>
          <ModeToggle />
        </div>
      </div>
      <div className="mx-auto flex max-w-3xl gap-2 px-4 py-2 sm:hidden">
        <Link
          href="/"
          className={cn(
            "flex-1 rounded-md py-2 text-center text-sm font-medium",
            pathname === "/" ? "bg-muted text-foreground" : "text-muted-foreground"
          )}
        >
          Upload
        </Link>
        <Link
          href="/history"
          className={cn(
            "flex-1 rounded-md py-2 text-center text-sm font-medium",
            pathname === "/history" ? "bg-muted text-foreground" : "text-muted-foreground"
          )}
        >
          History
        </Link>
      </div>
    </header>
  );
}
