import axios from "axios";

export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "";

export const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : "/api",
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "paras_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${t}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== "undefined") {
      clearToken();
    }
    return Promise.reject(err);
  },
);

// Resolve an image URL that may be a relative /uploads path.
export function assetUrl(src?: string): string {
  if (!src) return "";
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  if (src.startsWith("/uploads")) return `${API_URL}${src}`;
  return src;
}
