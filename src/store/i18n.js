import { create } from "zustand";
import { translations } from "../i18n/translations";

const KEY = "zouhour-lang";

function apply(lang) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
}

function initial() {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "en" || stored === "ar") return stored;
  } catch {
    // ignore
  }
  return "en";
}

function lookup(lang, key) {
  const parts = key.split(".");
  let node = translations[lang];
  for (const p of parts) {
    node = node?.[p];
    if (node === undefined) return null;
  }
  return typeof node === "string" ? node : null;
}

// A fresh closure per language, so its identity changes when lang changes —
// components that select only `t` (not `lang`) still re-render on toggle.
function makeT(lang) {
  return (key) => lookup(lang, key) ?? lookup("en", key) ?? key;
}

const startLang = initial();
apply(startLang);

export const useI18n = create((set, get) => ({
  lang: startLang,
  isRtl: startLang === "ar",
  t: makeT(startLang),
  setLang: (lang) => {
    apply(lang);
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      // ignore
    }
    set({ lang, isRtl: lang === "ar", t: makeT(lang) });
  },
  toggle: () => get().setLang(get().lang === "ar" ? "en" : "ar"),
}));
