import Dexie, { type Table } from 'dexie';

export interface Report {
  id: string;
  siteName: string;
  inspectorName: string;
  inspectedAt: string;
  status: 'Draft' | 'Submitted' | 'Approved';
  notes: string;
  photoDataUrl?: string;
  createdAt: string;
  updatedAt: string;
  syncState: 'pending' | 'synced';
}

class AppDB extends Dexie {
  reports!: Table<Report, string>;
  constructor() {
    super('field-inspection');
    this.version(1).stores({ reports: 'id, syncState, updatedAt' });
  }
}

export const db = new AppDB();
