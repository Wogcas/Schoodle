import { SchoolUser } from '../services/school.service';
import { registerAuthUser } from '../services/auth.service';
import config, { getLastSyncDate, updateLastSyncDate } from '../config';
import { getOldestRegisteredUser, getUsersRegisteredSince } from '../services/school.service';
import { log } from 'console';

const generatePassword = (lastName: string): string => {
  const prefix = lastName.substring(0, 3);
  return `Pass${prefix}`;
};

const syncUsers = async () => {
  try {
    if (!config.JWT_SECRET) {
      throw new Error('Falta JWT_SECRET en la configuración');
    }
    let sinceDate = getLastSyncDate();
    
    if (!sinceDate) {
      const oldestUser = await getOldestRegisteredUser();
      sinceDate = new Date(oldestUser.registeredAt);
    }

    const users = await getUsersRegisteredSince(sinceDate);
    const now = new Date();
    let authServiceAvailable = true;
    let allUsersSynced = true;

    if (users.length > 0) {
      for (const user of users) {
        try {
          const authUser = {
            idNumber: user.idNumber,
            firstName: user.name, // Cambiado de name a firstName
            lastName: user.lastName,
            email: user.email,
            password: generatePassword(user.lastName),
            role: user.role || 'teacher' // Valor por defecto en minúscula
          };
          
          await registerAuthUser(authUser);
          console.log(`User ${user.email} synchronized successfully`);
        } catch (error: any) {
          allUsersSynced = false; // Marcamos que hubo un error
          
          if (error?.message === 'AUTH_SERVICE_CONNECTION_ERROR') {
            authServiceAvailable = false;
            console.error('Error de conexión con el servicio de autenticación');
          } else {
            console.error(`Error syncing user ${user.email}:`, error?.message);
          }
        }
      }
    }

    // Actualizar solo si no hubo errores
    if (authServiceAvailable && allUsersSynced) {
      updateLastSyncDate(now);
      console.log(`Sync completed at ${now.toISOString()}`);
    } else {
      console.log('No se actualiza la fecha por errores durante la sincronización');
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