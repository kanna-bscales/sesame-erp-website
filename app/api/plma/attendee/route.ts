// POST /api/plma/attendee  { ref }  ->  { found: true, fields, company } | { found: false }
//
// Looks up the invited person's Lead by the secure reference from their personal link and returns
// only the fields the registration form may pre-fill. A booth number alone never returns
// anything. Unknown, malformed and ambiguous references all get the same answer.
//
// Pre-fill uses the latest values this person submitted (Submitted_* fields) when they exist,
// otherwise the original imported values. `company` describes OTHER people with the same PLMA
// Company ID who have submitted: their number, plus the first names of only those who allowed it
// (PLMA Show First Name). Never surnames, emails, enquiries or notes.

import { parseEmailList } from "@/lib/plma/identity";
import { clientIp, rateLimit } from "@/lib/plma/rate-limit";
import { isValidRef, type AttendeeLookupResponse } from "@/lib/plma/reference";
import {
  otherSubmitters,
  findLeadByReference,
  getLeadExtras,
  PLACEHOLDER_LAST_NAME,
  zohoConfigured,
} from "@/lib/plma/zoho.server";

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

function reply(body: AttendeeLookupResponse, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

const clean = (value: string | null | undefined, max: number) => (value ?? "").trim().slice(0, max);
/** Latest submitted value when there is one, otherwise the original. */
const latest = (submitted: string | null | undefined, original: string | null | undefined, max: number) =>
  clean(submitted, max) || clean(original, max);

export async function POST(request: Request) {
  if (!rateLimit(`lookup:${clientIp(request)}`, 20, 10 * 60_000)) return reply({ found: false }, 429);

  let ref: unknown;
  try {
    ref = ((await request.json()) as { ref?: unknown })?.ref;
  } catch {
    return reply({ found: false }, 400);
  }
  if (!isValidRef(ref) || !zohoConfigured()) return reply({ found: false });

  try {
    const lead = await findLeadByReference(ref);
    if (!lead) return reply({ found: false });
    const last = lead.Last_Name === PLACEHOLDER_LAST_NAME ? "" : clean(lead.Last_Name, 80);
    const originalName = last ? [clean(lead.First_Name, 40), last].filter(Boolean).join(" ") : "";

    // Both extras are best-effort: the form still pre-fills if either call fails.
    const [extras, others] = await Promise.all([
      lead.Submitted_Name || lead.Submitted_Email ? getLeadExtras(lead.id).catch(() => null) : Promise.resolve(null),
      lead.PLMA_Company_ID
        ? otherSubmitters(lead.PLMA_Company_ID, lead.id).catch(() => ({ count: 0, names: [] as string[] }))
        : Promise.resolve({ count: 0, names: [] as string[] }),
    ]);

    return reply({
      found: true,
      fields: {
        name: latest(lead.Submitted_Name, originalName, 120),
        email: latest(lead.Submitted_Email, lead.Email, 100),
        company: latest(lead.Submitted_Company, lead.Company, 200),
        phone: latest(lead.Submitted_Phone, lead.Phone || lead.Mobile, 30),
        booth: latest(lead.Submitted_Booth_Number, lead.Booth_Number, 20),
        jobTitle: latest(lead.Submitted_Job_Title, lead.Designation, 100),
        website: latest(lead.Submitted_Website, lead.Website, 255),
        additionalEmails: parseEmailList(extras?.Submitted_Additional_Emails).slice(0, 5),
      },
      // The verified company name comes from the original import, not from anything submitted.
      company: lead.PLMA_Company_ID
        ? { name: clean(lead.Company, 200), otherSubmitted: others.count, names: others.names.slice(0, 10) }
        : null,
    });
  } catch {
    // CRM unavailable: the visitor simply gets the blank form. No details are logged.
    return reply({ found: false });
  }
}
