import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ChatWidget } from "@/components/chat/chat-widget";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, organizationSchema, personSchema, professionalServiceSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d12",
  colorScheme: "dark",
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
        <WhatsAppButton />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
