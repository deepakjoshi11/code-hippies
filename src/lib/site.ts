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
   * Placeholder. Replace with the real WhatsApp number in international format,
   * digits only (e.g. 919999999999) via NEXT_PUBLIC_WHATSAPP_NUMBER.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "910000000000",
  whatsappMessage:
    "Hi Code Hippies — I found you through your website and I'd like to talk about a project.",
  whatsappLabel: "Chat with Code Hippies",
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "",
  github: {
    primary: "https://github.com/deepakjoshi11",
    studio: "https://github.com/codehippies11",
    primaryUser: "deepakjoshi11",
    studioUser: "codehippies11",
  },
  dharmarthlabs: "https://dharmarthlabs.com",
} as const;

export function whatsappHref(message: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}
