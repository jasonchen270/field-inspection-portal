import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { msalInstance, useDevAuth } from './auth/auth';
import { startSyncLoop } from './db/sync';

async function bootstrap() {
  if (!useDevAuth) await msalInstance.initialize();
  startSyncLoop();
  createRoot(document.getElementById('root')!).render(
    <StrictMode><App /></StrictMode>
  );
}
void bootstrap();
