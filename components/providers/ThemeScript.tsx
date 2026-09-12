"use client";

import { themeInitScript } from "@/lib/theme";

// Executes during HTML parsing on hard loads. On the client it becomes text/plain so React
// does not warn about rendering a script tag (pattern from Next's "preventing flash" guide).
export function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
