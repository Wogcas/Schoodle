import { SchoolUser } from '../services/school.service';
import { registerAuthUser } from '../services/auth.service';
import config, { getLastSyncDate, updateLastSyncDate } from '../config';
import { getOldestRegisteredUser, getUsersRegisteredSince } from '../services/school.service';

const generatePassword = (lastName: string): string => {
  const prefix = lastName.substring(0, 3);
  return `Pass${prefix}`;
};

const syncUsers = async () => {
  try {
    let sinceDate = getLastSyncDate();
    
    if (!sinceDate) {
      const oldestUser = await getOldestRegisteredUser();
      sinceDate = new Date(oldestUser.registeredAt);
    }

    const users = await getUsersRegisteredSince(sinceDate);
    const now = new Date();
    let authServiceAvailable = true;

    if (users.length > 0) {
      for (const user of users) {
        try {
          const authUser = {
            idNumber: user.idNumber,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            password: generatePassword(user.lastName),
            role: user.role || 'Student'
          };
          
          await registerAuthUser(authUser);
          console.log(`User ${user.email} synchronized successfully`);
        } catch (error: any) {
          if (error?.message === 'AUTH_SERVICE_CONNECTION_ERROR') {
            authServiceAvailable = false;
            console.error('Error de conexión con el servicio de autenticación');
          } else {
            console.error(`Error syncing user ${user.email}:`, error?.message);
          }
        }
      }
    }

    // Solo actualiza si el servicio de autenticación estuvo disponible
    if (authServiceAvailable) {
      updateLastSyncDate(now);
      console.log(`Sync completed at ${now.toISOString()}`);
    } else {
      console.log('No se actualiza la fecha de última sincronización por falla en autenticación');
    }
  } catch (error: any) {
    if (error?.message === 'SCHOOL_SYSTEM_CONNECTION_ERROR') {
      console.error('Error de conexión con el school-system, sincronización abortada');
    } else {
      console.error('Sync error:', error?.message);
    }
  }
};

export const startSyncService = () => {
  syncUsers(); // Ejecutar inmediatamente al iniciar
  const cron = require('node-cron');
  cron.schedule(config.SYNC_INTERVAL, syncUsers);
};