"use server";

import nodemailer from "nodemailer";
import { site } from "@/lib/site";
import { emptyContactValues, type ContactState } from "./state";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Enquiry = Record<"name" | "email" | "phone" | "message", string>;

function buildMessage(enquiry: Enquiry) {
  return {
    to: process.env.CONTACT_TO ?? site.email,
    replyTo: enquiry.email,
    subject: `New enquiry from ${enquiry.name}`,
    text: [
      `Name:    ${enquiry.name}`,
      `Email:   ${enquiry.email}`,
      `Phone:   ${enquiry.phone || "not given"}`,
      "",
      "Message:",
      enquiry.message || "(no message)",
      "",
      `Sent from the ${site.name} website contact form.`,
    ].join("\n"),
  };
}

// SMTP (for example a Gmail account with an app password). See .env.example.
async function sendOverSmtp(enquiry: Enquiry, user: string, pass: string) {
  const message = buildMessage(enquiry);
  const port = Number(process.env.SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port,
    secure: port === 465,
    // App passwords are shown in groups of four; people paste the spaces too.
    auth: { user, pass: pass.replace(/\s/g, "") },
  });

  await transporter.sendMail({ ...message, from: process.env.CONTACT_FROM ?? `${site.name} website <${user}>` });
}

// Resend's HTTP API, used when no SMTP details are set.
async function sendOverResend(enquiry: Enquiry, apiKey: string) {
  const message = buildMessage(enquiry);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? `${site.name} website <onboarding@resend.dev>`,
      to: message.to.split(",").map((address) => address.trim()),
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
}

async function sendEnquiry(enquiry: Enquiry): Promise<boolean> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const resendKey = process.env.RESEND_API_KEY;

  try {
    if (smtpUser && smtpPass) {
      await sendOverSmtp(enquiry, smtpUser, smtpPass);
      return true;
    }
    if (resendKey) {
      await sendOverResend(enquiry, resendKey);
      return true;
    }
    console.error("[contact] No email credentials set (SMTP_USER/SMTP_PASSWORD or RESEND_API_KEY). Enquiry:", enquiry);
    return false;
  } catch (error) {
    console.error("[contact] Sending failed. Enquiry:", enquiry, error);
    return false;
  }
}

export async function submitContact(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Hidden field: bots fill it in, people never see it.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success", errors: {}, values: emptyContactValues };
  }

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2) errors.name = "Tell us your name.";
  if (!EMAIL.test(values.email)) errors.email = "Enter an email address we can reply to.";
  if (values.phone.length > 0 && values.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a phone number we can call, or leave it empty.";
  }
  if (values.message.length > 4000) errors.message = "Keep this under 4000 characters.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  // Never tell someone their message arrived when it did not: show the direct address instead.
  const delivered = await sendEnquiry(values);
  if (!delivered) {
    return { status: "error", errors: {}, deliveryFailed: true, values };
  }

  return { status: "success", errors: {}, values: emptyContactValues };
}
