import { describe, expect, it } from "vitest";
import { leadSchema, chatSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/security/rate-limit";
import { timingSafeEqual, createToken } from "@/lib/security/csrf";

describe("input validation", () => {
  const valid = {
    name: "Priya Sharma",
    email: "priya@example.com",
    company: "",
    projectType: "Web application",
    budget: "Not sure yet",
    timeline: "Within 1 month",
    message: "We need a customer portal with authentication and a billing dashboard.",
    website: "",
  };

  it("accepts a well-formed brief", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a malformed email", () => {
    expect(leadSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects an unknown project type — enums are closed, not free text", () => {
    expect(leadSchema.safeParse({ ...valid, projectType: "<script>alert(1)</script>" }).success).toBe(false);
  });

  it("rejects an over-length message rather than truncating it", () => {
    expect(leadSchema.safeParse({ ...valid, message: "x".repeat(4001) }).success).toBe(false);
  });

  it("rejects a filled honeypot field", () => {
    expect(leadSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(false);
  });

  it("normalises email case and trims whitespace", () => {
    const parsed = leadSchema.parse({ ...valid, email: "  PRIYA@Example.COM  ", name: "  Priya Sharma  " });
    expect(parsed.email).toBe("priya@example.com");
    expect(parsed.name).toBe("Priya Sharma");
  });

  it("bounds chat question length", () => {
    expect(chatSchema.safeParse({ question: "x".repeat(501) }).success).toBe(false);
    expect(chatSchema.safeParse({ question: "Do you build mobile apps?" }).success).toBe(true);
  });
});

describe("rate limiting", () => {
  it("allows up to the limit then rejects with a retry window", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    }
    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("keeps separate buckets per key", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).ok).toBe(false);
    expect(rateLimit(b, 1, 60_000).ok).toBe(true);
  });
});

describe("csrf tokens", () => {
  it("generates URL-safe tokens of a fixed length", () => {
    const token = createToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token.length).toBe(43);
    expect(createToken()).not.toBe(token);
  });

  it("compares in constant time and rejects mismatches", () => {
    const token = createToken();
    expect(timingSafeEqual(token, token)).toBe(true);
    expect(timingSafeEqual(token, createToken())).toBe(false);
    expect(timingSafeEqual(token, token.slice(0, -1))).toBe(false);
  });
});
