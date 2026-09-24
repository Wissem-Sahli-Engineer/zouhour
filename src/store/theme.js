import { create } from "zustand";

const KEY = "zouhour-theme";

function apply(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

function initial() {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const startTheme = initial();
apply(startTheme);

export const useTheme = create((set, get) => ({
  theme: startTheme,
  toggle: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // ignore
    }
    set({ theme: next });
  },
}));
