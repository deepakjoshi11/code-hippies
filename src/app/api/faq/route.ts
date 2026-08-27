import { NextResponse } from "next/server";
import { faqCategories, faqs } from "@/data/faq";

/**
 * The curated question list for the assistant's browse panel.
 *
 * Static and public — no CSRF or rate limit, because it is the same content
 * already rendered on /faq. Answers are deliberately NOT included: the panel
 * sends the chosen question back through /api/chat so every answer takes the
 * same audited path, and a browsed question is logged the same way a typed one
 * is.
 */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    {
      total: faqs.length,
      categories: faqCategories.map((category) => ({
        category,
        questions: faqs.filter((f) => f.category === category).map((f) => f.q),
      })),
    },
    { headers: { "cache-control": "public, max-age=3600, stale-while-revalidate=86400" } },
  );
}
