import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand-block">
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              B<span>·</span>
            </span>
            <span>
              byte<span className="brand-accent">mint</span>
            </span>
          </Link>
          <p>Small tools. Smoother builds.</p>
          <span className="footer-note">
            Useful utilities, right in your browser.
          </span>
        </div>
        <div className="footer-links-group">
          <span className="footer-heading">Explore</span>
          <Link href="/tools">All tools</Link>
          <Link href="/guides">Developer guides</Link>
          <Link href="/about">About ByteMint</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="footer-links-group">
          <span className="footer-heading">Information</span>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms of use</Link>
          <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ByteMint. All rights reserved.</span>
        <span>Built for the developer workflow.</span>
      </div>
    </footer>
  );
}
