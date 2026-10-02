import { About } from "@/components/sections/About";
import { chapterMetadata } from "@/content/metadata";

export const metadata = chapterMetadata("Об Элине — Элина Тумарева", "Элина Тумарева: карьерное консультирование, коучинг и профессиональный путь.", "/about");

export default function AboutRoute() { return <About />; }
