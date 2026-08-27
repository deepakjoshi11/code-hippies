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
   * Set to true once you drop your own public/logo.svg in. Until then the
   * generated monogram renders, which is a valid mark rather than a gap.
   */
  hasCustomLogo: process.env.NEXT_PUBLIC_HAS_CUSTOM_LOGO === "true",
  hasPortrait: process.env.NEXT_PUBLIC_HAS_PORTRAIT === "true",
  hasOgImage: process.env.NEXT_PUBLIC_HAS_OG_IMAGE === "true",

  logo: "/logo.svg",
  logoMark: "/logo-mark.svg",
  icon: "/icon.svg",
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
  /** Screen-reader name for the mark wherever it appears. */
  alt: "Code Hippies",
} as const;
