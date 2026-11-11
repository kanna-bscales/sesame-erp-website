// Phase 2 tests (approved requirement 12, tests 1–18) against the fake Zoho in mock-zoho.cjs.
// Fake people and companies only. Run: node e2e2.js
const { chromium } = require('playwright');
const crypto = require('crypto');
const A = 'http://localhost:3061', NOCREDS = 'http://localhost:3062', MOCK = 'http://127.0.0.1:4010';
const results = [];
const ok = (n, cond, info = '') => { results.push([n, !!cond, cond ? '' : info]); };
let ipn = 1;
const ip = () => `10.${Math.floor(ipn / 250)}.${ipn++ % 250}.9`;
const j = (u, o) => fetch(u, o).then(async r => ({ status: r.status, body: await r.json().catch(() => null), headers: r.headers }));
const lookup = (ref, base = A) => j(base + '/api/plma/attendee', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip() }, body: JSON.stringify({ ref }) });
const base = { phone: '', booth: '', jobTitle: '', website: '', requirements: 'Fake test enquiry', consent: true, terms: true, termsVersion: 'test' };
const enquiry = (body, opts = {}) => j((opts.base || A) + '/api/plma/enquiry', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': opts.ip || ip() }, body: JSON.stringify({ ...base, ...body }) });
const state = () => fetch(MOCK + '/__state').then(r => r.json());
const reset = () => fetch(MOCK + '/__reset');
const ORIGINAL = ['First_Name', 'Last_Name', 'Email', 'Secondary_Email', 'Company', 'Phone', 'Designation', 'Website', 'Booth_Number', 'Attendee_Reference_Hash', 'Offer_URL'];
const pick = (l, keys) => Object.fromEntries(keys.map(k => [k, l[k] ?? null]));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const R = { P1: 'R1abcdefghijklmnopqrst', R2: 'R2abcdefghijklmnopqrst', R3: 'R3abcdefghijklmnopqrst', D1: 'RDabcdefghijklmnopqrst', E1: 'REabcdefghijklmnopqrst', L1: 'AAAAAAAAAAAAAAAAAAAAAA', G1: 'RGabcdefghijklmnopqrst', H1: 'RHabcdefghijklmnopqrst', B1: 'RBabcdefghijklmnopqrst' };

(async () => {
  // ---------- Test 1: SEO page, canonical, sitemap, robots ----------
  const html = await fetch(A + '/plma-2026').then(r => r.text());
  const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1])).flat();
  ok('1a /plma-2026 title, description, canonical, OG', /<title>PLMA 2026 Chicago Guide &amp; ERP for Private Label/.test(html) && html.includes('<link rel="canonical" href="https://www.sesameerp.ai/plma-2026"') && html.includes('property="og:url" content="https://www.sesameerp.ai/plma-2026"') && /name="description" content="Plan PLMA 2026 in Chicago \(Nov 15–17\)/.test(html));
  ok('1b Event + FAQ JSON-LD', ld.some(x => x['@type'] === 'Event' && x.startDate === '2026-11-15' && x.endDate === '2026-11-17' && x.location[0].name === 'Donald E. Stephens Convention Center') && ld.some(x => x['@type'] === 'FAQPage' && x.mainEntity.length >= 5), JSON.stringify(ld).slice(0, 300));
  ok('1c content sections present', ['What is PLMA?', 'What is PLMA 2026?', 'PLMA 2026 schedule and venues', 'Who you will meet at PLMA 2026', 'What private label manufacturers deal with every day', 'ERP for private label manufacturers: what it should cover', 'How SesameERP helps manufacturers', 'The complimentary PLMA 2026 offer', 'not affiliated with, sponsored by or endorsed by PLMA'].every(h => html.includes(h)));
  ok('1d links to /chicago-event (offer page)', html.includes('href="/chicago-event"') && html.includes('href="/chicago-event#register"'));
  const robots = await fetch(A + '/robots.txt').then(r => r.text());
  ok('1e robots.txt allows site, blocks /api/, lists sitemap', /Allow: \//.test(robots) && /Disallow: \/api\//.test(robots) && robots.includes('Sitemap: https://www.sesameerp.ai/sitemap.xml'), robots);
  const sm = await fetch(A + '/sitemap.xml').then(r => r.text());
  ok('1f sitemap lists /plma-2026 and /chicago-event, not terms or ?ref', sm.includes('<loc>https://www.sesameerp.ai/plma-2026</loc>') && sm.includes('<loc>https://www.sesameerp.ai/chicago-event</loc>') && !sm.includes('terms') && !sm.includes('ref='), sm);
  const home = await fetch(A + '/').then(r => r.text());
  ok('1g homepage canonical www + footer link to /plma-2026', home.includes('<link rel="canonical" href="https://www.sesameerp.ai"') && home.includes('href="/plma-2026"'), (home.match(/rel="canonical"[^>]*/) || [''])[0]);
  const ce = await fetch(A + '/chicago-event').then(r => r.text());
  ok('1h /chicago-event canonical unchanged + links to /plma-2026', ce.includes('<link rel="canonical" href="https://www.sesameerp.ai/chicago-event"') && ce.includes('href="/plma-2026"'));
  const ev = ld.find(x => x['@type'] === 'Event');
  ok('1k Event JSON-LD lists both venues (show floor + Sunday education)', Array.isArray(ev.location) && ev.location.map(l => l.name).join('|') === "Donald E. Stephens Convention Center|Hyatt Regency O'Hare");
  const txt = html.replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ');
  ok('1l guide separates Sunday education (Hyatt) from the trade show (Mon–Tue, convention center)', txt.includes("Executive Education Insight Series (10:00 a.m.–12:30 p.m.) and Opening Seminars (2:00–4:30 p.m.) at the Hyatt Regency O'Hare") && txt.includes('The show floor is closed on Sunday') && txt.includes('Trade show (9:00 a.m.–4:00 p.m.)') && txt.includes('Keynote Breakfast (8:00–9:00 a.m.) at the Hyatt Regency O'));
  ok('1m offer explained as development work, not cash or credit (guide)', txt.includes('with development services valued up to US$5,000. It is not cash or credit.') && !txt.includes('worth of ERP development work'));
  const ldFaq = ld.find(x => x['@type'] === 'FAQPage');
  ok('1n FAQ JSON-LD matches the visible FAQ (11 questions, all answered)', ldFaq.mainEntity.length === 11 && ldFaq.mainEntity.every(q => q.acceptedAnswer.text.length > 60 && txt.includes(q.name)));
  const cetxt = ce.replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ');
  ok('1o landing page: event facts split, cash FAQ, no duplicated guide sections', cetxt.includes("Sunday, Nov 15: education") && cetxt.includes("Hyatt Regency O'Hare") && cetxt.includes('Is the offer paid as cash or credit?') && /development services valued up to US\$5,000/i.test(cetxt) && !cetxt.includes('worth of ERP development work') && cetxt.includes('provided by Business Scales LLC') && cetxt.includes('Built for private label manufacturers') && cetxt.includes('Development work, not cash or credit') && cetxt.includes('not affiliated with, sponsored by or endorsed by PLMA') && !/Sesame Labs/.test(ce + html) && !cetxt.includes('founded in 1979') && !cetxt.includes('About PLMA and the 2026 show') && !cetxt.includes('Who attends'));
  const terms = await fetch(A + '/plma-2026-terms').then(r => r.text());
  ok('1i terms page still noindex', /<meta name="robots" content="noindex/.test(terms));

  // ---------- Tests 2, 3, 16: separate people, own URL, no private research ----------
  await reset();
  const SEED = Object.keys((await state()).leads).length;
  const l1 = await lookup(R.P1), l2 = await lookup(R.R2), l3 = await lookup(R.R3);
  let s = await state();
  const abc = Object.values(s.leads).filter(l => l.PLMA_Company_ID === 'PLMA26-C0002');
  ok('2 three people at one company = three Leads, three distinct refs/URLs', abc.length === 3 && new Set(abc.map(l => l.Attendee_Reference_Hash)).size === 3 && new Set(abc.map(l => l.Offer_URL)).size === 3);
  ok('3 each URL returns only its own person', l1.body.fields.name === 'Ann Able' && l2.body.fields.name === 'Bob Baker' && l3.body.fields.name === 'Cara Cole' && l2.body.fields.email === '' && l1.body.company.name === 'ABC Foods Inc', JSON.stringify([l1.body.fields.name, l2.body.fields.name, l3.body.fields.name]));
  const keys = Object.keys(l1.body.fields).sort().join();
  const dump = JSON.stringify([l1.body, l2.body, l3.body]);
  ok('16 public API returns only permitted fields; no research/IDs', keys === 'additionalEmails,booth,company,email,jobTitle,name,phone,website' && Object.keys(l1.body.company).sort().join() === 'name,names,otherSubmitted' && !/secret research|private research|Private Person|PLMA26-|P1|R2|Primary Attendee|Research Contact/.test(dump), keys + ' ' + dump.slice(0, 200));
  const bad = await lookup('ZZZZZZZZZZZZZZZZZZZZZZ'), malformed = await lookup('F300');
  ok('16b unknown / booth-like references reveal nothing', same(bad.body, { found: false }) && same(malformed.body, { found: false }));

  // ---------- Test 4: existing (pre-Phase-2) URLs still work ----------
  const old = await lookup(R.L1);
  ok('4 existing reference (no Company ID yet) still pre-fills', old.body.found && old.body.fields.name === 'Test Person' && old.body.company === null);

  // ---------- Test 5: companies sharing a booth never mixed ----------
  const d = await lookup(R.D1);
  ok('5 shared booth F500: Delta sees no count from Echo (different Company ID)', d.body.found && d.body.company && d.body.company.otherSubmitted === 0, JSON.stringify(d.body.company));

  // ---------- Tests 6, 7, 8: company count ----------
  const before = await state();
  let r = await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc' });
  ok('6a first person submits', r.body?.ok === true, JSON.stringify(r.body));
  r = await enquiry({ ref: R.R2, name: 'Bob Baker', email: 'bob.baker@abcfoods.example', company: 'ABC Foods Inc' });
  ok('6b second person submits', r.body?.ok === true, JSON.stringify(r.body));
  const third = await lookup(R.R3);
  ok('6 third person sees count of 2', third.body.company?.otherSubmitted === 2, JSON.stringify(third.body.company));
  const first = await lookup(R.P1);
  ok('7 count excludes the current person (Ann sees 1, not 2)', first.body.company?.otherSubmitted === 1, JSON.stringify(first.body.company));
  s = await state();
  const snapshot = Object.fromEntries(Object.values(s.leads).filter(l => l.id !== 'R3').map(l => [l.id, JSON.stringify(l)]));
  const notesBefore = s.notes.length;
  r = await enquiry({ ref: R.R3, name: 'Cara Cole', email: 'cara.cole@abcfoods.example', company: 'ABC Foods Inc' });
  s = await state();
  const changedOthers = Object.values(s.leads).filter(l => l.id !== 'R3' && snapshot[l.id] !== JSON.stringify(l)).map(l => l.id);
  ok('8 third submission changes only her own Lead', r.body?.ok && changedOthers.length === 0 && s.leads.R3.PLMA_Response_Status === 'Submitted' && s.notes.slice(notesBefore).every(n => n.Parent_Id.id === 'R3') && Object.keys(s.leads).length === Object.keys(before.leads).length, JSON.stringify(changedOthers));
  ok('8b nothing told about who submitted (count only)', !JSON.stringify(third.body).includes('Ann') && !JSON.stringify(third.body).includes('Bob'));

  // ---------- Test 9: Add Another Contact ----------
  await reset();
  r = await enquiry({
    ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc',
    contacts: [
      { name: 'Iris Ivy', email: 'iris.ivy@abcfoods.example', jobTitle: 'Buyer' },
      { name: 'Jon Jones', email: 'jon.jones@abcfoods.example', jobTitle: '' },
      { name: 'Robert Baker', email: 'robert.baker@abcfoods.example', jobTitle: 'Plant Manager' }, // = research contact Bob Baker
      { name: 'Iris Ivy', email: 'iris.ivy@abcfoods.example', jobTitle: 'Buyer' }, // duplicate row
      { name: 'Ann Able', email: 'ann.other@abcfoods.example', jobTitle: '' }, // the submitter herself
      { name: '', email: '', jobTitle: '' }, // empty row ignored
    ],
  });
  s = await state();
  const created = Object.values(s.leads).filter(l => l.PLMA_Contact_Role === 'Added by Colleague');
  ok('9 colleagues become separate Leads; known people not duplicated', r.body?.ok && r.body.contactsAdded === 2 && r.body.contactsAlreadyKnown === 2 && created.length === 2 && created.map(l => l.Last_Name).sort().join() === 'Ivy,Jones', JSON.stringify(r.body));
  ok('9b new Leads: same Company ID, unique ref + Offer URL, Not Submitted, no consent, workflows off', created.every(l => l.PLMA_Company_ID === 'PLMA26-C0002' && /^https:\/\/www\.sesameerp\.ai\/chicago-event\?ref=[A-Za-z0-9_-]{22}$/.test(l.Offer_URL) && l.Attendee_Reference_Hash === crypto.createHash('sha256').update(l.Offer_URL.split('ref=')[1]).digest('hex') && l.PLMA_Response_Status === 'Not Submitted' && !l.Consent_to_be_Contacted && JSON.stringify(l.__trigger) === '[]' && l.Company === 'ABC Foods Inc' && l.Booth_Number === 'F300') && new Set(created.map(l => l.Offer_URL)).size === 2);
  ok('9c no campaign status for added colleagues, note on submitter', !s.camp.some(c => created.some(l => l.id === c.lead)) && s.notes.some(n => n.Parent_Id.id === 'P1' && /colleagues added/.test(n.Note_Title)));
  const iris = created.find(l => l.Last_Name === 'Ivy');
  const irisLookup = await lookup(iris.Offer_URL.split('ref=')[1]);
  ok('9d an added colleague\'s own URL works and returns only them', irisLookup.body.fields.name === 'Iris Ivy' && irisLookup.body.fields.email === 'iris.ivy@abcfoods.example');
  r = await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc', contacts: [{ name: 'Iris Ivy', email: 'iris.ivy@abcfoods.example', jobTitle: 'Buyer' }] });
  s = await state();
  ok('9e adding the same colleague again creates nothing', r.body.contactsAdded === 0 && Object.values(s.leads).filter(l => l.PLMA_Contact_Role === 'Added by Colleague').length === 2);
  r = await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc', contacts: [{ name: 'Henry Hill', email: 'hank@hotel.example', jobTitle: '' }] });
  s = await state();
  ok('9f colleague email already used at another company -> review, not created', r.body.contactsForReview === 1 && r.body.contactsAdded === 0 && s.leads.H1.PLMA_Duplicate_Review === true && s.leads.H1.Email === 'hank@hotel.example');
  r = await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc', contacts: Array.from({ length: 11 }, (_, i) => ({ name: 'P ' + i, email: `p${i}@x.example`, jobTitle: '' })) });
  ok('9g more than 10 contacts rejected (abuse limit)', r.status === 413);
  r = await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc', contacts: [{ name: 'No Mail', email: 'nope', jobTitle: '' }] });
  ok('9h invalid colleague email rejected with field error', r.status === 400 && r.body.errors.includes('contact.0.email'));
  const huge = await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc', requirements: 'x'.repeat(30000) });
  ok('9i oversized request rejected', huge.status === 413);

  // ---------- Tests 10, 11: multiple emails and changed email ----------
  await reset();
  r = await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.new@abcfoods.example', additionalEmails: ['ann@personal.example', 'ANN.ABLE@abcfoods.example'], company: 'ABC Foods Inc', phone: '+1 312 555 0100' });
  s = await state();
  let P = s.leads.P1;
  ok('11 changed email: original Email kept, new one in Submitted Email, note', r.body.ok && P.Email === 'ann.able@abcfoods.example' && P.Submitted_Email === 'ann.new@abcfoods.example' && s.notes.some(n => n.Parent_Id.id === 'P1' && /details changed/.test(n.Note_Title) && /Email: "ann.able@abcfoods.example" → "ann.new@abcfoods.example"/.test(n.Note_Content)), JSON.stringify(pick(P, ['Email', 'Submitted_Email'])));
  ok('10 multiple emails for one person stored on the same Lead', P.Submitted_Additional_Emails === 'ann@personal.example\nann.able@abcfoods.example' && Object.keys(s.leads).length === SEED, JSON.stringify(P.Submitted_Additional_Emails));
  r = await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.new@abcfoods.example', additionalEmails: ['ann.third@abcfoods.example'], company: 'ABC Foods Inc' });
  s = await state(); P = s.leads.P1;
  ok('10b later extra email is added, earlier ones kept', P.Submitted_Additional_Emails.split('\n').length === 3 && P.Submitted_Additional_Emails.includes('ann.third@abcfoods.example'));
  ok('7b originals untouched (all original fields identical)', same(pick(P, ORIGINAL), pick({ First_Name: 'Ann', Last_Name: 'Able', Email: 'ann.able@abcfoods.example', Company: 'ABC Foods Inc', Booth_Number: 'F300', Designation: 'COO', Website: 'www.abcfoods.example', Attendee_Reference_Hash: s.leads.P1.Attendee_Reference_Hash, Offer_URL: 'https://www.sesameerp.ai/chicago-event?ref=' + R.P1 }, ORIGINAL)), JSON.stringify(pick(P, ORIGINAL)));
  const again = await lookup(R.P1);
  ok('7c later visit pre-fills the latest submitted values', again.body.fields.email === 'ann.new@abcfoods.example' && again.body.fields.phone === '+1 312 555 0100' && again.body.fields.additionalEmails.length === 3);
  r = await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.new@abcfoods.example', additionalEmails: Array.from({ length: 6 }, (_, i) => `a${i}@x.example`), company: 'ABC Foods Inc' });
  ok('10c more than 5 extra emails rejected', r.status === 400 && r.body.errors.includes('additionalEmails'));
  r = await enquiry({ ref: R.H1, name: 'Hank Hill', email: 'dan@delta.example', company: 'Hotel Foods' });
  s = await state();
  ok('8A/C ref holder types an email that belongs to someone else: saved on own Lead, flagged, other Lead untouched', r.body.ok && s.leads.H1.Submitted_Email === 'dan@delta.example' && s.leads.H1.PLMA_Duplicate_Review === true && s.leads.D1.Email === 'dan@delta.example' && !s.leads.D1.Submitted_Email);

  // ---------- Test 12: shared emails never merge people ----------
  await reset();
  r = await enquiry({ name: 'Greg Green', email: 'info@gamma.example', company: 'Gamma Foods LLC' });
  s = await state();
  const greg = Object.values(s.leads).find(l => l.Last_Name === 'Green');
  ok('12a (B/D) shared inbox, different name, same company -> new Lead with same Company ID; Gina untouched', r.body.ok && greg && greg.PLMA_Company_ID === 'PLMA26-C0006' && greg.PLMA_Contact_Role === 'Self-registered' && s.leads.G1.First_Name === 'Gina' && s.leads.G1.PLMA_Response_Status === 'Not Submitted' && !s.leads.G1.Submitted_Name, JSON.stringify(greg && pick(greg, ['PLMA_Company_ID', 'PLMA_Contact_Role'])));
  r = await enquiry({ name: 'Gina Gold', email: 'info@gamma.example', company: 'Gamma Foods' });
  s = await state();
  ok('12b shared inbox + same name + same company -> Gina\'s own Lead (no duplicate)', r.body.ok && s.leads.G1.PLMA_Response_Status === 'Submitted' && Object.values(s.leads).filter(l => /Gold/.test(l.Last_Name)).length === 1);
  const count1 = Object.keys(s.leads).length;
  r = await enquiry({ name: 'Someone Else', email: 'hank@hotel.example', company: 'Hotel Foods' });
  s = await state();
  ok('12c (C) personal email on another Lead, different name -> review flag, nothing created or overwritten', r.body.ok && Object.keys(s.leads).length === count1 && s.leads.H1.PLMA_Duplicate_Review === true && s.leads.H1.First_Name === 'Hank' && s.leads.H1.PLMA_Response_Status === 'Not Submitted' && s.notes.some(n => n.Parent_Id.id === 'H1' && /needs manual review/.test(n.Note_Title)));
  r = await enquiry({ name: 'Zed Zulu', email: 'info@gamma.example', company: 'Totally Different Co' });
  s = await state();
  ok('12d shared inbox at a different company -> review, not merged', Object.keys(s.leads).length === count1 && s.leads.G1.PLMA_Duplicate_Review === true);
  r = await enquiry({ name: 'Bea Beta', email: 'info@beta.example.net', company: 'Beta Bakery' });
  s = await state();
  ok('12e shared inbox on a no-name Lead, same company -> new person with that Company ID', Object.values(s.leads).some(l => l.Last_Name === 'Beta' && l.PLMA_Company_ID === 'PLMA26-C0008') && s.leads.B1.Last_Name === 'PLMA 2026 exhibitor');

  // ---------- Test 13: repeat submissions create no duplicates ----------
  await reset();
  for (let i = 0; i < 3; i++) await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc' });
  r = await enquiry({ name: 'Kim Kay', email: 'kim.kay@newco.example', company: 'NewCo' });
  r = await enquiry({ name: 'Kim Kay', email: 'kim.kay@newco.example', company: 'NewCo' });
  r = await enquiry({ name: 'Kimberly Kay', email: 'KIM.KAY@newco.example', company: 'NewCo' });
  s = await state();
  const kims = Object.values(s.leads).filter(l => l.Last_Name === 'Kay');
  ok('13 repeats (by ref, and by email+name without ref) never duplicate', Object.keys(s.leads).length === SEED + 1 && kims.length === 1 && kims[0].PLMA_Contact_Role === 'Self-registered' && /^PLMA26-W[A-Z0-9]{8}$/.test(kims[0].PLMA_Company_ID) && kims[0].Offer_URL && s.camp.filter(c => c.lead === 'P1').length === 3, JSON.stringify(kims.map(k => k.id)));

  // ---------- Test 14: Company IDs and report counts ----------
  await reset();
  await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc', contacts: [{ name: 'Iris Ivy', email: 'iris.ivy@abcfoods.example', jobTitle: '' }] });
  await enquiry({ ref: R.R2, name: 'Bob Baker', email: 'bob@abcfoods.example', company: 'ABC Foods Inc' });
  s = await state();
  const leads = Object.values(s.leads).filter(l => l.Conference_Name === 'PLMA 2026');
  const byCo = {};
  for (const l of leads) { const c = byCo[l.PLMA_Company_ID || 'none'] ||= { total: 0, sub: 0 }; c.total++; if (l.PLMA_Response_Status === 'Submitted') c.sub++; }
  ok('14 per-company counts: ABC 4 people / 2 submitted / 2 not; Delta & Echo separate', same(byCo['PLMA26-C0002'], { total: 4, sub: 2 }) && same(byCo['PLMA26-C0003'], { total: 1, sub: 0 }) && same(byCo['PLMA26-C0004'], { total: 1, sub: 1 }), JSON.stringify(byCo));
  ok('14b people and companies counted separately', leads.length === 22 && Object.keys(byCo).length === 11, `${leads.length} people, ${Object.keys(byCo).length} companies`);

  // ---------- Test 18: campaign status Responded (and failure tolerated) ----------
  ok('18a submitter added to the PLMA campaign as Responded', s.camp.some(c => c.lead === 'P1' && c.Member_Status === 'Responded' && c.id === '7671386000000694366') && s.camp.some(c => c.lead === 'R2'));
  await fetch(MOCK + '/__campaignForbidden');
  r = await enquiry({ ref: R.R3, name: 'Cara Cole', email: 'cara@abcfoods.example', company: 'ABC Foods Inc' });
  s = await state();
  ok('18b missing campaigns.UPDATE scope: Lead still saved, user sees success', r.body.ok && s.leads.R3.PLMA_Response_Status === 'Submitted');
  await reset();
  r = await enquiry({ ref: 'TTTTTTTTTTTTTTTTTTTTTT', name: 'Fake Tester', email: 'plma-live-test@example.com', company: 'PLMA TEST', contacts: [{ name: 'Fake Colleague', email: 'fake.colleague@example.com', jobTitle: '' }] });
  s = await state();
  ok('18c test Leads stay out of the campaign; their colleagues are test Leads too', r.body.ok && !s.camp.some(c => c.lead === 'LT') && Object.values(s.leads).some(l => l.Last_Name === 'Colleague' && l.Conference_Name === 'PLMA 2026 (test)'));

  // ---------- Test 17: existing functionality ----------
  await reset();
  r = await enquiry({ name: 'X', email: 'x@y.example', company: 'Y', consent: false, terms: false });
  ok('17a server requires consent and terms', r.status === 400 && r.body.errors.includes('consent') && r.body.errors.includes('terms'));
  r = await enquiry({ name: 'Bot', email: 'bot@spam.example', company: 'Spam', honeypot: 'filled' });
  s = await state();
  ok('17b honeypot: fake success, nothing written', r.body.ok && Object.keys(s.leads).length === SEED);
  r = await enquiry({ name: 'X', email: 'x@y.example', company: 'Y' }, { base: NOCREDS });
  ok('17c no Zoho credentials -> not_configured (webform fallback)', r.status === 503 && r.body.reason === 'not_configured');
  const noCredsLookup = await lookup(R.P1, NOCREDS);
  ok('17d no credentials -> lookup returns nothing', same(noCredsLookup.body, { found: false }));
  const rip = '10.250.250.1'; let last;
  for (let i = 0; i < 7; i++) last = await enquiry({ name: 'R', email: 'r@r.example', company: 'R', consent: false }, { ip: rip });
  ok('17e rate limit on enquiries', last.status === 429);
  const lk = await j(A + '/api/plma/attendee', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ref: R.P1 }) });
  ok('17f lookup is no-store + noindex', lk.headers.get('cache-control') === 'no-store' && lk.headers.get('x-robots-tag') === 'noindex');

  // ---------- Name display (first names of colleagues who allowed it) ----------
  await reset();
  const N = { K1: 'K1abcdefghijklmnopqrst', K2: 'K2abcdefghijklmnopqrst', K3: 'K3abcdefghijklmnopqrst', K4: 'K4abcdefghijklmnopqrst', M3: 'M3abcdefghijklmnopqrst', Q2: 'Q2abcdefghijklmnopqrst', S3: 'S3abcdefghijklmnopqrst', S1: 'S1abcdefghijklmnopqrst', D1: 'RDabcdefghijklmnopqrst' };
  let sarah = await lookup(N.K3);
  ok('N1 Sarah sees Prakash and Monesh (same Company ID, Submitted, permission given)', same(sarah.body.company, { name: 'ABC Foods', otherSubmitted: 2, names: ['Prakash', 'Monesh'] }), JSON.stringify(sarah.body.company));
  const sarahDump = JSON.stringify(sarah.body);
  ok('N2 no surnames, emails, enquiries or IDs exposed', !/Rao|Kumar|abcfoods\.example|PLMA26-|K1|K2|Submitted/.test(sarahDump.replace('"otherSubmitted"', '')), sarahDump);
  const prakash = await lookup(N.K1);
  ok('N3 current person excluded (Prakash sees only Monesh)', same(prakash.body.company.names, ['Monesh']) && prakash.body.company.otherSubmitted === 1, JSON.stringify(prakash.body.company));
  const dev = await lookup(N.M3);
  ok('N4 partial permission: named + counted (Priya + 1 other)', same(dev.body.company, { name: 'XYZ Snacks', otherSubmitted: 2, names: ['Priya'] }) && !sarahDump.includes('Kiran') && !JSON.stringify(dev.body).includes('Kiran'));
  const bala = await lookup(N.Q2);
  ok('N5 nobody gave permission -> no names, count only', same(bala.body.company, { name: 'Quiet Co', otherSubmitted: 1, names: [] }));
  const mia = await lookup(N.S3);
  ok('N6 unusable first names (placeholder / email-like) never shown, still counted', same(mia.body.company, { name: 'Solo Foods', otherSubmitted: 2, names: ['Leo'] }), JSON.stringify(mia.body.company));
  const delta = await lookup(N.D1);
  ok('N7 nobody else submitted -> names empty and count 0 (no message)', delta.body.company.otherSubmitted === 0 && delta.body.company.names.length === 0);
  const badN = await lookup('ZZZZZZZZZZZZZZZZZZZZZZ'), boothOnly = await lookup('F900');
  ok('N8 invalid reference or booth number alone -> nothing', same(badN.body, { found: false }) && same(boothOnly.body, { found: false }));
  // Message wording (rendered by the client from the same data)
  let s0 = await state();
  const beforeN = Object.fromEntries(Object.values(s0.leads).filter(l => l.id !== 'K3').map(l => [l.id, JSON.stringify(l)]));
  r = await enquiry({ ref: N.K3, name: 'Sarah Lee', email: 'sarah.lee@abcfoods.example', company: 'ABC Foods', showName: true });
  s0 = await state();
  const changedN = Object.values(s0.leads).filter(l => l.id !== 'K3' && beforeN[l.id] !== JSON.stringify(l)).map(l => l.id);
  ok('N9 Sarah submits -> only her Lead changes; permission stored separately from consent', r.body.ok && changedN.length === 0 && s0.leads.K3.PLMA_Response_Status === 'Submitted' && s0.leads.K3.PLMA_Show_First_Name === true && s0.leads.K3.Consent_to_be_Contacted === true && s0.leads.K3.Last_Name === 'Lee' && Object.keys(s0.leads).length === Object.keys(beforeN).length + 1, JSON.stringify(changedN));
  const ravi = await lookup(N.K4);
  ok('N10 another colleague (Ravi) now sees Prakash, Monesh and Sarah', same(ravi.body.company.names, ['Prakash', 'Monesh', 'Sarah']) && ravi.body.company.otherSubmitted === 3, JSON.stringify(ravi.body.company));
  r = await enquiry({ ref: N.K3, name: 'Sarah Lee', email: 'sarah.lee@abcfoods.example', company: 'ABC Foods' });
  const ravi2 = await lookup(N.K4);
  s0 = await state();
  ok('N11 consent to be contacted does not imply name display; withdrawing hides the name', s0.leads.K3.PLMA_Show_First_Name === false && s0.leads.K3.Consent_to_be_Contacted === true && same(ravi2.body.company.names, ['Prakash', 'Monesh']) && ravi2.body.company.otherSubmitted === 3);
  r = await enquiry({ ref: N.K1, name: 'Prakash Rao', email: 'prakash.rao@abcfoods.example', company: 'ABC Foods', contacts: [{ name: 'Nina Roy', email: 'nina.roy@abcfoods.example', jobTitle: '' }] });
  s0 = await state();
  const nina = Object.values(s0.leads).find(l => l.Last_Name === 'Roy');
  ok('N12 colleagues added by someone else never get name permission', nina && nina.PLMA_Show_First_Name === false && nina.PLMA_Response_Status === 'Not Submitted');

  // ---------- Browser: 15, company message, extra email + contacts UI ----------
  await reset();
  await enquiry({ ref: R.P1, name: 'Ann Able', email: 'ann.able@abcfoods.example', company: 'ABC Foods Inc' });
  await enquiry({ ref: R.R2, name: 'Bob Baker', email: 'bob@abcfoods.example', company: 'ABC Foods Inc' });
  const b = await chromium.launch();
  const pg = await b.newPage();
  await pg.goto(A + '/chicago-event?booth=F500&ref=' + R.R3 + '&utm_source=email');
  await pg.waitForTimeout(3000);
  const v = await pg.evaluate(() => { const f = document.querySelector('form'); const g = n => f.elements.namedItem(n)?.value ?? null; return { name: g('plma_full_name'), booth: g('plma_booth_number'), consent: f.elements.namedItem('LEADCF52').checked, terms: f.elements.namedItem('plma_terms_accept').checked, url: location.href, statuses: [...document.querySelectorAll('form [role=status]')].map(e => e.textContent) }; });
  ok('15 consent and terms start unchecked after prefill', !v.consent && !v.terms);
  ok('5b booth from URL ignored, CRM booth used; ref removed from URL', v.booth === 'F300' && !v.url.includes('ref=') && !v.url.includes('booth='), JSON.stringify(v));
  ok('6c company message shown with the count only', v.statuses.some(t => t === 'We have already received enquiries from 2 other contacts at ABC Foods Inc. You can still submit your own enquiry.'), JSON.stringify(v.statuses));
  await pg.click('text=Add another email');
  await pg.fill('input[id$="-extra-0"]', 'cara.home@personal.example');
  await pg.click('text=Add another contact');
  await pg.click('text=Add another contact');
  const cn = pg.locator('fieldset input');
  await cn.nth(0).fill('Lia Lane'); await cn.nth(1).fill('lia.lane@abcfoods.example'); await cn.nth(2).fill('QA lead');
  await pg.fill('input[name=Email]', 'cara.cole@abcfoods.example');
  await pg.check('input[name=LEADCF52]'); await pg.check('input[name=plma_terms_accept]');
  await pg.click('button[type=submit]'); await pg.waitForTimeout(800);
  const errShown = await pg.locator('text=Enter this colleague’s name, or remove the row.').count();
  ok('UI blank contact row ignored (no error)', errShown === 0);
  await pg.waitForTimeout(2500);
  const success = await pg.locator('text=We have also recorded 1 colleague you added.').count();
  s = await state();
  ok('UI extra email + one colleague submitted from the browser', success === 1 && s.leads.R3.Submitted_Additional_Emails === 'cara.home@personal.example' && Object.values(s.leads).some(l => l.Last_Name === 'Lane' && l.PLMA_Company_ID === 'PLMA26-C0002'), JSON.stringify(pick(s.leads.R3, ['Submitted_Additional_Emails'])));
  await pg.screenshot({ path: '' + (process.env.SHOT_DIR || '.') + '/p2_success.png' });
  const msg = async (ref) => { const q = await b.newPage(); await q.goto(A + '/chicago-event?ref=' + ref); await q.waitForTimeout(2500); const t = await q.evaluate(() => [...document.querySelectorAll('form [role=status]')].map(e => e.textContent)); const box = await q.evaluate(() => document.querySelector('input[name=plma_show_first_name]')?.checked); await q.close(); return { t, box }; };
  await reset();
  let m = await msg('K3abcdefghijklmnopqrst');
  ok('UI N-a two names: exact wording', m.t.includes('Prakash and Monesh from ABC Foods have already submitted their enquiries. You can still submit yours.'), JSON.stringify(m.t));
  ok('UI N-b name-display box starts unticked', m.box === false);
  m = await msg('K1abcdefghijklmnopqrst');
  ok('UI N-c one name: exact wording', m.t.includes('Monesh from ABC Foods has already submitted an enquiry. You can still submit yours.'), JSON.stringify(m.t));
  m = await msg('M3abcdefghijklmnopqrst');
  ok('UI N-d named + unnamed: "Priya and 1 other colleague"', m.t.includes('Priya and 1 other colleague from XYZ Snacks have already submitted their enquiries. You can still submit yours.'), JSON.stringify(m.t));
  m = await msg('Q2abcdefghijklmnopqrst');
  ok('UI N-e no permission: generic count message', m.t.includes('We have already received enquiries from 1 other contact at Quiet Co. You can still submit your own enquiry.'), JSON.stringify(m.t));
  m = await msg('RDabcdefghijklmnopqrst');
  ok('UI N-f nobody else submitted: no company message', !m.t.some(x => /already/.test(x)), JSON.stringify(m.t));
  await enquiry({ ref: 'K3abcdefghijklmnopqrst', name: 'Sarah Lee', email: 'sarah.lee@abcfoods.example', company: 'ABC Foods', showName: true });
  m = await msg('K4abcdefghijklmnopqrst');
  ok('UI N-g three names listed naturally', m.t.includes('Prakash, Monesh and Sarah from ABC Foods have already submitted their enquiries. You can still submit yours.'), JSON.stringify(m.t));
  const pg2 = await b.newPage({ viewport: { width: 390, height: 1400 } });
  await pg2.goto(A + '/chicago-event?ref=' + R.R3); await pg2.waitForTimeout(2500);
  await pg2.click('text=Add another contact');
  const form = pg2.locator('form');
  await form.scrollIntoViewIfNeeded();
  const overflow = await pg2.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  ok('UI mobile: no horizontal overflow with contact rows', !overflow);
  await pg2.locator('fieldset').screenshot({ path: '' + (process.env.SHOT_DIR || '.') + '/p2_mobile_contacts.png' });
  const pg3 = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await pg3.goto(A + '/plma-2026'); await pg3.waitForTimeout(1500);
  await pg3.screenshot({ path: '' + (process.env.SHOT_DIR || '.') + '/p2_seo.png', fullPage: true });
  const pg4 = await b.newPage({ viewport: { width: 390, height: 900 } });
  await pg4.goto(A + '/plma-2026'); await pg4.waitForTimeout(1500);
  ok('1j /plma-2026 mobile: no horizontal overflow', !(await pg4.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));
  await b.close();

  const pass = results.filter(r => r[1]).length;
  for (const [n, p, info] of results) console.log((p ? 'PASS ' : 'FAIL ') + n + (info ? '  :: ' + info : ''));
  console.log(`\n${pass}/${results.length} passed`);
})().catch(e => { console.error(e); process.exit(1); });
