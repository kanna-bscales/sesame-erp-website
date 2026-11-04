// POST /api/plma/attendee  { ref }  ->  { found: true, fields } | { found: false }
//
// Looks up the invited attendee's Lead by the secure reference from their personal link and
// returns only the seven fields the registration form may pre-fill. A booth number alone never
// returns anything. Unknown, malformed and ambiguous references all get the same answer.

import { clientIp, rateLimit } from "@/lib/plma/rate-limit";
import { isValidRef, type AttendeeLookupResponse } from "@/lib/plma/reference";
import { findLeadByReference, PLACEHOLDER_LAST_NAME, zohoConfigured } from "@/lib/plma/zoho.server";

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

function reply(body: AttendeeLookupResponse, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

const clean = (value: string | null | undefined, max: number) => (value ?? "").trim().slice(0, max);

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
    return reply({
      found: true,
      fields: {
        name: last ? [clean(lead.First_Name, 40), last].filter(Boolean).join(" ") : "",
        email: clean(lead.Email, 100),
        company: clean(lead.Company, 200),
        phone: clean(lead.Phone || lead.Mobile, 30),
        booth: clean(lead.Booth_Number, 20),
        jobTitle: clean(lead.Designation, 100),
        website: clean(lead.Website, 255),
      },
    });
  } catch {
    // CRM unavailable: the visitor simply gets the blank form. No details are logged.
    return reply({ found: false });
  }
}
