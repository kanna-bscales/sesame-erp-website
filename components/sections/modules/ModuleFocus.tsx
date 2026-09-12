"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type ModuleFocus = "all" | "manufacturing";

type ModuleFocusValue = { focus: ModuleFocus; setFocus: (focus: ModuleFocus) => void };

const ModuleFocusContext = createContext<ModuleFocusValue | null>(null);

export function ModuleFocusProvider({ children }: { children: ReactNode }) {
  const [focus, setFocus] = useState<ModuleFocus>("all");
  return <ModuleFocusContext value={{ focus, setFocus }}>{children}</ModuleFocusContext>;
}

export function useModuleFocus() {
  const value = useContext(ModuleFocusContext);
  if (!value) throw new Error("useModuleFocus must be used inside ModuleFocusProvider");
  return value;
}
