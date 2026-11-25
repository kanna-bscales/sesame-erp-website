"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Search, Zap, Sparkles, HeadphonesIcon, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { about } from "@/content/about";
import { site } from "@/lib/site";

const approachIcons = [Search, Zap, Sparkles, HeadphonesIcon];

const stats = [
  { value: "Weeks", label: "Not months to deliver" },
  { value: "100%", label: "Custom-built systems" },
  { value: "5", label: "AI agents built in" },
  { value: "Direct", label: "Support from our team" },
];

export function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const graphicY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <>
      {/* Hero with decorative graphic */}
      <section ref={heroRef} className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-28">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(229,9,20,0.2) 0%, rgba(229,9,20,0.05) 50%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(255,216,77,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="page-container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div style={{ y: heroY }} className="lg:col-span-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-ballpoint-ink">
                About {site.name}
              </p>
              <h1 className="heading-section mt-4">{about.heading}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{about.intro}</p>
              <div className="mt-8">
                <ButtonLink href={site.consultationHref} className="h-13 px-7">
                  Get a free consultation <ArrowRight aria-hidden className="size-4" />
                </ButtonLink>
              </div>
            </motion.div>

            {/* Decorative ERP interface mockup */}
            <motion.div style={{ y: graphicY }} className="lg:col-span-6" aria-hidden>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Carbon shadow layer */}
                <div className="absolute top-4 left-4 h-full w-full rounded-xl bg-carbon/20" />
                {/* Canary shadow layer */}
                <div className="absolute top-2 left-2 h-full w-full rounded-xl bg-canary/10" />
                {/* Main card */}
                <div className="relative rounded-xl border border-rule bg-sheet p-6 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-rule pb-4">
                    <div className="size-3 rounded-full bg-ballpoint" />
                    <div className="size-3 rounded-full bg-canary" />
                    <div className="size-3 rounded-full bg-rule" />
                    <span className="ml-2 text-sm font-semibold text-ink-soft">SesameERP Dashboard</span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-paper p-3">
                      <div className="text-xs text-ink-soft">Sales today</div>
                      <div className="font-semiwide mt-1 text-lg font-extrabold">$24,800</div>
                      <div className="mt-1 text-xs text-ballpoint-ink">+12%</div>
                    </div>
                    <div className="rounded-lg bg-paper p-3">
                      <div className="text-xs text-ink-soft">Orders</div>
                      <div className="font-semiwide mt-1 text-lg font-extrabold">47</div>
                      <div className="mt-1 inline-flex rounded-full bg-canary px-1.5 text-xs font-semibold text-night">3 pending</div>
                    </div>
                    <div className="rounded-lg bg-paper p-3">
                      <div className="text-xs text-ink-soft">AI tasks</div>
                      <div className="font-semiwide mt-1 text-lg font-extrabold">128</div>
                      <div className="mt-1 text-xs text-ink-soft">Today</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: "Quote QT-2044 drafted", agent: "Sales AI", color: "bg-ballpoint" },
                      { label: "Stock alert: MS sheet", agent: "Inventory AI", color: "bg-canary" },
                      { label: "Invoice INV-8815 processed", agent: "Data Entry AI", color: "bg-carbon" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-lg bg-paper px-3 py-2.5">
                        <span className={`size-2 shrink-0 rounded-full ${item.color}`} />
                        <span className="flex-1 text-sm">{item.label}</span>
                        <span className="text-xs text-ink-soft">{item.agent}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="on-ink bg-night text-white">
        <div className="page-container grid grid-cols-2 gap-6 py-14 lg:grid-cols-4 lg:py-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="border-l-2 border-canary pl-5"
            >
              <p className="font-wide text-3xl font-extrabold lg:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-night-soft">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission — with decorative accent */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Decorative dots grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-8 right-8 grid grid-cols-6 gap-4 opacity-[0.08]"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="size-2 rounded-full bg-ink" />
          ))}
        </div>

        <div className="page-container">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="inline-block rounded-full bg-ballpoint/10 px-4 py-1.5 text-sm font-semibold text-ballpoint-ink">
                Our mission
              </span>
              <h2 className="heading-section mt-5">{about.mission.heading}</h2>
            </div>
            <div className="lg:col-span-7">
              <blockquote className="relative border-l-4 border-canary pl-6">
                <p className="text-xl leading-relaxed text-ink-soft">{about.mission.body}</p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* How we work — numbered steps with connectors */}
      <section className="bg-sheet py-20 lg:py-28">
        <div className="page-container">
          <div className="text-center">
            <span className="inline-block rounded-full bg-ballpoint/10 px-4 py-1.5 text-sm font-semibold text-ballpoint-ink">
              Our process
            </span>
            <h2 className="heading-section mt-5">{about.approach.heading}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              From first call to live system — every step is designed for speed and clarity.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {about.approach.items.map((item, index) => {
              const Icon = approachIcons[index];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative rounded-xl border border-rule bg-paper p-7 transition-all hover:border-ballpoint/30 hover:shadow-lg lg:p-8"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-ballpoint text-on-ballpoint font-semiwide text-lg font-extrabold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semiwide text-xl font-extrabold">{item.title}</h3>
                      <p className="mt-3 leading-relaxed text-ink-soft">{item.body}</p>
                    </div>
                  </div>
                  <Icon
                    aria-hidden
                    className="absolute top-7 right-7 size-5 text-rule transition-colors group-hover:text-ballpoint-ink"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="on-ink bg-night text-white py-20 lg:py-28">
        <div className="page-container">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="heading-section">What we believe in</h2>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-6">
                {[
                  {
                    title: "Transparency over jargon",
                    body: "We explain what we're building, why, and how long it will take. No black boxes, no vague timelines.",
                  },
                  {
                    title: "Speed without shortcuts",
                    body: "Fast delivery doesn't mean cutting corners. We move quickly because our process is focused, not because we skip steps.",
                  },
                  {
                    title: "Your system, your way",
                    body: "Every business runs differently. We build around your workflows, not the other way around.",
                  },
                ].map((value, index) => (
                  <motion.li
                    key={value.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-night-rule pb-6 last:border-b-0"
                  >
                    <h3 className="font-semiwide text-xl font-extrabold">{value.title}</h3>
                    <p className="mt-2 text-night-soft">{value.body}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="on-canary bg-canary text-night py-24 lg:py-32">
        <div className="page-container text-center">
          <h2 className="font-wide mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95] font-extrabold text-balance">
            {about.cta.heading}
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed">{about.cta.body}</p>
          <div className="mt-10">
            <ButtonLink href={site.consultationHref} magnetic className="h-16 px-9 text-lg">
              {about.cta.button}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
