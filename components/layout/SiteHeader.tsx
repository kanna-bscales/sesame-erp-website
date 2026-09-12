"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navLinks, services, site } from "@/lib/site";
import { SectionLink } from "./SectionLink";
import { ServicesMenu } from "./ServicesMenu";

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  const solid = scrolled || menuOpen;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        solid ? "bg-paper/90 shadow-[0_1px_0_var(--color-rule)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:rounded-md focus:bg-sheet focus:px-4 focus:py-2 focus:font-medium"
      >
        Skip to content
      </a>

      <div className="page-container flex h-18 items-center justify-between gap-6">
        {pathname === "/" ? (
          <a href="#top" aria-label={`${site.name} home`} className="rounded-md">
            <Logo />
          </a>
        ) : (
          <Link href="/" aria-label={`${site.name} home`} className="rounded-md">
            <Logo />
          </Link>
        )}

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-[0.95rem] font-medium">
            <li>
              <ServicesMenu />
            </li>
            {navLinks.map((link) => (
              <li key={link.hash}>
                <SectionLink hash={link.hash} className="text-ink-soft transition-colors hover:text-ink">
                  {link.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden lg:block">
            <ButtonLink href={site.consultationHref} className="h-11 px-5 text-[0.95rem]">
              Schedule a consultation
            </ButtonLink>
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-ballpoint"
        style={{ scaleX: scrollYProgress }}
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-rule bg-paper lg:hidden"
          >
            <div className="page-container py-4">
              <p className="pt-1 text-sm font-medium text-ink-soft">Services</p>
              <ul>
                {services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      onClick={closeMenu}
                      aria-current={pathname === service.href ? "page" : undefined}
                      className="block py-3 text-lg font-medium"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-2 border-t border-rule pt-2">
                {navLinks.map((link) => (
                  <li key={link.hash}>
                    <SectionLink hash={link.hash} onClick={closeMenu} className="block py-3 text-lg font-medium">
                      {link.label}
                    </SectionLink>
                  </li>
                ))}
              </ul>
              <div className="pt-4 pb-2">
                <ButtonLink href={site.consultationHref} block onClick={closeMenu}>
                  Schedule a consultation
                </ButtonLink>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
