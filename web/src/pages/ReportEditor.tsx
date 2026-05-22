import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, type Report } from '../db/db';
import { syncPending } from '../db/sync';
import { currentUser } from '../auth/auth';

const empty = (): Report => ({
  id: crypto.randomUUID(),
  siteName: '',
  inspectorName: currentUser() ?? '',
  inspectedAt: new Date().toISOString().slice(0, 16),
  status: 'Draft',
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  syncState: 'pending',
});

export default function ReportEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const [r, setR] = useState<Report | null>(null);

  useEffect(() => {
    if (!id || id === 'new') setR(empty());
    else db.reports.get(id).then(found => setR(found ?? empty()));
  }, [id]);

  if (!r) return <p>Loading...</p>;

  const update = <K extends keyof Report>(k: K, v: Report[K]) => setR({ ...r, [k]: v });

  const save = async () => {
    const updated = { ...r, updatedAt: new Date().toISOString(), syncState: 'pending' as const };
    await db.reports.put(updated);
    void syncPending();
    nav('/');
  };

  const remove = async () => {
    await db.reports.delete(r.id);
    nav('/');
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('photoDataUrl', reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2>{id === 'new' ? 'New Report' : 'Edit Report'}</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <label>Site name<input value={r.siteName} onChange={e => update('siteName', e.target.value)} /></label>
        <label>Inspector<input value={r.inspectorName} onChange={e => update('inspectorName', e.target.value)} /></label>
        <label>Inspected at<input type="datetime-local" value={r.inspectedAt} onChange={e => update('inspectedAt', e.target.value)} /></label>
        <label>Status
          <select value={r.status} onChange={e => update('status', e.target.value as Report['status'])}>
            <option>Draft</option><option>Submitted</option><option>Approved</option>
          </select>
        </label>
        <label>Notes<textarea rows={5} value={r.notes} onChange={e => update('notes', e.target.value)} /></label>
        <label>Photo<input type="file" accept="image/*" onChange={onPhoto} /></label>
        {r.photoDataUrl && <img src={r.photoDataUrl} alt="" style={{ maxWidth: 200 }} />}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={save}>Save</button>
          <button onClick={() => nav('/')}>Cancel</button>
          {id !== 'new' && <button onClick={remove} style={{ marginLeft: 'auto', color: 'crimson' }}>Delete</button>}
        </div>
      </div>
    </div>
  );
}
