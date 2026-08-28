import { NextResponse, type NextRequest } from "next/server";
import { requiredOrigins } from "@/lib/analytics/providers";

/**
 * Security headers — Section 9.
 *
 * On the CSP script-src policy: a per-request nonce with 'strict-dynamic'
 * would be stronger, but Next.js can only inject a nonce into a response it
 * renders per request — and almost every route here is statically generated,
 * which is the single largest SEO decision this site makes. A nonce policy
 * over static output silently blocks Next.js's own inline hydration bootstrap
 * and takes the page down.
 *
 * So the honest tradeoff is taken deliberately: static rendering is kept, and
 * script-src allows same-origin scripts plus the framework's inline bootstrap.
 * The compensating controls are the ones that actually matter here — this site
 * renders no user-supplied HTML, object-src is 'none', base-uri is locked to
 * 'self', frame-ancestors is 'none' and form-action is 'self', so the usual
 * routes from an injected string to code execution are closed. See NOTES.md.
 */
export default function proxy(_request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  /*
   * The CSP widens ONLY for measurement providers that are actually
   * configured. An unset provider never loosens the policy — deriving the
   * allowlist from configuration, rather than hard-coding every origin an ad
   * stack might one day use, keeps the default deployment tight.
   */
  const thirdParty = requiredOrigins();
  const extra = thirdParty.length > 0 ? ` ${thirdParty.join(" ")}` : "";

  const csp = [
    `default-src 'self'`,
    // Dev needs 'unsafe-eval' for React Refresh; production never gets it.
    `script-src 'self' 'unsafe-inline'${extra}${isDev ? " 'unsafe-eval'" : ""}`,
    // Tailwind and Next.js inject inline style attributes; styles are same-origin otherwise.
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `img-src 'self' blob: data: https:`,
    `connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com${extra}`,
    `frame-src 'self' https://cal.com https://app.cal.com${extra}`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ]
    .filter(Boolean)
    .join("; ");

  const response = NextResponse.next();

  response.headers.set("content-security-policy", csp);
  response.headers.set("x-frame-options", "DENY");
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "strict-transport-security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set(
    "permissions-policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  );
  response.headers.set("x-dns-prefetch-control", "on");
  response.headers.set("cross-origin-opener-policy", "same-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image optimisation output — those are
     * immutable, already same-origin, and re-hashing a CSP for them is waste.
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|webmanifest)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
