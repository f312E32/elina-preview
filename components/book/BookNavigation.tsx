"use client";

import { motion, useReducedMotion } from "motion/react";
import { chapters } from "@/content/site";
import { useBook } from "./BookContext";
import { BookLink } from "./BookLink";

export function BookNavigation() {
  const { activeRoute, openContact } = useBook();
  const reducedMotion = useReducedMotion();
  const index = Math.max(0, chapters.findIndex((chapter) => chapter.href === activeRoute));
  const previous = chapters[index - 1];
  const next = chapters[index + 1];

  return <nav className="book-navigation" aria-label="Навигация по страницам">
    <div className="page-shell book-navigation__inner">
      {previous ? <BookLink className="book-navigation__edge" href={previous.href} aria-label={`Предыдущая страница: ${previous.label}`}><span aria-hidden="true">←</span><span>ПРЕДЫДУЩАЯ</span></BookLink> : <span className="book-navigation__edge book-navigation__edge--empty" aria-hidden="true" />}
      <motion.div key={activeRoute} className="book-navigation__counter" initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? .12 : .35 }} aria-live="polite"><span>{chapters[index].number} / 04</span><small>{chapters[index].chapter}</small></motion.div>
      {next ? <BookLink className="book-navigation__edge book-navigation__edge--next" href={next.href} aria-label={`Следующая страница: ${next.label}`}><span>СЛЕДУЮЩАЯ</span><span aria-hidden="true">→</span></BookLink> : <button className="book-navigation__edge book-navigation__edge--next" type="button" onClick={openContact}><span>СВЯЗАТЬСЯ</span><span aria-hidden="true">↗</span></button>}
    </div>
  </nav>;
}
