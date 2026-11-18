// Server-only Zoho CRM client for the PLMA 2026 campaign (Leads module, org945149959).
//
// Credentials come from .env.local (see .env.example) and are only read here, inside route
// handlers. Nothing in this file may be imported by a client component.
//
// Required OAuth scopes for the Self Client refresh token:
//   ZohoCRM.modules.leads.ALL,ZohoCRM.modules.campaigns.READ,ZohoCRM.modules.campaigns.UPDATE,ZohoCRM.modules.notes.CREATE,ZohoCRM.coql.READ

import { createHash, randomBytes } from "node:crypto";

if (typeof window !== "undefined") {
  throw new Error("lib/plma/zoho.server.ts must only run on the server");
}

const API_VERSION = "v8";
const TIMEOUT_MS = 10_000;

/** The PLMA 2026 – Complimentary ERP Module campaign in Zoho CRM (not a secret). */
export const PLMA_CAMPAIGN_ID = process.env.ZOHO_PLMA_CAMPAIGN_ID || "7671386000000694366";

/** Conference Name of internal test Leads. They are never added to the real PLMA campaign. */
export const TEST_CONFERENCE_NAME = "PLMA 2026 (test)";

/** Last Name used at import for companies where no contact name was found. Never pre-filled. */
export const PLACEHOLDER_LAST_NAME = "PLMA 2026 exhibitor";

function config() {
  return {
    clientId: process.env.ZOHO_CLIENT_ID ?? "",
    clientSecret: process.env.ZOHO_CLIENT_SECRET ?? "",
    refreshToken: process.env.ZOHO_REFRESH_TOKEN ?? "",
    accountsUrl: (process.env.ZOHO_ACCOUNTS_URL || "https://accounts.zoho.com").replace(/\/$/, ""),
    apiDomain: (process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.com").replace(/\/$/, ""),
  };
}

export function zohoConfigured(): boolean {
  const c = config();
  return Boolean(c.clientId && c.clientSecret && c.refreshToken);
}

export class ZohoError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingToken: Promise<string> | null = null;

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

async function accessToken(force = false): Promise<string> {
  if (!force && cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  if (pendingToken) return pendingToken;
  pendingToken = (async () => {
    const c = config();
    const body = new URLSearchParams({
      refresh_token: c.refreshToken,
      client_id: c.clientId,
      client_secret: c.clientSecret,
      grant_type: "refresh_token",
    });
    const response = await fetchWithTimeout(`${c.accountsUrl}/oauth/v2/token`, { method: "POST", body });
    const json = (await response.json().catch(() => ({}))) as { access_token?: string; expires_in?: number };
    if (!response.ok || !json.access_token) throw new ZohoError("Zoho token refresh failed", response.status);
    cachedToken = { value: json.access_token, expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 };
    return json.access_token;
  })();
  try {
    return await pendingToken;
  } finally {
    pendingToken = null;
  }
}

async function zoho<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T | null> {
  const send = async (token: string) =>
    fetchWithTimeout(`${config().apiDomain}/crm/${API_VERSION}${path}`, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });

  let response = await send(await accessToken());
  if (response.status === 401) response = await send(await accessToken(true));
  if (response.status === 204) return null;
  const json = (await response.json().catch(() => null)) as T | null;
  if (!response.ok) throw new ZohoError(`Zoho ${init.method ?? "GET"} ${path.split("?")[0]} failed`, response.status);
  return json;
}

export function hashReference(ref: string): string {
  return createHash("sha256").update(ref, "utf8").digest("hex");
}

export type CrmLead = {
  id: string;
  First_Name?: string | null;
  Last_Name?: string | null;
  Email?: string | null;
  Secondary_Email?: string | null;
  Company?: string | null;
  Phone?: string | null;
  Mobile?: string | null;
  Booth_Number?: string | null;
  Designation?: string | null;
  Website?: string | null;
  ERP_Requirements?: string | null;
  Conference_Name?: string | null;
  PLMA_Company_ID?: string | null;
  PLMA_Contact_Role?: string | null;
  PLMA_Response_Status?: string | null;
  Submitted_Name?: string | null;
  Submitted_Email?: string | null;
  Submitted_Company?: string | null;
  Submitted_Phone?: string | null;
  Submitted_Job_Title?: string | null;
  Submitted_Website?: string | null;
  Submitted_Booth_Number?: string | null;
  Submitted_Additional_Emails?: string | null;
  PLMA_Show_First_Name?: boolean | null;
};

// Phase 2 fields (Leads): PLMA_Company_ID, PLMA_Contact_Role, Submitted_* (what the person typed;
// the original imported fields are never overwritten), PLMA_Duplicate_Review/_Reason.
const LEAD_FIELDS = [
  "id", "First_Name", "Last_Name", "Email", "Secondary_Email", "Company", "Phone", "Mobile", "Booth_Number",
  "Designation", "Website", "ERP_Requirements", "Conference_Name", "PLMA_Company_ID", "PLMA_Contact_Role",
  "PLMA_Response_Status", "Submitted_Name", "Submitted_Email", "Submitted_Company", "Submitted_Phone",
  "Submitted_Job_Title", "Submitted_Website", "Submitted_Booth_Number",
].join(", ");

/** Company IDs are minted by us ("PLMA26-C0003", "PLMA26-W7Q2K9XD"): safe inside a COQL literal. */
export const COMPANY_ID_RE = /^PLMA26-[A-Z0-9]{4,12}$/;
/** Emails that can be put in a COQL string literal as they are. */
const COQL_EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/;

const OFFER_BASE = "https://www.sesameerp.ai/chicago-event";

/** A new secure reference for a new person: the link (kept by the CRM in Offer URL) and its hash. */
export function newReference() {
  const ref = randomBytes(16).toString("base64url"); // 22 characters, 128 bits
  return { ref, hash: hashReference(ref), offerUrl: `${OFFER_BASE}?ref=${ref}` };
}

/** New company identifier for a company that is not on the imported list (self-registered). */
export function newCompanyId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  return `PLMA26-W${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}

type LeadExtras = { Submitted_Additional_Emails?: string | null; PLMA_Last_Submission_Key?: string | null };

/**
 * One Lead by id with the extra fields the form needs: the multi-line additional emails, and the
 * key of the last submission that started the Zoho email workflow (used to recognise retries).
 */
export async function getLeadExtras(id: string): Promise<LeadExtras | null> {
  if (!/^[A-Za-z0-9]{1,25}$/.test(id)) return null;
  const result = await zoho<{ data?: LeadExtras[] }>(
    `/Leads/${id}?fields=Submitted_Additional_Emails,PLMA_Last_Submission_Key`,
  );
  return result?.data?.[0] ?? null;
}

/**
 * Leads whose primary, secondary or previously submitted email is this address (COQL, real time).
 * Addresses that cannot be put in a COQL literal fall back to the search API (primary email only).
 */
export async function findLeadsByAnyEmail(email: string): Promise<CrmLead[]> {
  if (COQL_EMAIL_RE.test(email)) {
    const result = await zoho<{ data?: CrmLead[] }>("/coql", {
      method: "POST",
      body: {
        // Zoho COQL accepts at most two conditions per group, so three are nested in pairs.
        select_query: `select ${LEAD_FIELDS} from Leads where ((Email = '${email}' or Secondary_Email = '${email}') or Submitted_Email = '${email}') order by Modified_Time desc limit 20`,
      },
    });
    return result?.data ?? [];
  }
  return findLeadsByEmail(email);
}

/** Every Lead with this Company ID (people at one company). */
export async function findLeadsByCompanyId(companyId: string): Promise<CrmLead[]> {
  if (!COMPANY_ID_RE.test(companyId)) return [];
  const result = await zoho<{ data?: CrmLead[] }>("/coql", {
    method: "POST",
    body: { select_query: `select ${LEAD_FIELDS} from Leads where PLMA_Company_ID = '${companyId}' limit 200` },
  });
  return result?.data ?? [];
}

type SubmitterRow = Pick<CrmLead, "id" | "First_Name" | "Last_Name" | "Submitted_Name" | "PLMA_Show_First_Name">;

/** A person's first name for display: the name they submitted, else the CRM first name. Null when unusable. */
export function displayFirstName(row: Pick<CrmLead, "First_Name" | "Last_Name" | "Submitted_Name">): string | null {
  const fromSubmitted = (row.Submitted_Name ?? "").trim().split(/\s+/)[0] ?? "";
  const fromCrm = (row.First_Name ?? "").trim().split(/\s+/)[0] ?? "";
  const first = (fromSubmitted || fromCrm).replace(/[.,]$/, "");
  // Letters, apostrophes and hyphens only (no emails, numbers or initials); 2–40 characters.
  return /^[\p{L}][\p{L}'’-]{1,39}$/u.test(first) ? first : null;
}

/**
 * OTHER people at this company (same PLMA Company ID) whose PLMA Response Status is Submitted, the
 * current person excluded. Returns the total and the first names of those who gave permission to
 * show their first name (PLMA_Show_First_Name), earliest submission first.
 */
export async function otherSubmitters(companyId: string, selfId: string): Promise<{ count: number; names: string[] }> {
  if (!COMPANY_ID_RE.test(companyId)) return { count: 0, names: [] };
  const result = await zoho<{ data?: SubmitterRow[] }>("/coql", {
    method: "POST",
    body: {
      select_query: `select id, First_Name, Last_Name, Submitted_Name, PLMA_Show_First_Name from Leads where PLMA_Company_ID = '${companyId}' and PLMA_Response_Status = 'Submitted' order by PLMA_Submission_Date asc limit 200`,
    },
  });
  const others = (result?.data ?? []).filter((row) => row.id !== selfId);
  const names: string[] = [];
  for (const row of others) {
    if (row.PLMA_Show_First_Name !== true) continue;
    const first = displayFirstName(row);
    if (first) names.push(first);
  }
  return { count: others.length, names };
}

/** The lead whose Attendee Reference Hash matches. Null when none, or when (unexpectedly) more than one. */
export async function findLeadByReference(ref: string): Promise<CrmLead | null> {
  const hash = hashReference(ref); // 64 hex characters: safe inside the COQL string literal
  const result = await zoho<{ data?: CrmLead[] }>("/coql", {
    method: "POST",
    body: { select_query: `select ${LEAD_FIELDS} from Leads where Attendee_Reference_Hash = '${hash}' limit 2` },
  });
  const rows = result?.data ?? [];
  return rows.length === 1 ? rows[0] : null;
}

/**
 * Leads with this email. Uses COQL (reads the database directly, so a Lead created seconds ago is
 * found and a quick repeat submission cannot create a duplicate). Zoho's search API lags behind
 * new records, so it is only used for unusual addresses that cannot be put in a COQL literal.
 */
export async function findLeadsByEmail(email: string): Promise<CrmLead[]> {
  if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/.test(email)) {
    const result = await zoho<{ data?: CrmLead[] }>("/coql", {
      method: "POST",
      body: { select_query: `select ${LEAD_FIELDS} from Leads where Email = '${email}' order by Modified_Time desc limit 10` },
    });
    return result?.data ?? [];
  }
  const fields = LEAD_FIELDS.replace(/\s/g, "");
  const result = await zoho<{ data?: CrmLead[] }>(
    `/Leads/search?email=${encodeURIComponent(email)}&fields=${fields}&per_page=10`,
  );
  return result?.data ?? [];
}

type WriteResult = { data?: { status: string; code: string; details?: { id?: string } }[] };

function firstId(result: WriteResult | null, action: string): string {
  const row = result?.data?.[0];
  if (!row || row.status !== "success" || !row.details?.id) throw new ZohoError(`Zoho ${action} rejected (${row?.code ?? "no data"})`);
  return row.details.id;
}

// trigger: [] — no workflow rules, approvals or blueprints run, so no automatic or promotional
// emails are sent by these writes. The one exception is `{ workflow: true }`, used only by the
// enquiry route for the single write that records a genuinely new PLMA 2026 submission: that write
// lets Zoho's "PLMA 2026 New enquiry" workflow send the internal notification and the customer
// confirmation and create the follow-up task (docs/plma-2026-phase2.md, "Enquiry emails").
export async function updateLead(id: string, data: Record<string, unknown>, options: { workflow?: boolean } = {}): Promise<void> {
  const trigger = options.workflow ? ["workflow"] : [];
  firstId(await zoho<WriteResult>(`/Leads/${id}`, { method: "PUT", body: { data: [data], trigger } }), "update");
}

export async function createLead(data: Record<string, unknown>): Promise<string> {
  return firstId(await zoho<WriteResult>("/Leads", { method: "POST", body: { data: [data], trigger: [] } }), "create");
}

export async function addLeadToCampaign(leadId: string, memberStatus: string): Promise<void> {
  await zoho(`/Leads/${leadId}/Campaigns`, {
    method: "PUT",
    body: { data: [{ id: PLMA_CAMPAIGN_ID, Member_Status: memberStatus }] },
  });
}

export async function addLeadNote(leadId: string, title: string, content: string): Promise<void> {
  await zoho("/Notes", {
    method: "POST",
    body: {
      data: [{ Note_Title: title.slice(0, 120), Note_Content: content.slice(0, 32000), Parent_Id: { module: { api_name: "Leads" }, id: leadId } }],
    },
  });
}
