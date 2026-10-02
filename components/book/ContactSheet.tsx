"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { siteContent } from "@/content/site";
import { useBook } from "./BookContext";

export function ContactSheet() {
  const { contactOpen, closeContact } = useBook();
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const channels = siteContent.contact.channels.filter((channel): channel is { label: string; href: string } => Boolean(channel.href));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let frame = 0;
    let timer = 0;
    if (contactOpen) {
      if (!dialog.open) dialog.showModal();
      frame = requestAnimationFrame(() => dialog.dataset.open = "true");
    } else if (dialog.open) {
      dialog.dataset.open = "false";
      timer = window.setTimeout(() => dialog.close(), reducedMotion ? 150 : 440);
    }
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [contactOpen, reducedMotion]);

  return <dialog className="contact-sheet" ref={dialogRef} aria-labelledby="contact-sheet-title" onCancel={(event) => { event.preventDefault(); closeContact(); }}>
    <div className="contact-sheet__inner page-shell">
      <div className="contact-sheet__top"><span>ДОПОЛНИТЕЛЬНАЯ СТРАНИЦА / СВЯЗЬ</span><button type="button" onClick={closeContact} aria-label="Закрыть контакты">ЗАКРЫТЬ <span aria-hidden="true">×</span></button></div>
      <div className="contact-sheet__content">
        <p className="contact-sheet__eyebrow">ЭЛИНА ТУМАРЕВА</p>
        <h2 id="contact-sheet-title">{siteContent.contact.title}</h2>
        {channels.length > 0 ? <><p>{siteContent.contact.description}</p><nav aria-label="Способы связи">{channels.map((channel) => <a href={channel.href} key={channel.label} target="_blank" rel="noopener noreferrer"><span>{channel.label}</span><span aria-hidden="true">↗</span></a>)}</nav></> : <p className="contact-sheet__empty">Контактные ссылки ещё не подтверждены.</p>}
      </div>
      <div className="contact-sheet__bottom"><span>ЭЛИНА ТУМАРЕВА</span><span>КАРЬЕРНЫЙ КОНСУЛЬТАНТ · КОУЧ</span>{siteContent.legal.privacyUrl && <a href={siteContent.legal.privacyUrl}>КОНФИДЕНЦИАЛЬНОСТЬ</a>}</div>
    </div>
  </dialog>;
}
