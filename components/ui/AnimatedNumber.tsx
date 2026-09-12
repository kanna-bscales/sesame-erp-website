"use client";

import { useEffect } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";

type Props = {
  value: number;
  format: (value: number) => string;
  from?: number;
};

export function AnimatedNumber({ value, format, from }: Props) {
  const reduceMotion = useReducedMotion();
  const spring = useSpring(from ?? value, { stiffness: 110, damping: 22 });
  const text = useTransform(spring, (current) => format(current));

  useEffect(() => {
    if (reduceMotion) spring.jump(value);
    else spring.set(value);
  }, [spring, value, reduceMotion]);

  return <motion.span className="tabular-nums">{text}</motion.span>;
}
