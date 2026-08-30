"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { primaryNav, secondaryNav } from "@/lib/nav";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation. Derived during render rather than in
  // an effect, so it does not cause a second render pass.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /**
   * The home hero is the only dark band on the site, and the header floats over
   * it while the page is at the top. Borrowing the hero's palette for those few
   * hundred pixels keeps the nav readable without a second set of classes:
   * `surface-dark` flips the ink ramp for this subtree only. Once scrolled, the
   * header has its own light glass background and reverts to the page palette.
   */
  const overDarkHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors duration-300",
        scrolled || open
          ? "border-ink-100/10 bg-ink-950/85 backdrop-blur-xl"
          : "border-transparent bg-transparent",
        overDarkHero && "surface-dark",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-18">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight text-ink-50"
        >
          <Logo size={32} className="size-8" priority />
          <span>Code Hippies</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors",
                  active ? "text-ink-50" : "text-ink-300 hover:text-ink-50",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Start a project
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full border border-ink-100/15 text-ink-100 lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-100/10 bg-ink-950/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
          {[...primaryNav, ...secondaryNav].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-3 text-base text-ink-200 hover:bg-ink-100/8 hover:text-ink-50"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/contact" size="md" className="mt-3">
            Start a project
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
