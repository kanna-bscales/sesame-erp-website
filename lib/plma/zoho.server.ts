// Server-only Zoho CRM client for the PLMA 2026 campaign (Leads module, org945149959).
//
// Credentials come from .env.local (see .env.example) and are only read here, inside route
// handlers. Nothing in this file may be imported by a client component.
//
// Required OAuth scopes for the Self Client refresh token:
//   ZohoCRM.modules.leads.ALL,ZohoCRM.modules.campaigns.READ,ZohoCRM.modules.notes.CREATE,ZohoCRM.coql.READ

import { createHash } from "node:crypto";

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
  Company?: string | null;
  Phone?: string | null;
  Mobile?: string | null;
  Booth_Number?: string | null;
  Designation?: string | null;
  Website?: string | null;
  ERP_Requirements?: string | null;
  Conference_Name?: string | null;
};

const LEAD_FIELDS = "id, First_Name, Last_Name, Email, Company, Phone, Mobile, Booth_Number, Designation, Website, ERP_Requirements, Conference_Name";

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
// emails are sent by these writes.
export async function updateLead(id: string, data: Record<string, unknown>): Promise<void> {
  firstId(await zoho<WriteResult>(`/Leads/${id}`, { method: "PUT", body: { data: [data], trigger: [] } }), "update");
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
