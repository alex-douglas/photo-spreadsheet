export const CLASSIFICATION_PROMPT = `Look at this image and classify the document type. Reply with ONLY one of these exact strings:
w2, receipt, invoice, business_card, table, other

No explanation, just the type.`;

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

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  w2: "W-2 Tax Form",
  receipt: "Receipt",
  invoice: "Invoice",
  business_card: "Business Card",
  table: "Table / Spreadsheet",
  other: "Document",
};
