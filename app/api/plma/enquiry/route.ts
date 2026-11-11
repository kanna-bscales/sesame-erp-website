// POST /api/plma/enquiry — PLMA 2026 registration form submission.
//
// Identity rules (Phase 2):
// - The secure reference from a personal link is the primary identity. With a valid reference the
//   submission always belongs to that one Lead (scenario A), whatever email is typed.
// - Without a reference, an email that is already on a Lead is only treated as the same person when
//   the name also matches. A shared inbox (info@, sales@ …) is never an identity on its own
//   (scenario D): a different name at the same company becomes a new Lead with the same Company ID
//   (scenario B). Anything else that is uncertain is flagged for manual review on the existing Lead
//   and nothing is merged or created (scenario C).
// - Original imported fields (name, email, company, phone, title, website, booth) are NEVER
//   overwritten. What the person typed goes into the Submitted_* fields, and a note lists what
//   changed and when.
// - "Add another contact": each distinct new person becomes a separate Lead with the submitter's
//   Company ID, a new secure reference and Offer URL, status Not Submitted. People already on a
//   Lead are not created again; an email already used at another company is flagged for review.
// Writes run with trigger: [] so no workflow, approval or email fires. Answers { ok: true } only
// after Zoho has accepted the submitter's write.

import {
  normEmail,
  parseEmailList,
  sameCompanyName,
  samePersonName,
  uniqueEmails,
} from "@/lib/plma/identity";
import { clientIp, rateLimit } from "@/lib/plma/rate-limit";
import {
  BOOTH_RE,
  isSharedInbox,
  isValidRef,
  LIMITS,
  type ContactInput,
  type EnquiryErrorKey,
  type EnquiryResponse,
} from "@/lib/plma/reference";
import {
  addLeadNote,
  addLeadToCampaign,
  createLead,
  findLeadByReference,
  findLeadsByAnyEmail,
  findLeadsByCompanyId,
  getLeadExtras,
  newCompanyId,
  newReference,
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
  additionalEmails?: unknown;
  phone?: unknown;
  company?: unknown;
  booth?: unknown;
  jobTitle?: unknown;
  website?: unknown;
  requirements?: unknown;
  contacts?: unknown;
  showName?: unknown;
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
const zohoDateTime = (iso: string) => iso.replace(/\.\d{3}Z$/, "+00:00");

function splitName(full: string) {
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { first: "", last: (parts[0] ?? "").slice(0, 80) };
  return { first: parts.slice(0, -1).join(" ").slice(0, 40), last: parts[parts.length - 1].slice(0, 80) };
}

/** The Lead's original (imported) person name; empty for the "no name found" placeholder. */
function originalName(lead: CrmLead) {
  if (!lead.Last_Name || lead.Last_Name === PLACEHOLDER_LAST_NAME) return "";
  return [lead.First_Name, lead.Last_Name].filter(Boolean).join(" ").trim();
}

const leadNames = (lead: CrmLead) => [originalName(lead), lead.Submitted_Name ?? ""].filter(Boolean);
const leadEmails = (lead: CrmLead) =>
  [lead.Email, lead.Secondary_Email, lead.Submitted_Email].filter((e): e is string => Boolean(e)).map(normEmail);
const isTestLead = (lead: CrmLead | null) => lead?.Conference_Name === TEST_CONFERENCE_NAME;

type Submission = {
  name: string;
  email: string;
  additionalEmails: string[];
  phone: string;
  company: string;
  booth: string;
  jobTitle: string;
  website: string;
  requirements: string;
};

type EmailDecision =
  | { kind: "same"; lead: CrmLead; how: string }
  | { kind: "new"; companyLead: CrmLead | null; how: string }
  | { kind: "review"; leads: CrmLead[]; reason: string };

/** Who is this, when there is no valid personal reference? See the identity rules above. */
function decideByEmail(matches: CrmLead[], s: Submission): EmailDecision {
  if (!matches.length) return { kind: "new", companyLead: null, how: "new person (email not in the CRM)" };
  const shared = isSharedInbox(s.email);
  const byName = matches.filter((l) => leadNames(l).some((n) => samePersonName(s.name, n)));
  if (byName.length === 1) {
    const lead = byName[0];
    const companyOk = [lead.Company, lead.Submitted_Company].some((c) => c && sameCompanyName(c, s.company));
    if (!shared || companyOk) return { kind: "same", lead, how: shared ? "shared email + name + company" : "email + name" };
    return { kind: "review", leads: [lead], reason: `Shared inbox ${s.email} and the same name, but a different company was typed` };
  }
  if (byName.length > 1) {
    return { kind: "review", leads: byName.slice(0, 3), reason: `Email and name match ${byName.length} Leads` };
  }
  // Nobody with this name has this email.
  if (shared) {
    const companyIds = new Set(matches.map((l) => l.PLMA_Company_ID || "none"));
    const sameCompany = matches.every((l) => l.Company && sameCompanyName(l.Company, s.company));
    if (sameCompany && companyIds.size === 1) {
      return { kind: "new", companyLead: matches[0], how: "new person at a known company (shared inbox, different name)" };
    }
  }
  return {
    kind: "review",
    leads: matches.slice(0, 3),
    reason: shared
      ? `Shared inbox ${s.email} is on ${matches.length} Lead(s) at a different or uncertain company; name does not match`
      : `Email ${s.email} is already on ${matches.length} Lead(s) under a different or unknown name`,
  };
}

function summary(s: Submission) {
  return [
    `Name: ${s.name}`,
    `Email: ${s.email}`,
    s.additionalEmails.length ? `Additional emails: ${s.additionalEmails.join(", ")}` : "",
    `Company: ${s.company}`,
    s.phone ? `Phone: ${s.phone}` : "",
    s.jobTitle ? `Job title: ${s.jobTitle}` : "",
    s.website ? `Website: ${s.website}` : "",
    s.booth ? `Booth: ${s.booth}` : "",
  ].filter(Boolean);
}

export async function POST(request: Request) {
  if (!rateLimit(`enquiry:${clientIp(request)}`, 6, 10 * 60_000)) return reply({ ok: false, reason: "rate_limited" }, 429);

  let input: Input;
  try {
    const raw = await request.text();
    if (raw.length > LIMITS.requestBytes) return reply({ ok: false, reason: "too_large" }, 413);
    input = JSON.parse(raw) as Input;
    if (!input || typeof input !== "object") throw new Error();
  } catch {
    return reply({ ok: false, reason: "bad_request" }, 400);
  }

  // Spam trap: pretend success, write nothing.
  if (text(input.honeypot, 200)) return reply({ ok: true });

  const name = text(input.name, 120);
  const email = normEmail(text(input.email, 100));
  let website = text(input.website, 255);
  const phone = text(input.phone, 30);

  const errors: EnquiryErrorKey[] = [];
  if (!name) errors.push("name");
  if (!EMAIL_RE.test(email)) errors.push("email");
  const digits = phone.replace(/\D/g, "");
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15)) errors.push("phone");

  const rawExtra = Array.isArray(input.additionalEmails) ? input.additionalEmails : [];
  const extraTexts = rawExtra.map((e) => text(e, 100)).filter(Boolean);
  if (rawExtra.length > LIMITS.additionalEmails || extraTexts.some((e) => !EMAIL_RE.test(e))) errors.push("additionalEmails");

  const rawContacts = Array.isArray(input.contacts) ? input.contacts : [];
  if (rawContacts.length > LIMITS.contacts) return reply({ ok: false, reason: "too_large" }, 413);
  const contacts: ContactInput[] = [];
  rawContacts.forEach((c, i) => {
    const row = (c ?? {}) as Record<string, unknown>;
    const contact = { name: text(row.name, 120), email: normEmail(text(row.email, 100)), jobTitle: text(row.jobTitle, 100) };
    if (!contact.name && !contact.email && !contact.jobTitle) return; // empty row: ignored
    if (!contact.name) errors.push(`contact.${i}.name`);
    if (!EMAIL_RE.test(contact.email)) errors.push(`contact.${i}.email`);
    contacts.push(contact);
  });

  const s: Submission = {
    name,
    email,
    additionalEmails: uniqueEmails(extraTexts, [email]),
    phone,
    company: text(input.company, 200),
    booth: text(input.booth, 20),
    jobTitle: text(input.jobTitle, 100),
    website,
    requirements: text(input.requirements, MAX_REQUIREMENTS, true),
  };
  if (!s.company) errors.push("company");
  if (s.booth && !BOOTH_RE.test(s.booth)) errors.push("booth");
  if (website && !WEBSITE_RE.test(website)) errors.push("website");
  if (input.consent !== true) errors.push("consent");
  if (input.terms !== true) errors.push("terms");
  if (errors.length) return reply({ ok: false, reason: "invalid", errors }, 400);

  if (!zohoConfigured()) return reply({ ok: false, reason: "not_configured" }, 503);

  if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;
  s.website = website;
  const submittedAt = new Date().toISOString();
  const termsVersion = text(input.termsVersion, 40) || "unspecified";
  const utm = {
    source: text(input.utm?.source, 255),
    medium: text(input.utm?.medium, 255),
    campaign: text(input.utm?.campaign, 255),
  };
  const enquiryLine = `[${submittedAt.slice(0, 10)} PLMA 2026 enquiry]${s.booth ? ` Booth ${s.booth}.` : ""} ${s.requirements || "(no message)"}`;
  const tracking: Record<string, unknown> = {
    Consent_to_be_Contacted: true,
    // Separate permission, independent of marketing/contact consent: may colleagues at the same
    // company see this person's first name? Each submission records the latest choice.
    PLMA_Show_First_Name: input.showName === true,
    PLMA_Response_Status: "Submitted",
    PLMA_Submission_Date: zohoDateTime(submittedAt),
    ...(utm.source ? { UTM_Source: utm.source } : {}),
    ...(utm.medium ? { UTM_Medium: utm.medium } : {}),
    ...(utm.campaign ? { UTM_Campaign: utm.campaign } : {}),
  };

  try {
    // 1. Who is submitting?
    let lead: CrmLead | null = null;
    let matchedBy = "";
    if (isValidRef(input.ref)) {
      lead = await findLeadByReference(input.ref);
      if (lead) matchedBy = "personal invitation reference";
    }
    let decision: EmailDecision | null = null;
    if (!lead) {
      decision = decideByEmail(await findLeadsByAnyEmail(email), s);
      if (decision.kind === "same") {
        lead = decision.lead;
        matchedBy = decision.how;
      }
    }

    // 1a. Uncertain identity: flag for manual review, merge and create nothing.
    if (decision?.kind === "review") {
      const target = decision.leads[0];
      const others = decision.leads.map((l) => l.id).join(", ");
      for (const l of decision.leads) {
        await updateLead(l.id, { PLMA_Duplicate_Review: true, PLMA_Duplicate_Reason: decision.reason.slice(0, 255) });
      }
      await addLeadNote(
        target.id,
        "PLMA 2026 enquiry – needs manual review",
        [
          `Received: ${submittedAt}`,
          `Reason: ${decision.reason}`,
          `Leads involved: ${others}`,
          `Nothing was merged, overwritten or created. Decide which person this is, then copy the details across.`,
          ``,
          `Submitted details:`,
          ...summary(s),
          `Consent to be contacted: yes; offer terms accepted (terms dated ${termsVersion})`,
          contacts.length ? `Colleagues listed (not created): ${contacts.map((c) => `${c.name} <${c.email}>`).join("; ")}` : "",
          ``,
          `Enquiry:`,
          s.requirements || "(no message)",
        ].join("\n"),
      );
      return reply({ ok: true, contactsForReview: contacts.length });
    }

    let leadId: string;
    let companyId: string;
    let companyName: string;
    let companyBooth: string;
    let submitterName: string;

    if (lead) {
      // 1b. Known person (scenario A): store what they typed in Submitted_* only.
      leadId = lead.id;
      const extras = await getLeadExtras(lead.id).catch(() => null);
      const knownExtra = parseEmailList(extras?.Submitted_Additional_Emails);
      const ownEmails = [...leadEmails(lead), ...knownExtra];
      const mergedExtra = uniqueEmails([...knownExtra, ...s.additionalEmails], [email]);

      const previous = {
        Name: lead.Submitted_Name || originalName(lead),
        Email: lead.Submitted_Email || lead.Email || "",
        Company: lead.Submitted_Company || lead.Company || "",
        Phone: lead.Submitted_Phone || lead.Phone || lead.Mobile || "",
        "Job title": lead.Submitted_Job_Title || lead.Designation || "",
        Website: lead.Submitted_Website || lead.Website || "",
        Booth: lead.Submitted_Booth_Number || lead.Booth_Number || "",
      };
      const now = { Name: s.name, Email: s.email, Company: s.company, Phone: s.phone, "Job title": s.jobTitle, Website: s.website, Booth: s.booth };
      const changes = (Object.keys(now) as (keyof typeof now)[])
        .filter((k) => now[k] && now[k].trim().toLowerCase() !== previous[k].trim().toLowerCase())
        .map((k) => `${k}: "${previous[k] || "(blank)"}" → "${now[k]}"`);
      const newExtra = mergedExtra.filter((e) => !knownExtra.includes(e));
      if (newExtra.length) changes.push(`Additional emails added: ${newExtra.join(", ")}`);

      // A new personal email that already belongs to someone else: keep the submission on this
      // Lead (the reference/name proves who it is) but flag both for review. Never merge.
      let reviewReason = "";
      const newOwnEmails = [s.email, ...newExtra].filter((e) => !ownEmails.includes(e) && !isSharedInbox(e));
      for (const e of newOwnEmails) {
        const elsewhere = (await findLeadsByAnyEmail(e)).filter((l) => l.id !== lead!.id);
        if (elsewhere.length) {
          reviewReason = `Submitted email ${e} is also on Lead ${elsewhere.map((l) => l.id).join(", ")}`;
          break;
        }
      }

      // Every Lead should already have a Company ID (backfilled); mint one if it does not.
      companyId = lead.PLMA_Company_ID || newCompanyId();
      const previousReq = (lead.ERP_Requirements ?? "").trim();
      await updateLead(leadId, {
        ...tracking,
        ...(lead.PLMA_Company_ID ? {} : { PLMA_Company_ID: companyId }),
        Submitted_Name: s.name,
        Submitted_Email: s.email,
        Submitted_Company: s.company,
        ...(s.phone ? { Submitted_Phone: s.phone } : {}),
        ...(s.jobTitle ? { Submitted_Job_Title: s.jobTitle } : {}),
        ...(s.website ? { Submitted_Website: s.website } : {}),
        ...(s.booth ? { Submitted_Booth_Number: s.booth } : {}),
        ...(mergedExtra.length ? { Submitted_Additional_Emails: mergedExtra.join("\n") } : {}),
        ...(reviewReason ? { PLMA_Duplicate_Review: true, PLMA_Duplicate_Reason: reviewReason.slice(0, 255) } : {}),
        ERP_Requirements: (previousReq ? `${enquiryLine}\n\n${previousReq}` : enquiryLine).slice(0, MAX_REQUIREMENTS),
      });
      if (changes.length) {
        await addLeadNote(
          leadId,
          "PLMA 2026 – details changed by the contact",
          [`Submitted: ${submittedAt}`, `Original imported fields were not changed. New values are in the Submitted fields.`, "", ...changes].join("\n"),
        ).catch(() => console.error("PLMA enquiry: change note failed (lead saved)"));
      }

      companyName = lead.Company || s.company;
      companyBooth = lead.Booth_Number || s.booth;
      submitterName = s.name;
    } else {
      // 1c. New person (no reference, email unknown, or scenario B/D).
      const companyLead = decision?.kind === "new" ? decision.companyLead : null;
      matchedBy = decision?.how ?? "new person";
      companyId = companyLead?.PLMA_Company_ID || newCompanyId();
      companyName = companyLead?.Company || s.company;
      companyBooth = companyLead?.Booth_Number || s.booth;
      submitterName = s.name;
      const { first, last } = splitName(s.name);
      const reference = newReference();
      leadId = await createLead({
        ...tracking,
        First_Name: first || undefined,
        Last_Name: last,
        Email: s.email,
        Company: companyName.slice(0, 200),
        ...(s.phone ? { Phone: s.phone } : {}),
        ...(s.jobTitle ? { Designation: s.jobTitle } : {}),
        ...(s.website ? { Website: s.website } : {}),
        ...(companyBooth ? { Booth_Number: companyBooth } : {}),
        Submitted_Name: s.name,
        Submitted_Email: s.email,
        Submitted_Company: s.company,
        ...(s.phone ? { Submitted_Phone: s.phone } : {}),
        ...(s.jobTitle ? { Submitted_Job_Title: s.jobTitle } : {}),
        ...(s.website ? { Submitted_Website: s.website } : {}),
        ...(s.booth ? { Submitted_Booth_Number: s.booth } : {}),
        ...(s.additionalEmails.length ? { Submitted_Additional_Emails: s.additionalEmails.join("\n") } : {}),
        ERP_Requirements: enquiryLine.slice(0, MAX_REQUIREMENTS),
        PLMA_Company_ID: companyId,
        PLMA_Contact_Role: "Self-registered",
        Attendee_Reference_Hash: reference.hash,
        Offer_URL: reference.offerUrl,
        Lead_Source: "PLMA 2026",
        Conference_Name: isTestLead(companyLead) ? TEST_CONFERENCE_NAME : "PLMA 2026",
        Conference_Source: "PLMA 2026 landing page",
        Credit_Offer_Status: "Pending Review",
        Tag: [{ name: "PLMA 2026" }],
      });
      lead = { id: leadId, Conference_Name: isTestLead(companyLead) ? TEST_CONFERENCE_NAME : "PLMA 2026" };
    }

    // 2. Campaign status and audit note: best-effort, the Lead is already saved.
    if (!isTestLead(lead)) {
      try {
        await addLeadToCampaign(leadId, "Responded");
      } catch (error) {
        // A 401/403 here usually means the refresh token lacks ZohoCRM.modules.campaigns.UPDATE.
        console.error(
          "PLMA enquiry: campaign status update failed (lead saved):",
          error instanceof ZohoError ? `HTTP ${error.status ?? "?"}` : "unknown error",
        );
      }
    }
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
        s.requirements || "(no message)",
      ].join("\n"),
    ).catch(() => console.error("PLMA enquiry: audit note failed (lead saved)"));

    // 3. Colleagues added with "Add another contact".
    let added = 0;
    let known = 0;
    let review = 0;
    if (contacts.length) {
      const result = await addColleagues({
        submitter: { id: leadId, name: submitterName, email: s.email, test: isTestLead(lead) },
        companyId,
        companyName,
        booth: companyBooth,
        contacts,
        submittedAt,
      });
      ({ added, known, review } = result);
    }

    return reply({ ok: true, ...(contacts.length ? { contactsAdded: added, contactsAlreadyKnown: known, contactsForReview: review } : {}) });
  } catch {
    // Deliberately no personal data in logs.
    console.error("PLMA enquiry: Zoho CRM write failed");
    return reply({ ok: false, reason: "crm_error" }, 502);
  }
}

async function addColleagues(args: {
  submitter: { id: string; name: string; email: string; test: boolean };
  companyId: string;
  companyName: string;
  booth: string;
  contacts: ContactInput[];
  submittedAt: string;
}) {
  const { submitter, companyId, companyName, booth, submittedAt } = args;
  const atCompany = companyId ? await findLeadsByCompanyId(companyId) : [];
  const handled: ContactInput[] = [];
  const log: string[] = [];
  let added = 0;
  let known = 0;
  let review = 0;

  for (const c of args.contacts) {
    // Same person twice in this request, or the submitter themselves.
    if (handled.some((h) => h.email === c.email || samePersonName(h.name, c.name))) continue;
    handled.push(c);
    if (c.email === submitter.email || samePersonName(c.name, submitter.name)) {
      known++;
      log.push(`${c.name}: same person as the submitter, not created`);
      continue;
    }
    const existing = atCompany.find(
      (l) =>
        leadNames(l).some((n) => samePersonName(n, c.name)) ||
        (!isSharedInbox(c.email) && leadEmails(l).includes(c.email)),
    );
    if (existing) {
      known++;
      log.push(`${c.name}: already in the CRM (Lead ${existing.id}), not created`);
      continue;
    }
    const elsewhere = isSharedInbox(c.email)
      ? []
      : (await findLeadsByAnyEmail(c.email)).filter((l) => !companyId || l.PLMA_Company_ID !== companyId);
    if (elsewhere.length) {
      review++;
      const reason = `Colleague email ${c.email} (added by Lead ${submitter.id}) is already on Lead ${elsewhere.map((l) => l.id).join(", ")}`;
      await updateLead(elsewhere[0].id, { PLMA_Duplicate_Review: true, PLMA_Duplicate_Reason: reason.slice(0, 255) });
      log.push(`${c.name}: email already on another Lead (${elsewhere.map((l) => l.id).join(", ")}), flagged for review, not created`);
      continue;
    }
    const { first, last } = splitName(c.name);
    const reference = newReference();
    const id = await createLead({
      First_Name: first || undefined,
      Last_Name: last,
      Email: c.email,
      ...(c.jobTitle ? { Designation: c.jobTitle } : {}),
      Company: companyName.slice(0, 200),
      ...(booth ? { Booth_Number: booth } : {}),
      PLMA_Company_ID: companyId,
      PLMA_Contact_Role: "Added by Colleague",
      PLMA_Response_Status: "Not Submitted",
      PLMA_Show_First_Name: false,
      Attendee_Reference_Hash: reference.hash,
      Offer_URL: reference.offerUrl,
      Lead_Source: "PLMA 2026",
      Conference_Name: submitter.test ? TEST_CONFERENCE_NAME : "PLMA 2026",
      Conference_Source: "PLMA 2026 landing page – added by a colleague",
      Credit_Offer_Status: "Pending Review",
      Description: `Added on ${submittedAt.slice(0, 10)} by a colleague's PLMA 2026 enquiry (Lead ${submitter.id}). This person has not submitted the form, has not given consent and has not been contacted.`,
    });
    added++;
    atCompany.push({ id, First_Name: first, Last_Name: last, Email: c.email, PLMA_Company_ID: companyId });
    log.push(`${c.name}: new Lead ${id}`);
  }

  await addLeadNote(submitter.id, "PLMA 2026 – colleagues added by this contact", [`Submitted: ${submittedAt}`, "", ...log].join("\n")).catch(() =>
    console.error("PLMA enquiry: colleagues note failed"),
  );
  return { added, known, review };
}
