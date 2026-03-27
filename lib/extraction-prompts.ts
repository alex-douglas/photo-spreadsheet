export const CLASSIFICATION_PROMPT = `You are classifying a single document (photo scan or PDF page). Pick the SINGLE best category. Reply with ONLY one of these exact lowercase strings, no punctuation or explanation:

w2 — U.S. IRS Form W-2 Wage and Tax Statement: boxes for wages, federal withholding, Social Security/Medicare wages and taxes, employer name/EIN, employee name/address, state/local sections, copy labels, "OMB No. 1545-0008", tax year.
receipt — Retail or restaurant receipt: store name, line items, subtotal, tax, total, payment method, date/time.
invoice — Bill requesting payment: invoice #, vendor, bill-to, line items, amounts due, payment terms, due date.
business_card — Small card with person/company contact: name, title, phone, email, company logo.
table — Primarily a grid of rows/columns (spreadsheet, price list, simple data table) without being one of the forms above.
other — Anything else or ambiguous.

If the document is clearly a U.S. W-2 (even a photo of a printed W-2), you MUST answer: w2`;

export type DocType = "w2" | "receipt" | "invoice" | "business_card" | "table" | "other";

const W2_PROMPT = `Extract all data from this W2 tax form. Return valid JSON with this structure:
{
  "fields": {
    "employee_name": "",
    "employee_address": "",
    "employee_ssn": "",
    "employer_name": "",
    "employer_address": "",
    "employer_ein": "",
    "wages_tips_compensation": "",
    "federal_income_tax_withheld": "",
    "social_security_wages": "",
    "social_security_tax_withheld": "",
    "medicare_wages": "",
    "medicare_tax_withheld": "",
    "state": "",
    "state_wages": "",
    "state_income_tax": "",
    "tax_year": ""
  }
}
Extract every value you can read. Use empty string for unreadable fields. Return ONLY the JSON.`;

const RECEIPT_PROMPT = `Extract all data from this receipt. Return valid JSON with this structure:
{
  "fields": {
    "store_name": "",
    "store_address": "",
    "date": "",
    "subtotal": "",
    "tax": "",
    "total": "",
    "payment_method": "",
    "last_four_digits": ""
  },
  "table": [
    ["Item", "Qty", "Price"],
    ["item name", "1", "$0.00"]
  ]
}
Include all line items in the table. Use empty string for unreadable fields. Return ONLY the JSON.`;

const INVOICE_PROMPT = `Extract all data from this invoice. Return valid JSON with this structure:
{
  "fields": {
    "vendor_name": "",
    "vendor_address": "",
    "invoice_number": "",
    "invoice_date": "",
    "due_date": "",
    "bill_to": "",
    "subtotal": "",
    "tax": "",
    "total": "",
    "payment_terms": ""
  },
  "table": [
    ["Description", "Qty", "Unit Price", "Amount"],
    ["item", "1", "$0.00", "$0.00"]
  ]
}
Include all line items. Return ONLY the JSON.`;

const BUSINESS_CARD_PROMPT = `Extract all data from this business card. Return valid JSON with this structure:
{
  "fields": {
    "name": "",
    "title": "",
    "company": "",
    "email": "",
    "phone": "",
    "mobile": "",
    "fax": "",
    "address": "",
    "website": "",
    "linkedin": ""
  }
}
Extract every value you can read. Use empty string for missing fields. Return ONLY the JSON.`;

const TABLE_PROMPT = `Extract the table data from this image. Return valid JSON with this structure:
{
  "fields": {
    "title": "",
    "description": ""
  },
  "table": [
    ["Column1", "Column2", "Column3"],
    ["data", "data", "data"]
  ]
}
The first row of the table should be headers. Include ALL rows and columns. Return ONLY the JSON.`;

const OTHER_PROMPT = `Extract all structured data from this document. Return valid JSON with this structure:
{
  "fields": {
    "document_type": "",
    "key_field_1": "value",
    "key_field_2": "value"
  },
  "table": [
    ["Field", "Value"],
    ["field name", "field value"]
  ]
}
Identify the document type and extract every piece of data you can find. Use descriptive field names. Return ONLY the JSON.`;

export const EXTRACTION_PROMPTS: Record<DocType, string> = {
  w2: W2_PROMPT,
  receipt: RECEIPT_PROMPT,
  invoice: INVOICE_PROMPT,
  business_card: BUSINESS_CARD_PROMPT,
  table: TABLE_PROMPT,
  other: OTHER_PROMPT,
};

/** Single user message for extraction; for multi-page PDFs, asks for a `pages[]` payload. */
export function getExtractionUserPrompt(docType: DocType, pdfPageCount?: number): string {
  const base = EXTRACTION_PROMPTS[docType];
  const n = pdfPageCount ?? 1;
  if (n <= 1) return base;

  return `You are extracting from a PDF with ${n} pages.

Return ONLY valid JSON with this exact top-level shape (do not put "fields" or "table" at the root — only inside each pages[] item):
{
  "pages": [
    { "page_number": 1, "fields": { }, "table": [ ] },
    { "page_number": 2, "fields": { }, "table": [ ] }
  ]
}

Include exactly ${n} objects in "pages", with page_number 1 through ${n} in order. For "fields" and "table" on each page, use the same field names, table column headers, and conventions as in these single-page instructions (each page is its own surface; extract only what belongs on that page):
---
${base}
---

If a page has no line-item table, use "table": []. Use empty strings for missing scalar fields. Return ONLY the JSON object (no markdown code fences).`;
}

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  w2: "W-2 Tax Form",
  receipt: "Receipt",
  invoice: "Invoice",
  business_card: "Business Card",
  table: "Table / Spreadsheet",
  other: "Document",
};
