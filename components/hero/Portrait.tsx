"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { siteContent } from "@/content/site";
import { publicAssetPath } from "@/content/asset-path";

export function Portrait({ insight }: { insight: number }) {
  const reducedMotion = useReducedMotion();
  const { src, alt, placeholderLabel } = siteContent.home.portrait;
  return <figure className="hero-portrait">
    <div className="hero-portrait__frame">{src ? <Image src={publicAssetPath(src)} alt={alt} fill priority sizes="(max-width: 700px) 88vw, (max-width: 1100px) 42vw, 34vw" className="hero-portrait__image" /> : <div className="hero-portrait__placeholder" role="img" aria-label={placeholderLabel}><span className="hero-portrait__placeholder-top">ПОРТРЕТ / ЭЛИНА</span><span className="hero-portrait__placeholder-glyph" aria-hidden="true">Э</span><span className="hero-portrait__placeholder-bottom">ФОТОГРАФИЯ БУДЕТ ДОБАВЛЕНА</span></div>}</div>
    <figcaption className="hero-portrait__caption"><span>{siteContent.home.trustAnchor}</span><motion.span key={insight} aria-live="polite" initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? .12 : .24 }}>{`0${insight + 1} / ${siteContent.home.insightLabels[insight]}`}</motion.span></figcaption>
  </figure>;
}
