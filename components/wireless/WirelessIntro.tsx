import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { wirelessErp } from "@/content/wireless-erp";

export function WirelessIntro() {
  return (
    <section aria-labelledby="wireless-intro-heading" className="border-y border-rule bg-sheet">
      <div className="page-container grid gap-10 py-24 lg:grid-cols-12 lg:gap-12 lg:py-36">
        <h2
          id="wireless-intro-heading"
          className="heading-section text-[clamp(2rem,3.4vw,3.4rem)] lg:col-span-6"
        >
          {wirelessErp.headline}
        </h2>
        <ScrollRevealText
          text={wirelessErp.body}
          className="font-semiwide text-2xl leading-snug font-bold sm:text-[2rem] lg:col-span-6 lg:self-end"
        />
      </div>
    </section>
  );
}
