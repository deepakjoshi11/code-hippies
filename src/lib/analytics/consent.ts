/**
 * Consent model.
 *
 * The brief asked to collect as much visitor data as possible while INCREASING
 * trust rather than damaging it. Those two goals conflict unless consent is
 * real, so the resolution here is deliberate and worth reading before changing:
 *
 *  - Nothing that identifies a person is collected before consent. Not IP, not
 *    a persistent identifier, not geolocation.
 *  - Analytics that genuinely need no consent (aggregate page counts with no
 *    identifier and no cross-page linkage) run regardless, because they are
 *    not personal data under GDPR or India's DPDP Act.
 *  - Everything else — session continuity, funnel attribution, channel
 *    attribution, coarse geography — runs ONLY after an explicit opt-in.
 *  - Consent is per-category, revocable at any time, and the banner has a
 *    reject button as prominent as the accept button. A pre-ticked box or a
 *    hidden reject is not consent and would expose the site owner to real
 *    liability.
 *
 * This collects less than a covert setup would. It also cannot generate a
 * regulatory complaint, and it is the version a prospective enterprise client
 * can look at without concern — which is worth more than the extra rows.
 */

export const CONSENT_COOKIE = "ch_consent";
/**
 * Bumping this invalidates every stored consent decision and re-asks. It MUST
 * be bumped whenever a category is added — silently treating an old "yes" as
 * covering a new kind of processing is precisely what consent law forbids.
 */
export const CONSENT_VERSION = 2;

export type ConsentCategory = "essential" | "analytics" | "attribution" | "advertising";

export type ConsentState = {
  version: number;
  /** Always true — the site cannot function without these. */
  essential: true;
  /** Aggregate behaviour, session continuity, funnel drop-off. */
  analytics: boolean;
  /** Referrer, campaign and channel attribution, coarse (country) geography. */
  attribution: boolean;
  /**
   * Third-party advertising and audience measurement (Google Ad Manager,
   * AdSense, Comscore). Separate from analytics on purpose: these send data to
   * companies other than this site, which is a materially different decision
   * and must be consented to separately under GDPR and the DPDP Act.
   */
  advertising: boolean;
  /** ISO timestamp of the decision, so the record is auditable. */
  decidedAt: string;
};

export const DENIED: ConsentState = {
  version: CONSENT_VERSION,
  essential: true,
  analytics: false,
  attribution: false,
  advertising: false,
  decidedAt: "",
};

export function grantAll(): ConsentState {
  return {
    version: CONSENT_VERSION,
    essential: true,
    analytics: true,
    attribution: true,
    advertising: true,
    decidedAt: new Date().toISOString(),
  };
}

export function denyAll(): ConsentState {
  return { ...DENIED, decidedAt: new Date().toISOString() };
}

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      essential: true,
      analytics: Boolean(parsed.analytics),
      attribution: Boolean(parsed.attribution),
      advertising: Boolean(parsed.advertising),
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
    };
  } catch {
    return null;
  }
}

export function serialiseConsent(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state));
}

/**
 * What each category actually permits. Shown verbatim in the banner's detail
 * view — if this list and the code ever disagree, the code is the bug.
 */
export const consentCopy: Record<ConsentCategory, { label: string; body: string; locked?: boolean }> = {
  essential: {
    label: "Essential",
    body:
      "Required for the site to work at all: the security token that protects the contact form from cross-site abuse, and your choice on this banner. No tracking, and it cannot be switched off without breaking the form.",
    locked: true,
  },
  analytics: {
    label: "Understanding what's useful",
    body:
      "Which pages get read, which get abandoned, and where people give up in the contact form. Stored against a random session id that is discarded when you close the tab. No cross-site tracking, no advertising networks, no profile that outlives your visit.",
  },
  attribution: {
    label: "How you found me",
    body:
      "Which link, search or channel brought you here, and your country — never a precise location. It tells me which of my work is actually reaching people. Nothing is sold, and nothing is shared with an ad network.",
  },
  advertising: {
    label: "Advertising and audience measurement",
    body:
      "This is the only category that sends anything to a company other than this site. It allows Google Ad Manager, AdSense and Comscore, which fund the free learning material. Decline and the ad scripts are never loaded at all — not loaded-but-limited, never requested. Every article stays fully readable either way.",
  },
};

/** Bumped whenever a new category is added, so consent is re-asked rather than assumed. */
export const CONSENT_CATEGORIES: ConsentCategory[] = [
  "essential",
  "analytics",
  "attribution",
  "advertising",
];
