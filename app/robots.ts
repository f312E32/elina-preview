import type { MetadataRoute } from "next";
import { siteUrlForPath } from "@/content/metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (process.env.PREVIEW_NOINDEX === "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: siteUrlForPath("/sitemap.xml"),
  };
}
