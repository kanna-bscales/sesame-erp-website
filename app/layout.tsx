import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Providers } from "@/components/providers/Providers";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { site } from "@/lib/site";

// Organization + WebSite structured data on every page (SEO update, Nov 17, 2026). Only verified
// facts: brand, parent company and contact email (owner decisions, Nov 11, 2026). No social
// profiles yet: the links in lib/site.ts are placeholders, so `sameAs` is left out.
const siteUrl = "https://www.sesameerp.ai";
const organizationJsonLd = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: siteUrl,
    logo: `${siteUrl}/images/brand/sesameerp-logo.png`,
    email: site.email,
    description: site.description,
    parentOrganization: { "@type": "Organization", name: "Business Scales LLC", url: "https://businessscales.com/" },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.name,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#organization` },
  },
]).replace(/</g, "\\u003c");

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} | Custom ERP systems with AI agents built in`,
  description: site.description,
  openGraph: {
    title: `${site.name} | Custom ERP systems with AI agents built in`,
    description: site.description,
    url: "https://www.sesameerp.ai",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Custom ERP systems with AI agents built in`,
    description: site.description,
  },
  // www is the production host (the apex redirects to it).
  metadataBase: new URL("https://www.sesameerp.ai"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${archivo.variable} ${plex.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        {/* Google Tag Manager (container GTM-MCVM8CCQ), as supplied by the owner. */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-MCVM8CCQ" />
        <script
          id="gtag-init"
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());",
          }}
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJsonLd }} />
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
