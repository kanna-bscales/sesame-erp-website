"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { agents } from "@/content/home";
import { AgentDemo } from "./agents/AgentDemos";

const CYCLE_MS = 8000;

export function Agents() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(sectionRef, { amount: 0.35 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start 0.1"] });
  const inset = useTransform(scrollYProgress, [0, 1], [5, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [56, 0]);
  const clipPath = useMotionTemplate`inset(0% ${inset}% round ${radius}px)`;

  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const running = autoplay && !hovering && inView && !reduceMotion;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % agents.items.length), CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [active, running]);

  const select = (index: number) => {
    setActive(index);
    setAutoplay(false);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = agents.items.length;
    const keys: Record<string, number> = {
      ArrowDown: (index + 1) % count,
      ArrowRight: (index + 1) % count,
      ArrowUp: (index - 1 + count) % count,
      ArrowLeft: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
    document.getElementById(`agent-tab-${agents.items[next].id}`)?.focus();
  };

  const current = agents.items[active];

  return (
    <section ref={sectionRef} id="agents" aria-labelledby="agents-heading" className="relative">
      <motion.div
        style={{ clipPath }}
        className="on-ink bg-night text-white motion-reduce:[clip-path:none]! dark:border-y dark:border-white/10"
      >
        <div className="page-container py-24 lg:py-36">
          <div className="grid gap-8 lg:grid-cols-12">
            <h2 id="agents-heading" className="heading-section lg:col-span-7">
              {agents.heading}
            </h2>
            <p className="max-w-md self-end text-lg text-night-soft lg:col-span-4 lg:col-start-9">
              {agents.intro}
            </p>
          </div>

          <div
            className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10"
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
          >
            <div role="tablist" aria-label="AI agents" aria-orientation="vertical" className="lg:col-span-5">
              {agents.items.map((agent, index) => {
                const selected = index === active;
                return (
                  <button
                    key={agent.id}
                    id={`agent-tab-${agent.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="agent-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={`relative block w-full border-t border-night-rule py-5 text-left transition-colors ${
                      selected ? "text-white" : "text-night-soft hover:text-white"
                    }`}
                  >
                    <span className="font-semiwide block text-xl font-extrabold sm:text-2xl">{agent.name}</span>
                    <AnimatePresence initial={false}>
                      {selected && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="block overflow-hidden"
                        >
                          <span className="block max-w-[44ch] pt-2 text-night-soft">{agent.body}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {selected && running && (
                      <span
                        key={active}
                        aria-hidden
                        className="tab-progress absolute -top-px left-0 h-0.5 bg-canary"
                        style={{ animationDuration: `${CYCLE_MS}ms` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div
              id="agent-panel"
              role="tabpanel"
              aria-labelledby={`agent-tab-${current.id}`}
              className="lg:col-span-7"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AgentDemo id={current.id} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
