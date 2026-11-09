import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using ByteMint's free online developer utilities.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="container inner-page legal-page">
      <div className="page-heading"><span className="eyebrow">LEGAL / TERMS</span><h1>Terms of<br /><span>use.</span></h1><p>Last updated: November 9, 2026</p></div>
      <article className="prose-card">
        <p className="legal-notice">Template terms only. Have a qualified professional review them for your business and operating jurisdictions before launch.</p>
        <h2>1. Use of the tools</h2>
        <p>ByteMint provides browser-based utilities for general informational and development purposes. You are responsible for checking outputs before using them in production systems.</p>
        <h2>2. No security certification</h2>
        <p>The JWT decoder only decodes token sections. It does not verify signatures, validate claims or determine whether a token is safe. Base64 is encoding, not encryption. Do not treat any tool as a substitute for a security review.</p>
        <h2>3. Availability and changes</h2>
        <p>Tools are provided on an as-available basis. Features may change, be interrupted or be removed. We do not guarantee uninterrupted availability or error-free results.</p>
        <h2>4. Acceptable use</h2>
        <p>Do not use the site to violate laws, infringe another person&apos;s rights, attack infrastructure or process data you are not authorized to use.</p>
        <h2>5. Third-party services</h2>
        <p>Links to third-party products and services are provided for convenience. Those services are governed by their own terms and privacy policies. Affiliate relationships, where present, are disclosed.</p>
        <h2>6. Contact</h2>
        <p>Questions about these terms can be sent through the <Link href="/contact">contact page</Link>.</p>
      </article>
    </section>
  );
}
