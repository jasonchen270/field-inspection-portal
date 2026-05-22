import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { currentUser, signIn, signOut } from '../auth/auth';
import { syncPending } from '../db/sync';

export default function AppShell() {
  const [user, setUser] = useState<string | null>(currentUser());
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  if (!user) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Field Inspection Portal</h1>
      <button onClick={async () => setUser(await signIn())}>Sign in</button>
    </div>
  );

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}><h1 style={{ margin: 0, fontSize: 18 }}>Field Inspection Portal</h1></Link>
        <div style={{ fontSize: 13 }}>
          <span style={{ marginRight: 12, color: online ? 'green' : 'crimson' }}>{online ? '● online' : '● offline'}</span>
          <button onClick={() => syncPending()} disabled={!online}>Sync</button>
          <span style={{ margin: '0 8px' }}>{user}</span>
          <button onClick={() => { signOut(); setUser(null); }}>Sign out</button>
        </div>
      </header>
      <main style={{ paddingTop: 16 }}><Outlet /></main>
    </div>
  );
}
