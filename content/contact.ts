// Contact page copy. Written during design — see docs/content-contact.md.

export const contact = {
  eyebrow: "Contact",
  heading: "Tell us how your business runs today",
  intro:
    "Send us the basics and we will reply with what a custom ERP for your business would look like, what it would include, and how quickly we can deliver it.",
  form: {
    name: { label: "Name", placeholder: "Your full name" },
    email: { label: "Email", placeholder: "you@company.com" },
    phone: { label: "Phone", optional: "optional", placeholder: "+1 555 000 0000" },
    message: {
      label: "What do you need?",
      optional: "optional",
      placeholder: "The work you want to automate, the software you use today, anything else we should know.",
    },
    submit: "Send message",
    errorHeading: "That did not send",
    errorBody: "Something went wrong on our side. Email us directly and we will reply today:",
    submitting: "Sending",
    successHeading: "Thanks, we have your message",
    successBody: "We reply to every message within one business day.",
  },
  details: {
    heading: "Contact details",
    responseLabel: "Response time",
    responseValue: "Within one business day, Monday to Friday",
    emailLabel: "Email",
  },
};
