import { startSyncService } from './sync/user-sync';
import config, { getLastSyncDate } from './config';

console.log('Starting synchronization service...');
console.log('Configuration:', {
  interval: config.SYNC_INTERVAL,
  lastSync: getLastSyncDate()?.toISOString() || 'None'
});

startSyncService();