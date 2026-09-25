import { useAuth } from "../store/auth";
import { apiUrl } from "./apiBase";

// Every screen in this app calls the backend with plain fetch("/api/...").
// Rather than thread an Authorization header through every one of those call
// sites, attach it here once for any request going to our own API — and, on
// the native iOS app, rewrite the same-origin path to the real backend URL.
const nativeFetch = window.fetch.bind(window);

window.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input?.url || "";
  if (!url.startsWith("/api/")) return nativeFetch(input, init);

  const token = useAuth.getState().token;
  let headers = init.headers;
  if (token) {
    headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
    if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  }

  const target = typeof input === "string" ? apiUrl(input) : input;
  const res = await nativeFetch(target, { ...init, headers });
  if (res.status === 401 && token) {
    useAuth.getState().logout();
  }
  return res;
};
