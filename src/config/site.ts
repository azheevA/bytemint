export const siteConfig = {
  name: "ByteMint",
  shortName: "ByteMint",
  description:
    "Fast, private and free tools for developers. Format JSON, decode JWTs, work with Base64 and more — right in your browser.",
  tagline: "Small tools. Smoother builds.",
  navigation: [
    { href: "/tools", label: "Tools" },
    { href: "/guides", label: "Guides" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export function getSiteUrl(): URL {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Unsupported protocol");
    }
    return url;
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be a valid absolute HTTP(S) URL.",
    );
  }
}
