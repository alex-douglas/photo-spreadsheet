import { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for PhotoToSheet - AI document extraction tool",
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <article className="prose prose-sm max-w-none dark:prose-invert">
          <h1>PRIVACY POLICY</h1>

          <p>
            <strong>Last updated:</strong> April 7, 2026
          </p>

          <p>
            This Privacy Policy for Datalytics LLC (doing business as
            PhotoToSheet) (&ldquo;<strong>we</strong>,&rdquo; &ldquo;
            <strong>us</strong>,&rdquo; or &ldquo;<strong>our</strong>&rdquo;)
            describes how and why we might collect, store, use, and/or share
            (&ldquo;<strong>process</strong>&rdquo;) your information when you
            use our services (&ldquo;<strong>Services</strong>&rdquo;),
            including when you:
          </p>

          <ul>
            <li>
              Visit our website at{" "}
              <a
                href="https://phototosheet.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://phototosheet.com
              </a>
              , or any website of ours that links to this Privacy Policy
            </li>
            <li>
              Use PhotoToSheet to convert photos and PDFs into structured
              spreadsheet data via AI extraction
            </li>
            <li>
              Engage with us in other related ways, including customer support
            </li>
          </ul>

          <p>
            <strong>Questions or concerns?</strong> Reading this Privacy Policy
            will help you understand your privacy rights and choices. If you do
            not agree with our policies and practices, please do not use our
            Services. If you still have any questions or concerns, please
            contact us at{" "}
            <a
              href="mailto:hello@phototosheet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@phototosheet.com
            </a>
            .
          </p>

          <hr />

          <h2 id="summary-of-key-points">SUMMARY OF KEY POINTS</h2>

          <p>
            <strong>What personal information do we process?</strong> We process
            minimal personal information: email addresses (if you purchase
            credits), uploaded documents (temporarily, in-memory only), device
            identifiers (for free credit limits), and payment information
            (handled by Stripe). We do NOT permanently store your uploaded
            documents or extracted data.
          </p>

          <p>
            <strong>
              Do we process any sensitive personal information?
            </strong>{" "}
            Your uploaded documents may contain sensitive information (W-2 tax
            forms, Social Security Numbers, financial data, business
            information). We process this ONLY temporarily in-memory to perform
            AI extraction, then immediately discard it. We do not store uploaded
            documents on our servers.
          </p>

          <p>
            <strong>Do we share information with third parties?</strong> Yes. We
            send uploaded documents to Google Gemini (Google Cloud AI) for
            AI-powered data extraction. We also use Stripe for payment
            processing and Vercel for hosting and analytics.
          </p>

          <p>
            <strong>How do we keep your information safe?</strong> We use HTTPS
            encryption, process uploads in-memory only (no persistent storage),
            and rely on enterprise-grade service providers (Google, Stripe,
            Vercel). However, no system is 100% secure.
          </p>

          <p>
            <strong>What are your rights?</strong> Depending on your location,
            you may have rights to access, delete, or opt-out of certain data
            processing.
          </p>

          <p>
            <strong>How do you exercise your rights?</strong> Contact us at{" "}
            <a
              href="mailto:hello@phototosheet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@phototosheet.com
            </a>
            . We will respond within the timeframes required by applicable law.
          </p>

          <hr />

          <h2 id="table-of-contents">TABLE OF CONTENTS</h2>

          <ol>
            <li>
              <a href="#1-what-information-do-we-collect">
                WHAT INFORMATION DO WE COLLECT?
              </a>
            </li>
            <li>
              <a href="#2-how-do-we-process-your-information">
                HOW DO WE PROCESS YOUR INFORMATION?
              </a>
            </li>
            <li>
              <a href="#3-when-and-with-whom-do-we-share-your-personal-information">
                WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </a>
            </li>
            <li>
              <a href="#4-how-long-do-we-keep-your-information">
                HOW LONG DO WE KEEP YOUR INFORMATION?
              </a>
            </li>
            <li>
              <a href="#5-how-do-we-keep-your-information-safe">
                HOW DO WE KEEP YOUR INFORMATION SAFE?
              </a>
            </li>
            <li>
              <a href="#6-do-we-collect-information-from-minors">
                DO WE COLLECT INFORMATION FROM MINORS?
              </a>
            </li>
            <li>
              <a href="#7-what-are-your-privacy-rights">
                WHAT ARE YOUR PRIVACY RIGHTS?
              </a>
            </li>
            <li>
              <a href="#8-controls-for-do-not-track-features">
                CONTROLS FOR DO-NOT-TRACK FEATURES
              </a>
            </li>
            <li>
              <a href="#9-do-united-states-residents-have-specific-privacy-rights">
                DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </a>
            </li>
            <li>
              <a href="#10-do-we-make-updates-to-this-policy">
                DO WE MAKE UPDATES TO THIS POLICY?
              </a>
            </li>
            <li>
              <a href="#11-how-can-you-contact-us-about-this-policy">
                HOW CAN YOU CONTACT US ABOUT THIS POLICY?
              </a>
            </li>
            <li>
              <a href="#12-how-can-you-review-update-or-delete-your-data">
                HOW CAN YOU REVIEW, UPDATE, OR DELETE YOUR DATA?
              </a>
            </li>
          </ol>

          <hr />

          <h2 id="1-what-information-do-we-collect">
            1. WHAT INFORMATION DO WE COLLECT?
          </h2>

          <h3>Personal Information You Provide to Us</h3>

          <p>
            <em>
              In Short: We collect information you provide when purchasing
              credits or contacting us.
            </em>
          </p>

          <p>
            We collect the following personal information that you voluntarily
            provide:
          </p>

          <ul>
            <li>
              <strong>Email addresses</strong> — Collected when you purchase
              credits to create a persistent credit wallet
            </li>
            <li>
              <strong>Payment information</strong> — Payment card details,
              billing addresses (processed and stored by Stripe, not by us)
            </li>
            <li>
              <strong>Device identifiers</strong> — A randomly generated ID
              stored in your browser&rsquo;s localStorage to manage free credits
              and prevent abuse
            </li>
          </ul>

          <p>
            We do NOT require you to create an account. Email addresses are only
            collected if you choose to purchase credits.
          </p>

          <h3>Uploaded Documents (NOT Stored)</h3>

          <p>
            <em>
              In Short: We process your uploads temporarily in-memory only. We
              do not permanently store uploaded documents or extracted data on
              our servers.
            </em>
          </p>

          <p>
            When you upload a document (photo, screenshot, PDF) to PhotoToSheet:
          </p>

          <ol>
            <li>
              Your document is sent to Google Gemini (Google Cloud AI) for
              AI-powered data extraction
            </li>
            <li>
              The document is processed entirely in-memory — it is never written
              to disk or stored in a database
            </li>
            <li>
              Extracted data is returned to your browser and displayed in the
              results table
            </li>
            <li>
              Both the uploaded document and extracted data are immediately
              discarded after processing
            </li>
          </ol>

          <p>
            <strong>What this means:</strong>
          </p>
          <ul>
            <li>
              We cannot recover your uploads or extracted data after you close
              the page
            </li>
            <li>
              Your extraction history is stored ONLY in your browser&rsquo;s
              localStorage (on your device, not our servers)
            </li>
            <li>
              If you clear your browser data, your history is permanently
              deleted
            </li>
          </ul>

          <p>
            <strong>Important:</strong> Your uploaded documents may contain
            sensitive information such as:
          </p>
          <ul>
            <li>Social Security Numbers (SSNs) on W-2 tax forms</li>
            <li>Financial account numbers on invoices or receipts</li>
            <li>Personal contact information on business cards</li>
            <li>Proprietary business data</li>
          </ul>

          <p>
            <strong>
              We process this sensitive information ONLY to perform the AI
              extraction you requested, and we do not retain it beyond the
              immediate processing.
            </strong>
          </p>

          <h3>Information Automatically Collected</h3>

          <p>
            <em>
              In Short: We collect minimal technical information automatically
              via Vercel Analytics.
            </em>
          </p>

          <p>We automatically collect:</p>

          <ul>
            <li>
              <strong>IP addresses</strong> — Collected by Vercel Analytics for
              basic traffic analysis (aggregated, not linked to individual
              users)
            </li>
            <li>
              <strong>Browser and device information</strong> — Browser type,
              operating system, screen resolution (via Vercel Analytics)
            </li>
            <li>
              <strong>Usage data</strong> — Which pages you visit, time spent on
              site (aggregated, privacy-friendly analytics)
            </li>
          </ul>

          <p>
            <strong>Vercel Analytics is cookie-free.</strong> It does not set
            cookies or use persistent identifiers beyond what is necessary for
            basic analytics.
          </p>

          <h3>Anonymous Usage Tracking</h3>

          <p>
            We log minimal, anonymized usage data in our database:
          </p>

          <ul>
            <li>
              Document type processed (W-2, receipt, invoice, business card,
              table, other)
            </li>
            <li>MIME type (image/jpeg, application/pdf, etc.)</li>
            <li>Page count (for multi-page PDFs)</li>
            <li>Credit cost (1 credit per page)</li>
            <li>Timestamp of extraction</li>
          </ul>

          <p>
            <strong>
              This data contains NO personally identifiable information
            </strong>{" "}
            — no file names, no document contents, no email addresses, no IP
            addresses. It is used solely for service improvement and usage
            analytics.
          </p>

          <hr />

          <h2 id="2-how-do-we-process-your-information">
            2. HOW DO WE PROCESS YOUR INFORMATION?
          </h2>

          <p>
            <em>
              In Short: We process your information to provide AI document
              extraction, process payments, prevent abuse, and improve our
              service.
            </em>
          </p>

          <p>
            We process your personal information for the following purposes:
          </p>

          <p>
            <strong>To provide the PhotoToSheet service:</strong>
          </p>
          <ul>
            <li>
              Send your uploaded documents to Google Gemini for AI extraction
            </li>
            <li>Display extracted data in your browser</li>
            <li>
              Manage your credit balance (free credits and purchased credits)
            </li>
          </ul>

          <p>
            <strong>To process payments:</strong>
          </p>
          <ul>
            <li>Securely process credit card payments via Stripe</li>
            <li>
              Grant purchased credits to your wallet (device-based or
              email-based)
            </li>
            <li>
              Maintain records of credit purchases for accounting and dispute
              resolution
            </li>
          </ul>

          <p>
            <strong>To prevent abuse:</strong>
          </p>
          <ul>
            <li>Rate-limit free credits by IP address and device ID</li>
            <li>Prevent duplicate credit grants from payment retries</li>
            <li>Detect and block fraudulent payment attempts</li>
          </ul>

          <p>
            <strong>To improve our service:</strong>
          </p>
          <ul>
            <li>
              Analyze aggregated usage data to understand which document types
              are most popular
            </li>
            <li>Monitor API performance and error rates</li>
            <li>Optimize AI extraction prompts based on success rates</li>
          </ul>

          <p>
            <strong>To communicate with you:</strong>
          </p>
          <ul>
            <li>Respond to customer support inquiries</li>
            <li>Send transaction confirmations (payment receipts)</li>
            <li>
              Notify you of service updates or policy changes (if you&rsquo;ve
              provided an email)
            </li>
          </ul>

          <p>
            We do NOT use your information for marketing, advertising, or
            profiling.
          </p>

          <hr />

          <h2 id="3-when-and-with-whom-do-we-share-your-personal-information">
            3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
          </h2>

          <p>
            <em>
              In Short: We share information with Google Gemini (for AI
              extraction), Stripe (for payments), and Vercel (for
              hosting/analytics).
            </em>
          </p>

          <p>
            We share your personal information with the following third-party
            service providers:
          </p>

          <h3>Google Gemini (Google Cloud AI)</h3>

          <p>
            <strong>What we share:</strong> Uploaded documents (photos, PDFs)
            <br />
            <strong>Why:</strong> To perform AI-powered data extraction
            <br />
            <strong>Data retention:</strong> Google may retain data per their
            Cloud Data Processing Terms. We have configured our Gemini API usage
            to minimize data retention where possible.
            <br />
            <strong>Privacy Policy:</strong>{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://policies.google.com/privacy
            </a>
          </p>

          <p>
            <strong>Model Training:</strong> Google may use uploaded content to
            train and improve their AI models. While we use enterprise-grade
            Google Cloud services designed for business use, we do not have
            specific control over whether Google uses your uploaded documents for
            model training purposes. By using PhotoToSheet, you acknowledge and
            accept that your uploaded documents may be used by Google to improve
            their AI services.
          </p>

          <p>
            <strong>Important:</strong> Your uploaded documents (including W-2s
            with SSNs, financial data, etc.) are sent to Google&rsquo;s servers
            for processing. Google is acting as a data processor on our behalf.
            We do not control Google&rsquo;s internal data practices, but we use
            Google Cloud services that are designed for enterprise customers with
            strong privacy commitments.
          </p>

          <p>
            <strong>If you are concerned about sensitive data:</strong> Do not
            upload documents containing highly confidential information (SSNs,
            financial account numbers, trade secrets, proprietary business data)
            unless you understand and accept the risks of transmitting such data
            to third-party AI services.
          </p>

          <h3>Stripe (Payment Processing)</h3>

          <p>
            <strong>What we share:</strong> Payment card information, billing
            addresses, email addresses
            <br />
            <strong>Why:</strong> To process credit card payments securely
            <br />
            <strong>Data retention:</strong> Stripe retains payment data per
            their terms
            <br />
            <strong>Privacy Policy:</strong>{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://stripe.com/privacy
            </a>
          </p>

          <p>
            <strong>Note:</strong> Payment card details are entered directly
            into Stripe&rsquo;s secure payment form. We never see or store your
            full card number.
          </p>

          <h3>Vercel (Hosting and Analytics)</h3>

          <p>
            <strong>What we share:</strong> IP addresses, browser/device
            information, usage data
            <br />
            <strong>Why:</strong> Vercel hosts PhotoToSheet and provides
            privacy-friendly analytics
            <br />
            <strong>Data retention:</strong> Per Vercel&rsquo;s standard
            analytics retention policies
            <br />
            <strong>Privacy Policy:</strong>{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://vercel.com/legal/privacy-policy
            </a>
          </p>

          <p>
            Vercel Analytics is cookie-free and does not track users across
            websites.
          </p>

          <h3>We DO NOT sell your data</h3>

          <p>
            We do not sell, rent, or trade your personal information to third
            parties for their marketing purposes.
          </p>

          <hr />

          <h2 id="4-how-long-do-we-keep-your-information">
            4. HOW LONG DO WE KEEP YOUR INFORMATION?
          </h2>

          <p>
            <em>
              In Short: We keep information only as long as necessary, and we do
              NOT store uploaded documents.
            </em>
          </p>

          <p>
            <strong>Uploaded documents:</strong> NOT STORED (processed in-memory
            only, immediately discarded)
          </p>

          <p>
            <strong>Extracted data:</strong> NOT STORED on our servers (saved
            only in your browser&rsquo;s localStorage)
          </p>

          <p>
            <strong>Email addresses and credit wallets:</strong>
          </p>
          <ul>
            <li>Retained as long as you have a credit balance</li>
            <li>
              Deleted upon request (contact{" "}
              <a
                href="mailto:hello@phototosheet.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                hello@phototosheet.com
              </a>
              )
            </li>
            <li>Automatically purged after 2 years of inactivity</li>
          </ul>

          <p>
            <strong>Payment records:</strong>
          </p>
          <ul>
            <li>
              Retained for 7 years for accounting, tax, and legal compliance
              purposes
            </li>
            <li>
              Includes transaction IDs, amounts, dates (but not full card
              numbers)
            </li>
          </ul>

          <p>
            <strong>Anonymous usage data (upload_events):</strong>
          </p>
          <ul>
            <li>Retained indefinitely for analytics (contains no PII)</li>
          </ul>

          <p>
            <strong>IP address rate-limiting data:</strong>
          </p>
          <ul>
            <li>Automatically expires after 24 hours</li>
          </ul>

          <hr />

          <h2 id="5-how-do-we-keep-your-information-safe">
            5. HOW DO WE KEEP YOUR INFORMATION SAFE?
          </h2>

          <p>
            <em>
              In Short: We use industry-standard security practices, but no
              system is 100% secure.
            </em>
          </p>

          <p>
            We implement appropriate technical and organizational measures:
          </p>

          <p>
            <strong>Encryption:</strong> All data in transit is encrypted via
            HTTPS/TLS. Payment data is encrypted by Stripe (PCI-DSS Level 1
            compliant).
          </p>

          <p>
            <strong>No persistent storage of uploads:</strong> Uploaded
            documents are processed in-memory only, never written to disk or
            stored in databases.
          </p>

          <p>
            <strong>Access controls:</strong> Database access is restricted to
            authorized personnel only. API keys and secrets are stored securely
            in environment variables.
          </p>

          <p>
            <strong>Third-party security:</strong> We rely on enterprise-grade
            providers (Google Cloud, Stripe, Vercel), each maintaining their own
            security certifications and audits.
          </p>

          <p>
            <strong>
              However, no method of transmission over the internet or electronic
              storage is 100% secure.
            </strong>{" "}
            We cannot guarantee absolute security. If you become aware of any
            security vulnerability, please contact us immediately at{" "}
            <a
              href="mailto:hello@phototosheet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@phototosheet.com
            </a>
            .
          </p>

          <hr />

          <h2 id="6-do-we-collect-information-from-minors">
            6. DO WE COLLECT INFORMATION FROM MINORS?
          </h2>

          <p>
            <em>
              In Short: We do not knowingly collect data from children under 18.
            </em>
          </p>

          <p>
            PhotoToSheet is not directed at individuals under 18 years of age.
            We do not knowingly collect personal information from minors. If you
            are a parent or guardian and believe your child has provided us with
            personal information, please contact us at{" "}
            <a
              href="mailto:hello@phototosheet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@phototosheet.com
            </a>
            .
          </p>

          <hr />

          <h2 id="7-what-are-your-privacy-rights">
            7. WHAT ARE YOUR PRIVACY RIGHTS?
          </h2>

          <p>
            <em>
              In Short: Depending on your location, you may have rights to
              access, delete, or opt-out of certain data processing.
            </em>
          </p>

          <p>You may have the following rights:</p>

          <ul>
            <li>
              <strong>Right to Access:</strong> Request a copy of the personal
              information we hold about you
            </li>
            <li>
              <strong>Right to Deletion:</strong> Request that we delete your
              personal information
            </li>
            <li>
              <strong>Right to Correction:</strong> Request that we correct
              inaccurate personal information
            </li>
            <li>
              <strong>Right to Opt-Out:</strong> Opt-out of certain data
              processing activities
            </li>
          </ul>

          <p>
            <strong>How to exercise your rights:</strong>
          </p>
          <ol>
            <li>
              Email us at{" "}
              <a
                href="mailto:hello@phototosheet.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                hello@phototosheet.com
              </a>{" "}
              with your request
            </li>
            <li>
              Include &ldquo;Privacy Request&rdquo; in the subject line
            </li>
            <li>
              Provide sufficient detail for us to verify your identity and
              locate your data
            </li>
          </ol>

          <p>
            We will respond within the timeframes required by applicable law
            (typically 30–45 days).
          </p>

          <p>
            <strong>Note:</strong> Because we do not store uploaded documents or
            extracted data, we cannot provide access to or delete documents you
            previously uploaded.
          </p>

          <hr />

          <h2 id="8-controls-for-do-not-track-features">
            8. CONTROLS FOR DO-NOT-TRACK FEATURES
          </h2>

          <p>
            <em>
              In Short: We do not respond to Do-Not-Track browser signals, but
              we do not track users for advertising.
            </em>
          </p>

          <p>
            We do not currently respond to DNT signals because we do not track
            users across websites for advertising purposes, we use only
            first-party privacy-friendly analytics (Vercel Analytics), and we do
            not sell user data or share it with advertisers.
          </p>

          <hr />

          <h2 id="9-do-united-states-residents-have-specific-privacy-rights">
            9. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
          </h2>

          <p>
            <em>
              In Short: If you are a U.S. resident, you may have additional
              privacy rights under state law.
            </em>
          </p>

          <h3>California Residents (CCPA/CPRA)</h3>

          <p>Categories of personal information we collect:</p>

          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Collected?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Identifiers</td>
                <td>Email addresses, device IDs</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Financial information</td>
                <td>Payment card data (via Stripe)</td>
                <td>Yes (via Stripe)</td>
              </tr>
              <tr>
                <td>Internet activity</td>
                <td>IP address, browser type, pages visited</td>
                <td>Yes (via Vercel)</td>
              </tr>
              <tr>
                <td>Sensitive personal information</td>
                <td>
                  SSNs, financial account numbers (in uploaded documents)
                </td>
                <td>Yes (processed temporarily, not stored)</td>
              </tr>
            </tbody>
          </table>

          <p>
            <strong>How to exercise your CCPA rights:</strong> Email{" "}
            <a
              href="mailto:hello@phototosheet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@phototosheet.com
            </a>{" "}
            with &ldquo;CCPA Request&rdquo; in the subject line.
          </p>

          <h3>Colorado Residents (CPA)</h3>

          <p>
            Colorado residents have rights similar to California residents, plus
            the right to opt-out of profiling and the right to appeal privacy
            request decisions.
          </p>

          <p>
            <strong>How to exercise your CPA rights:</strong> Email{" "}
            <a
              href="mailto:hello@phototosheet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@phototosheet.com
            </a>{" "}
            with &ldquo;CPA Request&rdquo; in the subject line.
          </p>

          <h3>Virginia, Connecticut, Utah, and Other States</h3>

          <p>
            Residents of other states with comprehensive privacy laws have
            similar rights. Contact{" "}
            <a
              href="mailto:hello@phototosheet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@phototosheet.com
            </a>{" "}
            to exercise these rights.
          </p>

          <hr />

          <h2 id="10-do-we-make-updates-to-this-policy">
            10. DO WE MAKE UPDATES TO THIS POLICY?
          </h2>

          <p>
            <em>
              In Short: Yes, we may update this policy from time to time.
            </em>
          </p>

          <p>
            We may update this Privacy Policy to reflect changes in our
            practices or for legal, operational, or regulatory reasons. We will
            post the updated policy on this page with a new &ldquo;Last
            updated&rdquo; date. Material changes will be communicated via a
            prominent notice on phototosheet.com or by email.
          </p>

          <p>
            Your continued use of PhotoToSheet after the effective date of an
            updated Privacy Policy constitutes acceptance of the new terms.
          </p>

          <hr />

          <h2 id="11-how-can-you-contact-us-about-this-policy">
            11. HOW CAN YOU CONTACT US ABOUT THIS POLICY?
          </h2>

          <p>
            Datalytics LLC (doing business as PhotoToSheet)
            <br />
            Email:{" "}
            <a
              href="mailto:hello@phototosheet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@phototosheet.com
            </a>
            <br />
            Address: 1905 Sherman Street, Suite 200 #2248, Denver, CO 80203
          </p>

          <hr />

          <h2 id="12-how-can-you-review-update-or-delete-your-data">
            12. HOW CAN YOU REVIEW, UPDATE, OR DELETE YOUR DATA?
          </h2>

          <p>
            To request review, update, or deletion of your personal
            information:
          </p>

          <ol>
            <li>
              Email{" "}
              <a
                href="mailto:hello@phototosheet.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                hello@phototosheet.com
              </a>
            </li>
            <li>
              Include &ldquo;Data Request&rdquo; in the subject line
            </li>
            <li>
              Specify the action you want (access, correction, or deletion)
            </li>
            <li>
              Provide sufficient information for us to verify your identity
            </li>
          </ol>

          <p>
            <strong>What we can delete:</strong> Email addresses, credit balance
            and purchase history, payment transaction records (subject to legal
            retention).
          </p>

          <p>
            <strong>What we cannot delete:</strong> Uploaded documents (not
            stored), extracted data (stored only in your browser), anonymous
            usage statistics (no PII).
          </p>

          <p>
            <strong>Processing time:</strong> 30–45 days, as required by
            applicable law.
          </p>

          <hr />

          <p>Last updated: April 7, 2026</p>

          <p>&copy; 2026 Datalytics LLC. All rights reserved.</p>
        </article>
      </main>
    </SiteShell>
  );
}
