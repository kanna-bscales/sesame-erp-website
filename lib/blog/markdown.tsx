import Link from "next/link";
import type { ReactNode } from "react";

// Small Markdown renderer for blog posts (no extra dependencies, no raw HTML).
// Supported: "## " / "### " headings, paragraphs, "- " and "1. " lists, "> " callouts,
// "| a | b |" tables (second row is the separator), **bold** and [text](href) links.
// Internal links (starting with "/") use next/link; external links open in the same tab with
// rel="noopener". Anything else is rendered as plain text, so a post can never inject HTML.

export type Heading = { level: 2 | 3; text: string; id: string };

export type Block =
  | { type: "h2" | "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      const text = heading[2].trim();
      blocks.push({ type: heading[1].length === 2 ? "h2" : "h3", text, id: slugify(text) });
      i++;
      continue;
    }
    if (/^\s*\|/.test(line)) {
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
      const [head, , ...body] = rows; // rows[1] is the |---| separator
      blocks.push({ type: "table", head, rows: body });
      continue;
    }
    if (/^>\s?/.test(line)) {
      const text: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) text.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ type: "quote", text: text.join(" ") });
      continue;
    }
    const listMatch = line.match(/^(-|\d+\.)\s+/);
    if (listMatch) {
      const ordered = listMatch[1] !== "-";
      const re = ordered ? /^\d+\.\s+/ : /^-\s+/;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ""));
      blocks.push({ type: ordered ? "ol" : "ul", items });
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|\s*\||>|-\s|\d+\.\s)/.test(lines[i])) para.push(lines[i++].trim());
    blocks.push({ type: "p", text: para.join(" ") });
  }
  return blocks;
}

export const headingsOf = (blocks: Block[]): Heading[] =>
  blocks.flatMap((b) => (b.type === "h2" || b.type === "h3" ? [{ level: b.type === "h2" ? 2 : 3, text: b.text, id: b.id } as Heading] : []));

/** Every link target in the source, for the build-time link check. */
export const linksOf = (source: string) => [...source.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].map((m) => m[1]);

const linkClass = "font-semibold text-ballpoint-ink underline underline-offset-4 hover:text-ink";

function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1] !== undefined) {
      out.push(<strong key={k} className="font-semibold text-ink">{m[1]}</strong>);
    } else {
      const [label, href] = [m[2], m[3]];
      out.push(
        href.startsWith("/") ? (
          <Link key={k} href={href} className={linkClass}>
            {inline(label, k)}
          </Link>
        ) : (
          <a key={k} href={href} rel="noopener" className={linkClass}>
            {inline(label, k)}
          </a>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        const key = `b${i}`;
        switch (b.type) {
          case "h2":
            return (
              <h2 key={key} id={b.id} className="font-wide mt-14 scroll-mt-28 text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-extrabold">
                {inline(b.text, key)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={key} id={b.id} className="font-semiwide mt-9 scroll-mt-28 text-xl font-extrabold">
                {inline(b.text, key)}
              </h3>
            );
          case "p":
            return (
              <p key={key} className="mt-5 text-[1.075rem] leading-[1.75] text-ink-soft">
                {inline(b.text, key)}
              </p>
            );
          case "ul":
            return (
              <ul key={key} className="mt-5 list-disc space-y-2.5 pl-6 text-[1.075rem] leading-[1.7] text-ink-soft marker:text-ballpoint-ink">
                {b.items.map((item, j) => (
                  <li key={j}>{inline(item, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="mt-5 list-decimal space-y-2.5 pl-6 text-[1.075rem] leading-[1.7] text-ink-soft marker:font-semibold marker:text-ink">
                {b.items.map((item, j) => (
                  <li key={j}>{inline(item, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <p key={key} className="mt-6 border-l-4 border-ballpoint bg-paper py-4 pr-4 pl-5 leading-relaxed">
                {inline(b.text, key)}
              </p>
            );
          case "table":
            return (
              <div key={key} className="mt-6 overflow-x-auto rounded-lg ring-1 ring-ink/10">
                <table className="w-full min-w-[34rem] border-collapse text-left text-[0.97rem] leading-relaxed">
                  <thead className="bg-paper">
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} scope="col" className="border-b border-rule px-4 py-3 font-semibold text-ink">
                          {inline(h, `${key}-h${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="align-top [&:last-child>td]:border-b-0">
                        {row.map((c, j) => (
                          <td key={j} className="border-b border-rule px-4 py-3 text-ink-soft">
                            {inline(c, `${key}-${r}-${j}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}
