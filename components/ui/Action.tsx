"use client";

import { useBook } from "@/components/book/BookContext";

type ActionProps = {
  label: string;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  href?: string | null;
};

export function ContactAction({ label, variant = "primary", className = "", href }: ActionProps) {
  const { openContact } = useBook();
  const classNames = `action action--${variant} ${className}`.trim();
  const contents = <><span className="action__label">{label}</span><span className="action__mark" aria-hidden="true">↗</span></>;

  if (href) return <a className={classNames} href={href} target="_blank" rel="noopener noreferrer">{contents}</a>;
  return <button className={classNames} type="button" onClick={openContact} aria-haspopup="dialog">{contents}</button>;
}
