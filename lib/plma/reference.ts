// PLMA 2026 personal invitation links: https://www.sesameerp.ai/chicago-event?ref=<attendee reference>.
//
// The reference is a random 22-character token (128 bits) minted per attendee by
// data/plma-2026/build_offer_urls.py. Only its SHA-256 hash is stored in Zoho CRM
// (Leads › Attendee Reference Hash), so the CRM never holds the link itself. Booth numbers are
// not part of the link and are never used to look anyone up.
//
// Safe to import from client and server code: no secrets here.

export const refParam = "ref";
export const REF_RE = /^[A-Za-z0-9_-]{22}$/;
export const BOOTH_RE = /^[A-Za-z0-9-]{1,20}$/;

export function isValidRef(value: unknown): value is string {
  return typeof value === "string" && REF_RE.test(value);
}

/** Lead fields the landing page may pre-fill. Nothing else ever leaves the server. */
export type AttendeePrefill = {
  name: string;
  email: string;
  company: string;
  phone: string;
  booth: string;
  jobTitle: string;
  website: string;
  /** Extra addresses this same person submitted earlier (never researched data). */
  additionalEmails: string[];
};

/**
 * Company-level context for the "colleagues already submitted" message, present only for a valid
 * personal reference (same verified PLMA Company ID, current person excluded).
 * - `otherSubmitted`: how many OTHER people at the company have submitted.
 * - `names`: first names of those of them who ticked "show my first name to colleagues"
 *   (PLMA_Show_First_Name). Never surnames, emails, enquiries or anything else.
 */
export type CompanyContext = { name: string; otherSubmitted: number; names: string[] };

/**
 * `firstName`: the person's own first name for the welcome message (latest submitted name, else the
 * CRM first name; letters only). Null when the record has no usable first name.
 */
export type AttendeeLookupResponse =
  | { found: true; fields: AttendeePrefill; firstName: string | null; company: CompanyContext | null }
  | { found: false };

/** Limits for one submission (also enforced on the server). */
export const LIMITS = {
  additionalEmails: 5,
  contacts: 10,
  requestBytes: 24_000,
} as const;

/** A colleague the visitor adds with "Add another contact". Becomes a separate Lead. */
export type ContactInput = { name: string; email: string; jobTitle: string };

export type EnquiryErrorKey =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "booth"
  | "website"
  | "consent"
  | "terms"
  | "additionalEmails"
  | `contact.${number}.name`
  | `contact.${number}.email`;

export type EnquiryResponse =
  | { ok: true; contactsAdded?: number; contactsAlreadyKnown?: number; contactsForReview?: number }
  | { ok: false; reason: "invalid"; errors: EnquiryErrorKey[] }
  | { ok: false; reason: "not_configured" | "rate_limited" | "crm_error" | "bad_request" | "too_large" };

/** Generic/shared inboxes (info@, sales@ …). Never treated as one person's identity. */
export const SHARED_INBOX_RE =
  /^(info|sales|contact|hello|office|admin|customerservice|customer\.service|service|support|orders|marketing|inquiries|enquiries|inquiry|export|exports|hr|careers|jobs|mail|team|general|privatelabel|private\.label|accounts|purchasing|procurement)([._+-].*)?@/i;

export function isSharedInbox(email: string): boolean {
  return SHARED_INBOX_RE.test(email.trim());
}
