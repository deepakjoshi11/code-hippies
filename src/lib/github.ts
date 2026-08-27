import { site } from "./site";

export type GitHubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  publicRepos: number;
  followers: number;
  avatarUrl: string;
  htmlUrl: string;
};

export type GitHubRepo = {
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  htmlUrl: string;
  updatedAt: string;
};

const HEADERS: HeadersInit = {
  accept: "application/vnd.github+json",
  "user-agent": "codehippies.com",
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function githubFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`https://api.github.com${path}`, {
      headers: HEADERS,
      // Revalidated by the page's own ISR window; see revalidate in page.tsx.
      next: { revalidate: 21_600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Live GitHub stats for the About page.
 *
 * Returns null on any failure — rate limit, outage, network policy — and the
 * page falls back to the verified repository list in data/bio.ts rather than
 * rendering an error or, worse, invented numbers.
 */
export async function getProfile(user: string): Promise<GitHubProfile | null> {
  const data = await githubFetch<Record<string, unknown>>(`/users/${user}`);
  if (!data) return null;
  return {
    login: String(data.login ?? user),
    name: (data.name as string | null) ?? null,
    bio: (data.bio as string | null) ?? null,
    publicRepos: Number(data.public_repos ?? 0),
    followers: Number(data.followers ?? 0),
    avatarUrl: String(data.avatar_url ?? ""),
    htmlUrl: String(data.html_url ?? `https://github.com/${user}`),
  };
}

export async function getRepos(user: string, limit = 6): Promise<GitHubRepo[]> {
  const data = await githubFetch<Record<string, unknown>[]>(
    `/users/${user}/repos?sort=updated&per_page=${limit}&type=owner`,
  );
  if (!data || !Array.isArray(data)) return [];
  return data.map((repo) => ({
    name: String(repo.name ?? ""),
    fullName: String(repo.full_name ?? ""),
    description: (repo.description as string | null) ?? null,
    language: (repo.language as string | null) ?? null,
    stars: Number(repo.stargazers_count ?? 0),
    htmlUrl: String(repo.html_url ?? ""),
    updatedAt: String(repo.updated_at ?? ""),
  }));
}

export async function getGitHubSnapshot() {
  const [primary, studio, primaryRepos, studioRepos] = await Promise.all([
    getProfile(site.github.primaryUser),
    getProfile(site.github.studioUser),
    getRepos(site.github.primaryUser, 6),
    getRepos(site.github.studioUser, 6),
  ]);

  return {
    primary,
    studio,
    repos: [...studioRepos, ...primaryRepos]
      .filter((r) => r.name)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 6),
    live: Boolean(primary || studio),
  };
}
