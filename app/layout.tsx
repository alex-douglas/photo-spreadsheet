import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { CreditsProvider } from "@/components/credits-provider";
import { SITE_NAME, SITE_URL } from "@/lib/brand";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const defaultTitle = "Convert Image to Spreadsheet | Extract Tables from Photos & PDFs";
const defaultDescription =
  "Instantly convert photos, screenshots, and PDFs into editable Excel, CSV, or Google Sheets data. Perfect for receipts, tables, W-2s, and invoices — powered by AI at PhotoToSheet.com.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${defaultTitle} | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  keywords: [
    "image to excel",
    "picture to spreadsheet",
    "convert image to table",
    "scan receipt to csv",
    "pdf table extractor",
    "OCR to spreadsheet",
    "photo to spreadsheet",
    "extract table from image",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Convert Image to Spreadsheet Instantly",
    description:
      "Turn photos and PDFs into clean, editable tabular data in seconds. Export to CSV, Excel, or Google Sheets.",
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Image to Spreadsheet Instantly",
    description:
      "Turn photos and PDFs into clean, editable tabular data in seconds. Export to CSV, Excel, or Google Sheets.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CreditsProvider>{children}</CreditsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
