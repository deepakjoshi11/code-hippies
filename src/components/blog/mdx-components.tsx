import type { MDXComponents } from "mdx/types";

/**
 * MDX element overrides.
 *
 * Code blocks scroll horizontally, which makes them a scrollable region — and
 * a scrollable region that cannot be focused is unreachable by keyboard
 * (WCAG 2.1.1). Giving every <pre> a tabindex and an accessible name fixes
 * that without changing how it looks.
 */
export const mdxComponents: MDXComponents = {
  pre: ({ children, ...props }) => (
    <pre tabIndex={0} role="region" aria-label="Code sample" {...props}>
      {children}
    </pre>
  ),
};
