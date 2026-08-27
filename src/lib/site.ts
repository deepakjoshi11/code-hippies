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
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}
