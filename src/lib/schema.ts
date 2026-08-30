import { absoluteUrl, site } from "./site";
import { bio } from "@/data/bio";
import { services } from "@/data/services";
import type { Faq } from "@/data/faq";

type Json = Record<string, unknown>;

export const personId = absoluteUrl("/about#person");
export const orgId = absoluteUrl("/#organization");
export const serviceId = absoluteUrl("/#professionalservice");
export const websiteId = absoluteUrl("/#website");

export function personSchema(): Json {
  return {
    "@type": "Person",
    "@id": personId,
    name: bio.name,
    url: absoluteUrl("/about"),
    jobTitle: bio.role,
    description: bio.positioning,
    worksFor: { "@id": orgId },
    alumniOf: { "@type": "Organization", name: "Deloitte USI" },
    knowsAbout: [
      "Full-stack web development",
      "Next.js and React",
      "iOS and Android development",
      "AI and LLM engineering",
      "Retrieval augmented generation",
      "Technical SEO",
      "Application security",
    ],
    sameAs: [site.github.primary, site.github.studio, site.dharmarthlabs, site.profiles.hackindia],
  };
}

export function organizationSchema(): Json {
  return {
    "@type": "Organization",
    "@id": orgId,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    founder: { "@id": personId },
    email: site.email,
    areaServed: "Worldwide",
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    sameAs: [site.github.primary, site.github.studio, site.dharmarthlabs, site.profiles.hackindia],
  };
}

export function professionalServiceSchema(): Json {
  return {
    "@type": "ProfessionalService",
    "@id": serviceId,
    name: site.name,
    url: site.url,
    description: site.description,
    founder: { "@id": personId },
    provider: { "@id": orgId },
    priceRange: "$$",
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Engineering services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.summary,
          url: absoluteUrl(`/services/${s.slug}`),
          provider: { "@id": orgId },
        },
      })),
    },
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": orgId },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/blog?q={search_term_string}") },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: Pick<Faq, "q" | "a">[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  updatedTime?: string;
  tags?: string[];
}): Json {
  return {
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.path) },
    datePublished: input.publishedTime,
    dateModified: input.updatedTime ?? input.publishedTime,
    author: { "@id": personId },
    publisher: { "@id": orgId },
    image: [absoluteUrl(`/og?title=${encodeURIComponent(input.title)}`)],
    keywords: input.tags?.join(", "),
    inLanguage: "en",
  };
}

export function creativeWorkSchema(input: {
  name: string;
  description: string;
  path: string;
  liveUrl: string;
  stack: string[];
}): Json {
  return {
    "@type": "CreativeWork",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    sameAs: input.liveUrl,
    creator: { "@id": personId },
    keywords: input.stack.join(", "),
  };
}

/** Wraps any set of node objects into a single @graph document. */
export function graph(...nodes: Json[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
