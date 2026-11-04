// PLMA 2026 personal invitation links: …/chicago-event?booth=F2542&ref=<attendee reference>.
//
// The reference is a random 22-character token (128 bits) minted per attendee by
// data/plma-2026/build_offer_urls.py. Only its SHA-256 hash is stored in Zoho CRM
// (Leads › Attendee Reference Hash), so the CRM never holds the link itself. The booth number is
// for tracking only and is never used on its own to look anyone up.
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
};

export type AttendeeLookupResponse = { found: true; fields: AttendeePrefill } | { found: false };

export type EnquiryErrorKey = "name" | "email" | "phone" | "company" | "booth" | "website" | "consent" | "terms";

export type EnquiryResponse =
  | { ok: true }
  | { ok: false; reason: "invalid"; errors: EnquiryErrorKey[] }
  | { ok: false; reason: "not_configured" | "rate_limited" | "crm_error" | "bad_request" };
