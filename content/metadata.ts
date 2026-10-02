import type { Metadata } from "next";
import { siteContent, type BookRoute } from "./site";

export function siteUrlForPath(path: string): string | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteContent.seo.siteUrl;
  if (!siteUrl) return undefined;
  const base = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
  return new URL(path.replace(/^\/+/, ""), base).toString();
}

export function chapterMetadata(title: string, description: string, route: BookRoute): Metadata {
  const url = siteUrlForPath(route === "/" ? "/" : `${route}/`);
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: { type: "website", locale: "ru_RU", siteName: siteContent.identity.name, title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}
