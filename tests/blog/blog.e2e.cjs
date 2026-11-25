// Blog checks against a local production server (npm run build && npx next start -p 3061).
// Run: node tests/blog/blog.e2e.cjs   (BASE=http://localhost:3061 by default)
const fs = require('fs');
const path = require('path');
const BASE = process.env.BASE || 'http://localhost:3061';
const SLUG = 'erp-for-private-label-manufacturers-checklist';
const POST = `/blog/${SLUG}`;
const results = [];
const ok = (name, cond, info = '') => results.push([name, !!cond, cond ? '' : info]);
const get = async (p) => { const r = await fetch(BASE + p, { redirect: 'manual' }); return { status: r.status, type: r.headers.get('content-type') || '', text: await r.text() }; };
const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const ldOf = (h) => [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1])).flat();
const meta = (h, n) => ((h.match(new RegExp(`<meta (?:name|property)="${n}" content="([^"]*)"`)) || [])[1] || '').replace(/&amp;/g, '&');

(async () => {
  const idx = await get('/blog');
  const post = await get(POST);
  const art = (post.text.match(/<article[\s\S]*<\/article>/) || [''])[0];
  const body = text(art);
  const h1s = [...post.text.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)].map((m) => text(m[1]).trim());
  const title = (post.text.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  const desc = meta(post.text, 'description');

  ok('B1 /blog: 200, one H1, canonical, lists the article', idx.status === 200 && (idx.text.match(/<h1/g) || []).length === 1 && idx.text.includes('<link rel="canonical" href="https://www.sesameerp.ai/blog"') && idx.text.includes(`href="${POST}"`));
  ok('B2 article: 200, SEO title (<=60), one H1 = title', post.status === 200 && title === 'ERP for Private Label Manufacturers: Checklist | SesameERP' && title.length <= 60 && h1s.length === 1 && h1s[0] === 'ERP for Private Label Manufacturers: A Practical Requirements Checklist', JSON.stringify([title, h1s]));
  ok('B3 meta description 140-160 chars with the primary keyword; canonical + og:type article', desc.length >= 140 && desc.length <= 160 && /erp for private label manufacturers/i.test(desc) && post.text.includes(`<link rel="canonical" href="https://www.sesameerp.ai${POST}"`) && meta(post.text, 'og:type') === 'article', `${desc.length}`);
  const md = fs.readFileSync(path.join(__dirname, '../../content/blog', `${SLUG}.md`), 'utf8');
  const first100 = md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).slice(0, 100).join(' ');
  ok('B4 primary keyword in the first 100 words and in an H2', /erp for private label manufacturers/i.test(first100) && /^## .*ERP for private label manufacturers/im.test(md));
  const words = md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[|#*>-]/g, ' ').split(/\s+/).filter(Boolean).length;
  ok('B5 body length 1,400-1,700 words (excluding FAQs)', words >= 1400 && words <= 1700, String(words));
  const ld = ldOf(post.text);
  const bp = ld.find((x) => x['@type'] === 'BlogPosting'), bc = ld.find((x) => x['@type'] === 'BreadcrumbList'), faq = ld.find((x) => x['@type'] === 'FAQPage');
  ok('B6 structured data: BlogPosting, BreadcrumbList, FAQPage (every Q and A visible)', bp && bp.headline === h1s[0] && bp.datePublished === '2026-11-20' && bc && bc.itemListElement.length === 3 && faq && faq.mainEntity.length === 4 && faq.mainEntity.every((q) => body.includes(q.name) && body.includes(q.acceptedAnswer.text.slice(0, 80))));
  const hrefs = [...art.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  const internal = [...new Set(hrefs.filter((h) => h.startsWith('/') && !h.startsWith('//')).map((h) => h.split('#')[0]))];
  const bad = [];
  for (const h of internal) { const r = await get(h); if (r.status !== 200) bad.push(`${h} ${r.status}`); }
  ok('B7 every internal link in the article returns 200, including /plma-2026 and /contact', bad.length === 0 && internal.includes('/plma-2026') && internal.includes('/contact'), bad.join(', '));
  const ext = hrefs.filter((h) => /^https?:/.test(h));
  ok('B8 external links are https with rel="noopener"; sources 7-Eleven, Hershey, FDA', ext.every((h) => h.startsWith('https://')) && [...art.matchAll(/<a href="https:[^"]+"[^>]*>/g)].every((m) => /rel="noopener"/.test(m[0])) && ['7-eleven.com', 'thehersheycompany.com', 'fda.gov'].every((d) => ext.some((h) => h.includes(d))));
  ok('B9 brand rules: no "free" in the article; no unverified claims of results or prices', !/\bfree\b/i.test(body) && !/\$\s?\d/.test(body) && !/%/.test(md), (body.match(/.{30}\bfree\b.{30}/i) || [''])[0]);
  ok('B10 article Markdown contains no raw HTML', !/<[a-z/!]/i.test(md));
  const sm = await get('/sitemap.xml');
  ok('B11 sitemap lists /blog and the article (with lastmod)', sm.text.includes('<loc>https://www.sesameerp.ai/blog</loc>') && new RegExp(`<loc>https://www.sesameerp.ai${POST}</loc>\\s*<lastmod>2026-11-20</lastmod>`).test(sm.text));
  const og = await fetch(BASE + POST + '/opengraph-image');
  ok('B12 share image is a PNG', og.status === 200 && (og.headers.get('content-type') || '').includes('image/png'));
  ok('B13 unknown article slug is a 404', (await get('/blog/not-a-real-post')).status === 404);
  const plma = await get('/plma-2026'), home = await get('/');
  ok('B14 incoming links: /plma-2026 links to the article; homepage and footer link to /blog', plma.text.includes(`href="${POST}"`) && home.text.includes('href="/blog"') && plma.text.includes('href="/blog"'));
  ok('B15 hidden pages are never linked from the blog', !internal.some((h) => /^\/(manufacturing|restaurant|retail|wireless-erp|plma-2026-terms)/.test(h)));

  // ---------- Article 2 (approved Nov 20, 2026) ----------
  const DRAFT = 'erp-for-co-packers-contract-manufacturers';
  const d1 = await get(`/blog/${DRAFT}`), idx2 = await get('/blog');
  const t2 = (d1.text.match(/<title>(.*?)<\/title>/) || [])[1] || '', desc2 = meta(d1.text, 'description');
  const h1b = [...d1.text.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)].map((m) => text(m[1]).trim());
  ok('B16 article 2 published: 200, SEO title <=60, description 140-160 with keyword, one H1, canonical, not noindex', d1.status === 200 && t2 === 'ERP for Co-Packers and Contract Manufacturers | SesameERP' && t2.length <= 60 && desc2.length >= 140 && desc2.length <= 160 && /erp for co-packers/i.test(desc2) && h1b.length === 1 && h1b[0] === 'ERP for Co-Packers and Contract Manufacturers: A Practical Guide' && d1.text.includes(`<link rel="canonical" href="https://www.sesameerp.ai/blog/${DRAFT}"`) && !/name="robots" content="noindex/.test(d1.text), JSON.stringify([t2, desc2.length, h1b]));
  const art2 = (d1.text.match(/<article[\s\S]*<\/article>/) || [''])[0];
  const int2 = [...new Set([...art2.matchAll(/href="(\/[^"#]*)/g)].map((m) => m[1]))];
  const bad2 = []; for (const h of int2) { const r = await get(h); if (r.status !== 200) bad2.push(`${h} ${r.status}`); }
  const ld2 = ldOf(d1.text);
  ok('B16b article 2: internal links return 200; JSON-LD BlogPosting + Breadcrumb + FAQPage (6 visible Qs)', bad2.length === 0 && ld2.some((x) => x['@type'] === 'BlogPosting') && ld2.some((x) => x['@type'] === 'BreadcrumbList') && (ld2.find((x) => x['@type'] === 'FAQPage') || { mainEntity: [] }).mainEntity.length === 6, bad2.join(', '));
  ok('B16c both articles listed on /blog and in the sitemap; homepage band shows the newest article (article 4 since Nov 25, 2026); article 1 and 2 link to each other', idx2.text.includes(`href="/blog/${DRAFT}"`) && sm.text.includes(`/blog/${DRAFT}</loc>`) && home.text.includes('href="/blog/customer-owned-inventory-tracking"') && post.text.includes(`href="/blog/${DRAFT}"`) && art2.includes(`href="${POST}"`));
  const md2 = fs.readFileSync(path.join(__dirname, '../../content/blog', `${DRAFT}.md`), 'utf8');
  const plain2 = md2.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const words2 = plain2.replace(/[|#*>-]/g, ' ').split(/\s+/).filter(Boolean).length;
  ok('B17 article 2: primary keyword "erp for co-packers" in the first 100 words and an H2; 1,400-1,800 words', /erp for co-packers/i.test(plain2.split(/\s+/).slice(0, 100).join(' ')) && /^## .*ERP for co-packers/im.test(md2) && words2 >= 1400 && words2 <= 1800, String(words2));
  const links2 = [...md2.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
  ok('B18 article 2 links: Blog #1, /plma-2026, /contact; external https only; no "free"; no raw HTML', ['/blog/erp-for-private-label-manufacturers-checklist', '/plma-2026', '/contact'].every((l) => links2.includes(l)) && links2.filter((l) => !l.startsWith('/')).every((l) => l.startsWith('https://')) && !/\bfree\b/i.test(md2) && !/<[a-z/!]/i.test(md2));
  ok('B18b owner corrections: FSMA scope, no blanket balance-sheet claim, 7-Eleven scope', md2.includes('It does not cover every co-packer') && !/balance sheet/i.test(md2) && md2.includes('Proprietary Product Suppliers Addendum') && md2.includes("own-brand (proprietary) products"));
  const posts = fs.readFileSync(path.join(__dirname, '../../content/blog/posts.ts'), 'utf8');
  ok('B19 primary keywords are unique across articles', (() => { const k = [...posts.matchAll(/primaryKeyword: "([^"]+)"/g)].map((m) => m[1].toLowerCase()); return k.length >= 2 && new Set(k).size === k.length; })());

  // ---------- Articles 3 and 4 (published Nov 25, 2026) ----------
  const more = [
    { n: 3, slug: 'packaged-erp-vs-custom-erp', title: 'Packaged ERP vs Custom ERP: How to Decide | SesameERP', h1: 'Packaged ERP vs Custom ERP Modules: How to Decide', kw: /packaged erp vs custom erp/i, faqs: 4, sources: 0, links: ['/blog/erp-for-private-label-manufacturers-checklist', '/blog/erp-for-co-packers-contract-manufacturers', '/contact'], linkedFrom: post.text },
    { n: 4, slug: 'customer-owned-inventory-tracking', title: 'Customer-Owned Inventory Tracking for Co-Packers | SesameERP', h1: 'Customer-Owned Inventory: How Co-Packers Track Toll and Consigned Materials', kw: /customer-owned inventory tracking/i, faqs: 5, sources: 1, links: ['/blog/erp-for-co-packers-contract-manufacturers', '/blog/packaged-erp-vs-custom-erp', '/contact'], linkedFrom: d1.text },
  ];
  for (const a of more) {
    const url = `/blog/${a.slug}`;
    const r = await get(url);
    const t = ((r.text.match(/<title>(.*?)<\/title>/) || [])[1] || '').replace(/&amp;/g, '&'), de = meta(r.text, 'description');
    const h = [...r.text.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)].map((m) => text(m[1]).trim());
    ok(`B2${a.n === 3 ? 0 : 3} article ${a.n}: 200, SEO title <=60, description 140-160 with keyword, one H1, canonical, indexable, published date`, r.status === 200 && t === a.title && t.length <= 60 && de.length >= 140 && de.length <= 160 && a.kw.test(de) && h.length === 1 && h[0] === a.h1 && r.text.includes(`<link rel="canonical" href="https://www.sesameerp.ai${url}"`) && !/name="robots" content="noindex/.test(r.text) && meta(r.text, 'og:type') === 'article', JSON.stringify([t, de.length, h]));
    const ar = (r.text.match(/<article[\s\S]*<\/article>/) || [''])[0], bodyA = text(ar);
    const ints = [...new Set([...ar.matchAll(/href="(\/[^"#]*)/g)].map((m) => m[1]))];
    const badA = []; for (const x of ints) { const q = await get(x); if (q.status !== 200) badA.push(`${x} ${q.status}`); }
    const ldA = ldOf(r.text), fq = ldA.find((x) => x['@type'] === 'FAQPage') || { mainEntity: [] }, bpA = ldA.find((x) => x['@type'] === 'BlogPosting');
    ok(`B2${a.n === 3 ? 1 : 4} article ${a.n}: internal links 200 and as planned; BlogPosting + Breadcrumb + FAQPage (every Q and A visible); Sources block only when there are sources`, badA.length === 0 && a.links.every((l) => ints.includes(l)) && !ints.some((x) => /^\/(manufacturing|restaurant|retail|wireless-erp|plma-2026-terms)/.test(x)) && bpA && bpA.headline === a.h1 && bpA.datePublished === '2026-11-25' && ldA.some((x) => x['@type'] === 'BreadcrumbList') && fq.mainEntity.length === a.faqs && fq.mainEntity.every((q) => bodyA.includes(q.name) && bodyA.includes(q.acceptedAnswer.text.slice(0, 80))) && (ar.includes('id="sources"') === (a.sources > 0)), badA.join(', ') + ' ' + ints.join(' '));
    const m = fs.readFileSync(path.join(__dirname, '../../content/blog', `${a.slug}.md`), 'utf8');
    const pl = m.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    const wc = pl.replace(/[|#*>-]/g, ' ').split(/\s+/).filter(Boolean).length;
    ok(`B2${a.n === 3 ? 2 : 5} article ${a.n}: keyword in the first 100 words and an H2; 1,300-1,800 words; no "free", prices, percentages or raw HTML; listed on /blog, in the sitemap, linked from a related article; share image`, a.kw.test(pl.split(/\s+/).slice(0, 100).join(' ')) && new RegExp('^## .*' + a.kw.source, 'im').test(m) && wc >= 1300 && wc <= 1800 && !/\bfree\b/i.test(m) && !/\$\s?\d/.test(m) && !/%/.test(m) && !/<[a-z/!]/i.test(m) && idx2.text.includes(`href="${url}"`) && new RegExp(`<loc>https://www.sesameerp.ai${url}</loc>\\s*<lastmod>2026-11-25</lastmod>`).test(sm.text) && a.linkedFrom.includes(`href="${url}"`) && (await fetch(BASE + url + '/opengraph-image')).status === 200, String(wc));
  }
  ok('B26 sitemap has 10 URLs (6 pages + 4 articles)', (sm.text.match(/<loc>/g) || []).length === 10, String((sm.text.match(/<loc>/g) || []).length));

  for (const [n, pass, info] of results) console.log(`${pass ? 'PASS' : 'FAIL'} ${n}${info ? '  :: ' + info : ''}`);
  console.log(`\n${results.filter((r) => r[1]).length}/${results.length} passed`);
  process.exit(results.every((r) => r[1]) ? 0 : 1);
})();
