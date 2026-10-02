"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { siteContent } from "@/content/site";
import { ContactAction } from "@/components/ui/Action";

type Choice = "premium" | "express";

export function Services() {
  const { premium, express, title } = siteContent.services;
  const [active, setActive] = useState<Choice>("premium");
  const reducedMotion = useReducedMotion();
  const expressVisible = express.status !== "hidden";
  const premiumMetadata = [
    { label: "Длительность", value: premium.duration },
    { label: "Формат", value: premium.format },
    { label: "Стоимость", value: premium.price },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return <section className="services-page booklet-page" aria-labelledby="services-title">
    <div className="page-shell">
      <div className="page-heading"><span className="page-heading__index">02 / ФОРМАТЫ РАБОТЫ</span><h1 id="services-title">{title}</h1><p>Выберите путь, который подходит вашему запросу сейчас.</p></div>
      <div className={`service-choice-grid${expressVisible ? "" : " service-choice-grid--single"}`} data-active={active}>
        <article className="service-choice service-choice--premium" data-active={active === "premium"} onMouseEnter={() => setActive("premium")}>
          <button type="button" className="service-choice__select" aria-pressed={active === "premium"} onFocus={() => setActive("premium")} onClick={() => setActive("premium")}><span>01 / ЛИЧНАЯ РАБОТА</span><span className="service-choice__indicator" aria-hidden="true">↗</span></button>
          <div className="service-choice__content"><h2>{premium.name}</h2><p>{premium.description}</p>
            <AnimatePresence mode="wait">{active === "premium" && <motion.ul key="premium-points" className="service-choice__points" initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }} transition={{ duration: reducedMotion ? .1 : .25 }}>{premium.points.slice(0, 3).map((point, index) => <li key={point}><span>0{index + 1}</span>{point}</li>)}</motion.ul>}</AnimatePresence>
            {premiumMetadata.length > 0 && <dl className="service-choice__metadata">{premiumMetadata.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}
            <ContactAction label={premium.cta} href={premium.contactUrl} className="service-choice__action" />
          </div>
        </article>
        {expressVisible && <article className="service-choice service-choice--express" data-active={active === "express"} onMouseEnter={() => setActive("express")}>
          <button type="button" className="service-choice__select" aria-pressed={active === "express"} onFocus={() => setActive("express")} onClick={() => setActive("express")}><span>02 / КОРОТКИЙ ФОРМАТ</span><span className="service-choice__indicator" aria-hidden="true">↗</span></button>
          <div className="service-choice__content"><div className="service-choice__status">{express.status === "comingSoon" ? "СКОРО" : "ДОСТУПНО"}</div><h2>{express.name}</h2><p>{express.description}</p>
            <AnimatePresence mode="wait">{active === "express" && <motion.ul key="express-points" className="service-choice__points" initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }} transition={{ duration: reducedMotion ? .1 : .25 }}>{express.points.slice(0, 3).map((point, index) => <li key={point}><span>0{index + 1}</span>{point}</li>)}</motion.ul>}</AnimatePresence>
            <div className="service-choice__foot">{express.format && <span>{express.format}</span>}{express.price && <span>{express.price}</span>}{express.status === "available" && express.href && <a href={express.href} target="_blank" rel="noopener noreferrer">{express.cta} ↗</a>}</div>
          </div>
        </article>}
      </div>
      <p className="page-note">НАВЕДИТЕ ИЛИ НАЖМИТЕ, ЧТОБЫ СРАВНИТЬ ФОРМАТЫ</p>
    </div>
  </section>;
}
