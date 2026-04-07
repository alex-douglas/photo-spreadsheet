# PhotoToSheet

**Turn photos and PDFs into clean, structured spreadsheet data in seconds.**

Live at [phototosheet.com](https://phototosheet.com)

## What It Does

PhotoToSheet is an AI-powered document extraction tool. Users upload a photo, screenshot, or PDF of any document — receipts, invoices, W-2s, business cards, tables — and get structured, labeled data back instantly. Results can be exported as CSV, JSON, or copied to clipboard.

No account required. No data stored on our servers. Privacy-first.

### Supported Document Types

- **W-2 tax forms** — SSNs are auto-masked for safety
- **Receipts** — line items, totals, tax, vendor info
- **Invoices** — billing details, line items, amounts
- **Business cards** — name, title, company, contact info
- **Generic tables** — any tabular data from screenshots or photos
- **Other** — catch-all with best-effort field extraction

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui (Base UI primitives) |
| AI | Google Gemini Flash (classification + extraction) |
| Payments | Stripe Elements (inline PaymentIntent flow) |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel (auto-deploys from `main`) |
| Analytics | Vercel Analytics (privacy-friendly, no cookies) |
| Fonts | Geist (via `next/font`) |

## Architecture

### AI Pipeline

```
Upload (image or PDF)
    ↓
Auto-detect document type (Gemini Flash, classification prompt)
    ↓
Extract structured data (Gemini Flash, type-specific schema prompt)
    ↓
JSON response → editable results table → export
```

For multi-page PDFs, the pipeline splits the document into individual pages using `pdf-lib`, then sends each page to Gemini separately. Results are displayed per-page with both per-page and combined export options.

### Credits System

Credits are the usage currency: 1 credit = 1 image scan or 1 PDF page.

- **New visitors** get 1 free credit (rate-limited by IP to prevent abuse)
- **Device wallets** — ephemeral, tied to a browser via `device_id` in localStorage
- **Email wallets** — persistent, created when a user buys credits or links an email
- Once an email is linked, the device wallet is merged into the email wallet and deleted
- Credits are managed server-side in Supabase (`device_wallets` and `email_wallets` tables)
- A localStorage fallback exists for local dev when Supabase isn't configured

### Payments (Stripe)

- Users purchase credits inline via Stripe Elements — no redirect to Stripe Checkout
- Preset packs (10, 25, 60 credits) plus custom amounts (5–500 credits)
- $0.25 per credit
- Credit granting is idempotent: the `credit_grants` table (keyed on `payment_intent_id`) prevents double-granting from both the client-side confirm call and the webhook
- Flow: client creates PaymentIntent → user pays inline → client calls `/api/stripe/confirm-payment` for instant grant → webhook fires as backup

### History

Extraction history is stored entirely in the browser's localStorage. No server-side persistence of user data or uploaded documents.

- Batch uploads are grouped and navigable via previous/next arrows
- Multi-page PDF results show per-page breakdowns

### Upload Events Tracking

A lightweight `upload_events` table in Supabase logs anonymized usage data on each successful extraction (document type, mime type, page count, credit cost, timestamp). No PII is stored. This is fire-and-forget and never blocks the user flow.

## Project Structure

```
app/
  layout.tsx              Root layout (theme, credits provider, analytics)
  page.tsx                Upload page (main landing)
  history/page.tsx        History page
  extraction/[id]/        Extraction results (dynamic route)
  api/
    extract/              AI extraction endpoint
    credits/              Bootstrap, purchase, link-email
    stripe/               create-payment-intent, confirm-payment, webhook
    pdf-pages/            PDF page count utility

components/
  site-header.tsx         Header with logo, nav, credits, buy button
  upload-zone.tsx         Drag-drop / click / paste file upload
  results-table.tsx       Extraction results display (fields + tables)
  export-buttons.tsx      CSV / JSON / clipboard export
  buy-credits-dialog.tsx  Stripe Elements payment modal
  credits-provider.tsx    React context for credits state
  history-panel.tsx       History list with batch grouping

lib/
  extraction-prompts.ts   Classification + per-type extraction prompts
  credits-server.ts       Supabase credit operations (debit, add, link)
  credit-packs.ts         Pack definitions + pricing helpers
  stripe-server.ts        Stripe SDK singleton
  pdf-split.ts            Split multi-page PDFs into single pages (pdf-lib)
  history-storage.ts      localStorage history CRUD + batch navigation
  export-utils.ts         CSV/JSON/clipboard formatting
  upload-events.ts        Anonymous usage logging
  uuid.ts                 crypto.randomUUID with HTTP fallback
```

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `GEMINI_API_KEY` | Server | Google Gemini API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Both | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase admin key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Server | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Server | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` | Server | Stripe price ID for "Page Credit" |
| `NEXT_DEV_ALLOWED_HOSTS` | Server | Comma-separated IPs for remote dev access |

Set these in both `.env.local` (local dev) and the Vercel dashboard (production).

## Supabase Tables

| Table | Purpose |
|---|---|
| `device_wallets` | Per-browser credit balances (ephemeral) |
| `email_wallets` | Per-email credit balances (persistent) |
| `credit_grants` | Idempotency log for Stripe payment credit grants |
| `upload_events` | Anonymous extraction usage tracking |

## Local Development

```bash
npm install
npm run dev          # localhost:3000
npm run dev:lan      # accessible on LAN (0.0.0.0)
```

For remote dev access (e.g. testing from a phone on your network), add the device's IP to `NEXT_DEV_ALLOWED_HOSTS` in `.env.local`.

## Key Design Decisions

1. **No user accounts** — credits are tied to devices and optionally emails. Reduces friction for a utility tool.
2. **PDF page splitting** — multi-page PDFs are physically split into single-page PDFs before AI extraction, rather than relying on the LLM to parse specific pages from a full document. More reliable and deterministic.
3. **Inline Stripe Elements** — users pay without leaving the site. Better conversion than redirect-based Checkout.
4. **Dual credit granting** — client-side confirm + webhook ensures credits are always granted, even if the browser closes mid-payment.
5. **No cookie banner** — Vercel Analytics is cookie-free; upload tracking stores no PII. No consent mechanism needed.
6. **localStorage history** — keeps the app stateless on the server side. Users own their data in their browser.
7. **`crypto.randomUUID` fallback** — the app is sometimes accessed over HTTP during development (e.g. via Tailscale IP), where `crypto.randomUUID` isn't available. A timestamp-based fallback ensures IDs are always generated.
