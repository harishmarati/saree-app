import { authHeaders, setToken } from './token';

const API_ROOT = import.meta.env.VITE_API_BASE_URL ?? '';
const BASE_URL = `${API_ROOT}/api/auth`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

export function checkSession(): Promise<{ authenticated: boolean }> {
  return fetch(`${BASE_URL}/me`, { credentials: 'include', headers: authHeaders() }).then((res) => {
    if (res.status === 401) {
      setToken(null);
      return { authenticated: false };
    }
    return handleResponse<{ authenticated: boolean }>(res);
  });
}

export function login(password: string): Promise<{ ok: boolean; token?: string }> {
  return fetch(`${BASE_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
    .then((res) => handleResponse<{ ok: boolean; token?: string }>(res))
    .then((data) => {
      setToken(data.token ?? null);
      return data;
    });
}

export function logout(): Promise<{ ok: boolean }> {
  return fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: authHeaders(),
  }).then((res) => {
    setToken(null);
    return handleResponse<{ ok: boolean }>(res);
  });
}
