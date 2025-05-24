import config from '../config';
import axios from 'axios';
import https from 'https';

interface AuthUser {
  idNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
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

export const registerAuthUser = async (user: AuthUser): Promise<void> => {
  try {
    const response = await apiClient.post(
      `${config.AUTH_SERVICE_URL}/auth/sync/user`,
      user,
      {
        headers: {
          'x-api-key': config.JWT_SECRET
        }
      }
    );
    
    if (response.status !== 201 && response.status !== 200) {
      throw new Error(`Error en registro: ${response.statusText}`);
    }
  } catch (error: any) {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('AUTH_SERVICE_CONNECTION_ERROR');
    }
    throw error;
  }
};