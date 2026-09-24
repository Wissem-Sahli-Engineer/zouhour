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

  isAuthed: () => Boolean(get().token),

  login: async ({ email, password, remember }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || "Invalid email or password");
    }

    const payload = { user: data.user, token: data.token, remember };
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
    if (remember) localStorage.setItem(PERSIST_KEY, JSON.stringify(payload));
    else sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    set({ user: data.user, token: data.token, remember });
    return data.user;
  },

  // Signup no longer logs the user in — the account is "pending" until an
  // admin approves it (by email link or the in-app Pending Signups page).
  signup: async ({ name, email, password }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || "Could not submit signup request");
    }
    return data;
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
    set({ user: null, token: null, remember: false });
  },
}));

// For URLs the browser loads natively (img src, <a> downloads, window.open) —
// those never go through fetch, so the Authorization header can't reach them.
export function withToken(url) {
  if (!url) return url;
  const token = useAuth.getState().token;
  if (!token) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}token=${encodeURIComponent(token)}`;
}
