import { ArrowUpRight } from "lucide-react";
import { dharmarthlabs, dharmarthlabsHref, partnerRoutes, stayHereInstead } from "@/data/partnership";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Dharmarthlabs escalation.
 *
 * Outbound links carry UTM parameters so the CMS on dharmarthlabs.com can
 * attribute the referral back to this site — see src/app/api/cms.
 */
export function PartnerSection({ compact = false }: { compact?: boolean }) {
  const routes = compact ? partnerRoutes.filter((r) => r.featured) : partnerRoutes;

  return (
    <div className="flex flex-col gap-8">
      <ul className={cn("grid gap-4", compact ? "md:grid-cols-2" : "md:grid-cols-2")}>
        {routes.map((route, i) => (
          <Reveal as="li" key={route.id} delay={i * 0.06} className="min-w-0">
            <Card className={cn("h-full", route.featured ? "border-brand-400/25" : undefined)}>
              <CardBody className="flex h-full flex-col gap-4">
                <Eyebrow>{route.audience}</Eyebrow>
                <h3 className="text-xl font-semibold tracking-tight text-ink-50">{route.title}</h3>
                <p className="text-sm leading-relaxed text-ink-300">{route.body}</p>

                <ul className="flex flex-col gap-2.5">
                  {route.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-sm leading-relaxed text-ink-200">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand-400" />
                      {o}
                    </li>
                  ))}
                </ul>

                <a
                  href={dharmarthlabsHref(route.ctaPath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-partner-route={route.id}
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
                >
                  {route.ctaLabel}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </ul>

      {compact ? null : (
        <div className="rounded-card border border-ink-100/10 bg-ink-900/40 p-6 md:p-7">
          <h3 className="text-base font-semibold text-ink-50">
            When the honest answer is &ldquo;stay here&rdquo;
          </h3>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-ink-300">
            A referral that is wrong for you costs more trust than it earns, so here is when routing
            you to {dharmarthlabs.name} would be the wrong move and you should just work with me
            directly:
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {stayHereInstead.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-300">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
