// POST /api/plma/enquiry — PLMA 2026 registration form submission.
//
// 1. Validates everything again on the server (consent and terms must be ticked).
// 2. Finds the attendee's existing Lead: first by the secure reference from the personal link,
//    then by email. A found Lead is UPDATED, so repeat submissions never create duplicates.
// 3. Otherwise creates one new Lead with the PLMA 2026 source details.
// 4. Sets PLMA Response Status = "Submitted" and PLMA Submission Date, adds the Lead to the
//    PLMA 2026 campaign as "Responded" and records a Note with the consent
//    and terms acceptance. Writes run with trigger: [] so no workflow or promotional email fires.
// Answers { ok: true } only after Zoho has accepted the write. If Zoho credentials are not set,
// answers 503 "not_configured" and the form falls back to the Zoho webform.

import { clientIp, rateLimit } from "@/lib/plma/rate-limit";
import { BOOTH_RE, isValidRef, type EnquiryErrorKey, type EnquiryResponse } from "@/lib/plma/reference";
import {
  addLeadNote,
  addLeadToCampaign,
  createLead,
  findLeadByReference,
  findLeadsByEmail,
  PLACEHOLDER_LAST_NAME,
  TEST_CONFERENCE_NAME,
  updateLead,
  ZohoError,
  zohoConfigured,
  type CrmLead,
} from "@/lib/plma/zoho.server";

const NO_STORE = { "Cache-Control": "no-store" };
const reply = (body: EnquiryResponse, status = 200) => Response.json(body, { status, headers: NO_STORE });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WEBSITE_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;
const MAX_REQUIREMENTS = 2000;

type Input = {
  ref?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  booth?: unknown;
  jobTitle?: unknown;
  website?: unknown;
  requirements?: unknown;
  consent?: unknown;
  terms?: unknown;
  termsVersion?: unknown;
  honeypot?: unknown;
  utm?: { source?: unknown; medium?: unknown; campaign?: unknown };
};

// Strips control characters (keeps line breaks in the enquiry text) and trims to a length.
const text = (value: unknown, max: number, multiline = false) =>
  typeof value === "string"
    ? value
        .replace(multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "")
        .trim()
        .slice(0, max)
    : "";

/** Zoho datetime fields take "yyyy-MM-ddTHH:mm:ss+00:00" (no milliseconds). */
function zohoDateTime(iso: string) {
  return iso.replace(/\.\d{3}Z$/, "+00:00");
}

function splitName(full: string) {
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { first: "", last: parts[0] ?? "" };
  return { first: parts.slice(0, -1).join(" ").slice(0, 40), last: parts[parts.length - 1].slice(0, 80) };
}

export async function POST(request: Request) {
  if (!rateLimit(`enquiry:${clientIp(request)}`, 6, 10 * 60_000)) return reply({ ok: false, reason: "rate_limited" }, 429);

  let input: Input;
  try {
    input = (await request.json()) as Input;
    if (!input || typeof input !== "object") throw new Error();
  } catch {
    return reply({ ok: false, reason: "bad_request" }, 400);
  }

  // Spam trap: pretend success, write nothing.
  if (text(input.honeypot, 200)) return reply({ ok: true });

  const name = text(input.name, 120);
  const email = text(input.email, 100).toLowerCase();
  const phone = text(input.phone, 30);
  const company = text(input.company, 200);
  const booth = text(input.booth, 20);
  const jobTitle = text(input.jobTitle, 100);
  let website = text(input.website, 255);
  const requirements = text(input.requirements, MAX_REQUIREMENTS, true);

  const errors: EnquiryErrorKey[] = [];
  if (!name) errors.push("name");
  if (!EMAIL_RE.test(email)) errors.push("email");
  const digits = phone.replace(/\D/g, "");
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15)) errors.push("phone");
  if (!company) errors.push("company");
  if (booth && !BOOTH_RE.test(booth)) errors.push("booth");
  if (website && !WEBSITE_RE.test(website)) errors.push("website");
  if (input.consent !== true) errors.push("consent");
  if (input.terms !== true) errors.push("terms");
  if (errors.length) return reply({ ok: false, reason: "invalid", errors }, 400);

  if (!zohoConfigured()) return reply({ ok: false, reason: "not_configured" }, 503);

  if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;
  const { first, last } = splitName(name);
  const submittedAt = new Date().toISOString();
  const termsVersion = text(input.termsVersion, 40) || "unspecified";
  const utm = {
    source: text(input.utm?.source, 255),
    medium: text(input.utm?.medium, 255),
    campaign: text(input.utm?.campaign, 255),
  };

  try {
    let lead: CrmLead | null = null;
    let matchedBy = "new lead";
    if (isValidRef(input.ref)) {
      lead = await findLeadByReference(input.ref);
      if (lead) matchedBy = "personal invitation reference";
    }
    if (!lead) {
      const byEmail = await findLeadsByEmail(email);
      if (byEmail.length >= 1) {
        lead = byEmail[0];
        matchedBy = byEmail.length > 1 ? `email (${byEmail.length} leads share it; updated the first)` : "email";
      }
    }

    const enquiryLine = `[${submittedAt.slice(0, 10)} PLMA 2026 enquiry]${booth ? ` Booth ${booth}.` : ""} ${requirements || "(no message)"}`;

    // Only fields the visitor actually filled in are written, so researched values are never
    // replaced with blanks. Lead Source, Conference Name/Source, Offer URL, Attendee Reference
    // Hash and Credit Offer Status are left as imported.
    const contact: Record<string, unknown> = {
      Last_Name: last,
      Email: email,
      Company: company,
      Consent_to_be_Contacted: true,
      // Submission tracking (Leads › PLMA Response Status / PLMA Submission Date). Only a submitted
      // form sets these; opening the page or clicking the email banner changes nothing.
      PLMA_Response_Status: "Submitted",
      PLMA_Submission_Date: zohoDateTime(submittedAt),
      ...(first ? { First_Name: first } : {}),
      ...(phone ? { Phone: phone } : {}),
      ...(jobTitle ? { Designation: jobTitle } : {}),
      ...(website ? { Website: website } : {}),
      ...(booth ? { Booth_Number: booth } : {}),
      ...(utm.source ? { UTM_Source: utm.source } : {}),
      ...(utm.medium ? { UTM_Medium: utm.medium } : {}),
      ...(utm.campaign ? { UTM_Campaign: utm.campaign } : {}),
    };

    let leadId: string;
    if (lead) {
      leadId = lead.id;
      // Same name as on the Lead (e.g. a pre-filled name left unchanged): keep the stored
      // First/Last split instead of re-splitting it.
      const storedName = [lead.First_Name, lead.Last_Name].filter(Boolean).join(" ").trim();
      if (storedName && storedName.toLowerCase() === name.toLowerCase()) {
        delete contact.First_Name;
        delete contact.Last_Name;
      }
      const previous = (lead.ERP_Requirements ?? "").trim();
      const combined = previous ? `${enquiryLine}\n\n${previous}` : enquiryLine;
      await updateLead(leadId, { ...contact, ERP_Requirements: combined.slice(0, MAX_REQUIREMENTS) });

      // Keep a record of researched contact details that the visitor's own details replaced.
      const before = [
        lead.Last_Name && lead.Last_Name !== PLACEHOLDER_LAST_NAME ? `Name: ${[lead.First_Name, lead.Last_Name].filter(Boolean).join(" ")}` : "",
        lead.Email ? `Email: ${lead.Email}` : "",
        lead.Designation ? `Title: ${lead.Designation}` : "",
      ].filter(Boolean);
      const changed =
        (lead.Email ?? "").toLowerCase() !== email ||
        (storedName.toLowerCase() !== name.toLowerCase() && (lead.Last_Name ?? "") !== PLACEHOLDER_LAST_NAME) ||
        (jobTitle && (lead.Designation ?? "") !== jobTitle);
      if (changed && before.length) {
        await addLeadNote(leadId, "Contact details before the PLMA 2026 enquiry", before.join("\n")).catch(() =>
          console.error("PLMA enquiry: 'details before' note failed (lead saved)"),
        );
      }
    } else {
      leadId = await createLead({
        ...contact,
        ERP_Requirements: enquiryLine.slice(0, MAX_REQUIREMENTS),
        Lead_Source: "PLMA 2026",
        Conference_Name: "PLMA 2026",
        Conference_Source: "PLMA 2026 landing page",
        Credit_Offer_Status: "Pending Review",
        Tag: [{ name: "PLMA 2026" }],
      });
    }

    // The Lead itself is saved at this point. Campaign membership and the audit note are
    // best-effort: a failure here is logged (without personal data) but does not fail the request.
    // Internal test Leads stay outside the real campaign.
    if (lead?.Conference_Name !== TEST_CONFERENCE_NAME) {
      try {
        await addLeadToCampaign(leadId, "Responded");
      } catch (error) {
        // Logged without personal data. A 401/403 here usually means the refresh token lacks
        // the ZohoCRM.modules.campaigns.UPDATE scope.
        console.error(
          "PLMA enquiry: campaign status update failed (lead saved):",
          error instanceof ZohoError ? `HTTP ${error.status ?? "?"}` : "unknown error",
        );
      }
    }
    try {
      await addLeadNote(
        leadId,
        "PLMA 2026 enquiry submitted",
        [
          `Submitted: ${submittedAt}`,
          `Matched by: ${matchedBy}`,
          `Consent to be contacted: yes (ticked by the visitor)`,
          `Offer terms accepted: yes (terms dated ${termsVersion})`,
          `Marketing email opt-in: not requested`,
          ``,
          `Enquiry:`,
          requirements || "(no message)",
        ].join("\n"),
      );
    } catch {
      console.error("PLMA enquiry: audit note failed (lead saved)");
    }

    return reply({ ok: true });
  } catch {
    // Deliberately no personal data in logs.
    console.error("PLMA enquiry: Zoho CRM write failed");
    return reply({ ok: false, reason: "crm_error" }, 502);
  }
}
