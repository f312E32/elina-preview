import { Services } from "@/components/sections/Services";
import { chapterMetadata } from "@/content/metadata";

export const metadata = chapterMetadata("Услуги — Элина Тумарева", "Индивидуальная программа и короткий формат работы с Элиной Тумаревой.", "/services");

export default function ServicesRoute() { return <Services />; }
