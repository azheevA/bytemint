import Link from "next/link";
import type { ToolDefinition } from "@/features/tools/registry";

const iconByTool: Record<ToolDefinition["id"], string> = {
  "json-formatter": "{ }",
  "jwt-decoder": "⌘",
  base64: "01",
  "uuid-generator": "✳",
  "text-counter": "Aa",
};

export function ToolCard({
  tool,
  index,
}: {
  tool: ToolDefinition;
  index: number;
}) {
  return (
    <Link className="tool-card" href={`/tools/${tool.id}`}>
      <div className="tool-card-topline">
        <span className="tool-icon" aria-hidden="true">
          {iconByTool[tool.id]}
        </span>
        <span className="tool-number">0{index + 1}</span>
      </div>
      <span className="tool-category">{tool.category}</span>
      <h3>{tool.name}</h3>
      <p>{tool.shortDescription}</p>
      <span className="tool-card-link">
        Open tool <span aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}
