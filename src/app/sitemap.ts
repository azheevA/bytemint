import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";
import { tools } from "@/features/tools/registry";
import { guides } from "@/features/guides/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const staticRoutes = [
    "",
    "/tools",
    "/guides",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/affiliate-disclosure",
  ];
  const toolRoutes = tools.map((tool) => `/tools/${tool.id}`);
  const guideRoutes = guides.map((guide) => `/guides/${guide.slug}`);
  return [...staticRoutes, ...toolRoutes, ...guideRoutes].map((route) => ({
    url: new URL(route, baseUrl).toString(),
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route.startsWith("/tools/") || route.startsWith("/guides/")
          ? 0.8
          : 0.5,
  }));
}
