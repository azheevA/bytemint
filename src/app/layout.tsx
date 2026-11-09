import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { monetization } from "@/config/monetization";
import { getSiteUrl, siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  title: {
    default: "ByteMint — Free Online Developer Tools",
    template: "%s | ByteMint",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    siteName: siteConfig.name,
    title: "ByteMint — Free Online Developer Tools",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "ByteMint — Free Online Developer Tools",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080b10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {monetization.adsenseClient && monetization.topAdSlot ? (
          <Script
            id="adsense-loader"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(monetization.adsenseClient)}`}
          />
        ) : null}
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
