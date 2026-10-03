"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { siteContent, type ServiceDetails } from "@/content/site";
import { ContactAction } from "@/components/ui/Action";
import { useBook } from "@/components/book/BookContext";

type Choice = "premium" | "express";

export function Services() {
  const { premium, express, title } = siteContent.services;
  const { contactOpen } = useBook();
  const [active, setActive] = useState<Choice>("premium");
  const [expanded, setExpanded] = useState<Choice | null>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const detailRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const returnFocus = useRef(false);
  const expressVisible = express.status !== "hidden";
  const premiumMetadata = [
    { label: "Длительность", value: premium.duration },
    { label: "Формат", value: premium.format },
    { label: "Стоимость", value: premium.price },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  const open = (choice: Choice, event: MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget;
    returnFocus.current = false;
    setActive(choice);
    setChapterIndex(0);
    setExpanded(choice);
  };

  const close = () => {
    returnFocus.current = true;
    setExpanded(null);
  };

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => backRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !contactOpen) {
        event.preventDefault();
        returnFocus.current = true;
        setExpanded(null);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [expanded, contactOpen]);

  const onDetailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (contactOpen) return;
    if (event.key !== "Tab" || !detailRef.current) return;
    const focusable = Array.from(detailRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"))
      .filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const onChapterKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number, count: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % count;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    setChapterIndex(next);
    detailRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  };

  const detail = expanded === "premium" ? premium : express;
  const details: ServiceDetails = detail.details;
  const chapter = details.chapters[chapterIndex];
  const morphTransition = reducedMotion
    ? { duration: 0.14 }
    : { duration: 0.68, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return <section className="services-page booklet-page" aria-labelledby="services-title">
    <LayoutGroup id="service-booklet">
      <div className="page-shell" inert={expanded !== null}>
        <div className="page-heading"><h1 id="services-title">{title}</h1><p>Выберите путь, который подходит вашему запросу сейчас.</p></div>
        <div className={`service-choice-grid${expressVisible ? "" : " service-choice-grid--single"}`} data-active={active}>
          <motion.article className="service-choice service-choice--premium" data-active={active === "premium"} onMouseEnter={() => setActive("premium")} layoutId={reducedMotion ? undefined : "service-premium"} transition={{ layout: morphTransition }} style={{ visibility: expanded === "premium" ? "hidden" : "visible" }}>
            <button type="button" className="service-choice__select" aria-label="Подробнее об индивидуальной программе" onFocus={() => setActive("premium")} onClick={(event) => open("premium", event)}><span>01 / ЛИЧНАЯ РАБОТА</span><span className="service-choice__indicator" aria-hidden="true">↗</span></button>
            <div className="service-choice__content"><h2>{premium.name}</h2><p>{premium.description}</p>
              <AnimatePresence mode="wait">{active === "premium" && <motion.ul key="premium-points" className="service-choice__points" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }} transition={{ duration: reducedMotion ? .1 : .25 }}>{premium.points.slice(0, 3).map((point, index) => <li key={point}><span>0{index + 1}</span>{point}</li>)}</motion.ul>}</AnimatePresence>
              {premiumMetadata.length > 0 && <dl className="service-choice__metadata">{premiumMetadata.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}
              <div className="service-choice__actions"><ContactAction label={premium.cta} href={premium.contactUrl} className="service-choice__action" /><button type="button" className="service-choice__more" onClick={(event) => open("premium", event)}>Подробнее <span aria-hidden="true">↗</span></button></div>
            </div>
          </motion.article>
          {expressVisible && <motion.article className="service-choice service-choice--express" data-active={active === "express"} onMouseEnter={() => setActive("express")} layoutId={reducedMotion ? undefined : "service-express"} transition={{ layout: morphTransition }} style={{ visibility: expanded === "express" ? "hidden" : "visible" }}>
            <button type="button" className="service-choice__select" aria-label="Подробнее об экспресс-формате" onFocus={() => setActive("express")} onClick={(event) => open("express", event)}><span>02 / КОРОТКИЙ ФОРМАТ</span><span className="service-choice__indicator" aria-hidden="true">↗</span></button>
            <div className="service-choice__content"><div className="service-choice__status">{express.status === "comingSoon" ? "СКОРО" : "ДОСТУПНО"}</div><h2>{express.name}</h2><p>{express.description}</p>
              <AnimatePresence mode="wait">{active === "express" && <motion.ul key="express-points" className="service-choice__points" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }} transition={{ duration: reducedMotion ? .1 : .25 }}>{express.points.slice(0, 3).map((point, index) => <li key={point}><span>0{index + 1}</span>{point}</li>)}</motion.ul>}</AnimatePresence>
              <div className="service-choice__foot">{express.format && <span>{express.format}</span>}{express.price && <span>{express.price}</span>}{express.status === "available" && express.href && <a href={express.href} target="_blank" rel="noopener noreferrer">{express.cta} ↗</a>}<button type="button" className="service-choice__more" onClick={(event) => open("express", event)}>Подробнее <span aria-hidden="true">↗</span></button></div>
            </div>
          </motion.article>}
        </div>
      </div>

      <AnimatePresence onExitComplete={() => {
        if (returnFocus.current) {
          triggerRef.current?.focus();
          returnFocus.current = false;
        }
      }}>
        {expanded && <motion.div key="service-detail-stage" className="service-detail-stage" data-kind={expanded} role="dialog" aria-modal="true" aria-labelledby="service-detail-title" ref={detailRef} onKeyDown={onDetailKeyDown} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? .12 : .62 }}>
          <motion.div className={`service-detail service-detail--${expanded}`} layoutId={reducedMotion ? undefined : `service-${expanded}`} transition={{ layout: morphTransition }}>
            <div className="service-detail__top"><button ref={backRef} type="button" className="service-detail__back" onClick={close}><span aria-hidden="true">←</span> Вернуться к форматам</button>{expanded === "express" && <span className="service-detail__status">СКОРО</span>}</div>
            <div className="service-detail__spread">
              <div className="service-detail__intro"><h2 id="service-detail-title">{detail.name}</h2><p>{details.positioning}</p>
                <div className="service-detail__chapters" role="tablist" aria-label="Разделы услуги" aria-orientation="vertical">{details.chapters.map((item, index) => <button key={item.label} id={`service-tab-${index}`} type="button" role="tab" aria-selected={chapterIndex === index} aria-controls="service-chapter-panel" tabIndex={chapterIndex === index ? 0 : -1} onClick={() => setChapterIndex(index)} onKeyDown={(event) => onChapterKeyDown(event, index, details.chapters.length)}><span>0{index + 1}</span><strong>{item.label}</strong><span aria-hidden="true">↗</span></button>)}</div>
              </div>
              <div className="service-detail__reading" id="service-chapter-panel" role="tabpanel" aria-labelledby={`service-tab-${chapterIndex}`} tabIndex={0}>
                <AnimatePresence mode="wait"><motion.div key={`${expanded}-${chapterIndex}`} className="service-detail__chapter" initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }} transition={{ duration: reducedMotion ? .1 : .28 }}><span className="service-detail__chapter-number">0{chapterIndex + 1} / 04</span><h3>{chapter.heading}</h3>{chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{chapterIndex === 3 && <div className="service-detail__facts">{details.duration && <span>Длительность · {details.duration}</span>}{details.delivery && <span>Формат · {details.delivery}</span>}{details.location && <span>Место · {details.location}</span>}{details.communication && <span>Связь · {details.communication}</span>}{details.inclusions?.map((item) => <span key={item}>{item}</span>)}{details.price && <span>Стоимость · {details.price}</span>}{details.availability && <span>{details.availability}</span>}</div>}</motion.div></AnimatePresence>
              </div>
            </div>
            <div className="service-detail__bottom">{expanded === "premium" ? <ContactAction label={premium.cta} href={premium.contactUrl} className="service-detail__action" /> : <span>Экспресс-формат готовится к запуску</span>}</div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </LayoutGroup>
  </section>;
}
