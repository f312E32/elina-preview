"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { BookRoute } from "@/content/site";
import { useBook } from "./BookContext";

type Props = {
  href: BookRoute;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-current"?: "page";
};

export function BookLink({ href, children, ...props }: Props) {
  const { navigate } = useBook();
  return <Link href={href} {...props} onNavigate={(event) => { event.preventDefault(); navigate(href); }}>{children}</Link>;
}
