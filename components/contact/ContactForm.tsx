"use client";

import { useActionState, useId } from "react";
import { CircleCheck } from "lucide-react";
import { submitContact } from "@/app/contact/actions";
import { initialContactState } from "@/app/contact/state";
import { contact } from "@/content/contact";
import { site } from "@/lib/site";

const fieldClasses =
  "mt-2 w-full rounded-md border border-rule bg-paper px-4 py-3 text-ink placeholder:text-ink-soft/70 focus-visible:border-ballpoint";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const ids = useId();
  const fieldId = (name: string) => `${ids}-${name}`;
  const errorId = (name: string) => `${ids}-${name}-error`;
  const { form } = contact;

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-md bg-sheet p-6 shadow-[10px_10px_0_var(--color-canary)] ring-1 ring-rule sm:p-8 dark:shadow-[10px_10px_0_var(--color-canary),0_0_80px_-30px_var(--color-canary)]"
      >
        <CircleCheck aria-hidden className="size-10 text-ballpoint-ink" strokeWidth={1.75} />
        <h2 className="font-semiwide mt-4 text-2xl font-extrabold">{form.successHeading}</h2>
        <p className="mt-2 text-ink-soft">{form.successBody}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-md bg-sheet p-6 shadow-[10px_10px_0_var(--color-canary)] ring-1 ring-rule sm:p-8 dark:shadow-[10px_10px_0_var(--color-canary),0_0_80px_-30px_var(--color-canary)]"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor={fieldId("name")} className="font-medium">
            {form.name.label} <span className="text-ballpoint-ink">*</span>
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={state.values.name}
            placeholder={form.name.placeholder}
            aria-invalid={state.errors.name ? true : undefined}
            aria-describedby={state.errors.name ? errorId("name") : undefined}
            className={fieldClasses}
          />
          {state.errors.name && (
            <p id={errorId("name")} className="mt-2 text-sm font-medium text-ballpoint-ink">
              {state.errors.name}
            </p>
          )}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor={fieldId("email")} className="font-medium">
            {form.email.label} <span className="text-ballpoint-ink">*</span>
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state.values.email}
            placeholder={form.email.placeholder}
            aria-invalid={state.errors.email ? true : undefined}
            aria-describedby={state.errors.email ? errorId("email") : undefined}
            className={fieldClasses}
          />
          {state.errors.email && (
            <p id={errorId("email")} className="mt-2 text-sm font-medium text-ballpoint-ink">
              {state.errors.email}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fieldId("phone")} className="font-medium">
            {form.phone.label}{" "}
            <span className="font-normal text-ink-soft">({form.phone.optional})</span>
          </label>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={state.values.phone}
            placeholder={form.phone.placeholder}
            aria-invalid={state.errors.phone ? true : undefined}
            aria-describedby={state.errors.phone ? errorId("phone") : undefined}
            className={fieldClasses}
          />
          {state.errors.phone && (
            <p id={errorId("phone")} className="mt-2 text-sm font-medium text-ballpoint-ink">
              {state.errors.phone}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fieldId("message")} className="font-medium">
            {form.message.label}{" "}
            <span className="font-normal text-ink-soft">({form.message.optional})</span>
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={5}
            defaultValue={state.values.message}
            placeholder={form.message.placeholder}
            aria-invalid={state.errors.message ? true : undefined}
            aria-describedby={state.errors.message ? errorId("message") : undefined}
            className={`${fieldClasses} resize-y`}
          />
          {state.errors.message && (
            <p id={errorId("message")} className="mt-2 text-sm font-medium text-ballpoint-ink">
              {state.errors.message}
            </p>
          )}
        </div>
      </div>

      <div aria-hidden className="hidden">
        <label htmlFor={fieldId("company")}>Company website</label>
        <input id={fieldId("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.deliveryFailed && (
        <div role="alert" className="mt-6 rounded-md border-2 border-ballpoint-ink bg-paper p-4">
          <p className="font-semibold">{form.errorHeading}</p>
          <p className="mt-1 text-ink-soft">
            {form.errorBody}{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-ballpoint-ink underline underline-offset-4"
            >
              {site.email}
            </a>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-7 inline-flex h-13 items-center justify-center rounded-[10px] bg-ballpoint px-6 text-base font-semibold text-on-ballpoint transition-colors duration-200 ease-press hover:bg-ballpoint-deep disabled:cursor-not-allowed disabled:opacity-65"
      >
        {pending ? form.submitting : form.submit}
      </button>
    </form>
  );
}
