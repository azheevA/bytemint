import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { MonetizationPanel } from "@/components/monetization-panel";
import { ToolCard } from "@/components/tool-card";
import { GuideCard } from "@/components/guide-card";
import { monetization } from "@/config/monetization";
import { tools } from "@/features/tools/registry";
import { guides } from "@/features/guides/registry";

const benefits = [
  {
    number: "01",
    title: "Private by default",
    text: "Core tools run in your browser. Your input stays on your device.",
  },
  {
    number: "02",
    title: "No account required",
    text: "Open a tool and get to work. No sign-up wall or unnecessary steps.",
  },
  {
    number: "03",
    title: "Made for daily work",
    text: "Focused utilities for the small tasks that interrupt a developer's flow.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="status-pill">
              <span className="status-dot" /> A better little toolbox for the
              web
            </div>
            <h1>
              Less busywork.
              <br />
              <span>More building.</span>
            </h1>
            <p className="hero-description">
              A growing collection of fast, free developer tools. Format data,
              inspect tokens and get small tasks out of your way — without
              creating an account.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/tools">
                Explore all tools <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href="/about">
                Why ByteMint? <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hero-meta">
              <span>5 free tools</span>
              <i /> <span>Browser-based processing</span>
              <i /> <span>No account</span>
            </div>
          </div>
          <div
            className="hero-visual"
            role="img"
            aria-label="Illustration of a ByteMint JSON formatter workspace"
          >
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-glow" />
            <div className="visual-window">
              <div className="visual-window-top">
                <div className="window-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <span>bytemint / workspace</span>
                <span className="window-live">● LIVE</span>
              </div>
              <div className="visual-code-label">
                <span>JSON FORMATTER</span>
                <span>LOCAL</span>
              </div>
              <div className="visual-code">
                <span>
                  <b>01</b> <i>{"{"}</i>
                </span>
                <span>
                  <b>02</b> &nbsp;&nbsp;<em>&quot;status&quot;</em>:{" "}
                  <strong>true</strong>,
                </span>
                <span>
                  <b>03</b> &nbsp;&nbsp;<em>&quot;project&quot;</em>:{" "}
                  <u>&quot;ByteMint&quot;</u>,
                </span>
                <span>
                  <b>04</b> &nbsp;&nbsp;<em>&quot;builtFor&quot;</em>: [
                </span>
                <span>
                  <b>05</b> &nbsp;&nbsp;&nbsp;&nbsp;
                  <u>&quot;developers&quot;</u>
                </span>
                <span>
                  <b>06</b> &nbsp;&nbsp;]
                </span>
                <span>
                  <b>07</b> <i>{"}"}</i>
                </span>
              </div>
              <div className="visual-window-bottom">
                <span>
                  <i /> Syntax valid
                </span>
                <span>0.3 ms</span>
              </div>
            </div>
            <div className="floating-chip chip-top">
              <span>✳</span> Browser-native
            </div>
            <div className="floating-chip chip-bottom">
              <span>⌁</span> No upload needed
            </div>
          </div>
        </div>
        <div className="hero-bottom-line" />
      </section>

      <section className="container trust-strip">
        <span className="trust-label">BUILT AROUND YOUR WORKFLOW</span>
        <div>
          <span className="trust-icon">{"{ }"}</span> JSON utilities
        </div>
        <div>
          <span className="trust-icon">⌘</span> Token inspection
        </div>
        <div>
          <span className="trust-icon">01</span> Data encoding
        </div>
        <div>
          <span className="trust-icon">✳</span> Tiny generators
        </div>
      </section>

      <section className="section container tools-section" id="tools">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">THE TOOLBOX / 001</span>
            <h2>Small tools. Big time savers.</h2>
            <p>Pick a task, get it done, get back to building.</p>
          </div>
          <Link className="text-link" href="/tools">
            View all tools <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="tool-grid">
          {tools.map((tool, index) => (
            <ToolCard tool={tool} index={index} key={tool.id} />
          ))}
        </div>
      </section>

      <section className="container section guides-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">
              THE KNOWLEDGE BASE / PRACTICAL NOTES
            </span>
            <h2>Understand what you are working with.</h2>
            <p>Useful explanations, safer workflows and practical examples.</p>
          </div>
          <Link className="text-link" href="/guides">
            View all guides <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="guides-grid guides-grid-home">
          {guides.slice(0, 3).map((guide, index) => (
            <GuideCard guide={guide} index={index} key={guide.slug} />
          ))}
        </div>
      </section>

      <div className="container">
        <AdSlot slot={monetization.topAdSlot} />
      </div>

      <section className="section difference-section">
        <div className="container difference-layout">
          <div className="difference-intro">
            <span className="eyebrow">THE BYTEMINT APPROACH</span>
            <h2>
              Useful first.
              <br />
              <span>Everything else second.</span>
            </h2>
            <p>
              Tools should solve the problem without creating a new one.
              That&apos;s why ByteMint keeps the experience lightweight and
              privacy-conscious.
            </p>
            <Link className="text-link" href="/privacy">
              Read our privacy approach <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="benefit-list">
            {benefits.map((benefit) => (
              <div className="benefit-row" key={benefit.number}>
                <span className="benefit-number">{benefit.number}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
                <span className="benefit-arrow">↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section final-cta">
        <div>
          <span className="eyebrow">READY WHEN YOU ARE</span>
          <h2>
            Make your next task
            <br />
            <span>a little easier.</span>
          </h2>
        </div>
        <Link className="button button-primary" href="/tools">
          Find your tool <span aria-hidden="true">↗</span>
        </Link>
        <div className="cta-watermark" aria-hidden="true">
          B.
        </div>
      </section>

      <div className="container">
        <MonetizationPanel />
      </div>
    </>
  );
}
