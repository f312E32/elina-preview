import { Hero } from "@/components/hero/Hero";
import { siteContent } from "@/content/site";
import { chapterMetadata } from "@/content/metadata";

export const metadata = chapterMetadata(siteContent.seo.title, siteContent.seo.description, "/");

export default function Home() {
  return <Hero />;
}
