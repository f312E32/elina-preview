"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { siteContent } from "@/content/site";
import { publicAssetPath } from "@/content/asset-path";

export function About() {
  const { about } = siteContent;
  const [active, setActive] = useState(2);
  const reducedMotion = useReducedMotion();
  return <section className="about-page booklet-page" aria-labelledby="about-title" data-active={active}>
    <div className="page-shell">
      <div className="page-heading"><span className="page-heading__index">03 / ОБ ЭЛИНЕ</span><h1 id="about-title">{about.title}</h1></div>
      <div className="about-page__spread editorial-grid">
        <div className="about-page__portrait" data-active={active}>{about.portrait.src ? <Image src={publicAssetPath(about.portrait.src)} alt={about.portrait.alt} fill sizes="(max-width: 760px) 90vw, 34vw" /> : <div className="about-page__portrait-placeholder" role="img" aria-label="Место для портрета Элины Тумаревой"><span>ПОРТРЕТ / ЭЛИНА</span><b aria-hidden="true">Э</b><small>ФОТОГРАФИЯ БУДЕТ ДОБАВЛЕНА</small></div>}</div>
        <div className="about-page__body"><p className="about-page__intro">{about.paragraph}</p><ul className="about-page__facts">{about.credentials.slice(0, 4).map((fact, index) => <li key={fact}><span>0{index + 1}</span><strong>{fact}</strong></li>)}</ul></div>
      </div>
      <div className="path"><div className="path__top"><span>ПРОФЕССИОНАЛЬНЫЙ ПУТЬ</span><span>ВЫБЕРИТЕ ЭТАП</span></div><div className="path__stages"><svg className="path__line" aria-hidden="true" focusable="false"><defs><marker id="path-arrowhead" markerWidth="11" markerHeight="11" refX="9.5" refY="5.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1.5 1.5 9.5 5.5 1.5 9.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" /></marker></defs><line x1="0" y1="6" x2="100%" y2="6" stroke="currentColor" strokeWidth="3" markerEnd="url(#path-arrowhead)" /></svg>{about.path.map((stage, index) => <button type="button" key={stage.label} className="path__stage" data-active={active === index} aria-pressed={active === index} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span className="path__dot" aria-hidden="true" /><span>{stage.label}</span></button>)}</div><div className="path__detail" aria-live="polite"><AnimatePresence mode="wait"><motion.p key={active} initial={{ opacity: 0, y: reducedMotion ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -7 }} transition={{ duration: reducedMotion ? .1 : .25 }}>{about.path[active].detail}</motion.p></AnimatePresence></div></div>
    </div>
  </section>;
}
