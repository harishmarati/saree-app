import type { Saree, SareeInput } from './types';

const API_ROOT = import.meta.env.VITE_API_BASE_URL ?? '';
const BASE_URL = `${API_ROOT}/api/sarees`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? 'Request failed');
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function fetchSarees(): Promise<Saree[]> {
  return fetch(BASE_URL).then((res) => handleResponse<Saree[]>(res));
}

export function createSaree(input: SareeInput): Promise<Saree> {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then((res) => handleResponse<Saree>(res));
}

export function updateSaree(id: number, input: SareeInput): Promise<Saree> {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then((res) => handleResponse<Saree>(res));
}

export function deleteSaree(id: number): Promise<void> {
  return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then((res) => handleResponse<void>(res));
}
