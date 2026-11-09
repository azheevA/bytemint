import type { Metadata } from "next";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/features/tools/registry";

export const metadata: Metadata = {
  title: "Free Developer Tools",
  description:
    "Browse free browser-based developer utilities: JSON formatter, JWT decoder, Base64 converter, UUID generator and text counter.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <section className="container inner-page tools-index-page">
      <div className="page-heading">
        <span className="eyebrow">THE TOOLBOX / ALL UTILITIES</span>
        <h1>
          Tools for the
          <br />
          <span>work between builds.</span>
        </h1>
        <p>
          Focused online utilities for developers. No account, no unnecessary
          setup — just open a tool and get moving.
        </p>
      </div>
      <div className="tool-grid tool-grid-index">
        {tools.map((tool, index) => (
          <ToolCard tool={tool} index={index} key={tool.id} />
        ))}
      </div>
      <div className="page-footnote">
        <span className="local-indicator">
          <span /> Processed in your browser
        </span>
        <p>
          ByteMint tools are designed to work locally whenever possible. Read
          each tool&apos;s privacy note before entering sensitive information.
        </p>
      </div>
    </section>
  );
}
