"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = { hash: string; className?: string; children: ReactNode; onClick?: () => void };

// On the homepage a plain #hash link lets Lenis smooth-scroll; elsewhere navigate to /#hash.
export function SectionLink({ hash, className, children, onClick }: Props) {
  const onHome = usePathname() === "/";

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
