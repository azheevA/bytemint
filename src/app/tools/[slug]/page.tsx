import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import { ToolWorkspace } from "@/components/tool-workspace";
import { monetization } from "@/config/monetization";
import { getToolById, tools } from "@/features/tools/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolById(slug);
  if (!tool) return { title: "Tool not found" };

  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.id}` },
    openGraph: {
      title: `${tool.name} — Free Online Tool`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolById(slug);
  if (!tool) notFound();

  return (
    <section className="container inner-page tool-detail-page">
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/tools">Tools</Link>
        <span>/</span>
        <span>{tool.name}</span>
      </div>
      <div className="tool-page-heading">
        <span className="eyebrow">
          {tool.category.toUpperCase()} TOOL / BYTEMINT
        </span>
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
      </div>
      <ToolWorkspace key={tool.id} tool={tool} />
      <div className="container-ad-wrap">
        <AdSlot slot={monetization.topAdSlot} />
      </div>
      <div className="tool-content-grid">
        <article className="content-card">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>Get started in three steps.</h2>
          <ol className="steps-list">
            {tool.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <h3>Common use cases</h3>
          <ul className="check-list">
            {tool.useCases.map((item) => (
              <li key={item}>
                <span>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
        <aside className="content-card privacy-card">
          <span className="privacy-card-icon">⌑</span>
          <span className="eyebrow">PRIVACY NOTE</span>
          <h2>Your data stays local.</h2>
          <p>{tool.privacyNote}</p>
          <p>
            As with any online utility, avoid entering production credentials or
            information you are not authorized to share.
          </p>
          <Link className="text-link" href="/privacy">
            Read privacy policy <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>
      <section className="faq-section">
        <span className="eyebrow">QUICK ANSWERS</span>
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {tool.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <span>+</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="back-to-tools">
        <Link className="text-link" href="/tools">
          ← Back to all tools
        </Link>
      </div>
    </section>
  );
}
