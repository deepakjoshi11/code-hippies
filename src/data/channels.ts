/**
 * Contact channels.
 *
 * Every channel is driven by an environment variable and is HIDDEN until that
 * variable is set. Nothing here invents a phone number, handle or profile URL
 * — an unset channel simply does not render, so the site is never shipping a
 * dead link or a number that belongs to a stranger.
 *
 * Add the values in Vercel's environment settings (or .env.local) and the
 * channel appears on the next build. See .env.example and DEPLOY.md.
 */

export type ChannelKind = "messaging" | "social" | "direct" | "marketplace";

export type Channel = {
  id: string;
  label: string;
  /** Short line shown under the label in the contact dock. */
  hint: string;
  kind: ChannelKind;
  /** Brand colour used for the icon chip. */
  color: string;
  /** Built from env; null when not configured. */
  href: string | null;
  /** Preferred ordering within its group. */
  order: number;
};

const env = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "",
  instagramDm: process.env.NEXT_PUBLIC_INSTAGRAM_DM_URL ?? "",
  messenger: process.env.NEXT_PUBLIC_MESSENGER_ID ?? "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_PAGE ?? "",
  telegram: process.env.NEXT_PUBLIC_TELEGRAM_HANDLE ?? "",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
  calendly: process.env.NEXT_PUBLIC_CAL_LINK ?? "",
  fiverr: process.env.NEXT_PUBLIC_FIVERR_URL ?? "",
  upwork: process.env.NEXT_PUBLIC_UPWORK_URL ?? "",
  freelancer: process.env.NEXT_PUBLIC_FREELANCER_URL ?? "",
  toptal: process.env.NEXT_PUBLIC_TOPTAL_URL ?? "",
  clutch: process.env.NEXT_PUBLIC_CLUTCH_URL ?? "",
} as const;

/** Strips everything but digits — WhatsApp and tel: links need bare numbers. */
function digits(value: string): string {
  return value.replace(/\D/g, "");
}

function orNull(value: string, build: (v: string) => string): string | null {
  const trimmed = value.trim();
  return trimmed ? build(trimmed) : null;
}

export const DEFAULT_INTENT =
  "Hi Deepak — I found you through codehippies.com and I'd like to talk about a project.";

export function whatsappHref(message: string = DEFAULT_INTENT): string | null {
  const number = digits(env.whatsapp);
  if (!number || /^0+$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildChannels(message: string = DEFAULT_INTENT): Channel[] {
  const all: Channel[] = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      hint: "Fastest reply, usually within the hour",
      kind: "messaging",
      color: "#25D366",
      href: whatsappHref(message),
      order: 1,
    },
    {
      id: "instagram",
      label: "Instagram",
      hint: "DM me if that is where you live",
      kind: "messaging",
      color: "#E1306C",
      href:
        orNull(env.instagramDm, (v) => v) ??
        orNull(env.instagram, (v) => `https://ig.me/m/${v.replace(/^@/, "")}`),
      order: 2,
    },
    {
      id: "messenger",
      label: "Facebook Messenger",
      hint: "Message the page directly",
      kind: "messaging",
      color: "#0084FF",
      href: orNull(env.messenger, (v) => `https://m.me/${v}`),
      order: 3,
    },
    {
      id: "telegram",
      label: "Telegram",
      hint: "For anything you would rather keep encrypted",
      kind: "messaging",
      color: "#2AABEE",
      href: orNull(env.telegram, (v) => `https://t.me/${v.replace(/^@/, "")}`),
      order: 4,
    },
    {
      id: "email",
      label: "Email",
      hint: "Best for a detailed brief or an attachment",
      kind: "direct",
      color: "#34d399",
      href: orNull(env.email, (v) => `mailto:${v}?subject=${encodeURIComponent("Project enquiry — Code Hippies")}`),
      order: 5,
    },
    {
      id: "phone",
      label: "Call",
      hint: "If it is easier to just talk it through",
      kind: "direct",
      color: "#f59e0b",
      href: orNull(env.phone, (v) => `tel:+${digits(v)}`),
      order: 6,
    },
    {
      id: "cal",
      label: "Book a call",
      hint: "45 minutes, pick a slot that suits you",
      kind: "direct",
      color: "#8b5cf6",
      href: orNull(env.calendly, (v) => (v.startsWith("http") ? v : `https://cal.com/${v}`)),
      order: 7,
    },
    {
      id: "instagram-profile",
      label: "Instagram",
      hint: "Work in progress, shipped things",
      kind: "social",
      color: "#E1306C",
      href: orNull(env.instagram, (v) => `https://instagram.com/${v.replace(/^@/, "")}`),
      order: 8,
    },
    {
      id: "facebook",
      label: "Facebook",
      hint: "The page",
      kind: "social",
      color: "#1877F2",
      href: orNull(env.facebook, (v) => (v.startsWith("http") ? v : `https://facebook.com/${v}`)),
      order: 9,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      hint: "Background, roles, recommendations",
      kind: "social",
      color: "#0A66C2",
      href: orNull(env.linkedin, (v) => v),
      order: 10,
    },
    {
      id: "fiverr",
      label: "Fiverr",
      hint: "Buy a scoped package with escrow protection",
      kind: "marketplace",
      color: "#1DBF73",
      href: orNull(env.fiverr, (v) => v),
      order: 11,
    },
    {
      id: "upwork",
      label: "Upwork",
      hint: "Hourly or fixed-price, contract-protected",
      kind: "marketplace",
      color: "#14A800",
      href: orNull(env.upwork, (v) => v),
      order: 12,
    },
    {
      id: "freelancer",
      label: "Freelancer",
      hint: "Milestone payments held in escrow",
      kind: "marketplace",
      color: "#29B2FE",
      href: orNull(env.freelancer, (v) => v),
      order: 13,
    },
    {
      id: "toptal",
      label: "Toptal",
      hint: "Vetted-network engagement",
      kind: "marketplace",
      color: "#3863A0",
      href: orNull(env.toptal, (v) => v),
      order: 14,
    },
    {
      id: "clutch",
      label: "Clutch",
      hint: "Verified reviews and profile",
      kind: "marketplace",
      color: "#17313B",
      href: orNull(env.clutch, (v) => v),
      order: 15,
    },
  ];

  return all.filter((c) => c.href !== null).sort((a, b) => a.order - b.order);
}

export function channelsByKind(kind: ChannelKind, message?: string): Channel[] {
  return buildChannels(message).filter((c) => c.kind === kind);
}

/** True when at least one way to reach a human is configured. */
export function hasAnyChannel(): boolean {
  return buildChannels().length > 0;
}

/**
 * The channel used for the always-available floating button. WhatsApp when
 * configured, otherwise the first messaging channel, otherwise email, and if
 * nothing at all is set the dock falls back to the on-site brief form — which
 * always works.
 */
export function primaryChannel(message?: string): Channel | null {
  const channels = buildChannels(message);
  return (
    channels.find((c) => c.id === "whatsapp") ??
    channels.find((c) => c.kind === "messaging") ??
    channels.find((c) => c.kind === "direct") ??
    null
  );
}
