"use client";

import { useCallback, useLayoutEffect, useRef, useState, type TouchEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { siteContent } from "@/content/site";
import { ReviewAvatar } from "./ReviewAvatar";

function withEmphasis(paragraph: string, quote: string) {
  const start = paragraph.indexOf(quote);
  if (start < 0) return paragraph;
  return <>{paragraph.slice(0, start)}<mark className="review-reading__emphasis">{quote}</mark>{paragraph.slice(start + quote.length)}</>;
}

export function Reviews() {
  const { reviews } = siteContent;
  const [active, setActive] = useState(0);
  const [scrollState, setScrollState] = useState<{ overflowing: boolean | null; more: boolean }>({ overflowing: null, more: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number; direction: "horizontal" | "vertical" | null } | null>(null);
  const reducedMotion = useReducedMotion();
  const review = reviews.items[active];

  const syncScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const overflowing = element.scrollHeight > element.clientHeight + 4;
    const more = overflowing && element.scrollTop + element.clientHeight < element.scrollHeight - 4;
    setScrollState((previous) => previous.overflowing === overflowing && previous.more === more ? previous : { overflowing, more });
  }, []);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTop = 0;
    syncScroll();
    const observer = new ResizeObserver(syncScroll);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [active, syncScroll]);

  const move = (direction: number) => setActive((index) => (index + direction + reviews.items.length) % reviews.items.length);
  const onTouchStart = (event: TouchEvent) => {
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, direction: null };
  };
  const onTouchMove = (event: TouchEvent) => {
    const gesture = touchStart.current;
    if (!gesture || gesture.direction) return;
    const dx = Math.abs(event.touches[0].clientX - gesture.x);
    const dy = Math.abs(event.touches[0].clientY - gesture.y);
    if (Math.max(dx, dy) < 12) return;
    if (dx > dy * 1.5) gesture.direction = "horizontal";
    else if (dy > dx * 1.15) gesture.direction = "vertical";
  };
  const onTouchEnd = (event: TouchEvent) => {
    const gesture = touchStart.current;
    if (!gesture) return;
    const dx = event.changedTouches[0].clientX - gesture.x;
    const dy = event.changedTouches[0].clientY - gesture.y;
    if (gesture.direction !== "vertical" && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.65) move(dx < 0 ? 1 : -1);
    touchStart.current = null;
  };

  return <section className="reviews-page booklet-page" aria-labelledby="reviews-title" data-active={active % 4}>
    <div className="page-shell">
      <div className="page-heading"><h1 id="reviews-title">{reviews.title}</h1><p>Истории людей, которые искали своё направление.</p></div>
      <div className="review-browser" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={() => { touchStart.current = null; }}>
        <motion.article key={review.id} className="review-browser__main" initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .27, ease: [0.22, 1, 0.36, 1] }} aria-label={`Отзыв ${review.name}`}>
          <div className="review-profile"><ReviewAvatar review={review} prominent /><div className="review-profile__identity"><h2>{review.name}</h2>{review.context && <p>{review.context}</p>}</div><span className="review-profile__index" aria-live="polite">0{active + 1} / 0{reviews.items.length}</span></div>
          <div className="review-reading" data-more={scrollState.more}>
            <div ref={scrollRef} className="review-reading__scroll" data-overflowing={scrollState.overflowing === null ? "unknown" : scrollState.overflowing} role="region" aria-label={`Текст отзыва ${review.name}. Прокручивается отдельно.`} tabIndex={0} onScroll={syncScroll}>
              <blockquote className="review-reading__copy">{review.fullText.split(/\n\s*\n/).map((paragraph, index) => <p key={`${review.id}-${index}`}>{withEmphasis(paragraph, review.emphasizedQuote)}</p>)}</blockquote>
            </div>
            <div className="review-reading__footer"><a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">Оригинал в Instagram <span aria-hidden="true">↗</span></a><div className="review-reading__arrows"><button type="button" onClick={() => move(-1)} aria-label="Предыдущий отзыв">←</button><button type="button" onClick={() => move(1)} aria-label="Следующий отзыв">→</button></div></div>
          </div>
        </motion.article>
      </div>
      <div className="review-selector" role="group" aria-label="Выбрать отзыв">{reviews.items.map((item, index) => <button type="button" key={item.id} className="review-selector__item" data-active={active === index} aria-pressed={active === index} aria-label={`Отзыв ${index + 1}: ${item.name}`} onClick={() => setActive(index)}><ReviewAvatar review={item} /><span className="review-selector__person"><strong>{item.name}</strong>{item.context && <small>{item.context}</small>}</span><span className="review-selector__number">0{index + 1}</span></button>)}</div>
    </div>
  </section>;
}
