/**
 * Brand assets.
 *
 * Everything here has a working placeholder so the site is deployable today,
 * and every placeholder is replaced by dropping a file into /public with the
 * expected name — no code change, no rebuild of any component.
 *
 *   public/logo.svg          Primary wordmark/monogram (any aspect ratio)
 *   public/logo-mark.svg     Square mark, used where space is tight
 *   public/icon.svg          Favicon source (square, works at 16px)
 *   public/apple-icon.png    180x180 PNG for iOS home screen
 *   public/og-image.png      1200x630 social share fallback
 *   public/portrait.jpg      Photograph of Deepak, for /about
 *
 * `hasAsset` cannot check the filesystem from a client component, so instead
 * each asset is declared here with a flag. Flip the flag when you add the file.
 * The flags default to the generated placeholders, which are real, valid
 * assets — not broken images.
 */

export const brandAssets = {
  /**
   * The real marks are committed, so these default ON and the env vars exist
   * only to force the generated placeholders back (set to "false").
   *
   * Two distinct marks, deliberately:
   *   logo / logoMark  Deepak Joshi portrait — the site logo, in header and
   *                    footer. Its alt text is where the founder's name is
   *                    indexed now that it is out of the header wordmark.
   *   icon / ogImage   Code Hippies monkey mark — favicon and social cards,
   *                    where the studio brand is what should be recognised.
   *
   * Both are circular PNGs with transparent corners, so neither carries a
   * black square into a light theme.
   */
  hasCustomLogo: process.env.NEXT_PUBLIC_HAS_CUSTOM_LOGO !== "false",
  hasPortrait: process.env.NEXT_PUBLIC_HAS_PORTRAIT === "true",
  hasOgImage: process.env.NEXT_PUBLIC_HAS_OG_IMAGE !== "false",

  logo: "/logo.png",
  logoMark: "/logo-mark.png",
  icon: "/icon.png",
  appleIcon: "/apple-icon.png",
  ogImage: "/og-image.png",
  portrait: "/portrait.jpg",
} as const;

/** Brand colours, kept in one place so the logo gradient and UI cannot drift. */
export const brandColors = {
  from: "#34d399",
  to: "#f97316",
  ink: "#0b0d12",
} as const;

export const brandMark = {
  /** Two characters shown in the generated monogram. */
  initials: "ch",
  /**
   * Screen-reader and SEO name for the site logo. The header wordmark reads
   * "Code Hippies" alone, so this alt text is what carries "Deepak Joshi"
   * into the indexable markup — it is describing the portrait, so it is
   * accurate as alt text rather than keyword stuffing.
   */
  alt: "Deepak Joshi — founder of Code Hippies",
} as const;
