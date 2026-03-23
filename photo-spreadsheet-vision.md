# SnapGrid — Vision Document
*Photo → Structured Data, Instantly*

## One-Liner
Upload a photo of any document, table, or list — get clean, editable, exportable structured data in seconds.

## The Problem
People constantly have data trapped in physical or visual formats:
- Tax documents (W2s, 1099s) they need in spreadsheets
- Paper receipts they need for expense reports
- Menus, pricelists, inventory sheets on paper
- Screenshots of tables/dashboards they can't copy from
- Business cards piling up
- Handwritten notes and lists

Traditional OCR gives raw text. Copying from images doesn't work. Manual entry is tedious and error-prone.

## The Solution
A mobile-first web app that uses multimodal AI to:
1. **Accept** any photo or screenshot (camera, upload, paste)
2. **Detect** what type of document it is
3. **Extract** structured, labeled data (not raw text)
4. **Present** results in an editable table
5. **Export** to CSV, JSON, clipboard, or Google Sheets-ready format

## Key Differentiators
- **Smart Recognition** — knows what a W2 is, what a receipt is, labels fields intelligently
- **Auto-detect document type** — or let users pick from templates
- **Mobile-first** — designed for "snap and extract" from your phone
- **Editable before export** — correct any mistakes before downloading
- **Batch mode** (v2) — drop multiple images, get one merged dataset
- **Privacy-forward** — images processed and discarded, not stored

## Target Use Cases (Marketing Angles)
1. 📄 **Tax Season** — "Digitize your W2 in 5 seconds"
2. 🧾 **Expense Reports** — "Snap receipts, export spreadsheet"
3. 📋 **Inventory/Lists** — "Photograph a price list, get a CSV"
4. 📊 **Screenshots** — "Extract data from any screenshot"
5. 💼 **Business Cards** — "Scan cards to contacts"
6. 📝 **Handwritten Notes** — "Turn scribbles into structured data"

## MVP Scope (Weekend Build)
### Must Have
- [ ] Mobile-responsive upload (tap to photo, drag-drop on desktop, paste)
- [ ] Document type auto-detection with manual override
- [ ] Template presets: W2, Receipt, Invoice, Business Card, Generic Table
- [ ] Structured extraction via multimodal LLM (Gemini Flash)
- [ ] Editable results table
- [ ] Export: CSV download, JSON download, copy to clipboard
- [ ] Clean, modern UI (dark/light, mobile-first)
- [ ] No auth required for v1

### Nice to Have (v1.1)
- [ ] Paste from clipboard (Ctrl+V / screenshot paste)
- [ ] Confidence scores per field
- [ ] History (localStorage) of recent extractions
- [ ] Camera capture directly in-app

### Future (v2+)
- [ ] User accounts + saved extractions
- [ ] Batch processing (multi-image → merged output)
- [ ] Custom templates (user-defined schemas)
- [ ] Google Sheets direct export
- [ ] API access for developers
- [ ] Team/org features

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **AI:** Google Gemini Flash (cost-effective, great vision) via @google/genai
- **State:** React state only (no DB for v1)
- **Deploy:** Vercel
- **No database, no auth** — stateless, process-and-forget

## AI Architecture
```
Image Upload
    ↓
[Auto-detect document type] ← Gemini Flash, classify prompt
    ↓
[Extract structured data] ← Gemini Flash, type-specific schema prompt
    ↓
JSON response with labeled fields
    ↓
Render editable table + export options
```

### Extraction Prompt Strategy
Each document type gets a tailored system prompt with:
- Expected field names and types
- Field ordering/grouping
- Handling for missing/unclear fields
- Output as strict JSON schema

### Cost Model
- Gemini 2.0 Flash: ~$0.01-0.02 per image
- At scale: 1000 extractions/day = ~$15/day
- Generous free tier viable

## Monetization (Future)
| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 10 extractions/day |
| Pro | $9/mo | Unlimited + batch + history |
| API | $29/mo | REST API access + webhooks |

## Brand Direction
- **Name candidates:** SnapGrid, PhotoSheet, ExtractAI, TabSnap, GridSnap
- **Vibe:** Clean, utility-focused, fast. Not playful — productive.
- **Colors:** Think spreadsheet-green meets modern SaaS. Crisp whites, accent green.
- **Mobile feel:** Should feel like a native camera/scanner app

## Success Metrics
- Time from upload to export < 5 seconds
- Works on phone camera photos (not just perfect scans)
- Handles at least 5 document types accurately
- Mobile UX feels native, not "responsive desktop"

## Competitive Landscape
- **Google Lens** — reads text, doesn't structure it
- **Adobe Scan** — PDF focused, not data extraction
- **Tabula** — PDF tables only, desktop app
- **ChatGPT** — can do this but requires manual prompting, no export flow
- **Our edge:** Purpose-built UX for the extract→edit→export flow. No prompting needed.

---
*Created: March 22, 2026*
*Status: MVP Build*
