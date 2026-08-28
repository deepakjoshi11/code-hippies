/**
 * Third-party measurement and advertising providers.
 *
 * Every provider is env-driven and inert until its ID is set — the same
 * pattern as contact channels. Nothing here loads a script speculatively, and
 * nothing loads at all until the visitor has granted the matching consent
 * category.
 *
 * Two rules this module exists to enforce:
 *
 *  1. **Advertising and analytics are separate consents.** Analytics stays on
 *     this site; advertising sends data to third parties. Under GDPR and the
 *     DPDP Act those are materially different decisions, so a visitor can
 *     accept one and refuse the other.
 *
 *  2. **Refusing means never requested.** Declining does not load the script
 *     in a restricted mode — the tag is never added to the document at all.
 *     "Loaded but limited" still tells the third party you were here.
 */

export type ProviderId = "ga4" | "gam" | "adsense" | "comscore";

export type Provider = {
  id: ProviderId;
  label: string;
  /** Which consent category must be granted before this may load. */
  requires: "analytics" | "advertising";
  /** The configured account/publisher identifier, or null when unset. */
  account: string | null;
  /** Third-party origin the tag talks to — must be in the CSP allowlist. */
  origins: string[];
};

const env = {
  ga4: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  gam: process.env.NEXT_PUBLIC_GAM_NETWORK_CODE ?? "",
  adsense: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  comscore: process.env.NEXT_PUBLIC_COMSCORE_ID ?? "",
} as const;

/** Rejects placeholder values so a copied example never ships as live config. */
function clean(value: string, pattern: RegExp): string | null {
  const v = value.trim();
  if (!v || v.startsWith("<") || /^(xxx|todo|your|placeholder)/i.test(v)) return null;
  return pattern.test(v) ? v : null;
}

export const providers: Provider[] = [
  {
    id: "ga4",
    label: "Google Analytics 4",
    requires: "analytics",
    account: clean(env.ga4, /^G-[A-Z0-9]{6,}$/i),
    origins: ["https://www.googletagmanager.com", "https://www.google-analytics.com"],
  },
  {
    id: "gam",
    label: "Google Ad Manager",
    requires: "advertising",
    account: clean(env.gam, /^\d{4,}$/),
    origins: [
      "https://securepubads.g.doubleclick.net",
      "https://pagead2.googlesyndication.com",
      "https://tpc.googlesyndication.com",
    ],
  },
  {
    id: "adsense",
    label: "Google AdSense",
    requires: "advertising",
    account: clean(env.adsense, /^ca-pub-\d{10,}$/),
    origins: [
      "https://pagead2.googlesyndication.com",
      "https://googleads.g.doubleclick.net",
      "https://tpc.googlesyndication.com",
    ],
  },
  {
    id: "comscore",
    label: "Comscore",
    requires: "advertising",
    account: clean(env.comscore, /^\d{6,}$/),
    origins: ["https://sb.scorecardresearch.com", "https://sb.voicefive.com"],
  },
];

export function configuredProviders(): Provider[] {
  return providers.filter((p) => p.account !== null);
}

export function getProvider(id: ProviderId): Provider | undefined {
  return providers.find((p) => p.id === id && p.account !== null);
}

/** True when any advertising provider is configured — gates the consent copy. */
export function hasAdvertising(): boolean {
  return configuredProviders().some((p) => p.requires === "advertising");
}

/**
 * Origins that must be allowed in the CSP for the configured providers.
 * Only configured providers widen the policy — an unset provider never
 * loosens security, which is the point of deriving this rather than
 * hard-coding a permissive allowlist.
 */
export function requiredOrigins(): string[] {
  return [...new Set(configuredProviders().flatMap((p) => p.origins))].sort();
}
