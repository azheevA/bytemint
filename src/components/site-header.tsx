import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="ByteMint home">
          <span className="brand-mark" aria-hidden="true">
            B<span>·</span>
          </span>
          <span>
            byte<span className="brand-accent">mint</span>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {siteConfig.navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="nav-cta" href="/tools/json-formatter">
            Open a tool <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
