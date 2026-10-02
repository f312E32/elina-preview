import type { MetadataRoute } from "next";
import { chapters } from "@/content/site";
import { siteUrlForPath } from "@/content/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.PREVIEW_NOINDEX === "true" || !siteUrlForPath("/")) return [];

  return chapters.map((chapter, index) => ({ url: siteUrlForPath(chapter.href === "/" ? "/" : `${chapter.href}/`)!, changeFrequency: "monthly", priority: index === 0 ? 1 : .7 }));
}
