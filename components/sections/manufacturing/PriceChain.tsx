"use client";

import { useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatMoneyExact } from "@/lib/format";

// Illustrative figures only — see docs/placeholders.md.
const KG_PER_BRACKET = 1.8;
const CUTTING_COST = 22;
const BRACKETS_PER_RACK = 4;
const ASSEMBLY_COST = 140;
const MARGIN = 0.18;

export function PriceChain() {
  const sliderId = useId();
  const [rawCost, setRawCost] = useState(68);
  const [pulse, setPulse] = useState(0);

  const bracketCost = rawCost * KG_PER_BRACKET + CUTTING_COST;
  const rackPrice = (bracketCost * BRACKETS_PER_RACK + ASSEMBLY_COST) * (1 + MARGIN);

  return (
    <div className="rounded-md bg-paper p-5 sm:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-semiwide text-xl font-extrabold">Automated price update chain</h3>
        <p className="text-sm text-ink-soft">Illustrative example</p>
      </div>

      <div className="mt-7 rounded-md bg-sheet p-5 ring-1 ring-rule">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <label htmlFor={sliderId} className="font-medium">
            Raw material cost: MS coil, per kg
          </label>
          <output htmlFor={sliderId} className="font-semiwide text-2xl font-extrabold tabular-nums">
            {formatMoneyExact(rawCost)}
          </output>
        </div>
        <input
          id={sliderId}
          type="range"
          min={50}
          max={95}
          step={1}
          value={rawCost}
          onChange={(event) => {
            setRawCost(Number(event.target.value));
            setPulse((value) => value + 1);
          }}
          className="mt-4 h-2 w-full cursor-pointer accent-ballpoint"
        />
        <div className="mt-2 flex justify-between text-sm text-ink-soft">
          <span>{formatMoneyExact(50)}</span>
          <span>{formatMoneyExact(95)}</span>
        </div>
      </div>

      <Connector pulse={pulse} delay={0}>
        {KG_PER_BRACKET} kg per bracket, plus {formatMoneyExact(CUTTING_COST)} cutting
      </Connector>

      <ChainNode stage="Semi-finished good" name="Laser-cut bracket" pulse={pulse}>
        <AnimatedNumber value={bracketCost} format={formatMoneyExact} />
      </ChainNode>

      <Connector pulse={pulse} delay={0.25}>
        {BRACKETS_PER_RACK} brackets, {formatMoneyExact(ASSEMBLY_COST)} assembly, {MARGIN * 100}% margin
      </Connector>

      <ChainNode stage="Finished good" name="Wall-mounted storage rack" pulse={pulse} emphasis>
        <AnimatedNumber value={rackPrice} format={formatMoneyExact} />
      </ChainNode>

      <p className="mt-6 text-[0.95rem] text-ink-soft">
        Move the slider. The bracket cost and rack price recalculate from your pricing rules, with no spreadsheet
        to update.
      </p>
    </div>
  );
}

function Connector({ pulse, delay, children }: { pulse: number; delay: number; children: ReactNode }) {
  return (
    <div className="relative ml-6 flex min-h-20 items-center border-l-2 border-dashed border-ink/25 pl-6">
      {pulse > 0 && (
        <motion.span
          key={pulse}
          aria-hidden
          className="absolute -left-[6px] size-2.5 rounded-full bg-ballpoint motion-reduce:hidden"
          initial={{ top: "0%", opacity: 1 }}
          animate={{ top: "100%", opacity: 0 }}
          transition={{ duration: 0.55, delay, ease: "easeIn" }}
        />
      )}
      <p className="text-sm text-ink-soft">{children}</p>
    </div>
  );
}

type ChainNodeProps = {
  stage: string;
  name: string;
  pulse: number;
  emphasis?: boolean;
  children: ReactNode;
};

function ChainNode({ stage, name, pulse, emphasis = false, children }: ChainNodeProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-md bg-sheet p-5 ${
        emphasis ? "ring-2 ring-ink" : "ring-1 ring-rule"
      }`}
    >
      <div>
        <p className="text-sm text-ink-soft">{stage}</p>
        <p className="font-semibold">{name}</p>
      </div>
      <p className="relative font-semiwide text-2xl font-extrabold sm:text-3xl">
        {pulse > 0 && (
          <span key={pulse} aria-hidden className="flash absolute inset-x-0 bottom-0.5 h-[45%] bg-canary" />
        )}
        <span className="relative">{children}</span>
      </p>
    </div>
  );
}
