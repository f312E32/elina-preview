"use client";

import { createContext, useContext } from "react";
import type { BookRoute } from "@/content/site";

export type BookContextValue = {
  activeRoute: BookRoute;
  navigate: (href: BookRoute) => void;
  openContact: () => void;
  closeContact: () => void;
  contactOpen: boolean;
};

export const BookContext = createContext<BookContextValue | null>(null);

export function useBook() {
  const context = useContext(BookContext);
  if (!context) throw new Error("Book components must be rendered inside BookShell");
  return context;
}
