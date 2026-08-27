import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  readingTime: string;
  /** Internal linking — Section 5. */
  relatedService?: string;
  relatedCaseStudy?: string;
  featured?: boolean;
};

export type Post = PostFrontmatter & { slug: string; content: string };

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  return { ...fm, slug, content };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map(readPostFile)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllTags(): string[] {
  return [...new Set(getAllPosts().flatMap((p) => p.tags))].sort();
}
