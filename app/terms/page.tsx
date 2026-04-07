import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for PhotoToSheet - AI document extraction tool",
};

export default function TermsPage() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <article className="prose prose-sm max-w-none dark:prose-invert">
          <h1>Terms of Service</h1>

          <p>
            <strong>Last updated:</strong> April 7, 2026
          </p>

          <hr />

          <h2 id="agreement-to-terms">Agreement to Terms</h2>

          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally
            binding agreement between you (&ldquo;you&rdquo; or
            &ldquo;your&rdquo;) and Datalytics LLC (doing business as
            PhotoToSheet) (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) concerning your access to and use of the
            PhotoToSheet website (
            <a
              href="https://phototosheet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://phototosheet.com
            </a>
            ) and related services (collectively, the
            &ldquo;Services&rdquo;).
          </p>

          <p>
            BY USING THE SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS. If you
            do not agree with these Terms, you may not use the Services.
          </p>

          <p>
            We reserve the right to change these Terms at any time. We will
            notify you of material changes by posting a notice on the website or
            sending an email to your registered email address. Your continued
            use of the Services after such notice constitutes acceptance of the
            updated Terms.
          </p>

          <hr />

          <h2 id="table-of-contents">Table of Contents</h2>

          <ol>
            <li>
              <a href="#what-is-phototosheet">What Is PhotoToSheet?</a>
            </li>
            <li>
              <a href="#eligibility">Eligibility</a>
            </li>
            <li>
              <a href="#account-and-credits">Account and Credits</a>
            </li>
            <li>
              <a href="#payment-terms">Payment Terms</a>
            </li>
            <li>
              <a href="#refund-policy">Refund Policy</a>
            </li>
            <li>
              <a href="#ai-extraction-and-accuracy-disclaimers">
                AI Extraction and Accuracy Disclaimers
              </a>
            </li>
            <li>
              <a href="#prohibited-uses">Prohibited Uses</a>
            </li>
            <li>
              <a href="#user-uploaded-content">User-Uploaded Content</a>
            </li>
            <li>
              <a href="#intellectual-property-rights">
                Intellectual Property Rights
              </a>
            </li>
            <li>
              <a href="#limitation-of-liability">Limitation of Liability</a>
            </li>
            <li>
              <a href="#indemnification">Indemnification</a>
            </li>
            <li>
              <a href="#termination">Termination</a>
            </li>
            <li>
              <a href="#privacy-and-data-security">
                Privacy and Data Security
              </a>
            </li>
            <li>
              <a href="#governing-law-and-dispute-resolution">
                Governing Law and Dispute Resolution
              </a>
            </li>
            <li>
              <a href="#miscellaneous">Miscellaneous</a>
            </li>
            <li>
              <a href="#contact-information">Contact Information</a>
            </li>
          </ol>

          <hr />

          <h2 id="what-is-phototosheet">1. What Is PhotoToSheet?</h2>

          <p>
            PhotoToSheet is an AI-powered document extraction tool that converts
            photos, screenshots, and PDFs of documents (receipts, invoices, W-2
            tax forms, business cards, tables, etc.) into structured, editable
            spreadsheet data using artificial intelligence.
          </p>

          <p>
            <strong>How it works:</strong>
          </p>
          <ol>
            <li>You upload a document (image or PDF)</li>
            <li>
              Our AI (Google Gemini) automatically detects the document type and
              extracts structured data
            </li>
            <li>
              Extracted data is displayed in a table and can be exported as CSV
              or JSON
            </li>
          </ol>

          <p>
            <strong>Key features:</strong>
          </p>
          <ul>
            <li>No account required (optional email for purchased credits)</li>
            <li>
              No data stored on our servers (uploads processed in-memory only)
            </li>
            <li>Credits-based usage (1 credit = 1 image or 1 PDF page)</li>
            <li>
              Free credit for new users (rate-limited to prevent abuse)
            </li>
          </ul>

          <hr />

          <h2 id="eligibility">2. Eligibility</h2>

          <p>
            You must be at least 18 years old to use the Services. By using the
            Services, you represent and warrant that you are at least 18 years
            of age and have the legal capacity to enter into these Terms.
          </p>

          <p>
            If you are using the Services on behalf of an organization, you
            represent and warrant that you have the authority to bind that
            organization to these Terms.
          </p>

          <hr />

          <h2 id="account-and-credits">3. Account and Credits</h2>

          <h3 id="no-account-required">No Account Required</h3>

          <p>
            PhotoToSheet does not require you to create an account. You can use
            the service immediately with a free credit (rate-limited by IP
            address and device ID to prevent abuse).
          </p>

          <h3 id="credits-system">Credits System</h3>

          <p>
            Credits are the usage currency for PhotoToSheet. Each credit allows
            you to process one image or one PDF page.
          </p>

          <ul>
            <li>
              <strong>Free credits:</strong> New users receive 1 free credit
              (rate-limited to prevent abuse)
            </li>
            <li>
              <strong>Purchased credits:</strong> You may purchase additional
              credits via Stripe payment ($0.25 per credit)
            </li>
            <li>
              <strong>Credit wallets:</strong>
              <ul>
                <li>
                  Device wallet: Credits tied to your browser via a randomly
                  generated device ID (stored in localStorage)
                </li>
                <li>
                  Email wallet: If you purchase credits, you can link an email
                  address to create a persistent wallet
                </li>
              </ul>
            </li>
          </ul>

          <p>
            <strong>Credit usage:</strong>
          </p>
          <ul>
            <li>1 credit = 1 image scan or 1 PDF page</li>
            <li>Multi-page PDFs consume 1 credit per page</li>
            <li>Credits do not expire</li>
            <li>
              Credits are non-transferable and non-refundable (see Refund Policy
              below)
            </li>
          </ul>

          <h3 id="account-termination">Account Termination</h3>

          <p>
            We reserve the right to suspend or terminate your access to the
            Services if we reasonably believe you are abusing the free credit
            system, engaging in fraudulent activity, or violating these Terms.
          </p>

          <hr />

          <h2 id="payment-terms">4. Payment Terms</h2>

          <p>
            <strong>Accepted payment methods:</strong> Credit cards and debit
            cards via Stripe
          </p>

          <p>
            <strong>Pricing:</strong> $0.25 per credit (prices subject to
            change with notice)
          </p>

          <p>
            <strong>Credit packs:</strong> We offer preset packs (10, 25, 60
            credits) and custom amounts (5&ndash;500 credits)
          </p>

          <p>
            <strong>Sales tax:</strong> Depending on your location, applicable
            sales tax may be added to your purchase
          </p>

          <p>
            <strong>Payment processing:</strong> All payments are processed
            securely by Stripe. We do not store your full credit card number.
          </p>

          <p>
            <strong>Idempotency:</strong> If you accidentally submit a payment
            multiple times, you will only be charged once. Our system prevents
            duplicate credit grants for the same payment.
          </p>

          <p>
            <strong>Chargebacks:</strong> If you initiate a chargeback or
            payment dispute, we reserve the right to suspend or terminate your
            access and forfeit any remaining credits.
          </p>

          <hr />

          <h2 id="refund-policy">5. Refund Policy</h2>

          <p>
            <strong>
              All credit purchases are final and non-refundable.
            </strong>
          </p>

          <p>
            <strong>Exception:</strong> If PhotoToSheet fails to process your
            uploaded document due to a technical error on our end, we will
            refund the credits consumed for that failed extraction.
          </p>

          <p>
            <strong>How to request a refund:</strong>
          </p>
          <ol>
            <li>
              Email{" "}
              <a href="mailto:hello@phototosheet.com">
                hello@phototosheet.com
              </a>{" "}
              within 7 days of the failed upload
            </li>
            <li>
              Include &ldquo;Refund Request&rdquo; in the subject line
            </li>
            <li>
              Provide details about the failed extraction (date, time, document
              type)
            </li>
            <li>
              We will investigate and issue a credit refund if we confirm the
              failure was our fault
            </li>
          </ol>

          <p>
            <strong>
              Refunds are issued as PhotoToSheet credits only, not as cash
              refunds to your payment method.
            </strong>
          </p>

          <p>
            <strong>Chargebacks:</strong> Initiating a chargeback without first
            contacting us may result in termination of your access and
            forfeiture of remaining credits.
          </p>

          <hr />

          <h2 id="ai-extraction-and-accuracy-disclaimers">
            6. AI Extraction and Accuracy Disclaimers
          </h2>

          <h3 id="critical-ai-extraction-is-not-perfect">
            Critical: AI Extraction Is Not Perfect
          </h3>

          <p>
            PhotoToSheet uses artificial intelligence (Google Gemini) to extract
            data from your uploaded documents.{" "}
            <strong>
              AI extraction is not guaranteed to be accurate, complete, or
              error-free.
            </strong>
          </p>

          <p>
            <strong>YOU ARE SOLELY RESPONSIBLE FOR:</strong>
          </p>
          <ul>
            <li>
              Verifying the accuracy of all extracted data before relying on it
            </li>
            <li>
              Reviewing extracted data for errors, omissions, or
              misinterpretations
            </li>
            <li>Ensuring extracted data matches your source document</li>
          </ul>

          <p>
            <strong>IMPORTANT LIMITATIONS:</strong>
          </p>

          <p>
            <strong>Document quality:</strong> Poor image quality, blurry
            photos, skewed angles, low resolution, or poor lighting may result
            in inaccurate extraction.
          </p>

          <p>
            <strong>Handwritten text:</strong> AI extraction of handwritten text
            is less reliable than printed text.
          </p>

          <p>
            <strong>Complex layouts:</strong> Documents with unusual formatting
            may be extracted incorrectly.
          </p>

          <p>
            <strong>OCR errors:</strong> Optical Character Recognition can
            misread characters (e.g., &ldquo;0&rdquo; vs &ldquo;O&rdquo;,
            &ldquo;1&rdquo; vs &ldquo;l&rdquo;).
          </p>

          <h3 id="w-2-tax-forms-and-sensitive-data-warning">
            W-2 Tax Forms and Sensitive Data Warning
          </h3>

          <p>
            <strong>CRITICAL WARNING FOR TAX DOCUMENTS:</strong>
          </p>

          <p>
            PhotoToSheet can process W-2 tax forms containing Social Security
            Numbers (SSNs) and other sensitive financial data.
          </p>

          <p>
            <strong>SSN AUTO-MASKING:</strong>
          </p>
          <ul>
            <li>
              When PhotoToSheet detects a W-2 form, it attempts to
              automatically mask SSNs
            </li>
            <li>
              THIS AUTO-MASKING IS NOT GUARANTEED TO WORK IN ALL CASES
            </li>
            <li>
              YOU MUST VERIFY that SSNs and other sensitive data are properly
              masked before sharing or exporting
            </li>
          </ul>

          <p>
            <strong>DO NOT RELY SOLELY ON PHOTOTOSHEET FOR:</strong> Tax
            preparation or filing, financial reporting or accounting, legal
            compliance, making financial decisions.
          </p>

          <p>
            <strong>ALWAYS:</strong> Manually verify all extracted tax data,
            consult a qualified tax professional, use PhotoToSheet only as a
            convenience tool.
          </p>

          <p>
            <strong>
              PhotoToSheet is NOT a tax preparation service, accounting service,
              or legal service.
            </strong>
          </p>

          <h3 id="no-warranties">No Warranties</h3>

          <p>
            THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
            AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
          </p>

          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
            INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <hr />

          <h2 id="prohibited-uses">7. Prohibited Uses</h2>

          <p>You agree NOT to use the Services for:</p>

          <p>
            <strong>Illegal activities:</strong> Uploading documents you do not
            have legal right to possess or process, processing stolen or
            fraudulent documents, using extracted data for illegal purposes.
          </p>

          <p>
            <strong>Abuse and misuse:</strong> Attempting to circumvent free
            credit rate limits, overwhelming or disrupting the Services, reverse
            engineering or extracting AI prompts, scraping or automating uploads
            without permission.
          </p>

          <p>
            <strong>Harmful content:</strong> Uploading documents containing
            illegal content, uploading malware, uploading content that violates
            third-party rights.
          </p>

          <p>
            <strong>Spam and fraud:</strong> Creating fake credit wallets, using
            stolen payment information, initiating bad faith chargebacks.
          </p>

          <p>
            We reserve the right to suspend or terminate your access immediately
            for any prohibited use.
          </p>

          <hr />

          <h2 id="user-uploaded-content">8. User-Uploaded Content</h2>

          <h3 id="your-responsibility">Your Responsibility</h3>

          <p>
            You are solely responsible for the documents you upload. By
            uploading a document, you represent and warrant that you have the
            legal right to possess and process the document, the document does
            not violate any third-party rights, and the document does not
            contain illegal content.
          </p>

          <h3 id="our-rights">Our Rights</h3>

          <p>
            We do not store your uploaded documents. However, if we become aware
            of potentially illegal content, we reserve the right to terminate
            your access and report the matter to law enforcement.
          </p>

          <h3 id="ownership">Ownership</h3>

          <p>
            You retain all ownership rights to your uploaded documents and
            extracted data. We do not claim any ownership or license to your
            content.
          </p>

          <p>
            However, by uploading a document, you grant us a limited license to
            transmit the document to Google Gemini for AI processing, display
            the extracted data to you, and use anonymized aggregated usage data
            for service improvement. This license terminates when your document
            is discarded (immediately after processing).
          </p>

          <hr />

          <h2 id="intellectual-property-rights">
            9. Intellectual Property Rights
          </h2>

          <h3 id="our-intellectual-property">Our Intellectual Property</h3>

          <p>
            The Services, including all software, code, design, graphics, text,
            and other content (excluding user-uploaded documents), are owned by
            Datalytics LLC and protected by intellectual property laws.
          </p>

          <p>
            You may NOT copy, modify, distribute, or reverse engineer the
            Services, use our trademarks without written permission, or create
            derivative works.
          </p>

          <h3 id="user-feedback">User Feedback</h3>

          <p>
            If you provide feedback or suggestions, you grant us a worldwide,
            perpetual, royalty-free license to use, modify, and incorporate such
            feedback without compensation.
          </p>

          <hr />

          <h2 id="limitation-of-liability">10. Limitation of Liability</h2>

          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>

          <p>
            WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES including loss of data, revenue,
            or profits; inaccurate AI extraction leading to financial loss; tax
            penalties due to reliance on extracted data; identity theft or data
            breaches; service interruptions.
          </p>

          <p>
            OUR TOTAL LIABILITY IS LIMITED TO THE AMOUNT YOU PAID US IN THE 12
            MONTHS PRECEDING THE CLAIM (or $100, whichever is greater).
          </p>

          <p>
            Some jurisdictions do not allow limitation of liability, so these
            limitations may not apply to you.
          </p>

          <hr />

          <h2 id="indemnification">11. Indemnification</h2>

          <p>
            You agree to indemnify, defend, and hold harmless Datalytics LLC
            from any claims, damages, losses, liabilities, costs, or expenses
            arising from your use of the Services, your uploaded documents, your
            violation of these Terms, your violation of any third-party rights,
            or your violation of applicable laws.
          </p>

          <hr />

          <h2 id="termination">12. Termination</h2>

          <h3 id="your-right-to-terminate">Your Right to Terminate</h3>

          <p>
            You may stop using the Services at any time. To delete your email
            wallet, contact{" "}
            <a href="mailto:hello@phototosheet.com">
              hello@phototosheet.com
            </a>
            .
          </p>

          <h3 id="our-right-to-terminate">Our Right to Terminate</h3>

          <p>
            We reserve the right to suspend or terminate your access at any time
            if you violate these Terms, engage in fraudulent activity, we are
            required to by law, or we discontinue the Services.
          </p>

          <p>
            Upon termination, any remaining credits are forfeited (no refunds)
            and you must cease using the Services.
          </p>

          <hr />

          <h2 id="privacy-and-data-security">
            13. Privacy and Data Security
          </h2>

          <p>
            Your use of the Services is also governed by our{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>

          <p>Key privacy points:</p>
          <ul>
            <li>We do not store your uploaded documents</li>
            <li>
              Uploaded documents are sent to Google Gemini for AI extraction
            </li>
            <li>
              Extracted data is stored only in your browser&rsquo;s localStorage
            </li>
            <li>Payment data is handled securely by Stripe</li>
          </ul>

          <p>
            You acknowledge that transmitting data over the internet carries
            inherent risks, and you use the Services at your own risk.
          </p>

          <hr />

          <h2 id="governing-law-and-dispute-resolution">
            14. Governing Law and Dispute Resolution
          </h2>

          <h3 id="governing-law">Governing Law</h3>

          <p>
            These Terms are governed by the laws of the State of Colorado. Any
            legal action will be brought in the state or federal courts located
            in Denver, Colorado.
          </p>

          <h3 id="informal-dispute-resolution">
            Informal Dispute Resolution
          </h3>

          <p>
            Before filing a formal legal claim, you agree to first contact us at{" "}
            <a href="mailto:hello@phototosheet.com">
              hello@phototosheet.com
            </a>{" "}
            to attempt to resolve the dispute informally within 30 days.
          </p>

          <h3 id="arbitration-optional">Arbitration (Optional)</h3>

          <p>
            If we cannot resolve the dispute informally, you may elect binding
            arbitration in accordance with AAA rules. Arbitration will be
            conducted in Denver, Colorado (or remotely). You waive the right to
            participate in a class action. You may opt-out of arbitration within
            30 days of first using the Services by emailing{" "}
            <a href="mailto:hello@phototosheet.com">
              hello@phototosheet.com
            </a>
            .
          </p>

          <hr />

          <h2 id="miscellaneous">15. Miscellaneous</h2>

          <p>
            <strong>Entire Agreement:</strong> These Terms, together with our
            Privacy Policy, constitute the entire agreement.
          </p>

          <p>
            <strong>Severability:</strong> If any provision is found invalid,
            the remaining provisions remain in effect.
          </p>

          <p>
            <strong>Waiver:</strong> Failure to enforce any provision does not
            constitute a waiver.
          </p>

          <p>
            <strong>Assignment:</strong> You may not assign these Terms without
            our written consent. We may assign without restriction.
          </p>

          <p>
            <strong>Modifications:</strong> We may modify these Terms at any
            time. Material changes will be communicated via notice on the
            website or email.
          </p>

          <p>
            <strong>Force Majeure:</strong> We are not liable for failures due
            to events beyond our reasonable control.
          </p>

          <hr />

          <h2 id="contact-information">16. Contact Information</h2>

          <p>Datalytics LLC (doing business as PhotoToSheet)</p>
          <p>
            Email:{" "}
            <a href="mailto:hello@phototosheet.com">
              hello@phototosheet.com
            </a>
          </p>
          <p>
            Address: 1905 Sherman Street, Suite 200 #2248, Denver, CO 80203
          </p>

          <hr />

          <p>
            <em>Last updated: April 7, 2026</em>
          </p>

          <p>
            By using PhotoToSheet, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service.
          </p>

          <p>&copy; 2026 Datalytics LLC. All rights reserved.</p>
        </article>
      </main>
    </SiteShell>
  );
}
