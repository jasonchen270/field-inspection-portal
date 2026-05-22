import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { db } from '../db/db';

export default function ReportList() {
  const reports = useLiveQuery(() => db.reports.orderBy('updatedAt').reverse().toArray(), []);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Inspection Reports</h2>
        <Link to="/reports/new"><button>+ New Report</button></Link>
      </div>
      {!reports?.length && <p>No reports yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reports?.map(r => (
          <li key={r.id} style={{ border: '1px solid #ddd', padding: 12, margin: '8px 0', borderRadius: 6 }}>
            <Link to={`/reports/${r.id}`}><strong>{r.siteName || '(untitled)'}</strong></Link>
            <div style={{ fontSize: 13, color: '#666' }}>
              {r.inspectorName} · {r.status} · {r.syncState === 'pending' ? '⏳ pending sync' : '✓ synced'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
