// PLMA 2026 person identity rules (pure functions, no I/O).
//
// The secure reference in a personal link is the primary identity. These helpers are only used
// when there is no reference, or to decide whether a name typed for "Add another contact" is a
// person who is already in the CRM. When in doubt they answer "not the same person"; the callers
// then flag the record for manual review instead of merging anything.

const NICKNAMES: Record<string, string> = {
  rob: "robert", bob: "robert", bill: "william", will: "william", mike: "michael", jim: "james",
  jimmy: "james", tom: "thomas", dave: "david", dan: "daniel", danny: "daniel", steve: "steven",
  chris: "christopher", joe: "joseph", tony: "anthony", rick: "richard", rich: "richard",
  andy: "andrew", matt: "matthew", greg: "gregory", jeff: "jeffrey", ken: "kenneth",
  ron: "ronald", don: "donald", ed: "edward", pat: "patrick", sam: "samuel", ben: "benjamin",
  nick: "nicholas", alex: "alexander", tim: "timothy", jon: "jonathan", larry: "lawrence",
  charlie: "charles", chuck: "charles", fred: "frederick", kate: "katherine", katie: "katherine",
  liz: "elizabeth", beth: "elizabeth", sue: "susan", jen: "jennifer", vince: "vincent",
  phil: "philip", jerry: "gerald", jack: "john", doug: "douglas", zach: "zachary",
  josh: "joshua", nate: "nathan", ray: "raymond", walt: "walter", pete: "peter",
};

const TITLES = new Set(["jr", "sr", "ii", "iii", "iv", "dr", "mr", "ms", "mrs", "prof"]);

/** Lower-case ASCII name tokens without titles, initials or bracketed nicknames. */
export function nameTokens(name: string): string[] {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !TITLES.has(t));
}

const canonical = (first: string) => NICKNAMES[first] ?? first;

/** True when two written names very probably belong to the same person ("Rob Smith" / "Robert J. Smith"). */
export function samePersonName(a: string, b: string): boolean {
  const A = nameTokens(a);
  const B = nameTokens(b);
  if (!A.length || !B.length) return false;
  if (A.join(" ") === B.join(" ")) return true;
  if (A.length < 2 || B.length < 2) return false;
  if (A[A.length - 1] !== B[B.length - 1]) return false;
  const fa = canonical(A[0]);
  const fb = canonical(B[0]);
  return fa === fb || (fa.length >= 3 && fb.startsWith(fa)) || (fb.length >= 3 && fa.startsWith(fb));
}

/** Company names compared loosely (punctuation, case and legal suffixes ignored). */
export function sameCompanyName(a: string, b: string): boolean {
  const norm = (s: string) =>
    s
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((t) => t && !["inc", "llc", "ltd", "limited", "corp", "corporation", "co", "company", "the", "lp", "plc", "gmbh", "sa", "srl", "spa", "bv", "ulc"].includes(t))
      .join(" ");
  const x = norm(a);
  return Boolean(x) && x === norm(b);
}

export const normEmail = (e: string) => e.trim().toLowerCase();

/** Unique, valid-looking, lower-cased emails, without the excluded ones, in input order. */
export function uniqueEmails(list: string[], exclude: string[] = []): string[] {
  const out: string[] = [];
  const skip = new Set(exclude.map(normEmail));
  for (const raw of list) {
    const e = normEmail(raw);
    if (e && !skip.has(e) && !out.includes(e)) out.push(e);
  }
  return out;
}

/** Stored as one address per line in Submitted_Additional_Emails. */
export const parseEmailList = (value: string | null | undefined) =>
  (value ?? "")
    .split(/[\s,;]+/)
    .map(normEmail)
    .filter(Boolean);
