"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getCampaign } from "@/lib/campaign";

type Props = { hash: string; className?: string; children: ReactNode; onClick?: () => void };

// On the homepage a plain #hash link lets Lenis smooth-scroll; elsewhere navigate to /#hash.
// A campaign page can map a homepage section to its own equivalent section (see lib/campaign.ts).
export function SectionLink({ hash, className, children, onClick }: Props) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const localHash = getCampaign(pathname)?.sectionLinks[hash];

  if (localHash) {
    return (
      <a href={localHash} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  if (onHome) {
    return (
      <a href={hash} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={`/${hash}`} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
