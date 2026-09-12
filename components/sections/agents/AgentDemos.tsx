"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, CircleCheck, FileText, TriangleAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AgentId } from "@/content/home";
import { useSequence } from "@/hooks/useSequence";
import { formatMoney, formatMoneyExact } from "@/lib/format";

// Illustrative demo data only — see docs/placeholders.md.

const ease = [0.22, 1, 0.36, 1] as const;

export function AgentDemo({ id }: { id: AgentId }) {
  switch (id) {
    case "sales":
      return <SalesDemo />;
    case "inventory":
      return <InventoryDemo />;
    case "support":
      return <SupportDemo />;
    case "data-entry":
      return <DataEntryDemo />;
    case "reports":
      return <ReportsDemo />;
  }
}

function Sheet({ title, status, children }: { title: string; status: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-md bg-sheet p-5 text-ink shadow-[10px_10px_0_var(--color-canary)] sm:p-8 dark:shadow-[10px_10px_0_var(--color-canary),0_0_80px_-30px_var(--color-canary)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <p className="font-semiwide text-lg font-extrabold">{title}</p>
        <div className="text-sm text-ink-soft">{status}</div>
      </div>
      <div className="min-h-[22rem] pt-5">{children}</div>
    </div>
  );
}

function Status({ done, working, finished }: { done: boolean; working: string; finished: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className={`size-2 rounded-full ${done ? "bg-ballpoint" : "pulse-dot bg-canary"}`} />
      {done ? finished : working}
    </span>
  );
}

function Appear({ show, children, className }: { show: boolean; children: ReactNode; className?: string }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const salesLines = [
  { label: "Flange plate, 8 mm", detail: "250 × ₹186 list price", amount: 46500 },
  { label: "Gasket set", detail: "40 × ₹42 list price", amount: 1680 },
  { label: "Volume discount", detail: "4% on orders above 200 units", amount: -1927 },
];

function SalesDemo() {
  const { step } = useSequence(5, { stepMs: 650, delayMs: 500 });

  return (
    <Sheet
      title="Quotation QT-2043"
      status={<Status done={step >= 5} working="Drafting from RFQ-0194" finished="Waiting for your approval" />}
    >
      <div className="rounded-md bg-paper p-4 text-[0.95rem]">
        <p className="flex items-center gap-2 font-semibold">
          <FileText aria-hidden className="size-4 text-ballpoint-ink" />
          RFQ-0194 from Kaveri Castings
        </p>
        <p className="mt-2 text-ink-soft">
          “Please quote 250 flange plates (8 mm) and 40 gasket sets, delivered within two weeks.”
        </p>
      </div>

      <p className="my-4 flex items-center gap-2 text-sm text-ink-soft">
        <ArrowDown aria-hidden className="size-4" />
        Priced with your list prices and discount rules
      </p>

      {salesLines.map((line, index) => (
        <Appear
          key={line.label}
          show={step >= index + 1}
          className="flex items-baseline justify-between gap-4 border-t border-rule py-3"
        >
          <span>
            <span className="marker font-semibold">{line.label}</span>
            <span className="block text-sm text-ink-soft">{line.detail}</span>
          </span>
          <span className="font-semibold tabular-nums">
            {line.amount < 0 ? `−${formatMoney(-line.amount)}` : formatMoney(line.amount)}
          </span>
        </Appear>
      ))}

      <Appear show={step >= 4} className="flex items-baseline justify-between border-t-2 border-ink pt-3">
        <span className="font-semibold">Total before tax</span>
        <span className="font-semiwide text-2xl font-extrabold tabular-nums">{formatMoney(46253)}</span>
      </Appear>
    </Sheet>
  );
}

const history = [3400, 3260, 3150, 2990, 2870, 2720, 2590, 2420, 2320, 2160, 2050, 1910, 1800, 1660];
const forecast: [number, number][] = [
  [13, 1660],
  [16, 1330],
  [19, 1000],
  [21, 780],
];
const REORDER_KG = 1000;
const chartX = (day: number) => 16 + (day / 21) * 368;
const chartY = (kg: number) => 150 - (kg / 3600) * 132;
const toPath = (points: [number, number][]) =>
  points.map(([d, kg], i) => `${i === 0 ? "M" : "L"}${chartX(d).toFixed(1)} ${chartY(kg).toFixed(1)}`).join(" ");
const historyPath = toPath(history.map((kg, day) => [day, kg]));
const forecastPath = toPath(forecast);

function InventoryDemo() {
  const { step } = useSequence(3, { stepMs: 900, delayMs: 700 });

  return (
    <Sheet
      title="MS sheet, 2 mm"
      status={<Status done={step >= 3} working="Forecasting from 14 days of usage" finished="Reorder suggested" />}
    >
      <svg
        viewBox="0 0 400 176"
        className="w-full"
        role="img"
        aria-label="Stock fell from 3,400 kg to 1,660 kg over 14 days and is forecast to cross the 1,000 kg reorder point in 6 days."
      >
        <line x1="16" x2="384" y1="150" y2="150" stroke="var(--color-rule)" strokeWidth="1.5" />
        <line
          x1="16"
          x2="384"
          y1={chartY(REORDER_KG)}
          y2={chartY(REORDER_KG)}
          stroke="var(--color-ink-soft)"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <text x="384" y={chartY(REORDER_KG) - 8} textAnchor="end" className="fill-ink-soft text-[11px]">
          Reorder point, 1,000 kg
        </text>
        <motion.path
          d={historyPath}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        {step >= 1 && (
          <motion.path
            d={forecastPath}
            fill="none"
            stroke="var(--color-ballpoint-ink)"
            strokeWidth="2.5"
            strokeDasharray="3 6"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        {step >= 2 && (
          <motion.circle
            cx={chartX(19)}
            cy={chartY(REORDER_KG)}
            r="7"
            fill="var(--color-canary)"
            stroke="var(--color-ink)"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          />
        )}
        <text x="16" y="170" className="fill-ink-soft text-[11px]">
          14 days ago
        </text>
        <text x={chartX(13)} y="170" textAnchor="middle" className="fill-ink-soft text-[11px]">
          Today
        </text>
        <text x={chartX(19)} y="170" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          In 6 days
        </text>
      </svg>

      <Appear show={step >= 3} className="mt-5 flex gap-3 rounded-md border-l-4 border-canary bg-paper p-4">
        <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">Stock will fall below the reorder point in 6 days.</p>
          <p className="mt-1 text-[0.95rem] text-ink-soft">
            Suggested purchase order: 1,200 kg from Sri Balaji Steels, drafted and ready for your review.
          </p>
        </div>
      </Appear>
    </Sheet>
  );
}

const chat = [
  { from: "customer", text: "Has order SO-1187 been dispatched?", at: 1 },
  {
    from: "agent",
    text: "Yes. SO-1187 left the warehouse today at 11:20 AM. Tracking details are on your customer portal, and delivery is expected by Thursday.",
    at: 3,
  },
  { from: "customer", text: "Do you have 2 mm MS sheet in stock?", at: 4 },
  {
    from: "agent",
    text: "Yes, 3,400 kg is available right now. I can reserve it against a new order for you.",
    at: 6,
  },
];

function SupportDemo() {
  const { step } = useSequence(6, { stepMs: 850, delayMs: 400 });
  const typing = step === 2 || step === 5;

  return (
    <Sheet
      title="Customer chat, Nila Textiles"
      status={
        <Status done={step >= 6} working="Checking live order data" finished="Answered from live order and stock data" />
      }
    >
      <div className="flex flex-col gap-3">
        {chat.map((message) => {
          const fromCustomer = message.from === "customer";
          return (
            <Appear
              key={message.text}
              show={step >= message.at}
              className={`max-w-[85%] ${fromCustomer ? "self-start" : "self-end"}`}
            >
              <p
                className={`rounded-lg px-4 py-3 text-[0.95rem] ${
                  fromCustomer ? "rounded-bl-sm bg-paper" : "rounded-br-sm bg-ink text-paper"
                }`}
              >
                <span className="sr-only">{fromCustomer ? "Customer: " : "AI agent: "}</span>
                {message.text}
              </p>
            </Appear>
          );
        })}
        {typing && (
          <div aria-hidden className="flex gap-1.5 self-end rounded-lg rounded-br-sm bg-ink px-4 py-4">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="pulse-dot size-1.5 rounded-full bg-paper"
                style={{ animationDelay: `${dot * 150}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}

const invoiceFields = [
  { label: "Vendor", value: "Sri Balaji Steels", at: 1 },
  { label: "Invoice number", value: "INV-8812", at: 2 },
  { label: "Invoice date", value: "8 Sep 2026", at: 2 },
];

const invoiceLines = [
  { item: "HR coil, 2.5 mm", qty: "2,000 kg", rate: 61.5, amount: 123000, at: 3 },
  { item: "MS angle, 40 × 40 mm", qty: "600 kg", rate: 64, amount: 38400, at: 4 },
];

function DataEntryDemo() {
  const { step } = useSequence(5, { stepMs: 700, delayMs: 1100 });

  return (
    <Sheet
      title="Purchase bill from an invoice"
      status={<Status done={step >= 5} working="Reading INV-8812.pdf" finished="Matched to PO-0342" />}
    >
      <div className="grid gap-5 sm:grid-cols-5">
        <div aria-hidden className="relative overflow-hidden rounded-md border border-rule bg-paper p-4 sm:col-span-2">
          <p className="text-xs font-semibold">Sri Balaji Steels</p>
          <p className="mt-0.5 text-[10px] text-ink-soft">Tax invoice INV-8812</p>
          <div className="mt-4 space-y-2">
            {[88, 64, 80, 52, 84, 58, 72].map((width, index) => (
              <div key={index} className="h-1.5 rounded bg-rule" style={{ width: `${width}%` }} />
            ))}
          </div>
          <div className="mt-4 ml-auto h-1.5 w-1/3 rounded bg-ink/40" />
          <motion.div
            className="absolute inset-x-0 h-12 border-b-2 border-canary bg-linear-to-b from-transparent to-canary/50 motion-reduce:hidden"
            initial={{ top: "-20%" }}
            animate={{ top: "105%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        <div className="text-[0.95rem] sm:col-span-3">
          <dl className="space-y-2">
            {invoiceFields.map((field) => (
              <div key={field.label} className="flex justify-between gap-4 border-b border-rule pb-2">
                <dt className="text-ink-soft">{field.label}</dt>
                <dd className="font-semibold">
                  {step >= field.at ? <span className="marker">{field.value}</span> : <Skeleton className="w-24" />}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 space-y-2">
            {invoiceLines.map((line) => {
              const filled = step >= line.at;
              return (
                <div key={line.item} className="flex justify-between gap-4 border-b border-rule pb-2">
                  <span>
                    {filled ? <span className="marker font-semibold">{line.item}</span> : <Skeleton className="w-28" />}
                    <span className="block text-sm text-ink-soft">
                      {filled ? `${line.qty} at ${formatMoneyExact(line.rate)}` : " "}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">
                    {filled ? formatMoney(line.amount) : <Skeleton className="w-14" />}
                  </span>
                </div>
              );
            })}
          </div>
          <Appear show={step >= 5} className="mt-3 flex items-baseline justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semiwide text-2xl font-extrabold tabular-nums">{formatMoney(161400)}</span>
          </Appear>
        </div>
      </div>

      <Appear show={step >= 5} className="mt-5 flex items-start gap-2 text-[0.95rem] text-ink-soft">
        <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-ballpoint-ink" />
        Quantities and rates match the purchase order. Nothing needs your review.
      </Appear>
    </Sheet>
  );
}

const metrics = [
  { label: "Sales", value: "₹18.4 lakh", note: "+12% on last week" },
  { label: "Stock value", value: "₹42.1 lakh", note: "2 items near reorder" },
  { label: "Purchases", value: "₹9.7 lakh", note: "−3% on last week" },
];

const summary =
  "Sales are up 12% on last week, led by storage racks. Two items, 2 mm MS sheet and gasket sets, are close to their reorder points. Purchasing spend is 3% lower, and every open purchase order is on schedule.";

function ReportsDemo() {
  const { step } = useSequence(2, { stepMs: 800, delayMs: 500 });
  const words = summary.split(" ");

  return (
    <Sheet
      title="Weekly summary"
      status={<Status done={step >= 2} working="Reading this week's data" finished="Generated on request" />}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-md bg-paper p-4">
            <p className="text-sm text-ink-soft">{metric.label}</p>
            <p className="font-semiwide mt-1 text-xl font-extrabold">{metric.value}</p>
            <p className="mt-1 text-sm text-ink-soft">{metric.note}</p>
          </div>
        ))}
      </div>

      {step >= 1 && (
        <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
          <ArrowDown aria-hidden className="size-4" />
          Written in plain language
        </p>
      )}

      {step >= 2 && (
        <motion.p
          className="mt-3 text-lg leading-relaxed"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.03 } } }}
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="mr-[0.27em] inline-block"
              variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
      )}
    </Sheet>
  );
}
