/**
 * Repeatable QA audit — accessibility, responsiveness and link integrity.
 *
 * Run against a production build:
 *
 *   npm run build && npm start &
 *   node scripts/audit-quality.mjs http://localhost:3000
 *
 * Checks, in order:
 *   1. Every internal link resolves, and every external link returns < 400.
 *   2. Zero axe-core WCAG 2.1 A/AA violations at 390px and 1440px.
 *   3. No horizontal scroll at 360, 390, 768, 1024 and 1440px.
 *   4. One h1 per page, a canonical URL, an OG image, a title within SERP
 *      limits, and a description within the truncation limit.
 *
 * Exits non-zero on any failure, so it can be wired into CI once the
 * dependencies below are promoted out of optional tooling.
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const Axe = AxeBuilder.default ?? AxeBuilder;
const BASE = process.argv[2] ?? "http://localhost:3000";
const WIDTHS = [360, 390, 768, 1024, 1440];
const CHROME = process.env.CHROME_PATH;

const PAGES = [
  "/", "/work", "/work/uttaranchal-kesari", "/work/nantinbaba",
  "/services", "/services/ai-llm-engineering", "/process", "/pricing",
  "/about", "/faq", "/blog", "/blog/rag-that-refuses-to-answer", "/contact",
  "/enterprise", "/partner", "/hire", "/privacy",
];

let failures = 0;
const fail = (msg) => { failures++; console.log("FAIL " + msg); };

// ---------------------------------------------------------------- links ----
console.log("=== Link integrity");
{
  const seen = new Set();
  const queue = ["/"];
  const external = new Set();

  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await fetch(BASE + path);
    if (!res.ok) { fail(`${path} -> ${res.status}`); continue; }
    const html = await res.text();
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (href.startsWith("http")) { external.add(href); continue; }
      if (!href.startsWith("/") || href.startsWith("/_next")) continue;
      const clean = href.split("#")[0].split("?")[0];
      if (clean && !seen.has(clean)) queue.push(clean);
    }
  }
  console.log(`  ${seen.size} internal pages crawled`);

  // The canonical origin is not registered during development, so links to it
  // are expected to 404 locally and are not counted as failures.
  const origin = new URL(BASE).origin;
  // Case studies explicitly marked offline in src/data/case-studies.ts are
  // reported but do not fail the build — the page already tells the reader the
  // site is down, so the link is documented history rather than a broken promise.
  const { caseStudies } = await import("../src/data/case-studies.ts").catch(() => ({ caseStudies: [] }));
  const knownOffline = new Set(
    (caseStudies ?? []).filter((c) => c.status === "offline").map((c) => new URL(c.url).host),
  );
  const checkable = [...external].filter((u) => !u.startsWith("https://codehippies.com") && !u.startsWith(origin));
  const results = await Promise.all(checkable.map(async (url) => {
    try {
      const r = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(25000), headers: { "user-agent": "Mozilla/5.0 (compatible; CodeHippiesAudit/1.0)" } });
      return [url, r.status];
    } catch (e) { return [url, "ERR " + String(e.message).slice(0, 30)]; }
  }));
  for (const [url, status] of results) {
    if (typeof status !== "number" || status >= 400) {
      let host = "";
      try { host = new URL(url).host; } catch { /* keep empty */ }
      if (knownOffline.has(host)) {
        console.log(`  note  known-offline case study still down: ${url} -> ${status}`);
        continue;
      }
      fail(`external ${url} -> ${status}`);
    }
  }
  console.log(`  ${results.length} external links checked`);
}

// ------------------------------------------------------------- metadata ----
console.log("\n=== Metadata and document outline");
for (const path of PAGES) {
  const html = await (await fetch(BASE + path)).text();
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "";
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? "";
  const bad = [];
  if (h1s !== 1) bad.push(`h1=${h1s}`);
  if (!title || title.length > 76) bad.push(`title=${title.length}`);
  if (desc.length < 70 || desc.length > 185) bad.push(`desc=${desc.length}`);
  if (!/<link rel="canonical"/.test(html)) bad.push("no canonical");
  if (!/property="og:image"/.test(html)) bad.push("no og:image");
  if ([...html.matchAll(/<img\b[^>]*>/g)].some((m) => !/\balt=/.test(m[0]))) bad.push("img without alt");
  if (bad.length) fail(`${path}: ${bad.join("; ")}`);
}
console.log(`  ${PAGES.length} pages checked`);

// ------------------------------------------------- offline case studies ----
// A case study marked offline must say so on its page and must NOT render an
// "Open the live site" button. This is checked against rendered HTML because
// the guard is a render-time branch — a unit test on the data would have
// passed while the page still shipped a dead button, which is exactly what
// happened once.
console.log("\n=== Offline case-study rendering");
{
  const { caseStudies: studies } = await import("../src/data/case-studies.ts").catch(() => ({ caseStudies: [] }));
  const offline = (studies ?? []).filter((c) => c.status === "offline");
  for (const study of offline) {
    const html = await (await fetch(`${BASE}/work/${study.slug}`)).text();
    if (html.includes("Open the live site")) {
      fail(`/work/${study.slug} is offline but still renders an "Open the live site" button`);
    }
    if (!html.includes("no longer online")) {
      fail(`/work/${study.slug} is offline but does not tell the reader so`);
    }
  }
  console.log(`  ${offline.length} offline study/studies checked`);
}

// -------------------------------------------------- accessibility + layout ----
const browser = await chromium.launch({
  ...(CHROME ? { executablePath: CHROME } : {}),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

console.log("\n=== axe-core WCAG 2.1 A/AA");
for (const width of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const { violations } = await new Axe({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    for (const v of violations) fail(`${path} @${width}px: ${v.id} (${v.nodes.length} nodes, ${v.impact})`);
  }
  await ctx.close();
  console.log(`  ${width}px: ${PAGES.length} pages checked`);
}

console.log("\n=== Responsive layout");
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return de.scrollWidth > de.clientWidth + 1 ? `${de.scrollWidth}>${de.clientWidth}` : null;
    });
    if (overflow) fail(`${path} @${width}px: horizontal scroll ${overflow}`);
  }
  await ctx.close();
  console.log(`  ${width}px: ${PAGES.length} pages checked`);
}

await browser.close();

console.log(failures ? `\n${failures} failures` : "\nAll quality checks passed");
process.exit(failures ? 1 : 0);
