export const site = {
  name: "Code Hippies",
  legalName: "Code Hippies",
  founder: "Deepak Joshi",
  tagline: "Ship software that a business can actually run on.",
  description:
    "Code Hippies is Deepak Joshi's engineering studio — full-stack web, iOS and Android apps, and AI/LLM systems built for startups and agencies that need production software, not prototypes.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://codehippies.com",
  locale: "en_IN",
  country: "India",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@codehippies.com",
  /**
   * Contact channels live in src/data/channels.ts — every one is env-driven and
   * hidden until configured, so nothing here invents a number or a handle.
   */
  contactLabel: "Talk to a developer",
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "",
  github: {
    primary: "https://github.com/deepakjoshi11",
    studio: "https://github.com/codehippies11",
    primaryUser: "deepakjoshi11",
    studioUser: "codehippies11",
  },
  dharmarthlabs: "https://dharmarthlabs.com",
  /**
   * Third-party profiles that name Code Hippies, used as schema.org sameAs.
   * Add a URL here only after confirming it is live, indexable and actually
   * names the studio — verified 2026-08-30: HTTP 200,
   * <title>CodeHippies - AI for Marketers Hackathon Team | HackIndia</title>,
   * robots "index, follow", page body names both Code Hippies and Deepak Joshi.
   */
  profiles: {
    hackindia:
      "https://hackindia.org/2026/ai-for-marketers-hackathon/teams/codehippies",
  },
  /**
   * Google Search Console verification token. Public by design — it is served
   * in the HTML head and proves domain control to Google, nothing more. It
   * grants no access on its own, so it is committed rather than env-gated.
   */
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
    "4z-bWzOR4n_xaSW5hdacjR9G1EnVmwttS8Db0vDkyoc",
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}
