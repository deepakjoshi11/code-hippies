import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { CaseStudy } from "@/data/case-studies";
import { Card, CardBody } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { InlineCode } from "@/components/ui/inline-code";

export function CaseStudyCard({
  study,
  index = 0,
  headingLevel = "h3",
}: {
  study: CaseStudy;
  index?: number;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <Reveal as="li" delay={index * 0.05} className="h-full">
      <Card className="group h-full overflow-hidden">
        <div
          aria-hidden="true"
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${study.accentFrom}, ${study.accentTo})` }}
        />
        <CardBody className="flex h-full flex-col gap-4">
          <div className="flex items-center justify-between gap-3 text-xs text-ink-500">
            <span className="rounded-full border border-ink-100/12 px-2.5 py-1">{study.category}</span>
            <span className="font-mono">{study.year}</span>
          </div>

          <Heading className="text-xl font-semibold tracking-tight text-ink-50">
            <Link href={`/work/${study.slug}`} className="after:absolute after:inset-0">
              {study.name}
            </Link>
          </Heading>

          <div className="flex flex-col gap-3 text-sm leading-relaxed">
            <p className="text-ink-300">
              <span className="mr-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-brand-400">
                Engineering
              </span>
              <InlineCode text={study.engineering} />
            </p>
            <p className="text-ink-200">
              <span className="mr-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-accent-400">
                In plain terms
              </span>
              {study.layman}
            </p>
          </div>

          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {study.stack.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="rounded-md bg-ink-100/8 px-2 py-1 font-mono text-[0.7rem] text-ink-300"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-3 border-t border-ink-100/10 pt-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-400">
              Read the case study
              <ArrowUpRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
            <a
              href={study.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 font-mono text-xs text-ink-500 transition-colors hover:text-ink-100"
            >
              {study.displayUrl}
              <ExternalLink className="size-3.5" aria-hidden="true" />
              <span className="sr-only">(opens the live site in a new tab)</span>
            </a>
          </div>
        </CardBody>
      </Card>
    </Reveal>
  );
}

