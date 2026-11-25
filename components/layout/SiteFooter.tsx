import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { navLinks, showSolutions, site, solutions } from "@/lib/site";
import { FooterAttribution, FooterCampaignLinks, FooterContactColumn, FooterTagline } from "./FooterCampaignText";
import { SectionLink } from "./SectionLink";

export function SiteFooter() {
  return (
    <footer className="on-ink bg-night text-white">
      <div className="page-container grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-night-soft">
            <FooterTagline>Custom ERP systems with AI agents built in, delivered in a few weeks.</FooterTagline>
          </p>
        </div>

        {showSolutions && (
          <nav aria-label="Solutions" className="md:col-span-2">
            <h2 className="text-sm font-semibold">Solutions</h2>
            <ul className="mt-4 space-y-2 text-night-soft">
              {solutions.map((solution) => (
                <li key={solution.href}>
                  <Link href={solution.href} className="transition-colors hover:text-white">
                    {solution.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2 text-night-soft">
            {navLinks.map((link) => (
              <li key={link.hash}>
                <SectionLink hash={link.hash} className="transition-colors hover:text-white">
                  {link.label}
                </SectionLink>
              </li>
            ))}
            <li>
              <Link href="/plma-2026" className="transition-colors hover:text-white">
                PLMA 2026 guide
              </Link>
            </li>
            <li>
              <Link href="/chicago-event" className="transition-colors hover:text-white">
                PLMA 2026 ERP offer
              </Link>
            </li>
            <li>
              <Link href="/blog" className="transition-colors hover:text-white">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <FooterContactColumn email={site.email} />

        {site.social.some((s) => s.href !== "#") && (
          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold">Follow us</h2>
            <ul className="mt-4 space-y-2 text-night-soft">
              {site.social
                .filter((item) => item.href !== "#")
                .map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="transition-colors hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-night-rule">
        <div className="page-container flex flex-col gap-2 py-6 text-sm text-night-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.copyrightYear} {site.name}. All rights reserved.
          </p>
          <FooterAttribution />
          <FooterCampaignLinks />
          <a href="#top" className="transition-colors hover:text-white">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
