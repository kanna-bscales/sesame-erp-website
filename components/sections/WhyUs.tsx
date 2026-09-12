import { whyUs } from "@/content/home";
import { FlipHeading } from "./why-us/FlipHeading";

export function WhyUs() {
  return (
    <section aria-labelledby="why-heading" className="page-container py-24 lg:py-36">
      <FlipHeading id="why-heading" lead={whyUs.headingLead} flip={whyUs.headingFlip} />

      <ul className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
        {whyUs.items.map((item) => (
          <li key={item.title} className="border-t-2 border-ink pt-6">
            <h3 className="font-semiwide text-2xl font-extrabold">{item.title}</h3>
            <p className="mt-4 text-ink-soft">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
