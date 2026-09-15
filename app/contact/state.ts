export type ContactField = "name" | "email" | "phone" | "message";

export type ContactState = {
  status: "idle" | "error" | "success";
  errors: Partial<Record<ContactField, string>>;
  /** Set when the message validated but could not be delivered. */
  deliveryFailed?: boolean;
  values: Record<ContactField, string>;
};

export const emptyContactValues: Record<ContactField, string> = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export const initialContactState: ContactState = {
  status: "idle",
  errors: {},
  values: emptyContactValues,
};
