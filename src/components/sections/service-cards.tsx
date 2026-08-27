import Link from "next/link";
import { ArrowUpRight, Brain, Code2, Gauge, Shield, Smartphone } from "lucide-react";
import { services } from "@/data/services";
import { Card, CardBody } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

const icons = {
  code: Code2,
  smartphone: Smartphone,
  brain: Brain,
  gauge: Gauge,
  shield: Shield,
} as const;

export function ServiceCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => {
        const Icon = icons[service.icon];
        return (
          <Reveal as="li" key={service.slug} delay={i * 0.06} className="min-w-0">
            <Card className="group h-full">
              <CardBody className="flex h-full flex-col gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand-400/20 bg-brand-500/10 text-brand-400">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <Heading className="text-lg font-semibold tracking-tight text-ink-50">
                  <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0">
                    {service.name}
                  </Link>
                </Heading>
                <p className="flex-1 text-sm leading-relaxed text-ink-300">{service.summary}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-400">
                  Explore this service
                  <ArrowUpRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </CardBody>
            </Card>
          </Reveal>
        );
      })}
    </ul>
  );
}
