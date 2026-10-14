import type { Saree, SareeInput } from './types';

const API_ROOT = import.meta.env.VITE_API_BASE_URL ?? '';
const BASE_URL = `${API_ROOT}/api/sarees`;

export class SessionExpiredError extends Error {
  constructor() {
    super('Session expired');
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) throw new SessionExpiredError();
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? 'Request failed');
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function fetchSarees(): Promise<Saree[]> {
  return fetch(BASE_URL, { credentials: 'include' }).then((res) => handleResponse<Saree[]>(res));
}

export function createSaree(input: SareeInput): Promise<Saree> {
  return fetch(BASE_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then((res) => handleResponse<Saree>(res));
}

export function updateSaree(id: number, input: SareeInput): Promise<Saree> {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then((res) => handleResponse<Saree>(res));
}

export function deleteSaree(id: number): Promise<void> {
  return fetch(`${BASE_URL}/${id}`, { method: 'DELETE', credentials: 'include' }).then((res) =>
    handleResponse<void>(res)
  );
}
