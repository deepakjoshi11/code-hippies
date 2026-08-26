"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg text-cream-100">{site.name}</span>
            <span className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-brass-500/90 uppercase">
              {site.tagline}
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative py-2 text-sm text-cream-300 transition-colors duration-300 hover:text-cream-100 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brass-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="uv-brass hidden rounded-full px-5 py-2.5 text-sm font-medium md:inline-flex"
          >
            Start a project
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="uv-ghost rounded-full p-2.5 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-ink-700/60 bg-ink-950/97 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col px-5 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-ink-800 py-4 text-base text-cream-200"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-5">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="uv-brass block rounded-full px-6 py-3.5 text-center text-sm font-medium"
              >
                Start a project
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
