"use client";

import { AnimatePresence, motion } from "motion/react";
import { FileSpreadsheet, Package } from "lucide-react";

// Illustrative demo data only — see docs/placeholders.md.

type Holder = "retailer" | "sup-north" | "sup-south" | "agent-ravi" | "agent-meena" | "agent-arjun";

type StockItem = {
  id: string;
  kind: "box" | "device";
  label: string;
  detail: string;
  devices: number;
  // Where the item sits at each step: import, supervisor allocation, inventory allocation, agent allocation.
  path: [Holder, Holder, Holder, Holder];
};

const stock: StockItem[] = [
  {
    id: "bx-12",
    kind: "box",
    label: "Box BX-12",
    detail: "10 × Galaxy A15",
    devices: 10,
    path: ["retailer", "sup-north", "agent-ravi", "agent-ravi"],
  },
  {
    id: "bx-13",
    kind: "box",
    label: "Box BX-13",
    detail: "10 × Moto G34",
    devices: 10,
    path: ["retailer", "retailer", "retailer", "retailer"],
  },
  {
    id: "imei-3809",
    kind: "device",
    label: "…3809",
    detail: "Moto G34",
    devices: 1,
    path: ["retailer", "sup-south", "agent-meena", "agent-meena"],
  },
  {
    id: "imei-1127",
    kind: "device",
    label: "…1127",
    detail: "Moto G34",
    devices: 1,
    path: ["retailer", "sup-south", "agent-meena", "agent-meena"],
  },
  {
    id: "imei-6650",
    kind: "device",
    label: "…6650",
    detail: "iPad 10th gen",
    devices: 1,
    path: ["retailer", "sup-south", "agent-arjun", "agent-arjun"],
  },
  {
    id: "imei-2214",
    kind: "device",
    label: "…2214",
    detail: "iPad 10th gen",
    devices: 1,
    path: ["retailer", "retailer", "retailer", "retailer"],
  },
];

const totalDevices = stock.reduce((sum, item) => sum + item.devices, 0);

const columns: { title: string; holders: { id: Holder; name: string }[] }[] = [
  { title: "Retailer", holders: [{ id: "retailer", name: "Main store" }] },
  {
    title: "Supervisors",
    holders: [
      { id: "sup-north", name: "North zone" },
      { id: "sup-south", name: "South zone" },
    ],
  },
  {
    title: "Agents",
    holders: [
      { id: "agent-ravi", name: "Ravi" },
      { id: "agent-meena", name: "Meena" },
      { id: "agent-arjun", name: "Arjun" },
    ],
  },
];

const statusByStep = [
  `${totalDevices} devices imported from stock-september.csv`,
  "Retailer assigned a box and 3 IMEIs to supervisors",
  "Supervisors passed devices on to agents",
  "Every agent sees exactly what they hold",
];

const csvRows = [
  ["356938035643809", "Moto G34", "None"],
  ["356938035646650", "iPad 10th gen", "None"],
  ["356938035612040", "Galaxy A15", "BX-12"],
];

const spring = { type: "spring", stiffness: 300, damping: 32 } as const;

export function AllocationBoard({ step }: { step: number }) {
  return (
    <div className="w-full rounded-md bg-sheet p-4 shadow-[10px_10px_0_var(--color-canary)] ring-1 ring-rule sm:p-6 dark:shadow-[10px_10px_0_var(--color-canary),0_0_80px_-30px_var(--color-canary)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <p className="font-semiwide text-lg font-extrabold">Device allocation</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-ink-soft"
          >
            {statusByStep[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {step === 0 && (
          <motion.div
            key="csv"
            aria-hidden
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-md bg-paper p-3 text-xs sm:text-sm">
              <p className="flex items-center gap-2 font-semibold">
                <FileSpreadsheet className="size-4 text-ballpoint-ink" />
                stock-september.csv
              </p>
              <table className="mt-2 w-full text-left tabular-nums">
                <thead>
                  <tr className="text-ink-soft">
                    <th className="py-1 font-medium">IMEI</th>
                    <th className="py-1 font-medium">Model</th>
                    <th className="py-1 font-medium">Box</th>
                  </tr>
                </thead>
                <tbody>
                  {csvRows.map((row) => (
                    <tr key={row[0]} className="border-t border-rule">
                      <td className="py-1 pr-2">{row[0]}</td>
                      <td className="py-1 pr-2">{row[1]}</td>
                      <td className="py-1">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-hidden className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-2 text-xs font-medium text-ink-soft sm:text-sm">{column.title}</p>
            <div className="space-y-2">
              {column.holders.map((holder) => {
                const held = stock.filter((item) => item.path[step] === holder.id);
                const devices = held.reduce((sum, item) => sum + item.devices, 0);
                const spotlight = step === 3 && holder.id.startsWith("agent") && devices > 0;
                return (
                  <motion.div
                    key={holder.id}
                    layout
                    transition={spring}
                    className={`rounded-md p-2 sm:p-2.5 ${
                      held.length > 0 ? "bg-paper" : "border border-dashed border-rule"
                    } ${spotlight ? "ring-2 ring-canary" : ""}`}
                  >
                    <motion.p layout="position" className="truncate text-xs font-semibold sm:text-sm">
                      {holder.name}
                    </motion.p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {held.map((item) => (
                        <Chip key={item.id} item={item} />
                      ))}
                      {held.length === 0 && <span className="text-[11px] text-ink-soft">Nothing yet</span>}
                    </div>
                    {spotlight && (
                      <p className="mt-1.5 text-[11px] font-semibold sm:text-xs">
                        <span className="marker">
                          {devices} {devices === 1 ? "device" : "devices"}
                        </span>
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({ item }: { item: StockItem }) {
  if (item.kind === "box") {
    return (
      <motion.div
        layoutId={item.id}
        transition={spring}
        className="flex w-full items-center gap-1.5 rounded-md border-[1.5px] border-ink bg-sheet px-2 py-1.5"
      >
        <Package className="size-3.5 shrink-0" />
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold sm:text-xs">{item.label}</span>
          <span className="block truncate text-[10px] text-ink-soft sm:text-[11px]">{item.detail}</span>
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={item.id}
      transition={spring}
      className="rounded-full bg-sheet px-2 py-0.5 text-[11px] font-semibold tabular-nums ring-1 ring-rule sm:text-xs"
      title={item.detail}
    >
      {item.label}
    </motion.div>
  );
}
