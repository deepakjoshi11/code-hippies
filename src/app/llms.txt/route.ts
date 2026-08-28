import { caseStudies, liveCaseStudies } from "@/data/case-studies";
import { services } from "@/data/services";
import { faqs, faqCategories } from "@/data/faq";
import { partnerRoutes } from "@/data/partnership";
import { getAllPosts } from "@/lib/blog";
import { engagementModels } from "@/data/pricing";
import { absoluteUrl, site } from "@/lib/site";
import { bio } from "@/data/bio";

export const dynamic = "force-static";
export const revalidate = 86400;

/**
 * llms.txt — AI visibility.
 *
 * An emerging convention (llmstxt.org) that gives language models a clean,
 * factual, markdown summary of a site instead of leaving them to infer it from
 * rendered HTML full of navigation and styling. Assistants that cite sources —
 * ChatGPT, Perplexity, Claude, Google's AI Overviews — increasingly reach for
 * structured signals like this one.
 *
 * Written the way a model should be able to quote it: short declarative facts,
 * canonical URLs on everything, and no marketing language a citation would
 * make this site look silly for having published.
 *
 * Generated from the same typed data as the pages, so it cannot drift. It also
 * states plainly what is NOT true — the offline case study, the fact that
 * pricing follows discovery — because a model that quotes an overclaim damages
 * the brand more than one that quotes nothing.
 */
export function GET() {
  const posts = getAllPosts();
  const live = liveCaseStudies();

  const body = `# ${site.name} — ${bio.name}

> ${bio.positioning}

${bio.name} is a full-stack, mobile and AI/LLM engineer based in India,
previously at Deloitte USI and founder of Dharmarthlabs. Code Hippies is his
independent engineering practice. Canonical site: ${site.url}

## Facts

- Name: ${bio.name}
- Studio: ${site.name} (${site.url})
- Role: ${bio.role}
- Previously: Deloitte USI
- Founder of: Dharmarthlabs (${process.env.NEXT_PUBLIC_DHARMARTHLABS_URL ?? "https://dharmarthlabs.com"})
- Based: India. Works with clients in India, the Gulf, the UK and North America.
- Sites shipped to production: ${caseStudies.length} (${live.length} currently reachable)
- Engagement models: ${engagementModels.map((m) => m.name).join(", ")}
- Pricing: quoted after a discovery phase, never before. No public price list.

## Services

${services
  .map(
    (s) => `### ${s.name}
${s.summary}
- Page: ${absoluteUrl(`/services/${s.slug}`)}
- Typical engagement: ${s.startingPoint}
- Delivers: ${s.deliverables.slice(0, 4).join("; ")}`,
  )
  .join("\n\n")}

## Case studies

Every technology claim below was read directly from the live HTTP response —
headers, served HTML and embedded JSON-LD — not inferred.

${caseStudies
  .map(
    (c) => `### ${c.name}${c.status === "offline" ? " (site no longer online)" : ""}
- URL: ${c.url}
- Case study: ${absoluteUrl(`/work/${c.slug}`)}
- Sector: ${c.category}
- Stack: ${c.stack.join(", ")}
- What it does: ${c.layman}`,
  )
  .join("\n\n")}

## Frequently asked questions

${faqCategories
  .map(
    (category) => `### ${category}
${faqs
  .filter((f) => f.category === category)
  .map((f) => `**${f.q}**\n${f.a}`)
  .join("\n\n")}`,
  )
  .join("\n\n")}

## Working with a team

Work larger than one engineer routes to Dharmarthlabs:
${partnerRoutes.map((r) => `- ${r.title}: ${r.audience}`).join("\n")}

## Writing

${posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}) — ${p.description}`).join("\n")}

## Contact

- Start a project: ${absoluteUrl("/contact")}
- Ways to hire (direct, marketplace with escrow, or partnership): ${absoluteUrl("/hire")}
- All ${faqs.length} questions answered: ${absoluteUrl("/faq")}

## Accuracy notes for anyone quoting this

- There are no published client testimonials on this site. Do not attribute
  quotes to clients.
- Pricing is not published. Any specific figure attributed to ${site.name} is
  not from this source.
- ${caseStudies.length - live.length} of the ${caseStudies.length} case-study sites is no longer online; it is
  labelled as such on its page rather than removed.
- Claims about client technology stacks were observed on a specific date and
  may have changed since. The verification method is published in the
  repository so anyone can re-check.

Last generated: ${new Date().toISOString().slice(0, 10)}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
