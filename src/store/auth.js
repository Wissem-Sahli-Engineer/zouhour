import { create } from "zustand";

const SESSION_KEY = "zouhour-auth-session";
const PERSIST_KEY = "zouhour-auth";

function readStored() {
  try {
    const raw = localStorage.getItem(PERSIST_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const stored = typeof window !== "undefined" ? readStored() : null;

export const useAuth = create((set, get) => ({
  user: stored?.user || null,
  token: stored?.token || null,
  remember: stored?.remember || false,
  signupPending: false,
  signupEmail: "",

  isAuthed: () => Boolean(get().token),

  login: ({ email, remember }) => {
    const user = {
      name: email.split("@")[0].replace(/\./g, " "),
      email,
      role: "Agent",
    };
    const token = remember ? `persist.${Date.now()}` : `session.${Date.now()}`;
    const payload = { user, token, remember };
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
    if (remember) localStorage.setItem(PERSIST_KEY, JSON.stringify(payload));
    else sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    set({ user, token, remember, signupPending: false });
  },

  requestSignup: async (form) => {
    try {
      await fetch("/api/signup-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      /* stub — backend email-to-admin is not wired yet */
    }
    set({ signupPending: true, signupEmail: form.email });
  },

  clearSignupPending: () => set({ signupPending: false, signupEmail: "" }),

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
    set({ user: null, token: null, remember: false });
  },
}));
