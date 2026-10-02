import type { Metadata } from "next";
import { siteContent } from "@/content/site";
import { siteUrlForPath } from "@/content/metadata";
import { BookShell } from "@/components/book/BookShell";
import "@fontsource-variable/golos-text/wght.css";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";
import "./sections.css";
import "./reviews.css";

const { identity, seo } = siteContent;
const siteUrl = siteUrlForPath("/");
const previewNoindex = process.env.PREVIEW_NOINDEX === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl ? new URL(siteUrl).origin : "http://localhost:3000"),
  title: seo.title,
  description: seo.description,
  applicationName: identity.name,
  robots: previewNoindex ? { index: false, follow: false } : undefined,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: identity.name,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body><BookShell>{children}</BookShell></body></html>;
}
