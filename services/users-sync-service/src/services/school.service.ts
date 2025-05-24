import axios from 'axios';
import config from '../config';
import https from 'https';

export interface SchoolUser {
  id: number;
  idNumber: string;
  name: string;
  lastName: string;
  email: string;
  registeredAt: string;
  role?: string;
}

// 1. Crear agente HTTPS que ignora certificados autofirmados (SOLO DESARROLLO)
const insecureAgent = new https.Agent({ 
  rejectUnauthorized: false 
});

// 2. Configurar cliente API
const apiClient = axios.create({
  baseURL: config.AUTH_SERVICE_URL,
  // @ts-ignore // Ignoramos el error de tipo intencionalmente
  httpsAgent: insecureAgent,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getOldestRegisteredUser = async (): Promise<SchoolUser> => {
  try {
    const response = await apiClient.get<SchoolUser>(`${config.SCHOOL_SYSTEM_URL}/api/school-system/users/first-registered`);
    return response.data;
  } catch (error: any) {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('SCHOOL_SYSTEM_CONNECTION_ERROR');
    }
    throw error;
  }
};


export const getUsersRegisteredSince = async (since: Date): Promise<SchoolUser[]> => {
  try {
    const response = await apiClient.get<SchoolUser[]>(`${config.SCHOOL_SYSTEM_URL}/api/school-system/users/registered-since`, {
      params: { since: since.toISOString() }
    });
    return response.data;
  } catch (error: any) {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('SCHOOL_SYSTEM_CONNECTION_ERROR');
    }
    throw error;
  }
};