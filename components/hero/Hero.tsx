"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { siteContent } from "@/content/site";
import { ContactAction } from "@/components/ui/Action";
import { BookLink } from "@/components/book/BookLink";
import { Portrait } from "./Portrait";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const [insight, setInsight] = useState(0);
  const { identity, home } = siteContent;
  const reveal = (delay: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : .46, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero__inner editorial-grid">
      <motion.div className="hero__identity" {...reveal(.02)}><span>{identity.name}</span><span>{identity.role}</span></motion.div>
      <motion.div className="hero__index" {...reveal(.08)}><span className="index-mark" aria-hidden="true" />01 / ОБЛОЖКА</motion.div>
      <div className="hero__stage editorial-grid">
        <motion.div className="hero__portrait-wrap" {...reveal(.2)}><Portrait insight={insight} /></motion.div>
        <h1 className="hero__headline" id="hero-title">
          <motion.button type="button" className="hero__phrase hero__phrase--one" onMouseEnter={() => setInsight(0)} onFocus={() => setInsight(0)} onClick={() => setInsight(0)} {...reveal(.12)}>{home.headline[0]}</motion.button>
          <motion.button type="button" className="hero__phrase hero__phrase--two" onMouseEnter={() => setInsight(1)} onFocus={() => setInsight(1)} onClick={() => setInsight(1)} {...reveal(.18)}><span>{home.headline[1]}</span><span>{home.headline[2]}</span></motion.button>
          <motion.button type="button" className="hero__phrase hero__phrase--three" onMouseEnter={() => setInsight(2)} onFocus={() => setInsight(2)} onClick={() => setInsight(2)} {...reveal(.26)}>{home.headline[3]}</motion.button>
        </h1>
        <motion.div className="hero__content" {...reveal(.38)}><p className="hero__description">{home.description}</p><div className="hero__actions"><ContactAction label={home.primaryCta} /><BookLink className="hero__secondary" href="/services"><span>{home.secondaryCta}</span><span aria-hidden="true">↘</span></BookLink></div></motion.div>
      </div>
      <motion.div className="hero__bottom" {...reveal(.5)}><span>НАЧНИ С ВОПРОСА</span><span className="hero__bottom-rule" /><span>ДАЛЬШЕ — ЯСНЕЕ</span></motion.div>
    </div>
  </section>;
}
