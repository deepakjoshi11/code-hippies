import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { site } from "@/content/site";

const principles = [
  {
    title: "Speed is a design decision",
    body: "A page that takes four seconds has already lost the argument. I set a performance budget before the first component and hold the build to it.",
  },
  {
    title: "Accessibility is not a phase",
    body: "Semantic structure, keyboard paths and contrast are decided while the layout is drawn — not retrofitted the week before launch.",
  },
  {
    title: "You keep everything",
    body: "Your repository, your hosting account, your CMS. I am a supplier you can replace, and building it that way keeps me honest.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          <BlurFade>
            <div className="relative overflow-hidden rounded-2xl border border-ink-700/70">
              <Image
                src="/studio.webp"
                alt={`${site.founder} at the ${site.name} studio desk`}
                width={1200}
                height={674}
                sizes="(max-width: 1024px) 100vw, 560px"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
              <BorderBeam duration={16} size={200} />
              <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-xl text-cream-100">{site.founder}</p>
                  <p className="mt-0.5 font-mono text-[10px] tracking-[0.16em] text-brass-400 uppercase">
                    {site.role}
                  </p>
                </div>
                <Image
                  src="/logo.png"
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 shrink-0 rounded-full object-cover opacity-90"
                />
              </div>
            </div>
          </BlurFade>

          <div>
            <SectionHeading
              eyebrow="Who you are hiring"
              title={<>One engineer, accountable<br className="hidden sm:block" /> for the whole thing.</>}
              lead="I started on Android and web fundamentals, spent years on the unglamorous parts of the platform, and now build marketing sites for companies whose reputation arrives before their sales team does."
            />

            <div className="mt-10 space-y-7">
              {principles.map((p, i) => (
                <BlurFade key={p.title} delay={0.1 + i * 0.07}>
                  <div className="border-l border-ink-700 pl-6 transition-colors duration-500 hover:border-brass-600/60">
                    <h3 className="font-display text-lg text-cream-100 md:text-xl">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream-300">{p.body}</p>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
