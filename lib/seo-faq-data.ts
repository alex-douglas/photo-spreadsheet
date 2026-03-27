/** FAQ copy aligned with `seo-faq-section.txt` — questions as h3, answers as body text for snippets. */

export const SEO_FAQ_HEADING = "Common questions";
export const SEO_FAQ_INTRO =
  "Quick answers about turning photos and PDFs into spreadsheet-ready data.";

export const SEO_FAQ_ITEMS = [
  {
    id: "picture-table-excel",
    question: "How do I convert a picture of a table to Excel?",
    answer:
      "Simply upload your image (JPG, PNG) or snap a photo of the document with your phone. PhotoToSheet automatically detects the rows and columns, extracting the text into an editable format. From there, just click export to download a CSV file that opens perfectly in Excel, Numbers, or Google Sheets.",
  },
  {
    id: "receipt-spreadsheet",
    question: "Can I scan a receipt and export it to a spreadsheet?",
    answer:
      "Yes! PhotoToSheet is perfect for expense tracking. Just take a picture of your receipt, and our system will pull out the vendor name, date, individual line items, taxes, and the final total, organizing it all into clean, exportable rows.",
  },
  {
    id: "handwritten-notes",
    question: "Does this work with handwritten notes or messy lists?",
    answer:
      "Absolutely. Our system doesn't just read typed text; it understands handwriting too. If you have a handwritten inventory, a paper sign-up sheet, or scribbled notes, just take a clear photo. We'll turn those scribbles into structured data you can edit and save.",
  },
  {
    id: "pdf-screenshot",
    question: "Can I extract data from a PDF or a computer screenshot?",
    answer:
      "Yes, you aren't limited to just camera photos. You can upload scanned PDFs (like W-2s or invoices) or simply paste a screenshot of a digital dashboard right from your clipboard. We'll pull the tabular data out so you never have to manually retype it.",
  },
  {
    id: "privacy",
    question: "Is my document data secure and private?",
    answer:
      "Privacy is our priority. Your images and documents are processed instantly to extract the data and are never stored or saved on our servers. Once you close the page or clear your extraction, the data is gone.",
  },
] as const;
