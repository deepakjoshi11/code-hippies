import { NextResponse, type NextRequest } from "next/server";

/**
 * Security headers — Section 9.
 *
 * A per-request nonce is generated and threaded into the CSP so inline
 * scripts Next.js emits are allowed without resorting to a blanket
 * 'unsafe-inline' for scripts.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    `default-src 'self'`,
    // 'strict-dynamic' lets the nonced Next.js bootstrap load its own chunks.
    // Dev needs 'unsafe-eval' for React Refresh; production does not get it.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: ${isDev ? "'unsafe-eval'" : ""}`,
    // Tailwind and Next.js inject inline style attributes; styles are same-origin otherwise.
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `img-src 'self' blob: data: https:`,
    `connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com`,
    `frame-src 'self' https://cal.com https://app.cal.com`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ]
    .filter(Boolean)
    .join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

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
