"use client";

import { chapters } from "@/content/site";
import { useBook } from "./BookContext";
import { BookLink } from "./BookLink";

export function BookNavigation() {
  const { activeRoute, openContact } = useBook();
  const index = Math.max(0, chapters.findIndex((chapter) => chapter.href === activeRoute));
  const previous = chapters[index - 1];
  const next = chapters[index + 1];

  return <nav className="book-navigation" aria-label="Навигация по страницам">
    <div className="page-shell book-navigation__inner">
      {previous ? <BookLink className="book-navigation__edge" href={previous.href} aria-label={`Предыдущая страница: ${previous.label}`}><span aria-hidden="true">←</span><span>ПРЕДЫДУЩАЯ</span></BookLink> : <span className="book-navigation__edge book-navigation__edge--empty" aria-hidden="true" />}
      {next ? <BookLink className="book-navigation__edge book-navigation__edge--next" href={next.href} aria-label={`Следующая страница: ${next.label}`}><span>СЛЕДУЮЩАЯ</span><span aria-hidden="true">→</span></BookLink> : <button className="book-navigation__edge book-navigation__edge--next" type="button" onClick={openContact}><span>СВЯЗАТЬСЯ</span><span aria-hidden="true">↗</span></button>}
    </div>
  </nav>;
}
