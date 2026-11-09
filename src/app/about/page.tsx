import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ByteMint",
  description:
    "Learn why ByteMint is building a collection of lightweight, privacy-conscious utilities for developers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="container inner-page legal-page">
      <div className="page-heading">
        <span className="eyebrow">ABOUT / OUR APPROACH</span>
        <h1>
          Built for the little
          <br />
          <span>things that slow you down.</span>
        </h1>
        <p>
          ByteMint is a small, practical toolbox for everyday development work.
        </p>
      </div>
      <article className="prose-card">
        <h2>Why ByteMint exists</h2>
        <p>
          Developers spend a surprising amount of time on small tasks:
          formatting an API response, checking a token&apos;s claims, converting
          encoded text or generating a test identifier. ByteMint brings these
          utilities together in one focused place.
        </p>
        <h2>Useful without getting in the way</h2>
        <p>
          The first tools are intentionally lightweight. They do not require an
          account, and their core processing happens in the browser. This
          reduces unnecessary data collection and keeps common tasks quick.
        </p>
        <h2>How the project is supported</h2>
        <p>
          ByteMint may be supported by clearly labelled advertising, affiliate
          recommendations and optional digital products. Monetization should
          never change a tool&apos;s result or require a user to click an
          advertisement to use a core feature.
        </p>
        <h2>Feedback matters</h2>
        <p>
          Have an idea for a useful tool or spotted a bug? Send a message
          through the <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </section>
  );
}
