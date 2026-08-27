import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  type?: "website" | "article";
  publishedTime?: string;
  ogTitle?: string;
};

/**
 * Google truncates meta descriptions around 155-160 characters. Rather than
 * relying on every author to count, descriptions are clamped here at a word
 * boundary — a truncated sentence in a search result reads as carelessness.
 */
const MAX_DESCRIPTION = 158;

export function clampDescription(text: string, max = MAX_DESCRIPTION): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max - 1);
  const boundary = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return `${cut.slice(0, boundary > max * 0.6 ? boundary : cut.length).replace(/[,;:\s.]+$/, "")}…`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
  ogTitle,
}: PageMetaInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(`/og?title=${encodeURIComponent(ogTitle ?? title)}`);
  const clamped = clampDescription(description);

  return {
    title,
    description: clamped,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description: clamped,
      url: canonical,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: clamped,
      images: [ogImage],
    },
  };
}
