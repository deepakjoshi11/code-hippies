import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactDock } from "@/components/layout/contact-dock";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { Telemetry } from "@/components/consent/telemetry";
import { Measurement } from "@/components/ads/measurement";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, organizationSchema, personSchema, professionalServiceSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

/*
 * `display: "optional"` with preload, chosen by measurement rather than habit.
 * The alternative — "swap" without preload — was measured on the same build:
 * it produced no LCP improvement (2674ms vs 2725ms, inside run variance) and
 * pushed CLS from 0.000 to 0.096 as the face swapped in. Optional uses Inter
 * when it arrives in time and keeps the metrics-matched fallback otherwise, so
 * there is no swap repaint and no font-driven layout shift at all.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  preload: true,
  adjustFontFallback: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Code Hippies — Deepak Joshi | Full-stack, mobile & AI/LLM engineering",
    template: "%s | Code Hippies",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder, url: site.github.primary }],
  creator: site.founder,
  publisher: site.name,
  category: "technology",
  formatDetection: { telephone: false, address: false, email: false },
  verification: { google: site.googleSiteVerification },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <JsonLd
          json={graph(
            organizationSchema(),
            personSchema(),
            professionalServiceSchema(),
            websiteSchema(),
          )}
        />
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-500 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink-950"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ContactDock />
        <ChatWidget />
        <ConsentBanner />
        <Telemetry />
        <Measurement />
        {/* Vercel Analytics only resolves on Vercel; loading it elsewhere is a
            guaranteed 404 in the console and a false Lighthouse finding. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
