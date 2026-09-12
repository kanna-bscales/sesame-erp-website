import { ButtonLink } from "@/components/ui/ButtonLink";
import { finalCta } from "@/content/home";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="consultation" aria-labelledby="cta-heading" className="on-canary bg-canary text-night">
      <div className="page-container py-24 lg:py-40">
        <h2
          id="cta-heading"
          className="font-wide max-w-5xl text-[clamp(2.8rem,7vw,7rem)] leading-[0.95] font-extrabold text-balance"
        >
          {finalCta.headline}
        </h2>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-12">
          <p className="max-w-xl text-xl leading-relaxed lg:col-span-7">{finalCta.subtext}</p>
          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <ButtonLink href={site.consultationHref} magnetic className="h-16 px-9 text-lg">
              {finalCta.cta}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
