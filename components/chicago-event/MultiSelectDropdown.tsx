"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, X } from "lucide-react";

type Props = {
  /** Real Zoho field name. A hidden native <select multiple> with this name carries the values. */
  name: string;
  label: string;
  placeholder: string;
  options: readonly string[];
  optionalLabel?: string;
};

// Multi-select dropdown that keeps Zoho's own multi-select field in the submission.
//
// The visible control is a combobox + listbox with checkboxes. The selected values are mirrored
// into a hidden <select multiple name={name}>, so FormData sends each selected value once under the
// real Zoho field name, exactly as Zoho's generated <select multiple> would.
export function MultiSelectDropdown({ name, label, placeholder, options, optionalLabel }: Props) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const listId = `${uid}-list`;
  const optionId = (index: number) => `${uid}-opt-${index}`;

  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close on outside click / focus leaving the control.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  // Move focus into the list when it opens.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Keep values in sync when the surrounding form is reset.
  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onReset = () => setSelected([]);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  const toggle = (value: string) =>
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : options.filter((o) => o === value || current.includes(o)),
    );

  const openList = (index = 0) => {
    setActive(index);
    setOpen(true);
  };

  const closeList = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openList(event.key === "ArrowUp" ? options.length - 1 : 0);
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        toggle(options[active]);
        break;
      case "Escape":
        event.preventDefault();
        closeList();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  // Visible only when nothing is selected; otherwise it gives screen readers the current selection.
  const summary = selected.length === 0 ? placeholder : `Selected: ${selected.join(", ")}`;

  return (
    <div ref={rootRef} className="relative">
      <span id={labelId} className="block text-[0.95rem] font-semibold text-ink">
        {label} {optionalLabel && <span className="font-normal text-ink-soft">({optionalLabel})</span>}
      </span>

      {/* Real Zoho field. Hidden from users and assistive tech; the dropdown below is the UI. */}
      <select name={name} multiple hidden aria-hidden tabIndex={-1} value={selected} onChange={() => {}}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div
        className={`relative mt-2 flex min-h-12 w-full flex-wrap items-center gap-2 rounded-lg border bg-paper py-2 pr-11 pl-4 transition-colors ${
          open ? "border-ballpoint ring-2 ring-ballpoint/15" : "border-rule hover:border-ink/40 has-[[role=combobox]:focus-visible]:border-ballpoint has-[[role=combobox]:focus-visible]:ring-2 has-[[role=combobox]:focus-visible]:ring-ballpoint/25"
        }`}
      >
        {selected.map((value) => (
          <span
            key={value}
            className="relative z-10 inline-flex items-center gap-1 rounded-full bg-ink py-1 pr-1 pl-3 text-sm font-medium text-paper"
          >
            {value}
            <button
              type="button"
              onClick={() => toggle(value)}
              aria-label={`Remove ${value}`}
              className="flex size-6 items-center justify-center rounded-full hover:bg-paper/20"
            >
              <X aria-hidden className="size-3.5" />
            </button>
          </span>
        ))}

        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={labelId}
          aria-describedby={`${uid}-summary`}
          onClick={() => (open ? closeList(false) : openList())}
          onKeyDown={onTriggerKeyDown}
          className="flex min-h-8 flex-1 items-center text-left text-base text-ink-soft after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          <span id={`${uid}-summary`} className={selected.length ? "sr-only" : ""}>
            {summary}
          </span>
        </button>

        <ChevronDown
          aria-hidden
          className={`pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-soft transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-rule bg-sheet shadow-[5px_5px_0_var(--color-canary)]">
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-multiselectable="true"
            aria-labelledby={labelId}
            aria-activedescendant={optionId(active)}
            tabIndex={-1}
            onKeyDown={onListKeyDown}
            className="max-h-72 overflow-y-auto py-1.5 focus-visible:outline-none"
          >
            {options.map((option, index) => {
              const isSelected = selected.includes(option);
              return (
                <li
                  key={option}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActive(index)}
                  onClick={() => toggle(option)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-base ${
                    index === active ? "bg-paper" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className={`flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      isSelected ? "border-ballpoint bg-ballpoint text-on-ballpoint" : "border-ink/30 bg-sheet"
                    }`}
                  >
                    {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  {option}
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-between border-t border-rule px-4 py-2.5">
            <button
              type="button"
              onClick={() => setSelected([])}
              disabled={selected.length === 0}
              className="text-sm font-semibold text-ballpoint-ink underline-offset-4 hover:underline disabled:text-ink-soft disabled:no-underline"
            >
              Clear selection
            </button>
            <button
              type="button"
              onClick={() => closeList()}
              className="rounded-md bg-ink px-3.5 py-1.5 text-sm font-semibold text-paper"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
