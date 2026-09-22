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

  login: async ({ email, password, remember }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Invalid email or password");
    }

    const user = data.user;
    const token = remember ? `persist.${Date.now()}` : `session.${Date.now()}`;
    const payload = { user, token, remember };
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
    if (remember) localStorage.setItem(PERSIST_KEY, JSON.stringify(payload));
    else sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    set({ user, token, remember, signupPending: false });
    return user;
  },

  signup: async ({ name, email, password, role, remember }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Could not register account");
    }

    const user = data.user;
    const token = remember ? `persist.${Date.now()}` : `session.${Date.now()}`;
    const payload = { user, token, remember: Boolean(remember) };
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
    if (remember) localStorage.setItem(PERSIST_KEY, JSON.stringify(payload));
    else sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    set({ user, token, remember: Boolean(remember), signupPending: false });
    return user;
  },

  requestSignup: async (form) => {
    return get().signup(form);
  },

  clearSignupPending: () => set({ signupPending: false, signupEmail: "" }),

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
    set({ user: null, token: null, remember: false });
  },
}));
