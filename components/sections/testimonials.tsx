import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/content/site";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          align="center"
          eyebrow="In their words"
          title="What clients say when the invoice is already paid."
        />
      </div>
      <div className="mt-14">
        <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
      </div>
    </section>
  );
}
