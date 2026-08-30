import { ExternalLink } from "lucide-react";
import { testimonials } from "@/data/proof";
import { liveCaseStudies } from "@/data/case-studies";
import { Card, CardBody } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { InlineCode } from "@/components/ui/inline-code";

/**
 * Social proof.
 *
 * When there are no published testimonials, this renders verifiable
 * engineering evidence instead of inventing quotes: live URLs and the exact
 * signals observed on each one.
 */
export function ProofSection() {
  if (testimonials.length > 0) {
    return (
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal as="li" key={t.author + t.company} delay={i * 0.06}>
            <Card className="h-full">
              <CardBody className="flex h-full flex-col gap-5">
                <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-ink-200">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <footer className="border-t border-ink-100/10 pt-4 text-sm">
                  <p className="font-medium text-ink-50">{t.author}</p>
                  <p className="text-ink-500">
                    {t.role}, {t.company}
                  </p>
                </footer>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </ul>
    );
  }

  // Only reachable sites belong here: the entire point is that the reader can
  // open one and check the claim.
  const evidence = liveCaseStudies().slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-3xl text-[0.95rem] leading-relaxed text-ink-300">
        There are no client quotes on this page yet, and I would rather show you something you can
        check than something you have to take my word for. Every claim below was read directly off
        the live site&rsquo;s response — open any of them and verify it yourself.
      </p>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {evidence.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={i * 0.05} className="min-w-0">
            <Card className="h-full">
              <CardBody className="flex h-full flex-col gap-3 p-5 md:p-5">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-1.5 font-mono text-xs text-brand-400 hover:underline"
                >
                  <span className="truncate">{c.displayUrl}</span>
                  <ExternalLink className="size-3" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <ul className="flex flex-col gap-2">
                  {c.verified.slice(0, 3).map((v) => (
                    <li key={v} className="flex gap-2 text-xs leading-relaxed text-ink-300">
                      <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-400" />
                      <span><InlineCode text={v} /></span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

