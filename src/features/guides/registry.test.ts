import { describe, expect, it } from "vitest";
import { guides } from "@/features/guides/registry";
import { tools } from "@/features/tools/registry";

describe("developer guide registry", () => {
  it("contains unique slugs and non-empty article sections", () => {
    const slugs = guides.map((guide) => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(guides.length).toBeGreaterThanOrEqual(5);
    for (const guide of guides) {
      expect(guide.title.length).toBeGreaterThan(10);
      expect(guide.sections.length).toBeGreaterThanOrEqual(3);
      expect(
        guide.sections.every((section) => section.paragraphs.length > 0),
      ).toBe(true);
    }
  });

  it("links every guide to an existing tool page", () => {
    const toolPaths = new Set(tools.map((tool) => `/tools/${tool.id}`));
    for (const guide of guides) {
      expect(toolPaths.has(guide.toolHref)).toBe(true);
    }
  });
});
