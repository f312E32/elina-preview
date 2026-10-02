import { Reviews } from "@/components/sections/Reviews";
import { chapterMetadata } from "@/content/metadata";

export const metadata = chapterMetadata("Отзывы — Элина Тумарева", "Отзывы клиентов о работе с Элиной Тумаревой.", "/reviews");

export default function ReviewsRoute() { return <Reviews />; }
