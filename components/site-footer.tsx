import Link from "next/link";
import { SITE_DOMAIN, SITE_NAME, SITE_URL } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-6 text-center text-sm text-muted-foreground sm:text-left">
        <p>
          <a
            href={SITE_URL}
            className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {SITE_DOMAIN}
          </a>
          <span> — </span>
          {SITE_NAME} turns photos and PDFs into spreadsheet-ready data with AI.
        </p>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <nav className="flex gap-4 text-xs">
            <Link href="/privacy" className="underline-offset-4 hover:text-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="underline-offset-4 hover:text-foreground hover:underline">
              Terms
            </Link>
            <a href="mailto:hello@phototosheet.com" className="underline-offset-4 hover:text-foreground hover:underline">
              Contact
            </a>
          </nav>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} Datalytics LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
