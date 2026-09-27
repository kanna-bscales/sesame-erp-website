import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `About | ${site.name}`,
  description:
    "Sesame Labs builds custom ERP systems with AI agents built in. Learn about our team, our approach, and why we exist.",
};

export default function AboutPage() {
  return (
    <main id="main">
      <About />
    </main>
  );
}
