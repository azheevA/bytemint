import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug, guides } from "@/features/guides/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found" };

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { title: `${guide.title} | ByteMint`, description: guide.description },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <section className="container inner-page guide-detail-page">
      <div className="breadcrumbs">
        <Link href="/">Home</Link><span>/</span><Link href="/guides">Guides</Link><span>/</span><span>{guide.title}</span>
      </div>
      <header className="guide-detail-heading">
        <span className="eyebrow">BYTEMINT FIELD NOTES / {guide.readMinutes} MIN READ</span>
        <h1>{guide.title}</h1>
        <p>{guide.intro}</p>
      </header>
      <article className="prose-card guide-article">
        {guide.sections.map((section) => (
          <section className="guide-article-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.code ? <pre className="guide-code"><code>{section.code}</code></pre> : null}
            {section.points ? <ul className="guide-points">{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
          </section>
        ))}
      </article>
      <aside className="guide-tool-cta">
        <div>
          <span className="eyebrow">PUT IT INTO PRACTICE</span>
          <h2>Try the related free tool.</h2>
          <p>Use the browser-based utility alongside this guide. Your input stays in the current tab and is not uploaded to ByteMint.</p>
        </div>
        <Link className="button button-primary" href={guide.toolHref}>{guide.toolName} <span aria-hidden="true">↗</span></Link>
      </aside>
      <div className="back-to-tools"><Link className="text-link" href="/guides">← Back to all guides</Link></div>
    </section>
  );
}
