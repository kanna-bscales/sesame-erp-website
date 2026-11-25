import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { contact } from "@/content/contact";
import { site } from "@/lib/site";

const title = `Contact | ${site.name}`;

// og:/twitter tags set here too, otherwise the page inherits the homepage's og:url and title.
export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title,
  description: contact.intro,
  openGraph: { title, description: contact.intro, url: "/contact", siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description: contact.intro },
};

export default function ContactPage() {
  const { details } = contact;

  return (
    <main id="main">
      <section id="top" className="page-container pt-28 pb-24 sm:pt-32 lg:pb-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-rule bg-sheet px-4 py-1.5 text-sm font-medium">
              {contact.eyebrow}
            </p>
            <h1 className="heading-section mt-6 max-w-[16ch]">{contact.heading}</h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft">{contact.intro}</p>

            <h2 className="font-semiwide mt-12 text-lg font-extrabold">{details.heading}</h2>
            <dl className="mt-4 space-y-4">
              <div className="border-t border-rule pt-4">
                <dt className="text-sm text-ink-soft">{details.emailLabel}</dt>
                <dd className="mt-1 font-semibold">
                  <a href={`mailto:${site.email}`} className="transition-colors hover:text-ballpoint-ink">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="border-t border-rule pt-4">
                <dt className="text-sm text-ink-soft">{details.responseLabel}</dt>
                <dd className="mt-1 font-semibold">{details.responseValue}</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
