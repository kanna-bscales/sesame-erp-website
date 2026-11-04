"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { leadForm, zohoLeadForm, zohoWebform } from "@/content/chicago-event";
import { termsAcceptance, termsMeta, termsPath } from "@/content/plma-2026-terms";
import {
  BOOTH_RE,
  isValidRef,
  refParam,
  type AttendeeLookupResponse,
  type EnquiryErrorKey,
  type EnquiryResponse,
} from "@/lib/plma/reference";

// PLMA 2026 registration form.
//
// Personal invitation links (…/chicago-event?ref=<attendee reference>) pre-fill the form: the
// reference is sent to /api/plma/attendee, which looks the Lead up in Zoho CRM on the server and
// returns only Name, Email, Company, Phone, Booth, Job title and Website. Everything stays
// editable, and the consent and terms boxes are never pre-ticked.
//
// Submissions go to /api/plma/enquiry, which updates the attendee's existing Lead (matched by the
// reference, then by email) or creates a new one. If the server has no Zoho credentials it answers
// "not_configured" and the form falls back to the Zoho webform below.
//
// Webform fallback: it sends the same request Zoho's own generated form sends: a fetch POST of the form data to
// https://crm.zoho.com/crm/WebToLeadForm, using the real hidden keys and Zoho field names from
// content/chicago-event.ts. The success message only appears after Zoho answers with its
// "accepted" response; network errors, blocked responses or anything unexpected show an error
// and keep everything the visitor typed.

type WfaTrack = { wfa_submit?: (event: Event) => void; wfa_post_submit?: (event: Event) => void };
declare global {
  interface Window {
    _wfa_track?: WfaTrack;
  }
}

type FieldKey = "name" | "email" | "phone" | "company" | "booth" | "website" | "consent" | "terms";

// Clickwrap acceptance of the PLMA offer terms. Checked in the browser only: it is removed from the
// payload before it is sent, so the Zoho submission is unchanged.
const TERMS_FIELD = "plma_terms_accept";
type Errors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const F = zohoLeadForm.fields;
const UTM_KEY = "sesame-plma-utm";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WEBSITE_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;

const C = zohoLeadForm.clientOnly;

// The attendee reference from ?ref=… is the ONLY attendee identity. It is read once, kept in
// memory, and removed from the address bar straight away (together with any legacy ?booth=…),
// before Zoho's analytics script loads, so it is not shared via the URL, history, screenshots or
// referrer headers. A booth value in the URL is never trusted: the booth number shown in the form
// comes from the verified CRM record.
let capturedRef: string | null | undefined;
function takeRefFromUrl(): string | null {
  if (capturedRef !== undefined) return capturedRef;
  const url = new URL(window.location.href);
  const value = url.searchParams.get(refParam);
  capturedRef = isValidRef(value) ? value : null;
  if (url.searchParams.has(refParam) || url.searchParams.has("booth")) {
    url.searchParams.delete(refParam);
    url.searchParams.delete("booth");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }
  return capturedRef;
}

/** One "Name" input -> Zoho's First Name / Last Name. Last Name is mandatory in Zoho, so a
 *  single-word name goes there; otherwise the last word is the last name. */
function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { first: "", last: parts[0] ?? "" };
  return {
    first: parts.slice(0, -1).join(" ").slice(0, zohoLeadForm.maxLength.firstName),
    last: parts[parts.length - 1].slice(0, zohoLeadForm.maxLength.lastName),
  };
}

function validate(data: FormData): Errors {
  const text = (name: string) => String(data.get(name) ?? "").trim();
  const errors: Errors = {};
  const e = leadForm.errors;

  if (!text(C.fullName)) errors.name = e.name;

  const email = text(F.email);
  if (!email) errors.email = e.emailRequired;
  else if (!EMAIL_RE.test(email)) errors.email = e.email;

  // Optional. If given: digits with optional +, spaces, dots, dashes and brackets; 7–15 digits.
  const phone = text(F.phone);
  const digits = phone.replace(/\D/g, "");
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15)) errors.phone = e.phone;

  if (!text(F.company)) errors.company = e.company;

  const booth = text(C.booth);
  if (booth && !BOOTH_RE.test(booth)) errors.booth = e.booth;

  const website = text(F.website);
  if (website && !WEBSITE_RE.test(website)) errors.website = e.website;

  if (!data.get(F.consent)) errors.consent = e.consent;
  if (!data.get(TERMS_FIELD)) errors.terms = termsAcceptance.error;
  return errors;
}

type Utm = { source: string; medium: string; campaign: string };

function readUtm(): Utm {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = {
    source: params.get("utm_source") ?? "",
    medium: params.get("utm_medium") ?? "",
    campaign: params.get("utm_campaign") ?? "",
  };
  let stored: Partial<Utm> = {};
  try {
    stored = JSON.parse(window.sessionStorage.getItem(UTM_KEY) ?? "{}");
  } catch {
    stored = {};
  }
  const d = zohoLeadForm.utmDefaults;
  const pick = (key: keyof Utm) => (fromUrl[key] || stored[key] || d[key]).slice(0, 255);
  return { source: pick("source"), medium: pick("medium"), campaign: pick("campaign") };
}

const inputClasses =
  "mt-2 block h-12 w-full rounded-lg border border-rule bg-paper px-4 text-base text-ink placeholder:text-ink-soft/70 transition-colors hover:border-ink/40 focus-visible:border-ballpoint focus-visible:ring-2 focus-visible:ring-ballpoint/25 focus-visible:outline-none aria-invalid:border-ballpoint-ink aria-invalid:bg-ballpoint/[0.04]";

export function ZohoLeadForm() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const errId = (name: string) => `${uid}-${name}-error`;

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const attendeeRef = useRef<string | null>(null);

  // Remember UTM values from the landing URL for the rest of the visit (first touch wins).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (!params.get("utm_source") || window.sessionStorage.getItem(UTM_KEY)) return;
      window.sessionStorage.setItem(
        UTM_KEY,
        JSON.stringify({
          source: params.get("utm_source") ?? "",
          medium: params.get("utm_medium") ?? "",
          campaign: params.get("utm_campaign") ?? "",
        }),
      );
    } catch {
      // Storage unavailable (private mode): the URL is still read at submit time.
    }
  }, []);

  // Personal invitation link (?ref=…): ask the server for this attendee's permitted details. Only
  // empty inputs are filled, so anything the visitor already typed is kept. Missing, invalid or
  // unknown references leave the normal blank form.
  useEffect(() => {
    const ref = takeRefFromUrl();
    if (!ref) return;
    attendeeRef.current = ref;
    const controller = new AbortController();
    fetch("/api/plma/attendee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref }),
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => (response.ok ? (response.json() as Promise<AttendeeLookupResponse>) : null))
      .then((result) => {
        const form = formRef.current;
        if (!result?.found || !form) return;
        const map: [string, string][] = [
          [C.fullName, result.fields.name],
          [F.email, result.fields.email],
          [F.company, result.fields.company],
          [F.phone, result.fields.phone],
          [C.booth, result.fields.booth],
          [F.jobTitle, result.fields.jobTitle],
        ];
        for (const [name, value] of map) {
          const input = form.elements.namedItem(name);
          if (value && input instanceof HTMLInputElement && !input.value) {
            input.value = value;
          }
        }
      })
      .catch(() => {
        // Lookup unavailable: the visitor fills the form in by hand.
      });
    return () => controller.abort();
  }, []);

  // Zoho's webform analytics script (part of Zoho's generated code: "Do not remove this code").
  // It attaches to the form by its Zoho id and adds Zoho's tracking/anti-spam fields, which Zoho
  // requires before it will create the lead. Loaded once the form is in the DOM.
  useEffect(() => {
    if (document.getElementById("wf_anal")) return;
    const script = document.createElement("script");
    script.id = "wf_anal";
    script.src = zohoLeadForm.analyticsScript;
    script.async = true;
    document.body.appendChild(script);
  }, []);


  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") alertRef.current?.focus();
  }, [status]);

  // After the first submit attempt, re-check a field as soon as it changes.
  const revalidate = () => {
    if (!submitted || !formRef.current) return;
    setErrors(validate(new FormData(formRef.current)));
  };

  function errorText(key: EnquiryErrorKey): string {
    const e = leadForm.errors;
    const map: Record<EnquiryErrorKey, string> = {
      name: e.name,
      email: e.email,
      phone: e.phone,
      company: e.company,
      booth: e.booth,
      website: e.website,
      consent: e.consent,
      terms: termsAcceptance.error,
    };
    return map[key];
  }

  /** Sends the enquiry to our server route. "fallback" means: use the Zoho webform instead. */
  async function submitToApi(data: FormData): Promise<"ok" | "error" | "fallback" | EnquiryErrorKey[]> {
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch("/api/plma/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
        body: JSON.stringify({
          ref: attendeeRef.current,
          name: value(C.fullName),
          email: value(F.email),
          phone: value(F.phone),
          company: value(F.company),
          booth: value(C.booth),
          jobTitle: value(F.jobTitle),
          website: value(F.website),
          requirements: value(F.requirements),
          consent: Boolean(data.get(F.consent)),
          terms: Boolean(data.get(TERMS_FIELD)),
          termsVersion: termsMeta.updated,
          honeypot: value(zohoLeadForm.honeypot),
          utm: readUtm(),
        }),
      });
      if (response.status === 404) return "fallback"; // route not deployed
      const result = (await response.json().catch(() => null)) as EnquiryResponse | null;
      if (result?.ok) return "ok";
      if (result?.reason === "not_configured") return "fallback";
      if (result?.reason === "invalid" && result.errors.length) return result.errors;
      return "error";
    } catch {
      return "error";
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    let data = new FormData(form);

    setSubmitted(true);
    const found = validate(data);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as FieldKey[])[0];
    if (firstInvalid) {
      document.getElementById(id(firstInvalid))?.focus();
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    try {
      const outcome = await submitToApi(data);
      if (outcome === "ok") {
        setStatus("success");
        return;
      }
      if (Array.isArray(outcome)) {
        const mapped: Errors = {};
        for (const key of outcome) mapped[key] = errorText(key);
        setErrors(mapped);
        setStatus("idle");
        document.getElementById(id(outcome[0]))?.focus();
        return;
      }
      if (outcome === "error") {
        setStatus("error");
        return;
      }
      // "fallback": the server has no Zoho credentials yet. Use the Zoho webform instead.
    } finally {
      inFlight.current = false;
    }

    // Same order as Zoho's generated script: let its analytics record the submit (this fills in
    // Zoho's tracking fields on the form), then read the form data.
    try {
      window._wfa_track?.wfa_submit?.(event.nativeEvent);
    } catch {
      // Analytics errors must not block the submission.
    }
    data = new FormData(form);
    data.delete(TERMS_FIELD);

    // Single Name input -> Zoho's First Name / Last Name.
    const { first, last } = splitName(String(data.get(C.fullName) ?? ""));
    data.delete(C.fullName);
    data.set(F.firstName, first);
    data.set(F.lastName, last);

    // Booth number: its own Zoho field once one exists, otherwise the first line of ERP Requirements.
    const booth = String(data.get(C.booth) ?? "").trim();
    data.delete(C.booth);
    if (booth) {
      if (F.booth) {
        data.set(F.booth, booth);
      } else {
        const notes = String(data.get(F.requirements) ?? "").trim();
        const combined = `Booth number: ${booth}${notes ? `\n\n${notes}` : ""}`;
        data.set(F.requirements, combined.slice(0, zohoLeadForm.maxLength.requirements));
      }
    }

    // Zoho's Website field expects a full URL.
    const website = String(data.get(F.website) ?? "").trim();
    data.set(F.website, website && !/^https?:\/\//i.test(website) ? `https://${website}` : website);

    const utm = readUtm();
    data.set(F.utmSource, utm.source);
    data.set(F.utmMedium, utm.medium);
    data.set(F.utmCampaign, utm.campaign);

    inFlight.current = true;
    setStatus("submitting");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(zohoLeadForm.endpoint, {
        method: "POST",
        body: data,
        cache: "no-cache",
        signal: controller.signal,
      });
      const contentType = response.headers.get("Content-Type") ?? "";
      const result: unknown = contentType.includes("application/json") ? await response.json() : await response.text();

      // Zoho answers an accepted submission with JSON such as
      // { actionsubmit: "Splash Message", actionvalue: "Thank you! ..." }.
      const accepted =
        response.ok &&
        typeof result === "object" &&
        result !== null &&
        "actionsubmit" in result &&
        (result as { invalidCaptcha?: string }).invalidCaptcha !== "true";

      if (accepted) {
        try {
          window._wfa_track?.wfa_post_submit?.(event.nativeEvent);
        } catch {
          // Ignore analytics errors after Zoho accepted the lead.
        }
      }
      setStatus(accepted ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timer);
      inFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl bg-sheet p-8 ring-1 ring-ink/10 shadow-[6px_6px_0_var(--color-canary)] focus-visible:outline-none sm:p-12 dark:shadow-[6px_6px_0_var(--color-canary),0_0_80px_-30px_var(--color-canary)]"
      >
        <CircleCheck aria-hidden className="size-12 text-ballpoint-ink" strokeWidth={1.75} />
        <h3 className="font-semiwide mt-5 text-2xl font-extrabold sm:text-3xl">{leadForm.successHeading}</h3>
        <p className="mt-3 max-w-[32rem] text-lg leading-relaxed text-ink-soft">{leadForm.successBody}</p>
      </div>
    );
  }

  const busy = status === "submitting";
  const errorCount = Object.keys(errors).length;

  return (
    <form
      ref={formRef}
      id={zohoLeadForm.formId}
      name={zohoLeadForm.formName}
      onSubmit={onSubmit}
      onChange={revalidate}
      noValidate
      acceptCharset="UTF-8"
      aria-describedby={`${uid}-intro`}
      className="rounded-xl bg-sheet p-6 ring-1 ring-ink/10 shadow-[6px_6px_0_var(--color-canary)] sm:p-9 dark:shadow-[6px_6px_0_var(--color-canary),0_0_80px_-30px_var(--color-canary)]"
    >
      <div className="border-b border-rule pb-7">
        <h3 className="font-semiwide text-2xl font-extrabold sm:text-[1.75rem]">{leadForm.heading}</h3>
        <p id={`${uid}-intro`} className="mt-3 leading-relaxed text-ink-soft">
          {leadForm.description}
        </p>
        <p className="mt-5 inline-flex items-center gap-2.5 rounded-lg bg-canary px-3.5 py-2 text-[0.95rem] font-semibold text-night">
          <span aria-hidden className="size-2 rounded-full bg-ballpoint" />
          {leadForm.offer}
        </p>
      </div>

      {/* Zoho webform keys and fixed CRM values. Do not remove. */}
      {Object.entries(zohoLeadForm.hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <input type="hidden" name={F.utmSource} defaultValue={zohoLeadForm.utmDefaults.source} />
      <input type="hidden" name={F.utmMedium} defaultValue={zohoLeadForm.utmDefaults.medium} />
      <input type="hidden" name={F.utmCampaign} defaultValue={zohoLeadForm.utmDefaults.campaign} />
      {/* Zoho's spam trap: real visitors never see or fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input type="text" name={zohoLeadForm.honeypot} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {submitted && errorCount > 0 && (
        <p className="mt-6 flex items-center gap-2 rounded-lg bg-ballpoint/[0.06] px-4 py-3 text-[0.95rem] font-medium text-ballpoint-ink">
          <CircleAlert aria-hidden className="size-5 shrink-0" />
          {leadForm.errors.summary}
        </p>
      )}

      <div className="mt-7 grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field id={id("name")} errorId={errId("name")} label={leadForm.labels.name} required error={errors.name}>
          <input
            id={id("name")}
            name={C.fullName}
            type="text"
            autoComplete="name"
            maxLength={zohoLeadForm.maxLength.name}
            placeholder={leadForm.placeholders.name}
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? errId("name") : undefined}
            className={inputClasses}
          />
        </Field>

        <Field id={id("email")} errorId={errId("email")} label={leadForm.labels.email} required error={errors.email}>
          <input
            id={id("email")}
            name={F.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={zohoLeadForm.maxLength.email}
            placeholder={leadForm.placeholders.email}
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? errId("email") : undefined}
            className={inputClasses}
          />
        </Field>

        <Field id={id("company")} errorId={errId("company")} label={leadForm.labels.company} required error={errors.company}>
          <input
            id={id("company")}
            name={F.company}
            type="text"
            autoComplete="organization"
            maxLength={zohoLeadForm.maxLength.company}
            required
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={errors.company ? errId("company") : undefined}
            className={inputClasses}
          />
        </Field>

        <Field id={id("phone")} errorId={errId("phone")} label={leadForm.labels.phone} error={errors.phone}>
          <input
            id={id("phone")}
            name={F.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={zohoLeadForm.maxLength.phone}
            placeholder={leadForm.placeholders.phone}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? errId("phone") : undefined}
            className={inputClasses}
          />
        </Field>

        <Field
          id={id("booth")}
          errorId={errId("booth")}
          label={leadForm.labels.booth}
          error={errors.booth}
        >
          <input
            id={id("booth")}
            name={C.booth}
            type="text"
            autoComplete="off"
            maxLength={zohoLeadForm.maxLength.booth}
            placeholder={leadForm.placeholders.booth}
            aria-invalid={errors.booth ? true : undefined}
            aria-describedby={errors.booth ? errId("booth") : undefined}
            className={inputClasses}
          />
        </Field>

        <Field id={id("jobTitle")} errorId={errId("jobTitle")} label={leadForm.labels.jobTitle}>
          <input
            id={id("jobTitle")}
            name={F.jobTitle}
            type="text"
            autoComplete="organization-title"
            maxLength={zohoLeadForm.maxLength.jobTitle}
            className={inputClasses}
          />
        </Field>

        <Field id={id("requirements")} errorId={errId("requirements")} label={leadForm.labels.requirements} wide>
          <textarea
            id={id("requirements")}
            name={F.requirements}
            rows={5}
            maxLength={zohoLeadForm.maxLength.requirements - 40}
            placeholder={leadForm.placeholders.requirements}
            className={`${inputClasses} h-auto min-h-32 resize-y py-3 leading-relaxed`}
          />
        </Field>

        <div className="sm:col-span-2">
          <label
            htmlFor={id("consent")}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 leading-relaxed transition-colors ${
              errors.consent ? "border-ballpoint-ink bg-ballpoint/[0.04]" : "border-rule bg-paper hover:border-ink/40"
            }`}
          >
            <input
              id={id("consent")}
              name={F.consent}
              type="checkbox"
              required
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? errId("consent") : undefined}
              className="mt-1 size-4.5 shrink-0 accent-ballpoint"
            />
            <span>
              {leadForm.consent} <span className="text-ballpoint-ink">*</span>
            </span>
          </label>
          {errors.consent && <ErrorText id={errId("consent")}>{errors.consent}</ErrorText>}
          <label
            htmlFor={id("terms")}
            className={`mt-3 flex cursor-pointer items-start gap-3 rounded-lg border p-4 leading-relaxed transition-colors ${
              errors.terms ? "border-ballpoint-ink bg-ballpoint/[0.04]" : "border-rule bg-paper hover:border-ink/40"
            }`}
          >
            <input
              id={id("terms")}
              name={TERMS_FIELD}
              type="checkbox"
              required
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? errId("terms") : undefined}
              className="mt-1 size-4.5 shrink-0 accent-ballpoint"
            />
            <span>
              {termsAcceptance.before}{" "}
              <Link
                href={termsPath}
                target="_blank"
                className="font-medium text-ballpoint-ink underline underline-offset-4"
              >
                {termsAcceptance.link}
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
              . <span className="text-ballpoint-ink">*</span>
            </span>
          </label>
          {errors.terms && <ErrorText id={errId("terms")}>{errors.terms}</ErrorText>}
        </div>
      </div>

      {status === "error" && (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="mt-7 rounded-lg border-2 border-ballpoint-ink bg-paper p-4 focus-visible:outline-none"
        >
          <p className="font-semibold">{leadForm.failureHeading}</p>
          <p className="mt-1 text-ink-soft">
            {leadForm.failureBody}{" "}
            <a
              href={zohoWebform.src}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ballpoint-ink underline underline-offset-4"
            >
              {leadForm.failureLink}
            </a>
            .
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        aria-disabled={busy}
        className="ease-press mt-8 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-[10px] bg-ballpoint px-6 text-lg font-semibold text-on-ballpoint transition-colors duration-200 hover:bg-ballpoint-deep disabled:cursor-progress disabled:opacity-80"
      >
        {busy && <LoaderCircle aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />}
        {busy ? leadForm.submitting : leadForm.submit}
      </button>
      <p aria-live="polite" className="sr-only">
        {busy ? leadForm.submitting : ""}
      </p>
    </form>
  );
}

function Field({
  id,
  errorId,
  label,
  required = false,
  wide = false,
  error,
  hint,
  hintId,
  children,
}: {
  id: string;
  errorId: string;
  label: string;
  required?: boolean;
  wide?: boolean;
  error?: string;
  hint?: string;
  hintId?: string;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="block text-[0.95rem] font-semibold text-ink">
        {label}
        {required && (
          <>
            {" "}
            <span className="text-ballpoint-ink" aria-hidden>
              *
            </span>
          </>
        )}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-ink-soft">
          {hint}
        </p>
      )}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ballpoint-ink">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}
