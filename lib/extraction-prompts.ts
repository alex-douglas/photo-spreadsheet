export const CLASSIFICATION_PROMPT = `You are classifying a single document (photo scan or PDF page). Pick the SINGLE best category. Reply with ONLY one of these exact lowercase strings, no punctuation or explanation:

w2 — U.S. IRS Form W-2 Wage and Tax Statement: boxes for wages, federal withholding, Social Security/Medicare wages and taxes, employer name/EIN, employee name/address, state/local sections, copy labels, "OMB No. 1545-0008", tax year.
receipt — Retail or restaurant receipt: store name, line items, subtotal, tax, total, payment method, date/time.
invoice — Bill requesting payment: invoice #, vendor, bill-to, line items, amounts due, payment terms, due date.
business_card — Small card with person/company contact: name, title, phone, email, company logo.
table — Primarily a grid of rows/columns (spreadsheet, price list, simple data table) without being one of the forms above.
other — Anything else or ambiguous.

If the document is clearly a U.S. W-2 (even a photo of a printed W-2), you MUST answer: w2`;

export type DocType = "w2" | "receipt" | "invoice" | "business_card" | "table" | "other";

export const EXTRACTION_PROMPT = `Extract ALL structured data visible on this page. You decide which fields and columns are appropriate based on what you actually see — do not force a predetermined schema.

Return valid JSON with this structure:
{
  "fields": {
    "descriptive_field_name": "value",
    ...
  },
  "table": [
    ["Column1", "Column2", ...],
    ["row data", "row data", ...]
  ]
}

Rules:
- "fields" should contain key-value pairs for any standalone data points (names, dates, totals, IDs, addresses, etc.). Use descriptive snake_case keys.
- "table" should contain tabular/repeating data if present. The first row must be column headers. Include ALL rows and columns you can read.
- If there is no tabular data, omit the "table" key entirely.
- If there are no standalone fields, the "fields" object can be empty.
- Extract EVERY piece of data you can read. Do not skip or summarize.
- Use empty string "" for values you can see a label for but cannot read.
- Return ONLY the JSON, no explanation or markdown fences.`;

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  w2: "W-2 Tax Form",
  receipt: "Receipt",
  invoice: "Invoice",
  business_card: "Business Card",
  table: "Table / Spreadsheet",
  other: "Document",
};
