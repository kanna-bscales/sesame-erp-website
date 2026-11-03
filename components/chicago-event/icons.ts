import {
  Bot,
  CodeXml,
  Factory,
  Handshake,
  LayoutGrid,
  Package,
  PackageCheck,
  Smartphone,
  Store,
  Truck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

// Icon keys used in content/chicago-event.ts, mapped to lucide icons.
export const eventIcons: Record<string, LucideIcon> = {
  module: PackageCheck,
  erp: LayoutGrid,
  agents: Bot,
  automation: Workflow,
  software: CodeXml,
  app: Smartphone,
  factory: Factory,
  store: Store,
  truck: Truck,
  package: Package,
  sourcing: Handshake,
};
