"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { siteContent } from "@/content/site";
import { ContactAction } from "@/components/ui/Action";
import { useBook } from "@/components/book/BookContext";

type Choice = "premium" | "express";
type Offer = typeof siteContent.services.premium | typeof siteContent.services.express;

function ServiceCard({ choice, offer, active, hovered, expanded, reducedMotion, onSelect, onHover, onOpen }: {
  choice: Choice;
  offer: Offer;
  active: Choice;
  hovered: Choice | null;
  expanded: Choice | null;
  reducedMotion: boolean | null;
  onSelect: (choice: Choice) => void;
  onHover: (choice: Choice | null) => void;
  onOpen: (choice: Choice, event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const isPremium = choice === "premium";
  const duration = isPremium ? .68 : .6;
  return <motion.article
    className={`service-choice service-choice--${choice}`}
    data-active={active === choice}
    data-hovered={hovered === choice}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") { onSelect(choice); onHover(choice); } }}
    onPointerLeave={(event) => { if (event.pointerType === "mouse") onHover(null); }}
    onFocusCapture={() => { onSelect(choice); onHover(choice); }}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onHover(null); }}
    layoutId={reducedMotion ? undefined : `service-${choice}`}
    animate={{ opacity: expanded && expanded !== choice ? .42 : 1, x: expanded && expanded !== choice ? (isPremium ? -24 : 24) : 0, y: hovered === choice && !reducedMotion ? -4 : 0 }}
    transition={{ layout: { duration: reducedMotion ? .12 : duration, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: .25 }, x: { duration: .3 }, y: { duration: .22 } }}
    style={{ visibility: expanded === choice ? "hidden" : "visible" }}
  >
    <button type="button" className="service-choice__select" aria-label={`Подробнее: ${offer.name}`} onClick={(event) => onOpen(choice, event)}><span>{offer.coverLabel}</span><span className="service-choice__indicator" aria-hidden="true">↗</span></button>
    <div className="service-choice__content">
      {choice === "express" && <span className="service-choice__status">{siteContent.services.express.statusLabel}</span>}
      <h2>{offer.name}</h2>
      <p>{offer.description}</p>
      <ul className="service-choice__summary" aria-label="Краткие сведения">{offer.metadata.map((item) => <li key={item}>{item}</li>)}</ul>
      <div className="service-choice__closing">
        <div className="service-choice__price">{offer.price}</div>
        <AnimatePresence>{hovered === choice && !reducedMotion && <motion.p className="service-choice__teaser" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .22 }}>{offer.teaser}</motion.p>}</AnimatePresence>
        <button type="button" className="service-choice__open" onClick={(event) => onOpen(choice, event)}><span>{offer.openLabel}</span><span aria-hidden="true">↗</span></button>
      </div>
    </div>
  </motion.article>;
}

export function Services() {
  const { premium, express, title } = siteContent.services;
  const { contactOpen } = useBook();
  const [active, setActive] = useState<Choice>("premium");
  const [hovered, setHovered] = useState<Choice | null>(null);
  const [expanded, setExpanded] = useState<Choice | null>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const detailRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const returnFocus = useRef(false);
  const expressVisible = express.status !== "hidden";

  const open = (choice: Choice, event: MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget;
    returnFocus.current = false;
    setActive(choice);
    setHovered(null);
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
    return () => { cancelAnimationFrame(frame); document.body.style.overflow = previousOverflow; };
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
    if (contactOpen || event.key !== "Tab" || !detailRef.current) return;
    const focusable = Array.from(detailRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"))
      .filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
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

  const offer = expanded === "premium" ? premium : express;
  const chapter = offer.details.chapters[chapterIndex];
  const chapterPoints = chapterIndex === 3 ? [...(chapter.points ?? []), offer.price] : chapter.points;
  const unfoldDuration = expanded === "express" ? .6 : .68;

  return <section className="services-page booklet-page" aria-labelledby="services-title">
    <LayoutGroup id="service-booklet">
      <div className="page-shell" inert={expanded !== null}>
        <div className="page-heading"><h1 id="services-title">{title}</h1><p>Выберите путь, который подходит вашему запросу сейчас.</p></div>
        <div className={`service-choice-grid${expressVisible ? "" : " service-choice-grid--single"}`} data-active={active}>
          <ServiceCard choice="premium" offer={premium} active={active} hovered={hovered} expanded={expanded} reducedMotion={reducedMotion} onSelect={setActive} onHover={setHovered} onOpen={open} />
          {expressVisible && <ServiceCard choice="express" offer={express} active={active} hovered={hovered} expanded={expanded} reducedMotion={reducedMotion} onSelect={setActive} onHover={setHovered} onOpen={open} />}
        </div>
      </div>

      <AnimatePresence onExitComplete={() => {
        if (returnFocus.current) { triggerRef.current?.focus(); returnFocus.current = false; }
      }}>
        {expanded && <motion.div key="service-spread-stage" className="service-detail-stage service-spread-stage" data-kind={expanded} role="dialog" aria-modal="true" aria-labelledby="service-spread-title" ref={detailRef} onKeyDown={onDetailKeyDown} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reducedMotion ? .12 : .35, delay: reducedMotion ? 0 : .25 } }} transition={{ duration: reducedMotion ? .12 : .22 }}>
          <div className={`service-spread service-spread--${expanded}`}>
            <motion.div className="service-spread__cover" layoutId={reducedMotion ? undefined : `service-${expanded}`} transition={{ layout: { duration: reducedMotion ? .12 : unfoldDuration, ease: [0.22, 1, 0.36, 1] } }}>
              <div className="service-spread__cover-top"><button ref={backRef} type="button" className="service-spread__back" onClick={close}><span aria-hidden="true">←</span> Вернуться к форматам</button><span className="service-spread__cover-label">{offer.coverLabel}</span></div>
              <div className="service-spread__cover-body">{expanded === "express" && <span className="service-spread__status">{express.statusLabel}</span>}<h2 id="service-spread-title">{offer.name}</h2><p>{offer.details.positioning}</p><ul className="service-spread__metadata">{offer.metadata.map((item) => <li key={item}>{item}</li>)}</ul><strong className="service-spread__price">{offer.price}</strong></div>
              <div className="service-spread__cover-bottom"><ContactAction label={offer.cta} href={expanded === "premium" ? premium.contactUrl : null} className="service-spread__contact" /></div>
            </motion.div>
            <motion.div className="service-spread__leaf" initial={reducedMotion ? { opacity: 0, scale: .99 } : { opacity: .15, x: -46, clipPath: "inset(0 100% 0 0)" }} animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }} exit={reducedMotion ? { opacity: 0, scale: .99 } : { opacity: 0, x: -42, clipPath: "inset(0 100% 0 0)" }} transition={{ duration: reducedMotion ? .13 : expanded === "premium" ? .52 : .45, delay: reducedMotion ? 0 : .17, ease: [0.22, 1, 0.36, 1] }}>
              <div className="service-spread__leaf-top"><span>{offer.details.sectionLabel}</span>{expanded === "express" && <span>{express.statusLabel}</span>}</div>
              <div className="service-spread__tabs" role="tablist" aria-label="Разделы услуги">{offer.details.chapters.map((item, index) => <button key={item.label} id={`service-tab-${index}`} type="button" role="tab" aria-selected={chapterIndex === index} aria-controls="service-spread-panel" tabIndex={chapterIndex === index ? 0 : -1} onClick={() => setChapterIndex(index)} onKeyDown={(event) => onChapterKeyDown(event, index, offer.details.chapters.length)}><span>0{index + 1}</span><strong>{item.label}</strong></button>)}</div>
              <div className="service-spread__reading" id="service-spread-panel" role="tabpanel" aria-labelledby={`service-tab-${chapterIndex}`} tabIndex={0}>
                <AnimatePresence mode="wait"><motion.div key={`${expanded}-${chapterIndex}`} className="service-spread__chapter" initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -8, transition: { duration: reducedMotion ? .07 : .12 } }} transition={{ duration: reducedMotion ? .1 : .19 }}><span className="service-spread__chapter-number">0{chapterIndex + 1} / 04</span><h3>{chapter.heading}</h3>{chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{chapterPoints && <ul className={`service-spread__points${chapterIndex === 3 ? " service-spread__points--facts" : ""}`}>{chapterPoints.map((point) => <li key={point}>{point}</li>)}</ul>}{expanded === "premium" && chapterIndex === 1 && premium.details.dayVisual && <div className="service-day-path" aria-label="Два дня индивидуальной работы"><motion.div className="service-day-path__stage" initial={reducedMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? .1 : .18 }}><span>{premium.details.dayVisual.first.label}</span><strong>{premium.details.dayVisual.first.title}</strong></motion.div><motion.span className="service-day-path__line" aria-hidden="true" initial={reducedMotion ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reducedMotion ? .1 : .31, delay: reducedMotion ? 0 : .15 }} /><motion.div className="service-day-path__stage" initial={reducedMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? .1 : .18, delay: reducedMotion ? 0 : .45 }}><span>{premium.details.dayVisual.second.label}</span><strong>{premium.details.dayVisual.second.title}</strong></motion.div></div>}</motion.div></AnimatePresence>
              </div>
              <div className="service-spread__mobile-action"><ContactAction label={offer.cta} href={expanded === "premium" ? premium.contactUrl : null} className="service-spread__contact" /></div>
            </motion.div>
          </div>
        </motion.div>}
      </AnimatePresence>
    </LayoutGroup>
  </section>;
}
