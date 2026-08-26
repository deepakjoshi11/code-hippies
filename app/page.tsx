import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { StackStrip } from "@/components/sections/stack-strip";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { About } from "@/components/sections/about";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { faqs, site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://codehippies.com/#studio",
      name: site.name,
      description:
        "A small web engineering studio building fast, accessible, editorial-grade websites in Astro and Next.js for clients in Europe and India.",
      founder: { "@type": "Person", name: site.founder, jobTitle: site.role },
      email: site.email,
      areaServed: [{ "@type": "Place", name: "Europe" }, { "@type": "Place", name: "India" }],
      priceRange: "€€",
      sameAs: [site.github, site.githubPersonal],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="main">
        <Hero />
        <StackStrip />
        <Services />
        <Work />
        <About />
        <Process />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
