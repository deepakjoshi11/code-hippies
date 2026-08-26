import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE = "https://codehippies.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Code Hippies — Editorial web engineering for brands that ship",
    template: "%s · Code Hippies",
  },
  description:
    "A two-person studio led by Deepak Joshi, building fast, accessible, editorial-grade websites in Astro and Next.js for clients across Europe and India.",
  keywords: [
    "Astro developer", "Next.js developer", "web design studio",
    "headless CMS", "Framer Motion", "accessibility", "Core Web Vitals",
    "corporate profile website", "Europe", "India",
  ],
  authors: [{ name: "Deepak Joshi", url: "https://github.com/deepakjoshi11" }],
  creator: "Deepak Joshi",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE,
    siteName: "Code Hippies",
    title: "Code Hippies — Editorial web engineering for brands that ship",
    description:
      "Fast, accessible, editorial-grade websites in Astro and Next.js. Studio-quality work for European and Indian brands.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Code Hippies studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Hippies — Editorial web engineering",
    description: "Fast, accessible, editorial-grade websites in Astro and Next.js.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04060a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-brass-500 focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
