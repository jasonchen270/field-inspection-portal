import { api } from '../api/client';
import { db, type Report } from './db';

let syncing = false;

export async function syncPending(): Promise<{ pushed: number; pulled: number }> {
  if (syncing || !navigator.onLine) return { pushed: 0, pulled: 0 };
  syncing = true;
  try {
    const pending = await db.reports.where('syncState').equals('pending').toArray();
    for (const r of pending) {
      const res = await api.upsert(r);
      if (res.ok) await db.reports.update(r.id, { syncState: 'synced' });
    }
    const remote = await api.list();
    await db.transaction('rw', db.reports, async () => {
      for (const r of remote) {
        const local = await db.reports.get(r.id);
        if (!local || local.syncState === 'synced') {
          await db.reports.put({ ...r, syncState: 'synced' } as Report);
        }
      }
    });
    return { pushed: pending.length, pulled: remote.length };
  } finally {
    syncing = false;
  }
}

export function startSyncLoop() {
  window.addEventListener('online', () => void syncPending());
  setInterval(() => void syncPending(), 30_000);
  void syncPending();
}
