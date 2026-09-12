// Approved Wireless ERP copy. Mirrors docs/content-wireless-erp.md — keep wording in sync.

export type WirelessFeatureId = "import" | "supervisor" | "inventory" | "agent";

export type WirelessFeature = {
  id: WirelessFeatureId;
  title: string;
  body: string;
  draft?: boolean;
};

export const wirelessErp: {
  title: string;
  summary: string;
  headline: string;
  body: string;
  featuresHeading: string;
  flow: string[];
  features: WirelessFeature[];
} = {
  title: "Wireless ERP",
  summary:
    "The app is an all-encompassing inventory management system designed for the seamless handling of phones and tablets.",
  headline: "Enhance manufacturing efficiency with robust wireless ERP inventory management solutions",
  body: "At SesameERP, our wireless ERP solutions have transformed production processes and inventory management, delivering unmatched efficiency and productivity for clients.",
  featuresHeading: "Our features",
  flow: ["Retailer", "Supervisor", "Agent"],
  // Ordered by how devices move through the system (import, then down the hierarchy).
  features: [
    {
      id: "import",
      title: "Inventory Import",
      body: "Our system simplifies inventory management with an Upload feature for seamless phone and tablet data imports from Excel or CSV files. This eliminates manual entry, reduces errors, and streamlines workflows for enhanced efficiency.",
    },
    {
      id: "supervisor",
      title: "Supervisor Allocation",
      body: "Retailers can assign specific IMEIs or devices to Supervisors for precise control or allocate entire inventory boxes for quicker distribution.",
    },
    {
      id: "inventory",
      title: "Inventory Allocation",
      body: "Supervisors can assign individual IMEIs or devices to Agents for precise distribution or allocate entire inventory boxes for faster distribution.",
    },
    {
      id: "agent",
      title: "Agent Allocation",
      // DRAFT: the supplied text was website-builder placeholder copy. Needs real copy from the owner.
      body: "Each agent gets a clear list of the devices and boxes assigned to them, so every phone and tablet in the field can be traced back by IMEI.",
      draft: true,
    },
  ],
};
