# Contact page content

Route: `/contact`. Rendered from `content/contact.ts` and `components/contact/ContactForm.tsx`. The server action lives in `app/contact/actions.ts`.

## Making the form send email

The code is finished and supports two ways of sending. It uses SMTP when `SMTP_USER` and `SMTP_PASSWORD` are set, otherwise Resend when `RESEND_API_KEY` is set. Credentials live in `.env.local`, which is git-ignored; a filled-in template is in `.env.example`.

### Option 1, in use now: a Gmail account and an app password

Chosen because the recipient can be any address, so testing can go to a personal inbox first and switch to `hi@sesamelabs.ai` afterwards. No DNS work.

1. Turn on 2-Step Verification for the Google account: https://myaccount.google.com/signinoptions/twosv
2. Create an app password (16 letters): https://myaccount.google.com/apppasswords
3. Put it in `.env.local`:
   ```
   SMTP_USER=the.account@gmail.com
   SMTP_PASSWORD=the 16 letter app password
   CONTACT_TO=where enquiries should land
   ```
4. Restart `npm run dev` — environment variables are only read at startup.

Gmail sends up to about 500 messages a day, which is far above what this form will see. The email arrives from the Gmail address with the visitor's address as reply-to, so hitting Reply answers the visitor.

### Option 2: Resend

Leave `SMTP_USER` empty and set `RESEND_API_KEY`. Until `sesamelabs.ai` is verified in Resend, messages go from `onboarding@resend.dev` and Resend only delivers them to the address that owns the Resend account. After verifying the domain (DNS records), set `CONTACT_FROM=SesameERP website <website@sesamelabs.ai>`.

### Deploying

The same variables must be added in the hosting dashboard (on Vercel: Project → Settings → Environment Variables). `.env.local` is never committed.

### If the credentials are missing or a send fails

The form never claims success it cannot back up. The visitor sees "That did not send" with a direct `mailto:hi@sesamelabs.ai` link, their typed values stay in the form, and the full enquiry plus the error is written to the server log, so nothing is lost.

Variables: `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_HOST` (default `smtp.gmail.com`), `SMTP_PORT` (default 465), `RESEND_API_KEY`, `CONTACT_TO` (default `site.email`), `CONTACT_FROM`.

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| Name | Yes | At least 2 characters |
| Email | Yes | Must look like an email; the reply goes here, and it is set as reply-to on the email we receive |
| Phone | No | If filled, at least 7 digits |
| What do you need? (message) | No | Up to 4000 characters |
| Company website | Hidden | Honeypot: bots fill it, people never see it. A filled value is silently accepted and dropped. |

Validation runs on the server, so it works even if JavaScript fails. Errors appear under each field and are announced to screen readers.

## Copy (written during design, needs owner approval)

- **Eyebrow:** Contact
- **Heading:** Tell us how your business runs today
- **Intro:** Send us the basics and we will reply with what a custom ERP for your business would look like, what it would include, and how quickly we can deliver it.
- **Submit button:** Send message / Sending
- **Success heading:** Thanks, we have your message
- **Success body:** We reply to every message within one business day.
- **Delivery failure:** That did not send / Something went wrong on our side. Email us directly and we will reply today: hi@sesamelabs.ai
- **Contact details block:** Email and Response time ("Within one business day, Monday to Friday"). Phone and office address were removed on the owner's instruction — only the email is shown.

## Where it is linked from

- Header: "Contact" in the navigation and the "Schedule a consultation" button.
- Footer: "Contact" under Explore, plus the email in the contact column.
- Every "Schedule a consultation" button on the site goes to `/contact`.
