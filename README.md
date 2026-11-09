# ByteMint

A monetizable developer-tools portal built with Next.js App Router, TypeScript and a feature-oriented architecture. The first version contains five browser-based utilities, five practical developer guides and optional integrations for advertising, affiliate destinations, a digital product checkout URL, contact email and production rate limiting.

> **Important:** a website does not generate passive income automatically. This project is a technical MVP, not a promise of revenue. Traffic, original content, trust, distribution, approved monetization accounts and ongoing maintenance are required.

## 1. Product and revenue model

- **Free tools:** attract search traffic and give visitors a reason to return.
- **Display ads:** optional AdSense integration, disabled until configured. Apply only after the site has useful original content and a clear navigation structure. Check current AdSense policies and eligibility before applying.
- **Affiliate referrals:** optional hosting and AI-tool links. Only add destinations from programs that have approved your account. The disclosure is shown next to recommendations and has a dedicated page.
- **Digital product:** optional external checkout URL for a paid developer kit, templates or other original assets.

The current MVP intentionally does not process card payments or store tool inputs. It links to a hosted checkout URL that you control.

## 2. Tech stack

- Next.js 16.4.5 / App Router
- React 19 / TypeScript strict mode
- Zod for server-side request validation
- Upstash Redis + `@upstash/ratelimit` for distributed API rate limiting
- Resend for contact-form email delivery
- Vitest for unit tests
- ESLint, GitHub Actions, Dependabot
- Multi-stage Docker image and Docker Compose

## 3. Architecture

```text
src/
  app/                       Routes, layouts, metadata, route handlers
    api/contact/             Validated contact endpoint
    tools/[slug]/            Static tool detail pages and SEO content
    guides/[slug]/           Static practical guides with contextual tool links
  components/                Shared UI components
  config/                    Site settings and monetization configuration
  features/tools/            Tool registry, browser processing engine, tests
  features/guides/           Guide content registry and tests
  lib/security/              Rate limiting and request identity
  lib/validation/            Zod schemas and schema tests
```

The design is feature-oriented: each domain keeps its registry/logic close together, while routes compose features and shared components. There is no database or authentication in the MVP because the public tools do not need either. This intentionally reduces the attack surface and operating cost.

## 4. Run locally

Requirements: Node.js 22+ and npm.

```bash
cp .env.example .env
npm install
npm run dev
```

The first `npm install` creates `package-lock.json`. Commit it; after that use `npm ci` for clean, reproducible installs.

Open `http://localhost:3000`.

Run quality checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## 5. Environment variables

Copy `.env.example` to `.env` and set only the integrations you use.

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap and robots | Production |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID | Optional |
| `NEXT_PUBLIC_ADSENSE_SLOT_TOP` | Ad unit ID | Optional |
| `NEXT_PUBLIC_AFFILIATE_HOSTING_URL` | Approved hosting referral URL | Optional |
| `NEXT_PUBLIC_AFFILIATE_AI_URL` | Approved AI-service referral URL | Optional |
| `NEXT_PUBLIC_PREMIUM_PRODUCT_URL` | Hosted checkout page for your own product | Optional |
| `RESEND_API_KEY` | Resend server API key | Contact form |
| `CONTACT_TO_EMAIL` | Destination inbox | Contact form |
| `CONTACT_FROM_EMAIL` | Verified sender address/domain | Contact form |
| `UPSTASH_REDIS_REST_URL` | Redis REST endpoint | Production contact form |
| `UPSTASH_REDIS_REST_TOKEN` | Redis REST token | Production contact form |

Never prefix server secrets with `NEXT_PUBLIC_`. Never commit `.env` files. Use the hosting provider's encrypted environment variables for production.

### Contact form setup

1. Create a Resend account and verify a domain you control.
2. Create a Resend API key and set `RESEND_API_KEY`.
3. Set `CONTACT_FROM_EMAIL` to an address on the verified domain and `CONTACT_TO_EMAIL` to the inbox that receives messages.
4. Create an Upstash Redis database and set both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
5. Redeploy and test valid, invalid, oversized and repeated requests.

The contact route allows four messages per IP identifier in a rolling ten-minute window. Local development uses an in-memory fallback. Production intentionally rejects contact submissions if Upstash is not configured; an in-memory counter is not safe across serverless instances. Confirm that your hosting proxy sets trusted client-IP headers before relying on the limiter.

## 6. Monetization setup

### Advertising

1. Publish the site on a domain you own.
2. Add genuinely useful original pages: tool guides, examples, comparisons, use cases and a transparent About page.
3. Check AdSense's current eligibility and program policies, then apply.
4. Only after approval, configure the publisher ID and ad slot.
5. Before serving ads in jurisdictions that require consent, implement a Google-certified consent management platform and update the Privacy Policy to describe the actual behavior.

The ad component is disabled in production until a publisher ID and slot are provided. Do not insert ad code before approval or use ads on low-value/empty pages.

### Affiliate links

1. Apply to relevant partner programs.
2. Use only your approved tracking URLs.
3. Put the disclosure close to affiliate recommendations and keep `/affiliate-disclosure` accurate.
4. Review program restrictions (traffic sources, paid search, geo restrictions, cookie windows and prohibited claims).

### Digital product

Create something original and useful, for example a Next.js starter kit, reusable dashboard UI, API validation templates or a deployment checklist. Host checkout and file delivery on a provider that supports your country, tax rules and customer support needs. Set `NEXT_PUBLIC_PREMIUM_PRODUCT_URL` to the exact hosted checkout/product URL. The current code does not claim to deliver files or process payments itself.

## 7. Validation and safety

- Contact payload is parsed with a strict Zod schema; unknown keys are rejected.
- Request content type, same-host `Origin` in production, and streamed body size are checked before sending email. The origin check compares against `Host`, not the client-influenced `x-forwarded-host` header.
- Client form limits are convenience only; server validation is authoritative.
- Honeypot and distributed Upstash rate limiting (4 requests per 10-minute window) reduce basic form spam. The trusted proxy must overwrite `x-real-ip`; do not expose the application directly around the proxy.
- Contact content is sent as plain text; it is not rendered as HTML.
- All tools enforce input-size limits and run locally in the browser.
- UUID generation uses Web Crypto.
- JWT tool decodes only the header and payload; it does not verify signatures, claims, issuer or audience.
- Base64 is encoding, not encryption.
- No database, user accounts, session cookies or file uploads are included in the MVP.

## 8. Security headers

`next.config.ts` sets CSP, HSTS in production, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy`. The CSP currently allows Next.js inline bootstrap scripts and Google ad scripts when monetization is configured. For a stricter policy, implement nonce-based CSP and validate the policy against the exact third-party services you enable. Do not add `unsafe-eval` or arbitrary script hosts to silence CSP errors.

Also do the following before production:

- Add a domain-specific `CONTACT_TO_EMAIL` and an operational process for privacy requests.
- Review legal pages with qualified counsel for the countries where you operate and serve visitors.
- Configure a certified CMP when required by advertising partners or applicable privacy rules.
- Enable hosting-provider WAF/bot protection and platform-level rate limits.
- Restrict GitHub Actions permissions and protect `main` with required CI checks and review.
- Keep dependencies patched; do not ignore high/critical security advisories.
- Add uptime/error monitoring without capturing tool inputs or contact message contents.
- Run a security review before adding authentication, uploads, database writes or third-party scripts.

## 9. CI/CD

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`: lockfile check, `npm ci`, ESLint, TypeScript, unit tests (including request-origin and request-size tests), full `npm audit`, and production build.

`.github/workflows/deploy.yml` repeats the checks against the exact commit before deploying. Automatic deployment requires a successful CI run for `main`; manual deployment is also restricted to `main` and does not skip checks. Set the repository variable `VERCEL_DEPLOY_ENABLED=true` and add repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Add production environment variables in Vercel itself.

Protect `main` and require the CI job to pass before merging. A successful CI run does not replace staging tests or a production smoke test.

## 10. Docker

```bash
cp .env.example .env
npm install  # creates package-lock.json on first setup
# Set NEXT_PUBLIC_SITE_URL to the final public URL before the build.
docker compose up --build -d
docker compose logs -f web
```

The Docker image uses a multi-stage build and runs the Next.js standalone server as a non-root user. Expose it through a TLS reverse proxy or a managed hosting platform; do not expose a raw container directly to the public internet without HTTPS and platform-level protection.

## 11. Before launch checklist

- [ ] Run `npm install` and commit the generated `package-lock.json` (required by CI and Docker).
- [ ] Replace `NEXT_PUBLIC_SITE_URL` with your real HTTPS domain.
- [ ] Replace template privacy/terms text and verify every statement matches actual services.
- [ ] Add a real About page owner/contact identity or business information as legally appropriate.
- [ ] Expand the five included guides using real search-query data and user feedback; do not mass-publish thin SEO pages.
- [ ] Configure and test the contact delivery and Redis rate limit.
- [ ] Configure only approved affiliate/checkout URLs and test every destination.
- [ ] Apply for ads only when the site is complete and useful; configure consent where required.
- [ ] Add favicon/social preview artwork and test metadata on the final domain.
- [ ] Run lint, typecheck, tests, build and a production smoke test.
- [ ] Check accessibility, mobile layout, Core Web Vitals and Search Console indexing.

## 12. Roadmap to a real business

1. Publish the five tools and five included guides; expand them with real search queries, original examples, user questions and clear limitations.
2. Add two or three tools only when search demand and user feedback support them.
3. Track page-level search impressions and useful actions using privacy-conscious analytics.
4. Add a small relevant affiliate section only after the product has earned trust.
5. Launch one original paid asset that solves a repeated problem; do not build a large store before validating demand.
6. Reassess tool usage, search traffic and revenue monthly. Remove pages that add no value.
