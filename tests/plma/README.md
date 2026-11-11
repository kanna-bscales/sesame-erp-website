# PLMA 2026 Phase 2 tests (fake data only)

`mock-zoho.cjs` is a fake Zoho (OAuth + CRM v8: COQL subset, Leads, Notes, Campaigns) on port 4010.
`phase2.e2e.cjs` runs the approved tests 1–18 plus UI checks against two local production servers.
No real attendee data, references or credentials are used.

```bash
npm run build
node tests/plma/mock-zoho.cjs &
ZOHO_CLIENT_ID=1000.FAKE ZOHO_CLIENT_SECRET=fake ZOHO_REFRESH_TOKEN=fake \
  ZOHO_ACCOUNTS_URL=http://127.0.0.1:4010 ZOHO_API_DOMAIN=http://127.0.0.1:4010 npx next start -p 3061 &
npx next start -p 3062 &            # no Zoho credentials: webform-fallback checks
SHOT_DIR=/tmp node tests/plma/phase2.e2e.cjs
```

Needs `playwright` with Chromium installed. Expected: all checks PASS (61 on 2026-11-11).
