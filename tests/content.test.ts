import { describe, expect, it } from "vitest";
import { caseStudies, getCaseStudy, isLive, liveCaseStudies } from "@/data/case-studies";
import { services, getService } from "@/data/services";
import { faqs } from "@/data/faq";
import { getAllPosts } from "@/lib/blog";

describe("case studies", () => {
  it("covers all 15 production sites", () => {
    expect(caseStudies).toHaveLength(15);
  });

  it("has unique slugs and live https URLs", () => {
    const slugs = new Set(caseStudies.map((c) => c.slug));
    expect(slugs.size).toBe(caseStudies.length);
    for (const c of caseStudies) {
      expect(c.url.startsWith("https://"), `${c.slug} must be https`).toBe(true);
    }
  });

  it("marks any unreachable site offline and explains why, rather than deleting it", () => {
    // A dead "open the live site" link breaks the falsifiability argument the
    // whole portfolio rests on. Offline studies keep their record but must
    // carry an explanation instead of an invitation to click.
    for (const c of caseStudies) {
      if (isLive(c)) {
        expect(c.offlineNote, `${c.slug} is live and should not carry an offline note`).toBeUndefined();
      } else {
        expect(c.offlineNote, `${c.slug} is offline and must explain why`).toBeTruthy();
        expect(c.offlineNote!.length).toBeGreaterThan(60);
      }
    }
  });

  it("still has a majority of reachable sites — otherwise the claim is hollow", () => {
    expect(liveCaseStudies().length).toBeGreaterThan(caseStudies.length / 2);
  });

  it("pairs an engineering layer with a layman layer on every study", () => {
    for (const c of caseStudies) {
      expect(c.engineering.length, `${c.slug} engineering`).toBeGreaterThan(80);
      expect(c.layman.length, `${c.slug} layman`).toBeGreaterThan(30);
      expect(c.verified.length, `${c.slug} verified signals`).toBeGreaterThanOrEqual(3);
    }
  });

  it("links every study to 2-3 existing related studies and a real service", () => {
    for (const c of caseStudies) {
      expect(c.related.length, `${c.slug} related count`).toBeGreaterThanOrEqual(2);
      expect(c.related.length).toBeLessThanOrEqual(3);
      expect(c.related).not.toContain(c.slug);
      for (const slug of c.related) {
        expect(getCaseStudy(slug), `${c.slug} -> ${slug}`).toBeDefined();
      }
      expect(getService(c.serviceSlug), `${c.slug} -> ${c.serviceSlug}`).toBeDefined();
    }
  });
});

describe("services", () => {
  it("exposes five distinct offers with unique slugs", () => {
    expect(services).toHaveLength(5);
    expect(new Set(services.map((s) => s.slug)).size).toBe(5);
  });

  it("gives every service a long-tail target, keywords and its own FAQ", () => {
    for (const s of services) {
      expect(s.longTailTarget.split(" ").length, `${s.slug} long tail`).toBeGreaterThanOrEqual(6);
      expect(s.keywords.length).toBeGreaterThanOrEqual(4);
      expect(s.faqs.length).toBeGreaterThanOrEqual(3);
      expect(s.deliverables.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("links every service to case studies that exist", () => {
    for (const s of services) {
      for (const slug of s.relatedCaseStudies) {
        expect(getCaseStudy(slug), `${s.slug} -> ${slug}`).toBeDefined();
      }
    }
  });
});

describe("faq", () => {
  it("has no duplicate questions", () => {
    expect(new Set(faqs.map((f) => f.q)).size).toBe(faqs.length);
  });

  it("gives every question a substantive answer", () => {
    for (const f of faqs) {
      expect(f.q.endsWith("?"), `not a question: ${f.q}`).toBe(true);
      expect(f.a.length, `answer too short: ${f.q}`).toBeGreaterThan(80);
    }
  });
});

describe("blog", () => {
  it("loads posts with complete frontmatter", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThanOrEqual(5);
    for (const p of posts) {
      expect(p.title, p.slug).toBeTruthy();
      expect(p.description.length, p.slug).toBeGreaterThan(60);
      expect(p.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.content.length).toBeGreaterThan(1500);
    }
  });

  it("sorts newest first", () => {
    const dates = getAllPosts().map((p) => p.publishedAt);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("points relatedService and relatedCaseStudy at real entries", () => {
    for (const p of getAllPosts()) {
      if (p.relatedService) expect(getService(p.relatedService), p.slug).toBeDefined();
      if (p.relatedCaseStudy) expect(getCaseStudy(p.relatedCaseStudy), p.slug).toBeDefined();
    }
  });
});
