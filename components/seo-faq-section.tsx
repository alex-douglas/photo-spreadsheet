"use client";

import { ChevronDown } from "lucide-react";
import { memo } from "react";

import { cn } from "@/lib/utils";
import { SEO_FAQ_HEADING, SEO_FAQ_INTRO, SEO_FAQ_ITEMS } from "@/lib/seo-faq-data";

/**
 * Native <details>/<summary> FAQ: full Q&A in the HTML for crawlers, no accordion JS.
 * Wrapped in memo so the first item can use initial `open` without parent re-renders resetting it.
 */
export const SeoFaqSection = memo(function SeoFaqSection() {
  return (
    <section className="space-y-1 pb-2 pt-8" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-lg font-semibold tracking-tight text-foreground"
      >
        {SEO_FAQ_HEADING}
      </h2>
      <p className="max-w-2xl pb-4 text-sm text-muted-foreground">{SEO_FAQ_INTRO}</p>
      <div className="divide-y divide-border">
        {SEO_FAQ_ITEMS.map((item, index) => (
          <details
            key={item.id}
            className={cn("group", "[&[open]>summary>svg]:rotate-180")}
            {...(index === 0 ? { open: true } : {})}
          >
            <summary className="flex cursor-pointer list-none items-start gap-2 py-3.5 text-left outline-none [&::-webkit-details-marker]:hidden hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <h3 className="flex-1 text-pretty text-sm font-medium leading-snug text-foreground">
                {item.question}
              </h3>
              <ChevronDown
                className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200"
                aria-hidden
              />
            </summary>
            <div className="pb-4 pt-0">
              <p className="m-0 text-pretty text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
});
