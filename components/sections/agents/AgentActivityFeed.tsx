"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  FileText,
  PackageCheck,
  MessageSquare,
  ScanLine,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type FeedEntry = {
  agent: string;
  action: string;
  detail: string;
  icon: LucideIcon;
  color: string;
};

const entries: FeedEntry[] = [
  {
    agent: "Sales Assistant",
    action: "Drafted quotation",
    detail: "QT-2044 for Kaveri Castings — 3 line items, $4,820",
    icon: FileText,
    color: "text-ballpoint-ink",
  },
  {
    agent: "Inventory Forecaster",
    action: "Reorder alert",
    detail: "MS sheet 2 mm will hit reorder point in 4 days — PO drafted",
    icon: PackageCheck,
    color: "text-canary",
  },
  {
    agent: "Customer Support",
    action: "Answered inquiry",
    detail: "Nila Textiles asked about SO-1192 dispatch — replied with tracking",
    icon: MessageSquare,
    color: "text-carbon",
  },
  {
    agent: "Data Entry",
    action: "Processed invoice",
    detail: "INV-8815 from Sri Balaji Steels — matched to PO-0345, 2 items",
    icon: ScanLine,
    color: "text-ballpoint-ink",
  },
  {
    agent: "Report Generator",
    action: "Weekly summary ready",
    detail: "Sales up 8%, 1 item near reorder, all POs on schedule",
    icon: BarChart3,
    color: "text-canary",
  },
  {
    agent: "Sales Assistant",
    action: "Follow-up sent",
    detail: "QT-2039 pending 3 days — reminder drafted for review",
    icon: FileText,
    color: "text-ballpoint-ink",
  },
  {
    agent: "Inventory Forecaster",
    action: "Stock updated",
    detail: "GRN-0781 received — 2 mm MS sheet stock now 3,200 kg",
    icon: PackageCheck,
    color: "text-canary",
  },
  {
    agent: "Data Entry",
    action: "Expense logged",
    detail: "Transport bill TB-412 — $340, matched to DO-0198",
    icon: ScanLine,
    color: "text-ballpoint-ink",
  },
];

const VISIBLE = 5;
const INTERVAL_MS = 2800;

export function AgentActivityFeed() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [pointer, setPointer] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      setPointer((p) => (p + 1) % entries.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [inView]);

  const visible: (FeedEntry & { key: number })[] = [];
  for (let i = 0; i < VISIBLE; i++) {
    const idx = (pointer + i) % entries.length;
    visible.push({ ...entries[idx], key: pointer + i });
  }

  return (
    <div ref={ref} className="mt-20">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-sheet px-4 py-2 text-sm font-semibold shadow-sm">
          <Sparkles aria-hidden className="size-4 text-canary" />
          Live agent activity
        </span>
        <span aria-hidden className="pulse-dot size-2 rounded-full bg-canary" />
      </div>

      <div className="relative overflow-hidden rounded-lg border border-night-rule bg-night/50 backdrop-blur-sm">
        <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-0 px-5 py-3 text-xs font-semibold text-night-soft border-b border-night-rule uppercase tracking-wider">
          <span>Agent</span>
          <span>Action</span>
          <span className="hidden sm:block">Detail</span>
        </div>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((entry, i) => {
              const Icon = entry.icon;
              return (
                <motion.div
                  key={entry.key}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1 - i * 0.12, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-[auto_1fr_1fr] gap-x-4 items-center px-5 py-3 border-b border-night-rule/50"
                >
                  <span className="inline-flex items-center gap-2 min-w-[140px]">
                    <Icon aria-hidden className={`size-4 shrink-0 ${entry.color}`} />
                    <span className="text-sm font-medium text-white truncate">{entry.agent}</span>
                  </span>
                  <span className="text-sm text-night-soft">{entry.action}</span>
                  <span className="text-sm text-night-soft/70 truncate hidden sm:block">{entry.detail}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-night to-transparent pointer-events-none" />
      </div>

      <p className="mt-4 text-sm text-night-soft text-center">
        Your AI agents work around the clock — handling quotes, stock alerts, data entry, and more while your team focuses on decisions that matter.
      </p>
    </div>
  );
}
