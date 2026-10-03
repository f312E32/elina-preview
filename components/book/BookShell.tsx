"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { chapters, type BookRoute } from "@/content/site";
import { siteBasePath } from "@/content/asset-path";
import { BookContext } from "./BookContext";
import { BookNavigation } from "./BookNavigation";
import { ContactSheet } from "./ContactSheet";
import { Header } from "@/components/layout/Header";

type Phase = "idle" | "cover" | "reveal";

export function BookShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const relativePath = siteBasePath && (pathname === siteBasePath || pathname.startsWith(`${siteBasePath}/`))
    ? pathname.slice(siteBasePath.length) || "/"
    : pathname;
  const currentPath = relativePath.replace(/\/+$/, "") || "/";
  const activeRoute = (chapters.find((chapter) => chapter.href === currentPath)?.href ?? "/") as BookRoute;
  const [phase, setPhase] = useState<Phase>("idle");
  const [contactOpen, setContactOpen] = useState(false);
  const pendingHref = useRef<BookRoute | null>(null);
  const previousPath = useRef(pathname);
  const coverTimer = useRef<number>(0);
  const revealTimer = useRef<number>(0);

  const navigate = useCallback((href: BookRoute) => {
    if (href === activeRoute) { window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" }); return; }
    if (pendingHref.current) return;
    setContactOpen(false);
    pendingHref.current = href;
    if (reducedMotion) { router.push(href); return; }
    setPhase("cover");
    coverTimer.current = window.setTimeout(() => router.push(href), 300);
  }, [activeRoute, reducedMotion, router]);

  useEffect(() => {
    if (pathname === previousPath.current) return;
    previousPath.current = pathname;
    if (pendingHref.current) {
      if (reducedMotion) { pendingHref.current = null; return; }
      const frame = requestAnimationFrame(() => setPhase("reveal"));
      revealTimer.current = window.setTimeout(() => { setPhase("idle"); pendingHref.current = null; }, 430);
      return () => cancelAnimationFrame(frame);
    }
  }, [pathname, reducedMotion]);

  useEffect(() => () => { clearTimeout(coverTimer.current); clearTimeout(revealTimer.current); }, []);

  const context = { activeRoute, navigate, openContact: () => setContactOpen(true), closeContact: () => setContactOpen(false), contactOpen };
  return <BookContext.Provider value={context}>
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <Header />
    <motion.main id="main" key={pathname} className="book-main" initial={{ opacity: 0, x: 13 }} animate={{ opacity: phase === "cover" ? .76 : 1, x: phase === "cover" && !reducedMotion ? -14 : 0 }} transition={{ duration: reducedMotion ? .14 : .36, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.main>
    <BookNavigation />
    <ContactSheet />
    <div className="book-turn" data-phase={phase} aria-hidden="true" />
  </BookContext.Provider>;
}
