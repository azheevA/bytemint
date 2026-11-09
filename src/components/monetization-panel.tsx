import Link from "next/link";
import { monetization } from "@/config/monetization";

export function MonetizationPanel() {
  const links = [
    monetization.hostingAffiliateUrl
      ? {
          label: "Developer hosting",
          description: "Infrastructure for shipping web projects.",
          href: monetization.hostingAffiliateUrl,
        }
      : null,
    monetization.aiAffiliateUrl
      ? {
          label: "AI developer tools",
          description: "Services that can speed up your workflow.",
          href: monetization.aiAffiliateUrl,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  if (links.length === 0 && !monetization.premiumProductUrl) return null;

  return (
    <section className="recommendations-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Curated resources</span>
          <h2>Tools we think are worth a look.</h2>
        </div>
        {links.length > 0 ? (
          <p className="disclosure-inline">
            Some links may be affiliate links. We may earn a commission at no
            extra cost to you.
          </p>
        ) : null}
      </div>
      <div className="recommendation-grid">
        {links.map((item) => (
          <a
            className="recommendation-card"
            href={item.href}
            key={item.label}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
          >
            <span className="recommendation-icon" aria-hidden="true">
              ↗
            </span>
            <span className="recommendation-title">{item.label}</span>
            <span className="recommendation-description">
              {item.description}
            </span>
            <span className="recommendation-action">Explore resource</span>
          </a>
        ))}
        {monetization.premiumProductUrl ? (
          <a
            className="recommendation-card recommendation-card-featured"
            href={monetization.premiumProductUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <span className="recommendation-icon" aria-hidden="true">
              ✦
            </span>
            <span className="recommendation-title">ByteMint Developer Kit</span>
            <span className="recommendation-description">
              A practical collection of reusable project starters and UI
              resources.
            </span>
            <span className="recommendation-action">View digital product</span>
          </a>
        ) : null}
      </div>
      {links.length > 0 ? (
        <p className="disclosure-footnote">
          <Link href="/affiliate-disclosure">
            Read our affiliate disclosure
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}
