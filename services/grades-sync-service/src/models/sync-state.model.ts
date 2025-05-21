// En src/models/sync-state.model.ts

export type SyncError = {
  timestamp: string;
  message: string;
  stack?: string;
};

export interface SyncState {
    nextSyncDate?: string; // Siempre ISO string
    currentSchoolTermId?: number;
    lastSyncedSchoolTermId?: number;
    state: 'SEARCHING_TERM' | 'WAITING_TERM_END';
    termCheckInterval: number; // En minutos
    lastError?: SyncError;
}

export interface SchoolTerm {
    id: number;
    termStartDate: Date;
    termEndDate: Date;
}