import { ButtonLink } from "@/components/ui/ButtonLink";
import { hero } from "@/content/home";
import { site } from "@/lib/site";
import { HeroHeadline } from "./hero/HeroHeadline";
import { QuotationStack } from "./hero/QuotationStack";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pb-28">
      <div className="page-container">
        <HeroHeadline eyebrow={hero.eyebrow} lines={hero.headline} second={hero.headlineSecond} />

        <div className="mt-10 grid items-start gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[34rem] text-lg leading-relaxed text-ink-soft sm:text-xl sm:leading-relaxed">
              {hero.subheadline}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink href={site.consultationHref} magnetic>
                {hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="#process" variant="secondary">
                {hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            <QuotationStack />
          </div>
        </div>
      </div>
    </section>
  );
}
