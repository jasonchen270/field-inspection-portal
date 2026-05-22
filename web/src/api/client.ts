import { getToken } from '../auth/auth';
import type { Report } from '../db/db';

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000';

async function authed(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  return fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
}

export const api = {
  list: () => authed('/api/reports').then(r => r.json() as Promise<Report[]>),
  upsert: (r: Report) => authed('/api/reports', { method: 'POST', body: JSON.stringify(r) }),
  remove: (id: string) => authed(`/api/reports/${id}`, { method: 'DELETE' }),
};
