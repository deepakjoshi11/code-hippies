export const primaryNav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Partner", href: "/partner" },
  { label: "Pricing", href: "/pricing" },
  { label: "Learn", href: "/learn" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
] as const;

/** Secondary links — footer and mobile menu only, to keep the header short. */
export const secondaryNav = [
  { label: "How projects run", href: "/process" },
  { label: "Ways to hire", href: "/hire" },
  { label: "Contact", href: "/contact" },
] as const;
