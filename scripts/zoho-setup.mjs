#!/usr/bin/env node
// PLMA 2026 – one-time Zoho CRM API setup helper. Runs only on your computer.
//
//   node scripts/zoho-setup.mjs token   Exchange a Self Client "grant code" for a refresh token and
//                                       save it as ZOHO_REFRESH_TOKEN in .env.local.
//   node scripts/zoho-setup.mjs campaign-test
//                                       Proves the token can set a PLMA campaign member to
//                                       "Responded": creates ONE temporary fake Lead ("PLMA 2026
//                                       (test)"), adds it to the campaign, sets Responded, reads it
//                                       back, then deletes the fake Lead. No email, workflows off.
//   node scripts/zoho-setup.mjs check   Confirm the credentials in .env.local work (read-only:
//                                       lists the granted scopes, flags missing ones, counts
//                                       PLMA 2026 Leads; prints no personal data).
//
// Secrets are read from and written to .env.local only. Nothing secret is printed.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout, argv, exit } from "node:process";

const ENV_FILE = ".env.local";

function readEnv() {
  if (!existsSync(ENV_FILE)) return {};
  const env = {};
  for (const line of readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    // Tolerate a byte-order mark, Windows line endings, spaces and quotes around values.
    if (m) env[m[1]] = m[2].replace(/^\uFEFF/, "").trim().replace(/^["']|["']$/g, "").trim();
  }
  return env;
}

function setEnvValue(key, value) {
  const text = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
  const line = `${key}=${value}`;
  const re = new RegExp(`^\\s*${key}\\s*=.*$`, "m");
  const next = re.test(text) ? text.replace(re, line) : `${text}${text && !text.endsWith("\n") ? "\n" : ""}${line}\n`;
  writeFileSync(ENV_FILE, next, { mode: 0o600 });
}

const env = readEnv();

// Every scope the website needs. campaigns.UPDATE sets the campaign member status to "Responded".
const REQUIRED_SCOPES = [
  "ZohoCRM.modules.leads.ALL",
  "ZohoCRM.modules.campaigns.READ",
  "ZohoCRM.modules.campaigns.UPDATE",
  "ZohoCRM.modules.notes.CREATE",
  "ZohoCRM.coql.READ",
];

// Shape checks that never print the values themselves.
function checkShapes() {
  const problems = [];
  const id = env.ZOHO_CLIENT_ID ?? "";
  if (id && !/^1000\.[A-Z0-9]{20,40}$/.test(id)) {
    problems.push(
      `ZOHO_CLIENT_ID does not look like a Zoho Client ID (expected "1000." followed by capital letters/digits; ` +
        `starts with "1000.": ${id.startsWith("1000.")}, length ${id.length}).`,
    );
  }
  const secret = env.ZOHO_CLIENT_SECRET ?? "";
  if (secret && !/^[0-9a-f]{30,64}$/i.test(secret)) {
    problems.push(`ZOHO_CLIENT_SECRET contains unexpected characters (length ${secret.length}).`);
  }
  if (problems.length) {
    for (const p of problems) console.error(`✗ ${p}`);
    console.error(`Fix ${ENV_FILE} (copy the values again from API Console › Self Client › Client Secret) and run again.`);
    exit(1);
  }
}

/** Safe summary of a Zoho accounts response: status and error fields only, never tokens. */
function describe(res, json) {
  const parts = [`HTTP ${res.status}`];
  if (json.error) parts.push(`error=${json.error}`);
  if (json.error_description) parts.push(`description=${json.error_description}`);
  parts.push(`fields=[${Object.keys(json).join(", ")}]`);
  return parts.join(" ");
}
const accounts = (env.ZOHO_ACCOUNTS_URL || "https://accounts.zoho.com").replace(/\/$/, "");
const api = (env.ZOHO_API_DOMAIN || "https://www.zohoapis.com").replace(/\/$/, "");

function need(...keys) {
  const missing = keys.filter((k) => !env[k]);
  if (missing.length) {
    console.error(`Missing in ${ENV_FILE}: ${missing.join(", ")}. Add them (see .env.example) and run again.`);
    exit(1);
  }
}

async function token() {
  need("ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET");
  checkShapes();
  const rl = createInterface({ input: stdin, output: stdout });
  const code = (await rl.question("Paste the grant code from the Zoho API Console (valid for a few minutes): ")).trim();
  rl.close();
  if (!code) exit(1);
  if (!/^1000\.[0-9a-f]+\.[0-9a-f]+$/i.test(code)) {
    console.error(`That does not look like a Zoho grant code (expected "1000.<letters>.<letters>", length ${code.length}). Copy it again.`);
    exit(1);
  }
  const res = await fetch(`${accounts}/oauth/v2/token`, {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      code,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!json.refresh_token) {
    console.error(`Zoho did not return a refresh token: ${describe(res, json)}`);
    if (json.access_token) console.error("Zoho returned an access token but no refresh token: the code was generated without offline access.");
    console.error("Common causes: Client ID/Secret not from this Self Client, code expired or already used, wrong data centre.");
    exit(1);
  }
  setEnvValue("ZOHO_REFRESH_TOKEN", json.refresh_token);
  console.log(`Saved ZOHO_REFRESH_TOKEN to ${ENV_FILE}. Granted scopes: ${json.scope ?? "(not reported)"}`);
  console.log("Next: node scripts/zoho-setup.mjs check");
}

async function check() {
  need("ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN");
  checkShapes();
  const t = await fetch(`${accounts}/oauth/v2/token`, {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      refresh_token: env.ZOHO_REFRESH_TOKEN,
    }),
  }).then((r) => r.json());
  if (!t.access_token) {
    console.error(`Token refresh failed (${t.error ?? "unknown"}). Check the three values and the data centre.`);
    exit(1);
  }
  console.log("1/3 Access token: OK");
  // Scope names are not secret. Zoho returns them space- or comma-separated.
  const granted = String(t.scope ?? "").split(/[\s,]+/).filter(Boolean);
  if (granted.length) {
    const has = (s) => granted.some((g) => g.toLowerCase() === s.toLowerCase() || (s.endsWith(".UPDATE") && g.toLowerCase() === s.replace(/\.UPDATE$/, ".ALL").toLowerCase()));
    const missing = REQUIRED_SCOPES.filter((s) => !has(s));
    console.log(`2/3 Granted scopes: ${granted.join(", ")}`);
    if (missing.length) {
      console.error(`    Missing: ${missing.join(", ")}`);
      console.error("    Generate a new grant code with ALL of these scopes and run: node scripts/zoho-setup.mjs token");
      console.error(`    ${REQUIRED_SCOPES.join(",")}`);
    } else {
      console.log("    All required scopes present (campaign status can be set to Responded).");
    }
  } else {
    console.log("2/3 Granted scopes: not reported by Zoho for this token (use the 'Campaign status' test in docs).");
  }
  const r = await fetch(`${api}/crm/v8/coql`, {
    method: "POST",
    headers: { Authorization: `Zoho-oauthtoken ${t.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ select_query: "select COUNT(id) from Leads where Conference_Name = 'PLMA 2026'" }),
  });
  const j = await r.json().catch(() => ({}));
  const count = j?.data?.[0] ? Object.values(j.data[0])[0] : null;
  if (!r.ok || count === null) {
    console.error(`3/3 CRM query failed (${j.code ?? r.status}). Check the scopes include ZohoCRM.coql.READ and ZohoCRM.modules.leads.ALL.`);
    exit(1);
  }
  console.log(`3/3 CRM access: OK — ${count} PLMA 2026 Leads visible (718 primary attendees + additional contacts).`);
}

async function campaignTest() {
  need("ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN");
  const campaign = env.ZOHO_PLMA_CAMPAIGN_ID || "7671386000000694366";
  const t = await fetch(`${accounts}/oauth/v2/token`, {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      refresh_token: env.ZOHO_REFRESH_TOKEN,
    }),
  }).then((r) => r.json());
  if (!t.access_token) {
    console.error(`Token refresh failed (${t.error ?? "unknown"}).`);
    exit(1);
  }
  const H = { Authorization: `Zoho-oauthtoken ${t.access_token}`, "Content-Type": "application/json" };
  const call = async (path, init = {}) => {
    const r = await fetch(`${api}/crm/v8${path}`, { ...init, headers: H });
    return { status: r.status, json: await r.json().catch(() => ({})) };
  };
  const created = await call("/Leads", {
    method: "POST",
    body: JSON.stringify({
      data: [{ Last_Name: "PLMA campaign test (delete me)", Company: "PLMA TEST", Conference_Name: "PLMA 2026 (test)", Email_Opt_Out: true }],
      trigger: [],
    }),
  });
  const id = created.json?.data?.[0]?.details?.id;
  if (!id) {
    console.error(`Could not create the temporary test Lead (HTTP ${created.status}).`);
    exit(1);
  }
  let ok = false;
  try {
    const planned = await call(`/Leads/${id}/Campaigns`, { method: "PUT", body: JSON.stringify({ data: [{ id: campaign, Member_Status: "Planned" }] }) });
    const responded = await call(`/Leads/${id}/Campaigns`, { method: "PUT", body: JSON.stringify({ data: [{ id: campaign, Member_Status: "Responded" }] }) });
    const read = await call(`/Leads/${id}/Campaigns?fields=Campaign_Name,Member_Status`);
    const status = read.json?.data?.find((c) => c.id === campaign)?.$member_info?.Member_Status;
    console.log(`Add to campaign: HTTP ${planned.status}; set Responded: HTTP ${responded.status}; status read back: ${status ?? "(none)"}`);
    ok = status === "Responded";
    if (!ok && (responded.status === 401 || responded.status === 403)) {
      console.error("The token is missing ZohoCRM.modules.campaigns.UPDATE. Run 'check' for the full scope list.");
    }
  } finally {
    const del = await call(`/Leads?ids=${id}&wf_trigger=false`, { method: "DELETE" });
    console.log(`Temporary test Lead deleted: HTTP ${del.status}`);
  }
  console.log(ok ? "PASS: campaign status can be set to Responded." : "FAIL: campaign status was not set to Responded.");
  exit(ok ? 0 : 1);
}

const cmd = argv[2];
if (cmd === "token") await token();
else if (cmd === "check") await check();
else if (cmd === "campaign-test") await campaignTest();
else {
  console.log("Usage: node scripts/zoho-setup.mjs token | check | campaign-test");
  exit(1);
}
