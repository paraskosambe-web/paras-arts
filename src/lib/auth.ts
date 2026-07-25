import { api, clearToken, getToken, setToken } from "./api";

export type Admin = { id: string; name: string; email: string };

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string; admin: Admin }>("/auth/login", {
    email,
    password,
  });
  setToken(data.token);
  return data.admin;
}

export function logout() {
  clearToken();
}

export function isAuthed() {
  return !!getToken();
}

export async function fetchMe() {
  const { data } = await api.get<{ admin: Admin }>("/auth/me");
  return data.admin;
}
