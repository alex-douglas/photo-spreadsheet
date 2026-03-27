import { SITE_DOMAIN, SITE_NAME, SITE_URL } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-3xl space-y-2 px-4 py-6 text-center text-sm text-muted-foreground">
        <p>
          <a
            href={SITE_URL}
            className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {SITE_DOMAIN}
          </a>
          <span className="text-muted-foreground"> — </span>
          {SITE_NAME} turns photos and PDFs into spreadsheet-ready data with AI.
        </p>
        <p className="text-xs">
          Your document images are processed for extraction; we don&apos;t keep your files on our servers.
        </p>
      </div>
    </footer>
  );
}
