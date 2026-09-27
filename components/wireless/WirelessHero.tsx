import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LetterTitle } from "@/components/ui/LetterTitle";
import { wirelessErp } from "@/content/wireless-erp";
import { site } from "@/lib/site";
import { DeviceBoxLabel } from "./DeviceBoxLabel";

export function WirelessHero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pb-28">
      <div className="page-container grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>Solutions</li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="font-medium text-ink">
                {wirelessErp.title}
              </li>
            </ol>
          </nav>

          <LetterTitle
            text={wirelessErp.title}
            className="font-wide mt-6 text-[clamp(3.4rem,7.4vw,7.5rem)] leading-[0.9] font-extrabold"
          />

          <p className="mt-8 max-w-[34rem] text-xl leading-relaxed text-ink-soft">{wirelessErp.summary}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href={site.consultationHref} magnetic>
              Get a free consultation
            </ButtonLink>
            <ButtonLink href="#features" variant="secondary">
              See the features
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-6">
          <DeviceBoxLabel />
        </div>
      </div>
    </section>
  );
}
