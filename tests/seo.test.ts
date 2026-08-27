import { describe, expect, it } from "vitest";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  graph,
  organizationSchema,
  personSchema,
  professionalServiceSchema,
  websiteSchema,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { faqs } from "@/data/faq";
import { services } from "@/data/services";

describe("structured data", () => {
  it("emits a valid schema.org @graph document", () => {
    const parsed = JSON.parse(
      graph(organizationSchema(), personSchema(), professionalServiceSchema(), websiteSchema()),
    );
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@graph"]).toHaveLength(4);
    for (const node of parsed["@graph"]) {
      expect(node["@type"]).toBeTruthy();
      expect(node["@id"]).toBeTruthy();
    }
  });

  it("links the Person to the Organization by @id rather than duplicating it", () => {
    const person = personSchema() as unknown as { worksFor: { "@id": string } };
    const org = organizationSchema() as unknown as { "@id": string };
    expect(person.worksFor["@id"]).toBe(org["@id"]);
  });

  it("mirrors the full service catalogue into the ProfessionalService offer", () => {
    const node = professionalServiceSchema() as unknown as {
      hasOfferCatalog: { itemListElement: unknown[] };
    };
    expect(node.hasOfferCatalog.itemListElement).toHaveLength(services.length);
  });

  it("builds an FAQPage with a question and accepted answer per entry", () => {
    const node = faqSchema(faqs) as unknown as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(node.mainEntity).toHaveLength(faqs.length);
    for (const entry of node.mainEntity) {
      expect(entry.name).toBeTruthy();
      expect(entry.acceptedAnswer.text.length).toBeGreaterThan(40);
    }
  });

  it("numbers breadcrumb positions from 1 with absolute URLs", () => {
    const node = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
    ]) as unknown as { itemListElement: { position: number; item: string }[] };
    expect(node.itemListElement[0]!.position).toBe(1);
    expect(node.itemListElement[1]!.item).toMatch(/^https:\/\/.+\/work$/);
  });

  it("defaults an Article's dateModified to its publish date", () => {
    const node = articleSchema({
      title: "Test",
      description: "Test description",
      path: "/blog/test",
      publishedTime: "2026-01-01",
    }) as unknown as { datePublished: string; dateModified: string };
    expect(node.dateModified).toBe(node.datePublished);
  });

  it("escapes angle brackets so serialised JSON-LD cannot close its script tag", () => {
    const json = graph(faqSchema([{ q: "</script><img onerror=x>", a: "safe answer here for the test" }]));
    // JsonLd applies the same replacement before injection.
    expect(json.replace(/</g, "\\u003c")).not.toContain("</script>");
  });
});

describe("page metadata", () => {
  const meta = pageMetadata({
    title: "Test page",
    description: "A description of the test page that is long enough to be useful.",
    path: "/test",
    keywords: ["one", "two"],
  });

  it("sets a canonical URL", () => {
    expect(meta.alternates?.canonical).toMatch(/^https:\/\/.+\/test$/);
  });

  it("generates a per-page Open Graph image", () => {
    const images = meta.openGraph?.images as { url: string; width: number }[];
    expect(images[0]!.url).toContain("/og?title=");
    expect(images[0]!.width).toBe(1200);
  });

  it("uses a summary_large_image Twitter card", () => {
    expect((meta.twitter as { card: string }).card).toBe("summary_large_image");
  });
});
