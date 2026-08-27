/**
 * Builds the AI assistant's knowledge base — Section 8.
 *
 * Emits one markdown document per service, per case study, plus process,
 * pricing, bio and FAQ documents, into /knowledge-base. The retriever indexes
 * these at runtime. Generating them from the same typed data that renders the
 * site guarantees the assistant and the pages cannot drift apart.
 */
import fs from "node:fs";
import path from "node:path";

import { services } from "../src/data/services";
import { caseStudies } from "../src/data/case-studies";
import { processSteps } from "../src/data/process";
import { engagementModels } from "../src/data/pricing";
import { faqs } from "../src/data/faq";
import { bio } from "../src/data/bio";

const OUT = path.join(process.cwd(), "knowledge-base");

function write(name: string, body: string) {
  fs.writeFileSync(path.join(OUT, name), `${body.trim()}\n`, "utf8");
}

function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  for (const s of services) {
    write(
      `service-${s.slug}.md`,
      `# Service: ${s.name}

Page: /services/${s.slug}

## What this service is
${s.headline}. ${s.summary}

## What you get
${s.deliverables.map((d) => `- ${d}`).join("\n")}

## Technology options
${s.stackOptions.map((g) => `- ${g.label}: ${g.options.join(", ")}`).join("\n")}

## Typical engagement length
${s.startingPoint}

${s.sections.map((sec) => `## ${sec.heading}\n${sec.body}`).join("\n\n")}

## Questions about ${s.name}
${s.faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}`,
    );
  }

  for (const c of caseStudies) {
    write(
      `case-study-${c.slug}.md`,
      `# Case study: ${c.name}

Live site: ${c.url}
Page: /work/${c.slug}
Category: ${c.category}
Year: ${c.year}

## Summary
${c.summary}

## Engineering detail
${c.engineering}

## What it does for the business
${c.layman}

## Technology used
${c.stack.join(", ")}

## Signals verified on the live site
${c.verified.map((v) => `- ${v}`).join("\n")}

## The problem
${c.problem}

## The approach
${c.approach.map((a) => `- ${a}`).join("\n")}

## The outcome
${c.outcome.map((o) => `- ${o}`).join("\n")}`,
    );
  }

  write(
    "process.md",
    `# How a Code Hippies project runs

Page: /process

There are nine stages. Each has a defined output and a defined thing the client
is responsible for.

${processSteps
  .map(
    (s) => `## ${s.n} — ${s.title} (${s.duration})
${s.summary}

What you get:
${s.youGet.map((y) => `- ${y}`).join("\n")}

What is needed from the client: ${s.fromYou}`,
  )
  .join("\n\n")}`,
  );

  write(
    "pricing.md",
    `# Engagement models and pricing

Page: /pricing

Pricing is quoted after discovery, not before — a number given before the scope
is understood is wrong in one direction or the other. There are three ways to
work together.

${engagementModels
  .map(
    (m) => `## ${m.name}
Price: ${m.priceLabel}. ${m.priceNote}.
Commitment: ${m.commitment}
Best for: ${m.bestFor}

${m.description}

Included:
${m.includes.map((i) => `- ${i}`).join("\n")}

Not included:
${m.notIncluded.map((i) => `- ${i}`).join("\n")}`,
  )
  .join("\n\n")}

## Indicative timelines
- A focused marketing or consultation site: 2 to 4 weeks.
- A full web application with authentication, database and admin: 6 to 12 weeks.
- A first mobile app release: 8 to 14 weeks.
- A one-week audit (SEO, performance or security) is the smallest engagement available.`,
  );

  write(
    "about.md",
    `# About Deepak Joshi and Code Hippies

Page: /about

${bio.name} is a ${bio.role}. ${bio.positioning}

${bio.paragraphs.join("\n\n")}

## Background
${bio.credentials.map((c) => `- ${c.label}: ${c.value}`).join("\n")}

## Public repositories
${bio.knownRepos.map((r) => `- ${r.name} (${r.language}): ${r.description}`).join("\n")}

## Contact
The fastest route is the WhatsApp button on any page, or the project brief form
at /contact, which asks for project type, budget band and timeline.`,
  );

  const byCategory = new Map<string, typeof faqs>();
  for (const f of faqs) {
    const list = byCategory.get(f.category) ?? [];
    list.push(f);
    byCategory.set(f.category, list);
  }
  for (const [category, items] of byCategory) {
    const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    write(
      `faq-${slug}.md`,
      `# Frequently asked questions: ${category}

Page: /faq

${items.map((f) => `## ${f.q}\n${f.a}`).join("\n\n")}`,
    );
  }

  const count = fs.readdirSync(OUT).length;
  console.log(`Knowledge base built: ${count} documents in ${path.relative(process.cwd(), OUT)}`);
}

main();
