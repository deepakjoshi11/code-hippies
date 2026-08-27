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

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
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
      description,
      images: [ogImage],
    },
  };
}
