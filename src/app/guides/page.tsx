import type { Metadata } from "next";
import { GuideCard } from "@/components/guide-card";
import { guides } from "@/features/guides/registry";

export const metadata: Metadata = {
  title: "Developer Guides",
  description:
    "Practical guides to JSON debugging, JWT inspection, Base64, UUIDs and text statistics.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <section className="container inner-page guides-index-page">
      <div className="page-heading">
        <span className="eyebrow">THE KNOWLEDGE BASE / PRACTICAL NOTES</span>
        <h1>
          Understand the tools.
          <br />
          <span>Work with confidence.</span>
        </h1>
        <p>
          Short, practical explanations for common developer tasks, including
          limitations and security considerations.
        </p>
      </div>
      <div className="guides-grid">
        {guides.map((guide, index) => (
          <GuideCard guide={guide} index={index} key={guide.slug} />
        ))}
      </div>
      <p className="guides-note">
        Guides are educational material, not a substitute for reviewing your
        application&apos;s requirements, security controls or production data.
      </p>
    </section>
  );
}
