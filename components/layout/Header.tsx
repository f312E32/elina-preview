"use client";

import { chapters } from "@/content/site";
import { BookLink } from "@/components/book/BookLink";
import { useBook } from "@/components/book/BookContext";
import { ContactAction } from "@/components/ui/Action";

export function Header() {
  const { activeRoute } = useBook();
  return <header className="site-header">
    <div className="page-shell site-header__inner">
      <BookLink className="wordmark" href="/" aria-label="Элина Тумарева — главная"><span>Элина</span><span>Тумарева<span className="wordmark__period">.</span></span></BookLink>
      <nav className="site-nav" aria-label="Основная навигация">{chapters.map((chapter) => <BookLink href={chapter.href} key={chapter.href} aria-current={activeRoute === chapter.href ? "page" : undefined}>{chapter.label}</BookLink>)}</nav>
      <ContactAction label="Обсудить запрос" variant="text" className="site-header__contact" />
    </div>
  </header>;
}
