import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ByteMint handles browser-based tool inputs, contact messages and optional advertising.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="container inner-page legal-page">
      <div className="page-heading"><span className="eyebrow">LEGAL / PRIVACY</span><h1>Privacy, without<br /><span>the mystery.</span></h1><p>Last updated: November 9, 2026</p></div>
      <article className="prose-card">
        <p className="legal-notice">This is a project template. Before publishing, review this policy against the services, jurisdictions and data practices you actually use. It is not legal advice.</p>
        <h2>1. Browser-based tools</h2>
        <p>The JSON formatter, JWT decoder, Base64 converter, UUID generator and text counter are designed to process their inputs in your browser. These tool inputs are not intentionally sent to ByteMint&apos;s application server.</p>
        <h2>2. Contact messages</h2>
        <p>If you use the contact form, we process the name, email address and message you submit so that we can respond. The form is delivered through Resend when configured. Contact messages should not contain passwords, API keys, financial information or other sensitive data.</p>
        <h2>3. Security and abuse prevention</h2>
        <p>The contact endpoint uses rate limiting when configured with Upstash Redis. In production, the client IP supplied by the hosting proxy is HMAC-pseudonymized by the application before it is used as a Redis rate-limit key. The application does not intentionally store the raw IP address in that rate-limit store. Hosting and infrastructure providers may process connection metadata under their own terms and privacy notices.</p>
        <h2>4. Advertising and affiliate links</h2>
        <p>If advertising is enabled, advertising partners may use cookies or similar technologies subject to their own policies and your consent choices where required. Affiliate links may identify that a visitor came from ByteMint so that a referral commission can be attributed. We do not receive your payment card details through affiliate links.</p>
        <h2>5. Cookies and analytics</h2>
        <p>The initial template does not install a first-party analytics or tracking system. Optional advertising or third-party services must be disclosed and configured before launch. Add details here for any analytics, consent management or other services you actually enable.</p>
        <h2>6. Data retention and requests</h2>
        <p>Contact messages should be retained only as long as needed to handle the request and meet applicable legal obligations. Add a monitored privacy contact address and a process for access or deletion requests before launch.</p>
        <h2>7. Changes</h2>
        <p>This policy may be updated when the site&apos;s features or service providers change. The effective date should be updated whenever a material change is made.</p>
      </article>
    </section>
  );
}
