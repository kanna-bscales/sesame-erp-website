// Fake Zoho (accounts + CRM v8) for Phase 2 tests. Fake people and companies only.
// Supports COQL: select … from Leads where <A = 'x' | A != 'x' joined by and/or, with parens> [order by …] [limit n]
const http = require('http'); const crypto = require('crypto');
const sha = r => crypto.createHash('sha256').update(r).digest('hex');
const state = { leads: {}, notes: [], camp: [], tokens: 0, calls: [], campaignForbidden: false };
let seq = 0;
function seed() {
  state.leads = {}; state.notes = []; state.camp = []; seq = 0;
  const add = (id, ref, o) => state.leads[id] = { id, Attendee_Reference_Hash: ref ? sha(ref) : null, Offer_URL: ref ? 'https://www.sesameerp.ai/chicago-event?ref=' + ref : null, Lead_Source: 'PLMA 2026', Conference_Name: 'PLMA 2026', Credit_Offer_Status: 'Pending Review', Consent_to_be_Contacted: false, PLMA_Response_Status: 'Not Submitted', Description: 'secret research notes', Research_Notes: 'private research', ERP_DM_1_Name: 'Private Person', ...o };
  // ABC Foods: one primary attendee + two research contacts
  add('P1', 'R1abcdefghijklmnopqrst', { First_Name: 'Ann', Last_Name: 'Able', Email: 'ann.able@abcfoods.example', Company: 'ABC Foods Inc', Booth_Number: 'F300', Designation: 'COO', Website: 'www.abcfoods.example', PLMA_Company_ID: 'PLMA26-C0002', PLMA_Contact_Role: 'Primary Attendee' });
  add('R2', 'R2abcdefghijklmnopqrst', { First_Name: 'Bob', Last_Name: 'Baker', Company: 'ABC Foods Inc', Booth_Number: 'F300', Designation: 'Plant Manager', PLMA_Company_ID: 'PLMA26-C0002', PLMA_Contact_Role: 'Research Contact' });
  add('R3', 'R3abcdefghijklmnopqrst', { First_Name: 'Cara', Last_Name: 'Cole', Company: 'ABC Foods Inc', Booth_Number: 'F300', Designation: 'CFO', PLMA_Company_ID: 'PLMA26-C0002', PLMA_Contact_Role: 'Research Contact' });
  // Two different companies sharing booth F500; Echo has already submitted.
  add('D1', 'RDabcdefghijklmnopqrst', { First_Name: 'Dan', Last_Name: 'Delta', Email: 'dan@delta.example', Company: 'Delta Snacks', Booth_Number: 'F500', PLMA_Company_ID: 'PLMA26-C0003', PLMA_Contact_Role: 'Primary Attendee' });
  add('E1', 'REabcdefghijklmnopqrst', { First_Name: 'Eve', Last_Name: 'Echo', Email: 'eve@echo.example', Company: 'Echo Bakery', Booth_Number: 'F500', PLMA_Company_ID: 'PLMA26-C0004', PLMA_Contact_Role: 'Primary Attendee', PLMA_Response_Status: 'Submitted' });
  // Pre-Phase-2 style record (no Company ID yet) with an old reference.
  add('L1', 'AAAAAAAAAAAAAAAAAAAAAA', { First_Name: 'Test', Last_Name: 'Person', Email: 'test.person@example.com', Company: 'Example Foods Inc', Booth_Number: 'F100', Designation: 'COO', Website: 'www.example.com', Phone: null });
  // Shared inbox company, and a personal email owner.
  add('G1', 'RGabcdefghijklmnopqrst', { First_Name: 'Gina', Last_Name: 'Gold', Email: 'info@gamma.example', Company: 'Gamma Foods LLC', Booth_Number: 'F600', PLMA_Company_ID: 'PLMA26-C0006', PLMA_Contact_Role: 'Primary Attendee' });
  add('H1', 'RHabcdefghijklmnopqrst', { First_Name: 'Hank', Last_Name: 'Hill', Email: 'hank@hotel.example', Company: 'Hotel Foods', Booth_Number: 'F700', PLMA_Company_ID: 'PLMA26-C0007', PLMA_Contact_Role: 'Primary Attendee' });
  // Placeholder-name lead
  add('B1', 'RBabcdefghijklmnopqrst', { First_Name: '', Last_Name: 'PLMA 2026 exhibitor', Email: 'info@beta.example.net', Company: 'Beta Bakery', Booth_Number: 'F800', PLMA_Company_ID: 'PLMA26-C0008', PLMA_Contact_Role: 'Primary Attendee' });
  // Name display (Nov 2026): ABC Foods (fake) — Prakash and Monesh submitted and allowed their first
  // name; Sarah and Ravi not submitted. Other companies cover one name, partial and no permission.
  const sub = { PLMA_Response_Status: 'Submitted' };
  add('K1', 'K1abcdefghijklmnopqrst', { First_Name: 'Prakash', Last_Name: 'Rao', Email: 'prakash.rao@abcfoods.example', Company: 'ABC Foods', Booth_Number: 'F900', PLMA_Company_ID: 'PLMA26-C0010', PLMA_Contact_Role: 'Primary Attendee', ...sub, PLMA_Show_First_Name: true, PLMA_Submission_Date: '2026-11-10T10:00:00+00:00' });
  add('K2', 'K2abcdefghijklmnopqrst', { First_Name: 'Monesh', Last_Name: 'Kumar', Company: 'ABC Foods', Booth_Number: 'F900', PLMA_Company_ID: 'PLMA26-C0010', PLMA_Contact_Role: 'Research Contact', ...sub, Submitted_Name: 'Monesh Kumar', Submitted_Email: 'monesh@abcfoods.example', PLMA_Show_First_Name: true, PLMA_Submission_Date: '2026-11-10T11:00:00+00:00' });
  add('K3', 'K3abcdefghijklmnopqrst', { First_Name: 'Sarah', Last_Name: 'Lee', Company: 'ABC Foods', Booth_Number: 'F900', PLMA_Company_ID: 'PLMA26-C0010', PLMA_Contact_Role: 'Research Contact' });
  add('K4', 'K4abcdefghijklmnopqrst', { First_Name: 'Ravi', Last_Name: 'Shah', Company: 'ABC Foods', Booth_Number: 'F900', PLMA_Company_ID: 'PLMA26-C0010', PLMA_Contact_Role: 'Research Contact' });
  add('M1', 'M1abcdefghijklmnopqrst', { First_Name: 'Priya', Last_Name: 'Nair', Company: 'XYZ Snacks', Booth_Number: 'F901', PLMA_Company_ID: 'PLMA26-C0011', ...sub, PLMA_Show_First_Name: true });
  add('M2', 'M2abcdefghijklmnopqrst', { First_Name: 'Kiran', Last_Name: 'Das', Company: 'XYZ Snacks', Booth_Number: 'F901', PLMA_Company_ID: 'PLMA26-C0011', ...sub, PLMA_Show_First_Name: false });
  add('M3', 'M3abcdefghijklmnopqrst', { First_Name: 'Dev', Last_Name: 'Iyer', Company: 'XYZ Snacks', Booth_Number: 'F901', PLMA_Company_ID: 'PLMA26-C0011' });
  add('Q1', 'Q1abcdefghijklmnopqrst', { First_Name: 'Anu', Last_Name: 'Pillai', Company: 'Quiet Co', Booth_Number: 'F902', PLMA_Company_ID: 'PLMA26-C0012', ...sub });
  add('Q2', 'Q2abcdefghijklmnopqrst', { First_Name: 'Bala', Last_Name: 'Menon', Company: 'Quiet Co', Booth_Number: 'F902', PLMA_Company_ID: 'PLMA26-C0012' });
  add('S1', 'S1abcdefghijklmnopqrst', { First_Name: 'Leo', Last_Name: 'Park', Company: 'Solo Foods', Booth_Number: 'F903', PLMA_Company_ID: 'PLMA26-C0013', ...sub, PLMA_Show_First_Name: true });
  add('S2', 'S2abcdefghijklmnopqrst', { First_Name: '', Last_Name: 'PLMA 2026 exhibitor', Company: 'Solo Foods', Booth_Number: 'F903', PLMA_Company_ID: 'PLMA26-C0013', ...sub, Submitted_Name: 'x@solo.example', PLMA_Show_First_Name: true });
  add('S3', 'S3abcdefghijklmnopqrst', { First_Name: 'Mia', Last_Name: 'Chen', Company: 'Solo Foods', Booth_Number: 'F903', PLMA_Company_ID: 'PLMA26-C0013' });
  // Internal test lead
  add('LT', 'TTTTTTTTTTTTTTTTTTTTTT', { First_Name: 'Fake', Last_Name: 'Tester', Email: 'plma-live-test@example.com', Company: 'PLMA TEST', Conference_Name: 'PLMA 2026 (test)', PLMA_Company_ID: 'PLMA26-T0001' });
}
seed();

// --- tiny COQL where-clause evaluator ---
function tokenize(s) {
  const t = []; const re = /\s*(\(|\)|!=|=|'(?:[^'])*'|[A-Za-z_][A-Za-z0-9_]*)/y; let m;
  while (re.lastIndex < s.length && (m = re.exec(s))) t.push(m[1]);
  return t;
}
function parseWhere(tokens) {
  let i = 0;
  // Like Zoho COQL: at most two conditions per group (more must be nested in parentheses).
  const expr = () => { let l = term(); let n = 0; while (tokens[i] && tokens[i].toLowerCase() === 'or') { if (++n > 1) throw new Error('more than two conditions in a group'); i++; const r = term(); const a = l; l = x => a(x) || r(x); } return l; };
  const term = () => { let l = factor(); let n = 0; while (tokens[i] && tokens[i].toLowerCase() === 'and') { if (++n > 1) throw new Error('more than two conditions in a group'); i++; const r = factor(); const a = l; l = x => a(x) && r(x); } return l; };
  const factor = () => {
    if (tokens[i] === '(') { i++; const e = expr(); if (tokens[i++] !== ')') throw new Error('paren'); return e; }
    const f = tokens[i++], op = tokens[i++], v = tokens[i++];
    if (!/^'.*'$/.test(v || '') || !['=', '!='].includes(op)) throw new Error('syntax ' + f + op + v);
    const val = v.slice(1, -1);
    return op === '=' ? x => (x[f] ?? '') === val : x => (x[f] ?? '') !== val;
  };
  const e = expr(); if (i !== tokens.length) throw new Error('trailing'); return e;
}
function coql(q) {
  const m = q.match(/^select (.+?) from Leads where (.+?)(?: order by .+?)?(?: limit (\d+))?$/i);
  if (!m) throw new Error('bad query');
  const fields = m[1].split(',').map(s => s.trim());
  const pred = parseWhere(tokenize(m[2]));
  const rows = Object.values(state.leads).filter(pred).slice(0, Number(m[3] || 200));
  return rows.map(r => Object.fromEntries(fields.map(f => [f, r[f] ?? null])));
}

const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(obj === undefined ? '' : JSON.stringify(obj)); };
http.createServer((req, res) => {
  let b = ''; req.on('data', d => b += d); req.on('end', () => {
    const u = new URL(req.url, 'http://x'); const p = u.pathname; state.calls.push(req.method + ' ' + p);
    if (p === '/__state') return send(res, 200, state);
    if (p === '/__reset') { seed(); state.calls = []; state.campaignForbidden = false; return send(res, 200, { ok: 1 }); }
    if (p === '/__campaignForbidden') { state.campaignForbidden = true; return send(res, 200, { ok: 1 }); }
    if (p === '/oauth/v2/token') { state.tokens++; return send(res, 200, { access_token: 'tok', expires_in: 3600, scope: state.campaignForbidden ? 'ZohoCRM.modules.leads.ALL ZohoCRM.modules.campaigns.READ ZohoCRM.modules.notes.CREATE ZohoCRM.coql.READ' : 'ZohoCRM.modules.leads.ALL ZohoCRM.modules.campaigns.READ ZohoCRM.modules.campaigns.UPDATE ZohoCRM.modules.notes.CREATE ZohoCRM.coql.READ' }); }
    if (req.headers.authorization !== 'Zoho-oauthtoken tok') return send(res, 401, { code: 'INVALID_TOKEN' });
    if (p === '/crm/v8/coql') {
      try { const rows = coql(JSON.parse(b).select_query); return rows.length ? send(res, 200, { data: rows }) : send(res, 204); }
      catch (e) { return send(res, 400, { code: 'SYNTAX_ERROR', message: e.message }); }
    }
    if (p === '/crm/v8/Leads/search') { const e = (u.searchParams.get('email') || '').toLowerCase(); const rows = Object.values(state.leads).filter(l => (l.Email || '').toLowerCase() === e); return rows.length ? send(res, 200, { data: rows }) : send(res, 204); }
    let m = p.match(/^\/crm\/v8\/Leads\/(\w+)\/Campaigns$/);
    if (m && req.method === 'GET') { const last = state.camp.filter(c => c.lead === m[1]).pop(); return last ? send(res, 200, { data: [{ id: last.id, Campaign_Name: 'x', $member_info: { Member_Status: last.Member_Status } }] }) : send(res, 204); }
    if (p === '/crm/v8/Leads' && req.method === 'DELETE') { for (const id of (u.searchParams.get('ids') || '').split(',')) delete state.leads[id]; return send(res, 200, { data: [{ code: 'SUCCESS' }] }); }
    if (m && req.method === 'PUT') { if (state.campaignForbidden) return send(res, 403, { code: 'OAUTH_SCOPE_MISMATCH' }); state.camp.push({ lead: m[1], ...JSON.parse(b).data[0] }); return send(res, 200, { data: [{ status: 'success', code: 'SUCCESS' }] }); }
    m = p.match(/^\/crm\/v8\/Leads\/(\w+)$/);
    if (m && req.method === 'GET') { const l = state.leads[m[1]]; if (!l) return send(res, 204); const fields = (u.searchParams.get('fields') || '').split(','); return send(res, 200, { data: [{ id: l.id, ...Object.fromEntries(fields.map(f => [f, l[f] ?? null])) }] }); }
    if (m && req.method === 'PUT') { const body = JSON.parse(b); if (!state.leads[m[1]]) return send(res, 400, {}); Object.assign(state.leads[m[1]], body.data[0]); state.leads[m[1]].__trigger = body.trigger; return send(res, 200, { data: [{ status: 'success', code: 'SUCCESS', details: { id: m[1] } }] }); }
    if (p === '/crm/v8/Leads' && req.method === 'POST') { const body = JSON.parse(b); const id = 'N' + (++seq); state.leads[id] = { id, ...body.data[0], __trigger: body.trigger }; return send(res, 201, { data: [{ status: 'success', code: 'SUCCESS', details: { id } }] }); }
    if (p === '/crm/v8/Notes') { state.notes.push(JSON.parse(b).data[0]); return send(res, 201, { data: [{ status: 'success', code: 'SUCCESS', details: { id: 'NOTE' } }] }); }
    send(res, 404, { code: 'NOT_FOUND' });
  });
}).listen(4010, () => console.log('mock2 up'));
