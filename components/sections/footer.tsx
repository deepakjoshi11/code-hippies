import Image from "next/image";
import { Github, Mail } from "lucide-react";
import { site } from "@/content/site";

const columns = [
  {
    heading: "Studio",
    links: [
      { label: "Work", href: "#work" },
      { label: "Services", href: "#services" },
      { label: "Process", href: "#process" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "GitHub — Code Hippies", href: site.github },
      { label: "GitHub — Deepak Joshi", href: site.githubPersonal },
      { label: "Email", href: `mailto:${site.email}` },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-ink-800/80 bg-ink-950">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg text-cream-100">{site.name}</span>
                <span className="mt-1 font-mono text-[10px] tracking-[0.18em] text-brass-500/90 uppercase">
                  {site.tagline}
                </span>
              </span>
            </div>
            <p className="text-balance-pretty mt-5 max-w-sm text-sm leading-relaxed text-cream-300/75">
              A small studio building fast, accessible, editorial-grade websites for
              brands in Europe and India. Led by {site.founder}.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {site.bases.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-ink-700/70 bg-ink-900/70 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-cream-300/70 uppercase"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-mono text-[11px] tracking-[0.2em] text-brass-500 uppercase">
                {col.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm text-cream-300/80 transition-colors duration-300 hover:text-brass-400"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="hairline my-10 h-px w-full" />

        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="text-xs text-cream-300/55">
            © {new Date().getFullYear()} {site.name}. Built in Next.js — because it would
            be embarrassing not to.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="uv-ghost rounded-full p-2.5"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label="Email"
              className="uv-ghost rounded-full p-2.5"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
