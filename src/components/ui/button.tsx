import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * A long label with `whitespace-nowrap` is wider than a 360px viewport and
 * pushes the entire page into horizontal scroll — caught on /enterprise by the
 * responsive audit. Wrapping is allowed and centred instead: a two-line button
 * is a cosmetic compromise, a horizontally scrolling page is a broken layout.
 * Fixed heights become minimums so a wrapped label keeps its vertical padding.
 */
const buttonVariants = cva(
  "inline-flex max-w-full items-center justify-center gap-2 text-balance rounded-full text-center font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-500 text-ink-950 hover:bg-brand-400 active:bg-brand-600 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
        secondary:
          "bg-ink-100/10 text-ink-50 hover:bg-ink-100/16 border border-ink-100/12",
        outline:
          "border border-ink-100/20 text-ink-50 hover:bg-ink-100/8 hover:border-ink-100/32",
        ghost: "text-ink-300 hover:text-ink-50 hover:bg-ink-100/8",
      },
      size: {
        sm: "min-h-9 px-4 py-2 text-sm [&_svg]:size-4",
        md: "min-h-11 px-6 py-2.5 text-[0.95rem] [&_svg]:size-4",
        lg: "min-h-13 px-6 py-3 text-base [&_svg]:size-5 sm:px-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & { className?: string };

export function Button({
  className,
  variant,
  size,
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function ButtonLink({
  className,
  variant,
  size,
  href,
  external,
  ...props
}: BaseProps &
  Omit<React.ComponentProps<typeof Link>, "href"> & { href: string; external?: boolean }) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (external) {
    return (
      <a
        className={classes}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }
  return <Link className={classes} href={href} {...props} />;
}

export { buttonVariants };
