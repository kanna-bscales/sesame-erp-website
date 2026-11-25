import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { site } from "@/lib/site";

const title = `About | ${site.name}`;
const description =
  "SesameERP builds custom ERP systems with AI agents built in. Learn about our team, our approach, and why we exist.";

// og:/twitter tags set here too, otherwise the page inherits the homepage's og:url and title.
export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title,
  description,
  openGraph: { title, description, url: "/about", siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
};

export default function AboutPage() {
  return (
    <main id="main">
      <About />
    </main>
  );
}
