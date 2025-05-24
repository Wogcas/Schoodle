import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

interface Config {
  SYNC_INTERVAL: string;
  SCHOOL_SYSTEM_URL: string;
  AUTH_SERVICE_URL: string;
  STATE_FILE_PATH: string;
  JWT_SECRET: string;
}

interface SyncState {
  lastSyncDate?: string;
}

const config: Config = {
  SYNC_INTERVAL: process.env.SYNC_INTERVAL || '*/10 * * * *',
  SCHOOL_SYSTEM_URL: process.env.SCHOOL_SYSTEM_URL || 'http://localhost:3004',
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'https://localhost:3005',
  STATE_FILE_PATH: process.env.STATE_FILE_PATH || './sync-state.json',
  JWT_SECRET: process.env.JWT_SECRET || ''
};

const getStateFilePath = () => path.resolve(process.cwd(), config.STATE_FILE_PATH);

export const getLastSyncDate = (): Date | undefined => {
  try {
    const stateFile = fs.readFileSync(getStateFilePath(), 'utf-8');
    const state: SyncState = JSON.parse(stateFile);
    return state.lastSyncDate ? new Date(state.lastSyncDate) : undefined;
  } catch (error) {
    return undefined;
  }
};

export const updateLastSyncDate = (date: Date): void => {
  const state: SyncState = {
    lastSyncDate: date.toISOString()
  };
  
  fs.writeFileSync(
    getStateFilePath(),
    JSON.stringify(state, null, 2),
    'utf-8'
  );
};

export default config;