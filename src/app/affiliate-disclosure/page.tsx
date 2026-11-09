import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How affiliate relationships may support ByteMint.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <section className="container inner-page legal-page">
      <div className="page-heading">
        <span className="eyebrow">LEGAL / TRANSPARENCY</span>
        <h1>
          Affiliate
          <br />
          <span>disclosure.</span>
        </h1>
      </div>
      <article className="prose-card">
        <h2>How referrals may support ByteMint</h2>
        <p>
          Some links on ByteMint may be affiliate links. If you follow one and
          make a qualifying purchase, ByteMint may receive a commission. This
          does not add a fee to your purchase.
        </p>
        <p>
          We aim to label affiliate recommendations near the relevant links and
          only include products or services that are relevant to the developer
          workflow. A referral relationship does not guarantee an endorsement,
          and it does not change the output of our free tools.
        </p>
        <p>
          We will update this page when affiliate relationships are added or
          materially changed. If you have a question about a recommendation,
          please use the <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </section>
  );
}
